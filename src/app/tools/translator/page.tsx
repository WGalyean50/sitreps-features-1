"use client";

import * as React from "react";
import { ToolLayout, ToolSection } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResultsCard, ResultsList, ResultsListItem } from "@/components/results-card";
import { SaveResultsButton } from "@/components/save-results-button";
import { Disclaimer } from "@/components/disclaimer";
import * as analytics from "@/lib/analytics";
import {
  Building2,
  Briefcase,
  TrendingUp,
  Users,
  Shield,
  Target,
  Truck,
  Map,
  Wifi,
  GraduationCap,
  DollarSign,
  Globe,
  ChevronRight,
  Check,
  Star,
} from "lucide-react";

// Types matching the data file
interface CorporateRole {
  title: string;
  level: "entry" | "mid" | "senior" | "executive";
  description: string;
  salaryRange: { min: number; max: number };
  demandLevel: "high" | "medium" | "low";
}

interface StaffSection {
  number: number;
  name: string;
  militaryDescription: string;
  corporateEquivalents: CorporateRole[];
  keySkills: string[];
  typicalMilitaryTitles: string[];
  industryFit: string[];
}

interface CareerPath {
  id: string;
  name: string;
  description: string;
  militaryBackground: string;
  steps: { year: number; title: string; description: string; skills: string[] }[];
  timelineYears: number;
  potentialSalary: number;
}

interface BranchInfo {
  name: string;
  prefix: string;
  description: string;
}

// Section icons mapping
const SECTION_ICONS: Record<number, React.ReactNode> = {
  1: <Users className="h-5 w-5" />,
  2: <Shield className="h-5 w-5" />,
  3: <Target className="h-5 w-5" />,
  4: <Truck className="h-5 w-5" />,
  5: <Map className="h-5 w-5" />,
  6: <Wifi className="h-5 w-5" />,
  7: <GraduationCap className="h-5 w-5" />,
  8: <DollarSign className="h-5 w-5" />,
  9: <Globe className="h-5 w-5" />,
};

// Level badge colors
const LEVEL_COLORS: Record<string, string> = {
  entry: "bg-green-100 text-green-800",
  mid: "bg-blue-100 text-blue-800",
  senior: "bg-purple-100 text-purple-800",
  executive: "bg-amber-100 text-amber-800",
};

// Demand badge colors
const DEMAND_COLORS: Record<string, string> = {
  high: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-gray-100 text-gray-800",
};

