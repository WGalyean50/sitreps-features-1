import { NextRequest, NextResponse } from "next/server";
import {
  calculateTotalComp,
  COST_OF_LIVING,
  BENEFITS_VALUATION,
  type JobOffer,
  type VestingSchedule,
} from "@/data/compensation";

interface CompensationCompareRequest {
  offers: JobOffer[];
  normalizeToLocation?: string;
}

/**
 * POST /api/compensation/compare
 *
 * Compares 2-4 job offers and calculates total compensation at Year 1, 2, and 4
 *
 * Request body:
 * {
 *   offers: JobOffer[],
 *   normalizeToLocation?: string (for COL adjustment)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: CompensationCompareRequest = await request.json();
    const { offers, normalizeToLocation = "remote" } = body;

    // Validate offers
    if (!offers || !Array.isArray(offers) || offers.length < 2) {
      return NextResponse.json(
        { error: "At least 2 offers are required for comparison" },
        { status: 400 }
      );
    }

    if (offers.length > 4) {
      return NextResponse.json(
        { error: "Maximum 4 offers can be compared" },
        { status: 400 }
      );
    }

    // Calculate compensation for each offer at each year mark
    const yearMarks: (1 | 2 | 4)[] = [1, 2, 4];

    const comparisons = offers.map((offer) => {
      const yearlyComp = yearMarks.map((year) => ({
        year,
        ...calculateTotalComp(offer, year),
      }));

      return {
        offerId: offer.id,
        companyName: offer.companyName,
        location: offer.location,
        locationCOL: COST_OF_LIVING[offer.location]?.index || 100,
        baseSalary: offer.baseSalary,
        compensation: yearlyComp,
      };
    });

    // Determine winner for each year
    const winners = yearMarks.map((year) => {
      const yearComps = comparisons.map((c) => ({
        offerId: c.offerId,
        companyName: c.companyName,
        total: c.compensation.find((comp) => comp.year === year)?.total || 0,
        colAdjusted: c.compensation.find((comp) => comp.year === year)?.colAdjusted || 0,
      }));

      const byTotal = [...yearComps].sort((a, b) => b.total - a.total);
      const byCOL = [...yearComps].sort((a, b) => b.colAdjusted - a.colAdjusted);

      return {
        year,
        byTotalComp: {
          companyName: byTotal[0].companyName,
          offerId: byTotal[0].offerId,
          value: byTotal[0].total,
          margin: byTotal.length > 1 ? byTotal[0].total - byTotal[1].total : 0,
        },
        byCOLAdjusted: {
          companyName: byCOL[0].companyName,
          offerId: byCOL[0].offerId,
          value: byCOL[0].colAdjusted,
          margin: byCOL.length > 1 ? byCOL[0].colAdjusted - byCOL[1].colAdjusted : 0,
        },
      };
    });

    // Summary statistics
    const summary = {
      totalOffers: offers.length,
      yearMarks,
      normalizeToLocation,
      baseCOL: COST_OF_LIVING[normalizeToLocation]?.index || 100,
      overallWinner: {
        year4Total: winners.find((w) => w.year === 4)?.byTotalComp.companyName,
        year4COLAdjusted: winners.find((w) => w.year === 4)?.byCOLAdjusted.companyName,
      },
    };

    return NextResponse.json({
      comparisons,
      winners,
      summary,
      assumptions: {
        vestingSchedules: {
          "4year-1cliff": "25% at 1 year, then monthly over 3 years",
          "4year-monthly": "Monthly over 4 years, no cliff",
          "3year-monthly": "Monthly over 3 years, no cliff",
          immediate: "Immediate vesting",
        },
        benefitValuations: {
          healthcare: BENEFITS_VALUATION.healthcareValues,
          "401kMatch": "Calculated as match rate × contribution up to max",
          pto: `${BENEFITS_VALUATION.ptoValuePerExtraDay * 100}% of salary per day beyond ${BENEFITS_VALUATION.basePTODays} days`,
        },
        colNormalization: `All values normalized to ${COST_OF_LIVING[normalizeToLocation]?.name || "National Average"} (index ${COST_OF_LIVING[normalizeToLocation]?.index || 100})`,
      },
      disclaimer: "Equity values are estimates and may differ significantly from actual outcomes. Stock options and RSUs carry risk. Benefits valuations are estimates based on market averages. This is not financial advice.",
    });
  } catch (error) {
    console.error("[Compensation Compare Error]", error);
    return NextResponse.json(
      { error: "Failed to compare compensation. Please check your input." },
      { status: 500 }
    );
  }
}
