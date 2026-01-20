import { NextRequest, NextResponse } from "next/server";
import {
  getCredentialById,
  calculateGIBillBenefit,
  calculateNPV,
  calculateBreakEven,
  calculateCumulativeReturns,
  GI_BILL,
  type Credential,
} from "@/data/credentials";

export const dynamic = "force-dynamic";

interface ROICalculateRequest {
  credentialId: string;
  currentSalary: number;
  experienceLevel: "entry" | "experienced";
  useGIBill: boolean;
  isPrivateSchool?: boolean;
  yearsToAnalyze?: number;
}

interface ComparisonRequest {
  credentials: ROICalculateRequest[];
}

/**
 * POST /api/roi/calculate
 *
 * Calculates ROI for one or more credentials
 *
 * Single credential:
 * { credentialId, currentSalary, experienceLevel, useGIBill, isPrivateSchool?, yearsToAnalyze? }
 *
 * Comparison (2 credentials):
 * { credentials: [{ ... }, { ... }] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle comparison mode
    if (body.credentials && Array.isArray(body.credentials)) {
      if (body.credentials.length < 1 || body.credentials.length > 2) {
        return NextResponse.json(
          { error: "Comparison requires 1 or 2 credentials" },
          { status: 400 }
        );
      }

      const results = body.credentials.map((req: ROICalculateRequest) =>
        calculateCredentialROI(req)
      );

      // Check for errors
      const errors = results.filter((r: { error?: string }) => r.error);
      if (errors.length > 0) {
        return NextResponse.json(
          { error: errors[0].error },
          { status: 400 }
        );
      }

      // Determine winner (if 2 credentials)
      let winner = null;
      if (results.length === 2) {
        const npv1 = results[0].analysis.npv10Year;
        const npv2 = results[1].analysis.npv10Year;
        winner = npv1 > npv2 ? results[0].credential.name : results[1].credential.name;
      }

      return NextResponse.json({
        comparison: true,
        results,
        winner,
        summary: {
          credentials: results.map((r: { credential: { name: string } }) => r.credential.name),
          bestNPV: Math.max(...results.map((r: { analysis: { npv10Year: number } }) => r.analysis.npv10Year)),
          fastestBreakEven: Math.min(
            ...results.map((r: { analysis: { breakEvenMonths: number } }) => r.analysis.breakEvenMonths)
          ),
        },
      });
    }

    // Single credential calculation
    const req = body as ROICalculateRequest;
    const result = calculateCredentialROI(req);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[ROI Calculate Error]", error);
    return NextResponse.json(
      { error: "Failed to calculate ROI. Please check your input." },
      { status: 500 }
    );
  }
}

function calculateCredentialROI(req: ROICalculateRequest): {
  credential?: Credential;
  analysis?: {
    totalInvestment: number;
    outOfPocket: number;
    giBillBenefit: number;
    expectedSalaryIncrease: { annual: number; monthly: number };
    breakEvenMonths: number;
    breakEvenFormatted: string;
    npv5Year: number;
    npv10Year: number;
    cumulativeReturns: { year: number; cumulative: number; netReturn: number }[];
    roi5Year: number;
    roi10Year: number;
  };
  giBillDetails?: {
    tuitionCovered: number;
    housingAllowance: number;
    bookStipend: number;
    totalBenefit: number;
    monthsUsed: number;
    monthsRemaining: number;
  };
  assumptions?: Record<string, string>;
  error?: string;
} {
  // Validate inputs
  if (!req.credentialId) {
    return { error: "Credential ID is required" };
  }

  if (!req.currentSalary || req.currentSalary < 0) {
    return { error: "Valid current salary is required" };
  }

  const credential = getCredentialById(req.credentialId);
  if (!credential) {
    return { error: `Credential not found: ${req.credentialId}` };
  }

  const experienceLevel = req.experienceLevel || "entry";
  const yearsToAnalyze = req.yearsToAnalyze || 10;

  // Calculate costs
  const avgCost = (credential.totalCost.min + credential.totalCost.max) / 2;
  const avgMonths =
    (credential.monthsToComplete.min + credential.monthsToComplete.max) / 2;

  // Calculate GI Bill benefits
  let giBillBenefit = 0;
  let outOfPocket = avgCost;
  let giBillDetails = null;

  if (req.useGIBill) {
    const giBenefits = calculateGIBillBenefit(
      credential,
      req.isPrivateSchool || false
    );
    giBillBenefit = giBenefits.totalBenefit;
    outOfPocket = giBenefits.outOfPocket;

    giBillDetails = {
      tuitionCovered: Math.round(giBenefits.tuitionCovered),
      housingAllowance: Math.round(giBenefits.housingAllowance),
      bookStipend: Math.round(giBenefits.bookStipend),
      totalBenefit: Math.round(giBenefits.totalBenefit),
      monthsUsed: Math.min(Math.round(avgMonths), GI_BILL.maxMonths),
      monthsRemaining: Math.max(0, GI_BILL.maxMonths - Math.round(avgMonths)),
    };
  }

  // Calculate salary increase
  const salaryIncrease = credential.salaryIncrease[experienceLevel];
  const avgAnnualIncrease = (salaryIncrease.min + salaryIncrease.max) / 2;
  const monthlyIncrease = avgAnnualIncrease / 12;

  // Investment = out of pocket cost + opportunity cost (reduced earnings during study)
  // Simplified: just use out of pocket for now
  const totalInvestment = outOfPocket;

  // Calculate metrics
  const breakEvenMonths = calculateBreakEven(
    totalInvestment,
    monthlyIncrease,
    avgMonths
  );

  const npv5Year = calculateNPV(totalInvestment, avgAnnualIncrease, 5);
  const npv10Year = calculateNPV(totalInvestment, avgAnnualIncrease, 10);

  const cumulativeReturns = calculateCumulativeReturns(
    totalInvestment,
    avgAnnualIncrease,
    avgMonths,
    yearsToAnalyze
  );

  // ROI percentages
  const roi5Year =
    totalInvestment > 0
      ? Math.round(((avgAnnualIncrease * 5 - totalInvestment) / totalInvestment) * 100)
      : 0;
  const roi10Year =
    totalInvestment > 0
      ? Math.round(((avgAnnualIncrease * 10 - totalInvestment) / totalInvestment) * 100)
      : 0;

  // Format break-even
  let breakEvenFormatted: string;
  if (breakEvenMonths === Infinity) {
    breakEvenFormatted = "Never";
  } else if (breakEvenMonths < 12) {
    breakEvenFormatted = `${breakEvenMonths} months`;
  } else {
    const years = Math.floor(breakEvenMonths / 12);
    const months = breakEvenMonths % 12;
    breakEvenFormatted =
      months > 0 ? `${years} years, ${months} months` : `${years} years`;
  }

  return {
    credential,
    analysis: {
      totalInvestment: Math.round(totalInvestment),
      outOfPocket: Math.round(outOfPocket),
      giBillBenefit: Math.round(giBillBenefit),
      expectedSalaryIncrease: {
        annual: Math.round(avgAnnualIncrease),
        monthly: Math.round(monthlyIncrease),
      },
      breakEvenMonths: Math.round(breakEvenMonths),
      breakEvenFormatted,
      npv5Year,
      npv10Year,
      cumulativeReturns,
      roi5Year,
      roi10Year,
    },
    giBillDetails: giBillDetails || undefined,
    assumptions: {
      discountRate: "5% annual discount rate for NPV",
      salaryIncrease: `Based on ${experienceLevel} level estimates`,
      timeToComplete: `Average ${Math.round(avgMonths)} months`,
      costEstimate: `Average of ${formatCurrency(credential.totalCost.min)} - ${formatCurrency(credential.totalCost.max)}`,
      giBill: req.useGIBill
        ? "Post-9/11 GI Bill benefits applied"
        : "No GI Bill benefits applied",
    },
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
