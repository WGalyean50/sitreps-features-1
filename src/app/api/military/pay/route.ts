import { NextRequest, NextResponse } from "next/server";
import {
  getBasePay,
  getBAS,
  PAY_GRADES,
  DATA_SOURCE,
  type PayGrade,
} from "@/data/military-pay";

/**
 * GET /api/military/pay
 *
 * Returns base pay and BAS for a given rank and years of service
 *
 * Query params:
 * - grade: Pay grade (E1-E9, W1-W5, O1-O10)
 * - years: Years of service (0-40)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const grade = searchParams.get("grade")?.toUpperCase() as PayGrade;
  const yearsParam = searchParams.get("years");

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

  // Parse and validate years
  const years = yearsParam ? parseInt(yearsParam, 10) : 0;
  if (isNaN(years) || years < 0 || years > 40) {
    return NextResponse.json(
      { error: "Years must be a number between 0 and 40" },
      { status: 400 }
    );
  }

  const basePay = getBasePay(grade, years);
  const bas = getBAS(grade);
  const gradeInfo = PAY_GRADES[grade];

  return NextResponse.json({
    grade,
    yearsOfService: years,
    gradeInfo: {
      title: gradeInfo.title,
      armyTitle: gradeInfo.branch.army,
    },
    monthly: {
      basePay,
      bas,
      total: basePay + bas,
    },
    annual: {
      basePay: basePay * 12,
      bas: bas * 12,
      total: (basePay + bas) * 12,
    },
    dataSource: {
      name: DATA_SOURCE.name,
      year: DATA_SOURCE.year,
      lastUpdated: DATA_SOURCE.lastUpdated,
    },
  });
}
