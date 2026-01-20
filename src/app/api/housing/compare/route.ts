import { NextRequest, NextResponse } from "next/server";
import {
  calculateVAFundingFee,
  calculateMonthlyPayment,
  calculateHomeownershipCosts,
  calculateRentingCosts,
  calculateOpportunityCost,
  findBreakEvenYear,
  MORTGAGE_RATES,
  PROPERTY_COSTS,
  RENT_ASSUMPTIONS,
  INVESTMENT_ASSUMPTIONS,
  VA_FUNDING_FEES,
} from "@/data/va-loan";

interface HousingCompareRequest {
  homePrice: number;
  downPaymentPercent: number;
  monthlyRent: number;
  interestRate?: number;
  loanTermYears?: number;
  isFirstTimeVA?: boolean;
  isFundingFeeExempt?: boolean;
}

/**
 * POST /api/housing/compare
 *
 * Compares the cost of buying (with VA loan) vs renting over time
 *
 * Request body:
 * {
 *   homePrice: number,
 *   downPaymentPercent: number (0-100),
 *   monthlyRent: number,
 *   interestRate?: number (optional, defaults to current VA 30-year rate),
 *   loanTermYears?: number (15 or 30, defaults to 30),
 *   isFirstTimeVA?: boolean (defaults to true),
 *   isFundingFeeExempt?: boolean (defaults to false)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: HousingCompareRequest = await request.json();
    const {
      homePrice,
      downPaymentPercent = 0,
      monthlyRent,
      interestRate = MORTGAGE_RATES.va30Year,
      loanTermYears = 30,
      isFirstTimeVA = true,
      isFundingFeeExempt = false,
    } = body;

    // Validate inputs
    if (!homePrice || homePrice <= 0) {
      return NextResponse.json(
        { error: "Home price must be a positive number" },
        { status: 400 }
      );
    }

    if (!monthlyRent || monthlyRent <= 0) {
      return NextResponse.json(
        { error: "Monthly rent must be a positive number" },
        { status: 400 }
      );
    }

    if (downPaymentPercent < 0 || downPaymentPercent > 100) {
      return NextResponse.json(
        { error: "Down payment percent must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Calculate core values
    const downPayment = Math.round(homePrice * (downPaymentPercent / 100));
    const loanAmount = homePrice - downPayment;

    const vaFundingFee = calculateVAFundingFee(
      loanAmount,
      isFirstTimeVA,
      downPaymentPercent,
      isFundingFeeExempt
    );

    const totalLoanAmount = loanAmount + vaFundingFee;
    const monthlyMortgagePayment = calculateMonthlyPayment(
      totalLoanAmount,
      interestRate,
      loanTermYears
    );

    // Monthly costs breakdown for buying
    const monthlyPropertyTax = Math.round(
      (homePrice * (PROPERTY_COSTS.propertyTaxRate / 100)) / 12
    );
    const monthlyInsurance = Math.round(
      (homePrice * (PROPERTY_COSTS.homeownersInsurance / 100)) / 12
    );
    const monthlyMaintenance = Math.round(
      (homePrice * (PROPERTY_COSTS.maintenanceRate / 100)) / 12
    );

    const totalMonthlyBuying =
      monthlyMortgagePayment + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance;

    // Monthly costs for renting
    const totalMonthlyRenting = monthlyRent + RENT_ASSUMPTIONS.rentersInsurance;

    // Calculate comparison at different time horizons
    const timeHorizons = [1, 3, 5, 10];
    const comparisons = timeHorizons.map((years) => {
      const buyingCosts = calculateHomeownershipCosts(
        homePrice,
        downPayment,
        interestRate,
        loanTermYears,
        vaFundingFee,
        years
      );

      const rentingCosts = calculateRentingCosts(monthlyRent, years);
      const opportunityCost = calculateOpportunityCost(downPayment, years);

      // Net wealth position
      // Buying: You paid X but have Y equity
      const buyingNetCost = buyingCosts.totalCashOutflow - buyingCosts.homeEquity;

      // Renting: You paid X but could have earned Z on your down payment
      const rentingNetCost = rentingCosts.totalCashOutflow;
      const rentingWithOpportunityCost = rentingCosts.totalCashOutflow + opportunityCost;

      return {
        years,
        buying: {
          totalCashOutflow: buyingCosts.totalCashOutflow,
          homeEquity: buyingCosts.homeEquity,
          homeValue: buyingCosts.homeValue,
          netCost: buyingNetCost,
          breakdown: {
            downPayment,
            closingCosts: buyingCosts.closingCosts,
            mortgagePayments: buyingCosts.totalMortgagePayments,
            propertyTaxes: buyingCosts.propertyTaxes,
            insurance: buyingCosts.insurance,
            maintenance: buyingCosts.maintenance,
          },
        },
        renting: {
          totalCashOutflow: rentingCosts.totalCashOutflow,
          netCost: rentingNetCost,
          netCostWithOpportunity: rentingWithOpportunityCost,
          opportunityCostOfDownPayment: opportunityCost,
          breakdown: {
            totalRent: rentingCosts.totalRentPaid,
            insurance: rentingCosts.totalInsurance,
          },
        },
        difference: {
          absoluteDifference: rentingNetCost - buyingNetCost,
          withOpportunityCost: rentingWithOpportunityCost - buyingNetCost,
          buyingIsBetter: buyingNetCost < rentingWithOpportunityCost,
        },
      };
    });

    // Find break-even year
    const breakEvenYear = findBreakEvenYear(
      homePrice,
      downPayment,
      monthlyRent,
      interestRate,
      loanTermYears,
      vaFundingFee
    );

    return NextResponse.json({
      inputs: {
        homePrice,
        downPayment,
        downPaymentPercent,
        monthlyRent,
        interestRate,
        loanTermYears,
        isFirstTimeVA,
        isFundingFeeExempt,
      },
      vaLoan: {
        loanAmount,
        fundingFee: vaFundingFee,
        fundingFeePercent: isFundingFeeExempt
          ? 0
          : (isFirstTimeVA
              ? VA_FUNDING_FEES.purchase.firstTime
              : VA_FUNDING_FEES.purchase.subsequent
            )[
              downPaymentPercent >= 10
                ? "tenPercent"
                : downPaymentPercent >= 5
                ? "fivePercent"
                : "noDownPayment"
            ],
        totalLoanAmount,
      },
      monthly: {
        buying: {
          mortgagePayment: monthlyMortgagePayment,
          propertyTax: monthlyPropertyTax,
          insurance: monthlyInsurance,
          maintenance: monthlyMaintenance,
          total: totalMonthlyBuying,
        },
        renting: {
          rent: monthlyRent,
          insurance: RENT_ASSUMPTIONS.rentersInsurance,
          total: totalMonthlyRenting,
        },
        difference: totalMonthlyBuying - totalMonthlyRenting,
      },
      comparisons,
      breakEvenYear,
      assumptions: {
        propertyAppreciationRate: PROPERTY_COSTS.appreciationRate,
        rentIncreaseRate: RENT_ASSUMPTIONS.annualIncreaseRate,
        investmentReturnRate: INVESTMENT_ASSUMPTIONS.expectedReturn,
        propertyTaxRate: PROPERTY_COSTS.propertyTaxRate,
        homeInsuranceRate: PROPERTY_COSTS.homeownersInsurance,
        maintenanceRate: PROPERTY_COSTS.maintenanceRate,
        closingCostsPercent: PROPERTY_COSTS.closingCostsPercent,
      },
      disclaimer:
        "This calculator provides estimates for educational purposes only. Actual costs will vary based on location, credit score, market conditions, and other factors. Consult with a mortgage professional for personalized advice.",
    });
  } catch (error) {
    console.error("[Housing Compare Error]", error);
    return NextResponse.json(
      { error: "Failed to calculate housing comparison. Please check your input." },
      { status: 500 }
    );
  }
}
