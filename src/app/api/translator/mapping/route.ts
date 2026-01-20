import { NextRequest, NextResponse } from "next/server";
import {
  STAFF_SECTIONS,
  BRANCHES,
  CAREER_PATHS,
  getStaffSection,
  getAllIndustries,
  getSectionsByIndustry,
  getDesignation,
  type BranchKey,
} from "@/data/translator";

export const dynamic = "force-dynamic";

/**
 * GET /api/translator/mapping
 *
 * Returns staff function mappings and career data
 *
 * Query parameters:
 * - section: number (1-9) - Get specific section details
 * - branch: string - Filter by branch (army, navy, etc.)
 * - industry: string - Filter sections by industry fit
 * - paths: boolean - Include career path examples
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionParam = searchParams.get("section");
    const branch = searchParams.get("branch") as BranchKey | null;
    const industry = searchParams.get("industry");
    const includePaths = searchParams.get("paths") === "true";

    // If specific section requested
    if (sectionParam) {
      const sectionNumber = parseInt(sectionParam, 10);

      if (isNaN(sectionNumber) || sectionNumber < 1 || sectionNumber > 9) {
        return NextResponse.json(
          { error: "Section must be a number between 1 and 9" },
          { status: 400 }
        );
      }

      const section = getStaffSection(sectionNumber);

      if (!section) {
        return NextResponse.json(
          { error: "Section not found" },
          { status: 404 }
        );
      }

      // Generate designations for all branches
      const designations = Object.keys(BRANCHES).reduce((acc, branchKey) => {
        acc[branchKey] = getDesignation(branchKey as BranchKey, sectionNumber);
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({
        section: {
          ...section,
          designations,
        },
        branches: BRANCHES,
      });
    }

    // Filter by industry
    if (industry) {
      const sections = getSectionsByIndustry(industry);

      return NextResponse.json({
        industry,
        sections: sections.map((section) => ({
          number: section.number,
          name: section.name,
          corporateEquivalents: section.corporateEquivalents.slice(0, 3), // Top 3 roles
          keySkills: section.keySkills.slice(0, 5),
        })),
        totalSections: sections.length,
      });
    }

    // Return all sections overview
    const response: Record<string, unknown> = {
      branches: BRANCHES,
      sections: STAFF_SECTIONS.map((section) => ({
        number: section.number,
        name: section.name,
        militaryDescription: section.militaryDescription,
        topRoles: section.corporateEquivalents
          .filter((r) => r.level === "mid" || r.level === "senior")
          .slice(0, 2)
          .map((r) => ({
            title: r.title,
            level: r.level,
            salaryRange: r.salaryRange,
            demandLevel: r.demandLevel,
          })),
        keySkills: section.keySkills.slice(0, 4),
        industryFit: section.industryFit,
      })),
      industries: getAllIndustries(),
    };

    // Optionally include career paths
    if (includePaths) {
      response.careerPaths = CAREER_PATHS;
    }

    // Add branch-specific designations if branch filter specified
    if (branch && BRANCHES[branch]) {
      response.branchDesignations = STAFF_SECTIONS.map((section) => ({
        designation: getDesignation(branch, section.number),
        name: section.name,
      }));
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Translator Mapping Error]", error);
    return NextResponse.json(
      { error: "Failed to retrieve mapping data" },
      { status: 500 }
    );
  }
}