export default function TranslatorPage() {
  // State
  const [branches, setBranches] = React.useState<Record<string, BranchInfo>>({});
  const [sections, setSections] = React.useState<StaffSection[]>([]);
  const [careerPaths, setCareerPaths] = React.useState<CareerPath[]>([]);
  const [selectedBranch, setSelectedBranch] = React.useState<string | null>(null);
  const [selectedSection, setSelectedSection] = React.useState<number | null>(null);
  const [selectedSectionData, setSelectedSectionData] = React.useState<StaffSection | null>(null);
  const [expandedPath, setExpandedPath] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingSection, setLoadingSection] = React.useState(false);

  // Fetch initial data
  React.useEffect(() => {
    analytics.toolStarted("translator");

    async function fetchData() {
      try {
        const res = await fetch("/api/translator/mapping?paths=true");
        const data = await res.json();
        setBranches(data.branches);
        setSections(data.sections);
        setCareerPaths(data.careerPaths || []);
      } catch (error) {
        console.error("Failed to fetch translator data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch section details when selected
  React.useEffect(() => {
    if (selectedSection === null) {
      setSelectedSectionData(null);
      return;
    }

    async function fetchSection() {
      setLoadingSection(true);
      try {
        const res = await fetch(`/api/translator/mapping?section=${selectedSection}`);
        const data = await res.json();
        setSelectedSectionData(data.section);

        analytics.track("translator_section_selected", {
          section: selectedSection || 0,
          branch: selectedBranch || "unknown",
        });
      } catch (error) {
        console.error("Failed to fetch section details:", error);
      } finally {
        setLoadingSection(false);
      }
    }
    fetchSection();
  }, [selectedSection, selectedBranch]);

  // Get designation string
  const getDesignation = (sectionNum: number) => {
    if (selectedBranch && branches[selectedBranch]) {
      return `${branches[selectedBranch].prefix}-${sectionNum}`;
    }
    return `X-${sectionNum}`;
  };

  // Format salary
  const formatSalary = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <ToolLayout
        title="Defense to Corporate Translator"
        description="Translate your military staff experience to corporate roles"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading translator data...</div>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="Defense to Corporate Translator"
      description="Discover how your military staff experience translates to corporate career opportunities"
    >
      <div className="space-y-8">
        {/* Step 1: Select Branch */}
        <ToolSection>
          <h2 className="text-h3 font-semibold mb-4">Step 1: Select Your Branch</h2>
          <p className="text-muted-foreground mb-6">
            Choose your military branch to see branch-specific designations.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(branches).map(([key, branch]) => (
              <button
                key={key}
                onClick={() => setSelectedBranch(key)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedBranch === key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-semibold">{branch.name}</div>
                <div className="text-sm text-muted-foreground">{branch.prefix}-series</div>
              </button>
            ))}
          </div>
        </ToolSection>

        {/* Step 2: Select Staff Section */}
        <ToolSection>
          <h2 className="text-h3 font-semibold mb-4">Step 2: Select Staff Section</h2>
          <p className="text-muted-foreground mb-6">
            Select the staff function that best matches your experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.map((section) => (
              <button
                key={section.number}
                onClick={() => setSelectedSection(section.number)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedSection === section.number
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${
                    selectedSection === section.number ? "bg-primary/10" : "bg-muted"
                  }`}>
                    {SECTION_ICONS[section.number]}
                  </div>
                  <div>
                    <div className="font-semibold">{getDesignation(section.number)}</div>
                    <div className="text-sm text-muted-foreground">{section.name}</div>
                  </div>
                </div>
                {selectedSection === section.number && (
                  <Check className="absolute top-2 right-2 h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </ToolSection>

        {/* Results Section */}
        {selectedSectionData && (
          <div className="space-y-6">
            {/* Section Overview */}
            <ToolSection>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-h3 font-semibold">
                    {getDesignation(selectedSectionData.number)} - {selectedSectionData.name}
                  </h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    {selectedSectionData.militaryDescription}
                  </p>
                </div>
                <SaveResultsButton toolName="translator" />
              </div>

              {/* Key Skills */}
              <div className="mb-6">
                <h3 className="text-body-lg font-medium mb-3">Transferable Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSectionData.keySkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Industry Fit */}
              <div>
                <h3 className="text-body-lg font-medium mb-3">Best Industry Fit</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSectionData.industryFit.map((industry) => (
                    <span
                      key={industry}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </ToolSection>

            {/* Corporate Equivalents */}
            <ToolSection>
              <h2 className="text-h3 font-semibold mb-6">Corporate Equivalent Roles</h2>

              <div className="space-y-4">
                {selectedSectionData.corporateEquivalents.map((role, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{role.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${LEVEL_COLORS[role.level]}`}>
                              {role.level}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Salary Range</div>
                            <div className="font-semibold">
                              {formatSalary(role.salaryRange.min)} - {formatSalary(role.salaryRange.max)}
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${DEMAND_COLORS[role.demandLevel]}`}>
                            {role.demandLevel === "high" ? "High Demand" : role.demandLevel === "medium" ? "Moderate Demand" : "Lower Demand"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ToolSection>

            {/* Typical Military Titles */}
            <ToolSection>
              <h2 className="text-h3 font-semibold mb-4">Common Military Titles in This Function</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedSectionData.typicalMilitaryTitles.map((title) => (
                  <div
                    key={title}
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                  >
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{title}</span>
                  </div>
                ))}
              </div>
            </ToolSection>
          </div>
        )}

        {/* Example Career Paths */}
        <ToolSection>
          <h2 className="text-h3 font-semibold mb-2">Example Career Paths</h2>
          <p className="text-muted-foreground mb-6">
            See how other veterans have successfully transitioned from similar backgrounds.
          </p>

          <div className="space-y-4">
            {careerPaths.map((path) => (
              <Card key={path.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedPath(expandedPath === path.id ? null : path.id)}
                  className="w-full text-left"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          {path.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {path.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          expandedPath === path.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        From: <span className="font-medium text-foreground">{path.militaryBackground}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Timeline: <span className="font-medium text-foreground">{path.timelineYears} years</span>
                      </span>
                      <span className="text-muted-foreground">
                        Target: <span className="font-medium text-success">{formatSalary(path.potentialSalary)}</span>
                      </span>
                    </div>
                  </CardContent>
                </button>

                {/* Expanded Content */}
                {expandedPath === path.id && (
                  <CardContent className="pt-0 border-t">
                    <div className="pt-4">
                      <h4 className="font-medium mb-4">Career Progression</h4>
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                        {path.steps.map((step, index) => (
                          <div key={index} className="relative pl-10 pb-6 last:pb-0">
                            {/* Timeline dot */}
                            <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary" />

                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="text-sm font-medium text-primary">Year {step.year}</span>
                                <h5 className="font-semibold">{step.title}</h5>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {step.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-0.5 bg-muted rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </ToolSection>

        {/* Disclaimer */}
        <Disclaimer variant="info" title="Career Guidance">
          This tool provides general guidance based on common career transitions. Individual
          results may vary based on location, industry demand, certifications, and other factors.
          Salary ranges are national averages and may differ significantly by region.
        </Disclaimer>
      </div>
    </ToolLayout>
  );
}
