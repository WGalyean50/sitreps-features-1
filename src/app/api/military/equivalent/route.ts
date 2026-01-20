import { NextRequest, NextResponse } from "next/server";
import { getBasePay, getBAS, getBAH, type PayGrade } from "@/data/military-pay";
import {
  STATE_TAXES,
  calculateFederalTax,
  calculateFICA,
  calculateStateTax,
} from "@/data/tax-brackets";

export const dynamic = "force-dynamic";

interface MilitaryEquivalentRequest {
  grade: PayGrade;
  yearsOfService: number;
  zipCode: string;
  withDependents: boolean;
  filingStatus?: "single" | "married";
}

/**
 * POST /api/military/equivalent
 *
 * Calculates:
 * 1. Total military compensation (base pay + BAH + BAS)
 * 2. Military net income after taxes
 * 3. Equivalent civilian salary needed in EVERY state to match that net income
 */
export async function POST(request: NextRequest) {
  try {
    const body: MilitaryEquivalentRequest = await request.json();
    const { grade, yearsOfService, zipCode, withDependents, filingStatus = "single" } = body;

    // Validate
    if (!grade || !zipCode) {
      return NextResponse.json(
        { error: "Grade and ZIP code are required" },
        { status: 400 }
      );
    }

    // Get military pay components
    const basePay = getBasePay(grade, yearsOfService);
    const bas = getBAS(grade);
    const bah = getBAH(grade, zipCode, withDependents);

    // Monthly and annual totals
    const monthlyTotal = basePay + bas + bah;
    const annualBasePay = basePay * 12;
    const annualBAS = bas * 12;
    const annualBAH = bah * 12;
    const annualTotal = monthlyTotal * 12;

    // Tax-free allowances
    const taxFreeAllowances = annualBAS + annualBAH;

    // Military taxes (only base pay is taxable)
    const militaryFederalTax = calculateFederalTax(annualBasePay, filingStatus);
    const militaryFICA = calculateFICA(annualBasePay);
    // Military members typically don't pay state tax if stationed in a different state
    // For simplicity, assume no state tax on military income
    const militaryStateTax = 0;
    const militaryTotalTax = militaryFederalTax + militaryFICA.total + militaryStateTax;

    // Military net income
    const militaryNetIncome = annualTotal - militaryTotalTax;
    const militaryMonthlyNet = militaryNetIncome / 12;

    // Calculate equivalent civilian salary for each state
    const stateEquivalents = Object.entries(STATE_TAXES).map(([stateCode, stateInfo]) => {
      // Binary search to find the civilian salary that produces the same net income
      const targetNet = militaryNetIncome;
      let low = targetNet; // At minimum, need this much gross
      let high = targetNet * 2; // At most, need 2x (very high tax scenario)

      // Iterate to find the right salary
      for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        const federalTax = calculateFederalTax(mid, filingStatus);
        const stateTax = calculateStateTax(mid, stateCode);
        const fica = calculateFICA(mid);
        const netIncome = mid - federalTax - stateTax - fica.total;

        if (Math.abs(netIncome - targetNet) < 100) {
          // Close enough
          break;
        }

        if (netIncome < targetNet) {
          low = mid;
        } else {
          high = mid;
        }
      }

      const equivalentSalary = Math.round((low + high) / 2);

      // Calculate the effective tax burden at this salary
      const federalTax = calculateFederalTax(equivalentSalary, filingStatus);
      const stateTax = calculateStateTax(equivalentSalary, stateCode);
      const fica = calculateFICA(equivalentSalary);
      const totalTax = federalTax + stateTax + fica.total;
      const effectiveRate = Math.round((totalTax / equivalentSalary) * 1000) / 10;

      // Map "graduated" to "progressive" for UI consistency
      const taxType = stateInfo.type === "graduated" ? "progressive" : stateInfo.type;

      return {
        stateCode,
        stateName: stateInfo.name,
        taxType,
        equivalentSalary,
        federalTax: Math.round(federalTax),
        stateTax: Math.round(stateTax),
        ficaTotal: Math.round(fica.total),
        totalTax: Math.round(totalTax),
        effectiveRate,
        // Premium over military gross
        premiumOverMilitary: Math.round(equivalentSalary - annualTotal),
        premiumPercent: Math.round(((equivalentSalary - annualTotal) / annualTotal) * 100),
      };
    });

    // Sort by equivalent salary (lowest first = best states)
    stateEquivalents.sort((a, b) => a.equivalentSalary - b.equivalentSalary);

    // Group states by tax type for easier viewing
    const noTaxStates = stateEquivalents.filter((s) => s.taxType === "none");
    const flatTaxStates = stateEquivalents.filter((s) => s.taxType === "flat");
    const progressiveStates = stateEquivalents.filter((s) => s.taxType === "progressive");

    return NextResponse.json({
      military: {
        grade,
        yearsOfService,
        zipCode,
        withDependents,
        monthly: {
          basePay: Math.round(basePay),
          bah: Math.round(bah),
          bas: Math.round(bas),
          total: Math.round(monthlyTotal),
        },
        annual: {
          basePay: Math.round(annualBasePay),
          bah: Math.round(annualBAH),
          bas: Math.round(annualBAS),
          grossTotal: Math.round(annualTotal),
          taxableIncome: Math.round(annualBasePay),
          taxFreeAllowances: Math.round(taxFreeAllowances),
        },
        taxes: {
          federalTax: Math.round(militaryFederalTax),
          stateTax: Math.round(militaryStateTax),
          fica: Math.round(militaryFICA.total),
          totalTax: Math.round(militaryTotalTax),
        },
        netIncome: {
          annual: Math.round(militaryNetIncome),
          monthly: Math.round(militaryMonthlyNet),
        },
        effectiveRate: Math.round((militaryTotalTax / annualTotal) * 1000) / 10,
      },
      stateEquivalents,
      summary: {
        lowestSalaryNeeded: stateEquivalents[0],
        highestSalaryNeeded: stateEquivalents[stateEquivalents.length - 1],
        averageSalaryNeeded: Math.round(
          stateEquivalents.reduce((sum, s) => sum + s.equivalentSalary, 0) / stateEquivalents.length
        ),
        noTaxStates,
        flatTaxStates,
        progressiveStates,
      },
      insight: `To match your military take-home pay of ${formatCurrency(militaryNetIncome)}/year, you'd need a civilian salary ranging from ${formatCurrency(stateEquivalents[0].equivalentSalary)} in ${stateEquivalents[0].stateName} to ${formatCurrency(stateEquivalents[stateEquivalents.length - 1].equivalentSalary)} in ${stateEquivalents[stateEquivalents.length - 1].stateName}.`,
    });
  } catch (error) {
    console.error("[Military Equivalent Error]", error);
    return NextResponse.json(
      { error: "Failed to calculate equivalent salaries" },
      { status: 500 }
    );
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
