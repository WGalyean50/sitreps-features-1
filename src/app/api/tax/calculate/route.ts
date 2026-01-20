import { NextRequest, NextResponse } from "next/server";
import {
  calculateFederalTax,
  calculateStateTax,
  calculateFICA,
  STANDARD_DEDUCTION_2024,
  STATE_TAXES,
} from "@/data/tax-brackets";
import { getBasePay, getBAS, getBAH, type PayGrade, PAY_GRADES } from "@/data/military-pay";

interface MilitaryIncomeRequest {
  grade: PayGrade;
  yearsOfService: number;
  zipCode: string;
  withDependents: boolean;
}

interface CivilianIncomeRequest {
  salary: number;
  state: string;
  bonus?: number;
  preTax401k?: number;
}

interface TaxCalculationRequest {
  military?: MilitaryIncomeRequest;
  civilian?: CivilianIncomeRequest[];
  filingStatus?: "single" | "married";
}

/**
 * POST /api/tax/calculate
 *
 * Calculates and compares military vs civilian tax situations
 *
 * Request body:
 * {
 *   military: { grade, yearsOfService, zipCode, withDependents },
 *   civilian: [{ salary, state, bonus?, preTax401k? }],
 *   filingStatus: "single" | "married"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: TaxCalculationRequest = await request.json();
    const { military, civilian, filingStatus = "single" } = body;

    const standardDeduction = filingStatus === "single"
      ? STANDARD_DEDUCTION_2024.single
      : STANDARD_DEDUCTION_2024.married;

    let militaryResult = null;
    const civilianResults: Array<{
      scenario: number;
      grossIncome: number;
      taxableIncome: number;
      federalTax: number;
      stateTax: number;
      fica: { socialSecurity: number; medicare: number; total: number };
      totalTax: number;
      netIncome: number;
      effectiveRate: number;
      state: string;
      stateName: string;
    }> = [];

    // Calculate military taxes
    if (military) {
      const { grade, yearsOfService, zipCode, withDependents } = military;

      if (!(grade in PAY_GRADES)) {
        return NextResponse.json({ error: "Invalid pay grade" }, { status: 400 });
      }

      const basePay = getBasePay(grade, yearsOfService);
      const bas = getBAS(grade);
      const bah = getBAH(grade, zipCode, withDependents);

      // Military: Only base pay is taxable (BAH and BAS are tax-free)
      const taxableIncome = basePay * 12;
      const adjustedTaxable = Math.max(0, taxableIncome - standardDeduction);

      const federalTax = calculateFederalTax(adjustedTaxable, filingStatus);
      const fica = calculateFICA(taxableIncome);

      // Military doesn't pay state tax on allowances, typically stationed state
      // For simplicity, we'll assume no state tax on military income
      const stateTax = 0;

      const totalTax = federalTax + stateTax + fica.total;
      const grossAnnual = (basePay + bas + bah) * 12;
      const netIncome = grossAnnual - totalTax;

      militaryResult = {
        monthly: {
          basePay,
          bas,
          bah,
          total: basePay + bas + bah,
        },
        annual: {
          basePay: basePay * 12,
          bas: bas * 12,
          bah: bah * 12,
          taxFreeAllowances: (bas + bah) * 12,
          grossTotal: grossAnnual,
          taxableIncome,
          adjustedTaxableIncome: adjustedTaxable,
        },
        taxes: {
          federalTax,
          stateTax,
          fica,
          totalTax,
        },
        netIncome: {
          annual: netIncome,
          monthly: Math.round(netIncome / 12),
        },
        effectiveRate: Math.round((totalTax / grossAnnual) * 1000) / 10,
      };
    }

    // Calculate civilian taxes for each scenario
    if (civilian && civilian.length > 0) {
      civilian.forEach((civ, index) => {
        const { salary, state, bonus = 0, preTax401k = 0 } = civ;

        if (!(state in STATE_TAXES)) {
          return; // Skip invalid states
        }

        const grossIncome = salary + bonus;
        const taxableIncome = grossIncome - preTax401k;
        const adjustedTaxable = Math.max(0, taxableIncome - standardDeduction);

        const federalTax = calculateFederalTax(adjustedTaxable, filingStatus);
        const stateTax = calculateStateTax(adjustedTaxable, state);
        const fica = calculateFICA(grossIncome); // FICA on gross, not reduced by 401k

        const totalTax = federalTax + stateTax + fica.total;
        const netIncome = grossIncome - totalTax - preTax401k;

        civilianResults.push({
          scenario: index + 1,
          grossIncome,
          taxableIncome: adjustedTaxable,
          federalTax,
          stateTax,
          fica,
          totalTax,
          netIncome,
          effectiveRate: Math.round((totalTax / grossIncome) * 1000) / 10,
          state,
          stateName: STATE_TAXES[state].name,
        });
      });
    }

    // Calculate civilian equivalent if we have military data
    let civilianEquivalent = null;
    if (militaryResult) {
      // What civilian salary would yield the same net income?
      // This is iterative, but we can estimate:
      // Net = Gross - (Fed + State + FICA)
      // For a rough estimate in a typical state (~5% state + 22% fed marginal + 7.65% FICA ≈ 35% marginal)
      const targetNet = militaryResult.netIncome.annual;

      // Estimate: CivilianGross ≈ MilitaryNet / (1 - effectiveTaxRate)
      // Assume ~25% effective rate for median incomes
      const estimatedGross = Math.round(targetNet / 0.72);

      civilianEquivalent = {
        targetNetIncome: targetNet,
        estimatedGrossSalary: estimatedGross,
        note: "Estimated civilian salary needed to achieve the same after-tax income as your military compensation, assuming a moderate tax state.",
      };
    }

    return NextResponse.json({
      filingStatus,
      standardDeduction,
      military: militaryResult,
      civilian: civilianResults,
      civilianEquivalent,
      comparison: militaryResult && civilianResults.length > 0 ? {
        militaryAdvantage: civilianResults.map((civ) => ({
          scenario: civ.scenario,
          state: civ.stateName,
          civilianGross: civ.grossIncome,
          civilianNet: civ.netIncome,
          militaryNet: militaryResult.netIncome.annual,
          difference: militaryResult.netIncome.annual - civ.netIncome,
          percentDifference: Math.round(
            ((militaryResult.netIncome.annual - civ.netIncome) / civ.netIncome) * 1000
          ) / 10,
        })),
      } : null,
      disclaimer: "This calculator provides estimates for educational purposes only. Actual tax situations vary based on deductions, credits, filing status, and other factors. Consult a tax professional for personalized advice.",
    });
  } catch (error) {
    console.error("[Tax Calculate Error]", error);
    return NextResponse.json(
      { error: "Failed to calculate taxes. Please check your input." },
      { status: 500 }
    );
  }
}
