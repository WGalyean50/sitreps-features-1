import { NextRequest, NextResponse } from "next/server";
import {
  getBAH,
  PAY_GRADES,
  DATA_SOURCE,
  BAH_SAMPLES_2024,
  type PayGrade,
} from "@/data/military-pay";

/**
 * GET /api/military/bah
 *
 * Returns Basic Allowance for Housing (BAH) for a given rank, zip code, and dependent status
 *
 * Query params:
 * - grade: Pay grade (E1-E9, W1-W5, O1-O10)
 * - zip: 5-digit ZIP code
 * - dependents: "true" or "false" (default: true)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const grade = searchParams.get("grade")?.toUpperCase() as PayGrade;
  const zip = searchParams.get("zip");
  const dependentsParam = searchParams.get("dependents");

  // Validate grade
  if (!grade || !(grade in PAY_GRADES)) {
    return NextResponse.json(
      {
        error: "Invalid or missing pay grade",
        validGrades: Object.keys(PAY_GRADES),
      },
      { status: 400 }
    );
  }

  // Validate zip code format
  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { error: "Invalid or missing ZIP code (must be 5 digits)" },
      { status: 400 }
    );
  }

  const withDependents = dependentsParam !== "false";
  const bah = getBAH(grade, zip, withDependents);
  const isExactMatch = zip in BAH_SAMPLES_2024;

  return NextResponse.json({
    grade,
    zipCode: zip,
    withDependents,
    monthly: bah,
    annual: bah * 12,
    isExactZipMatch: isExactMatch,
    note: isExactMatch
      ? "BAH rate for this specific location"
      : "Estimated BAH based on national average. Actual rates may vary by location.",
    dataSource: {
      name: DATA_SOURCE.name,
      year: DATA_SOURCE.year,
      lastUpdated: DATA_SOURCE.lastUpdated,
      disclaimer: "BAH rates are location-specific. This calculator provides estimates for common military areas. For official rates, visit the DFAS BAH Calculator.",
    },
  });
}
