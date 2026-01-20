"use client";

import * as React from "react";
import { ToolLayout, ToolSection } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CurrencyInput } from "@/components/currency-input";
import { ResultsCard } from "@/components/results-card";
import { SaveResultsButton } from "@/components/save-results-button";
import { Disclaimer } from "@/components/disclaimer";
import { StepIndicator } from "@/components/step-indicator";
import * as analytics from "@/lib/analytics";
import {
  GraduationCap,
  Award,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle2,
  Briefcase,
  Plus,
  X,
} from "lucide-react";

// Types
interface Credential {
  id: string;
  name: string;
  type: "degree" | "certification" | "bootcamp";
  industry: string;
  description: string;
  totalCost: { min: number; max: number };
  monthsToComplete: { min: number; max: number };
  salaryIncrease: {
    entry: { min: number; max: number };
    experienced: { min: number; max: number };
  };
  jobsAvailable: "high" | "medium" | "low";
  passRate?: number;
  completionRate?: number;
  employmentRate?: number;
}

interface ROIResult {
  credential: Credential;
  analysis: {
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
}

// Type icons
const TYPE_ICONS: Record<string, React.ReactNode> = {
  degree: <GraduationCap className="h-5 w-5" />,
  certification: <Award className="h-5 w-5" />,
  bootcamp: <Zap className="h-5 w-5" />,
};

const DEMAND_COLORS: Record<string, string> = {
  high: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-gray-100 text-gray-800",
};

export default function ROICalculatorPage() {
  // State
  const [credentials, setCredentials] = React.useState<Credential[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [step, setStep] = React.useState(1);

  // Form state
  const [currentSalary, setCurrentSalary] = React.useState<number>(60000);
  const [experienceLevel, setExperienceLevel] = React.useState<"entry" | "experienced">("entry");
  const [useGIBill, setUseGIBill] = React.useState(true);
  const [selectedCredentials, setSelectedCredentials] = React.useState<string[]>([]);
  const [filterType, setFilterType] = React.useState<string>("all");
  const [filterIndustry, setFilterIndustry] = React.useState<string>("all");

  // Results state
  const [results, setResults] = React.useState<ROIResult[] | null>(null);
  const [calculating, setCalculating] = React.useState(false);
  const [winner, setWinner] = React.useState<string | null>(null);

  // Fetch credentials
  React.useEffect(() => {
    analytics.toolStarted("roi-calculator");

    async function fetchCredentials() {
      try {
        // Fetch credential list from the data file via dynamic import
        const { CREDENTIALS } = await import("@/data/credentials");
        setCredentials(CREDENTIALS);
      } catch (error) {
        console.error("Failed to load credentials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCredentials();
  }, []);

  // Filter credentials
  const filteredCredentials = React.useMemo(() => {
    return credentials.filter((c) => {
      if (filterType !== "all" && c.type !== filterType) return false;
      if (filterIndustry !== "all" && c.industry !== filterIndustry) return false;
      return true;
    });
  }, [credentials, filterType, filterIndustry]);

  // Get unique industries
  const industries = React.useMemo(() => {
    return Array.from(new Set(credentials.map((c) => c.industry))).sort();
  }, [credentials]);

  // Toggle credential selection
  const toggleCredential = (id: string) => {
    if (selectedCredentials.includes(id)) {
      setSelectedCredentials(selectedCredentials.filter((c) => c !== id));
    } else if (selectedCredentials.length < 2) {
      setSelectedCredentials([...selectedCredentials, id]);
    }
  };

  // Calculate ROI
  const calculateROI = async () => {
    if (selectedCredentials.length === 0) return;

    setCalculating(true);
    try {
      const response = await fetch("/api/roi/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentials: selectedCredentials.map((id) => ({
            credentialId: id,
            currentSalary,
            experienceLevel,
            useGIBill,
          })),
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("ROI calculation error:", data.error);
        return;
      }

      setResults(data.results);
      setWinner(data.winner || null);
      setStep(3);

      analytics.track("roi_calculated", {
        credentials: selectedCredentials.length,
        useGIBill,
        experienceLevel,
      });
    } catch (error) {
      console.error("Failed to calculate ROI:", error);
    } finally {
      setCalculating(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <ToolLayout
        title="Degree & Certification ROI Calculator"
        description="Calculate the return on investment for degrees, certifications, and bootcamps"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading credentials...</div>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="Degree & Certification ROI Calculator"
      description="Make informed decisions about your education investment. See how GI Bill benefits impact your ROI."
    >
      <div className="space-y-8">
        <StepIndicator currentStep={step} totalSteps={3} className="mb-8" />

        {/* Step 1: Your Information */}
        {step === 1 && (
          <ToolSection>
            <h2 className="text-h3 font-semibold mb-6">Step 1: Your Information</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <CurrencyInput
                id="current-salary"
                label="Current Annual Salary"
                value={currentSalary || undefined}
                onChange={(val) => setCurrentSalary(val || 0)}
              />

              <div>
                <label className="block text-sm font-medium mb-2">Experience Level</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setExperienceLevel("entry")}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      experienceLevel === "entry"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium">Entry Level</div>
                    <div className="text-sm text-muted-foreground">0-4 years in field</div>
                  </button>
                  <button
                    onClick={() => setExperienceLevel("experienced")}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      experienceLevel === "experienced"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium">Experienced</div>
                    <div className="text-sm text-muted-foreground">5+ years in field</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGIBill}
                  onChange={(e) => setUseGIBill(e.target.checked)}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-medium">I have Post-9/11 GI Bill benefits</span>
                  <p className="text-sm text-muted-foreground">
                    GI Bill can cover tuition plus monthly housing allowance
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={() => setStep(2)} size="lg">
                Continue to Credentials
              </Button>
            </div>
          </ToolSection>
        )}

        {/* Step 2: Select Credentials */}
        {step === 2 && (
          <ToolSection>
            <h2 className="text-h3 font-semibold mb-2">Step 2: Select Credentials to Compare</h2>
            <p className="text-muted-foreground mb-6">
              Choose up to 2 credentials to compare side-by-side.
            </p>

            {/* Selected credentials */}
            {selectedCredentials.length > 0 && (
              <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                <div className="text-sm font-medium mb-2">Selected ({selectedCredentials.length}/2):</div>
                <div className="flex flex-wrap gap-2">
                  {selectedCredentials.map((id) => {
                    const cred = credentials.find((c) => c.id === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                      >
                        {cred?.name}
                        <button onClick={() => toggleCredential(id)}>
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="all">All Types</option>
                  <option value="degree">Degrees</option>
                  <option value="certification">Certifications</option>
                  <option value="bootcamp">Bootcamps</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <select
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="all">All Industries</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Credential Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCredentials.map((cred) => {
                const isSelected = selectedCredentials.includes(cred.id);
                const canSelect = selectedCredentials.length < 2 || isSelected;

                return (
                  <button
                    key={cred.id}
                    onClick={() => canSelect && toggleCredential(cred.id)}
                    disabled={!canSelect}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : canSelect
                        ? "border-border hover:border-primary/50"
                        : "border-border opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/10" : "bg-muted"}`}>
                          {TYPE_ICONS[cred.type]}
                        </div>
                        <div>
                          <div className="font-semibold">{cred.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{cred.type}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {cred.description}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-muted rounded">
                        {formatCurrency(cred.totalCost.min)} - {formatCurrency(cred.totalCost.max)}
                      </span>
                      <span className="px-2 py-1 bg-muted rounded">
                        {cred.monthsToComplete.min}-{cred.monthsToComplete.max} months
                      </span>
                      <span className={`px-2 py-1 rounded ${DEMAND_COLORS[cred.jobsAvailable]}`}>
                        {cred.jobsAvailable} demand
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={calculateROI}
                disabled={selectedCredentials.length === 0 || calculating}
                size="lg"
              >
                {calculating ? "Calculating..." : "Calculate ROI"}
              </Button>
            </div>
          </ToolSection>
        )}

        {/* Step 3: Results */}
        {step === 3 && results && (
          <div className="space-y-6">
            {/* Winner Banner (if comparison) */}
            {winner && results.length === 2 && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span className="font-semibold text-success">Best 10-Year NPV: {winner}</span>
                </div>
              </div>
            )}

            {/* Results for each credential */}
            {results.map((result, index) => (
              <ToolSection key={result.credential.id}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {TYPE_ICONS[result.credential.type]}
                    </div>
                    <div>
                      <h3 className="text-h3 font-semibold">{result.credential.name}</h3>
                      <p className="text-muted-foreground capitalize">
                        {result.credential.type} • {result.credential.industry.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  {index === 0 && <SaveResultsButton toolName="roi-calculator" />}
                </div>

                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                  <ResultsCard
                    title="Break-Even Point"
                    value={result.analysis.breakEvenFormatted}
                    variant="info"
                    highlight
                  />
                  <ResultsCard
                    title="10-Year NPV"
                    value={formatCurrency(result.analysis.npv10Year)}
                    variant={result.analysis.npv10Year > 0 ? "success" : "warning"}
                  />
                  <ResultsCard
                    title="Annual Salary Boost"
                    value={formatCurrency(result.analysis.expectedSalaryIncrease.annual)}
                  />
                  <ResultsCard
                    title="10-Year ROI"
                    value={`${result.analysis.roi10Year}%`}
                    variant={result.analysis.roi10Year > 100 ? "success" : "info"}
                  />
                </div>

                {/* Cost Breakdown */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Cost Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Cost</span>
                          <span className="font-medium">
                            {formatCurrency(result.analysis.totalInvestment + result.analysis.giBillBenefit)}
                          </span>
                        </div>
                        {result.giBillDetails && (
                          <div className="flex justify-between text-success">
                            <span>GI Bill Benefit</span>
                            <span className="font-medium">
                              -{formatCurrency(result.analysis.giBillBenefit)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Your Out-of-Pocket</span>
                          <span className="font-bold">
                            {formatCurrency(result.analysis.outOfPocket)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* GI Bill Details */}
                  {result.giBillDetails && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Briefcase className="h-4 w-4" /> GI Bill Benefits Used
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tuition Covered</span>
                            <span>{formatCurrency(result.giBillDetails.tuitionCovered)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Housing Allowance</span>
                            <span>{formatCurrency(result.giBillDetails.housingAllowance)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Book Stipend</span>
                            <span>{formatCurrency(result.giBillDetails.bookStipend)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Months Used / Remaining</span>
                            <span className="font-medium">
                              {result.giBillDetails.monthsUsed} / {result.giBillDetails.monthsRemaining}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Cumulative Returns Chart (simplified table) */}
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> Cumulative Returns Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Year</th>
                            {result.analysis.cumulativeReturns.slice(0, 10).map((r) => (
                              <th key={r.year} className="text-right py-2 font-medium px-2">
                                {r.year}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-2 text-muted-foreground">Net Return</td>
                            {result.analysis.cumulativeReturns.slice(0, 10).map((r) => (
                              <td
                                key={r.year}
                                className={`text-right py-2 px-2 ${
                                  r.cumulative >= 0 ? "text-success" : "text-destructive"
                                }`}
                              >
                                {formatCurrency(r.cumulative)}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </ToolSection>
            ))}

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Compare Different Credentials
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCredentials([]);
                  setResults(null);
                  setStep(1);
                }}
              >
                Start Over
              </Button>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <Disclaimer variant="info" title="ROI Estimates">
          These calculations are estimates based on average data. Actual results vary based on
          location, employer, industry demand, and individual circumstances. Salary increases
          depend on many factors beyond credentials alone. GI Bill benefits shown are estimates
          and may differ from actual entitlements.
        </Disclaimer>
      </div>
    </ToolLayout>
  );
}
