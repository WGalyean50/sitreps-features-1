"use client";

import * as React from "react";
import { ToolLayout } from "@/components/layout";
import { StepIndicator } from "@/components/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsCard } from "@/components/results-card";
import { SaveResultsButton } from "@/components/save-results-button";
import { TaxDisclaimer } from "@/components/disclaimer";
import { toolStarted, toolCompleted } from "@/lib/analytics";
import {
  getRankOptions,
  calculateRetirementPay,
  getRetirementEligibility,
  type PayGrade,
  type RetirementSystem,
} from "@/data/military-pay";
import { Loader2, ArrowRight, ArrowLeft, TrendingUp, MapPin, DollarSign, Search, Clock, BadgeCheck } from "lucide-react";

const TOOL_NAME = "military-pay-comparison";

type SeparationType = "ets" | "retiree";

interface MilitaryInfo {
  grade: PayGrade | "";
  yearsOfService: number;
  zipCode: string;
  withDependents: boolean;
  separationType: SeparationType;
  retirementSystem: RetirementSystem;
}

interface StateEquivalent {
  stateCode: string;
  stateName: string;
  taxType: "none" | "flat" | "progressive";
  equivalentSalary: number;
  federalTax: number;
  stateTax: number;
  ficaTotal: number;
  totalTax: number;
  effectiveRate: number;
  premiumOverMilitary: number;
  premiumPercent: number;
}

interface MilitaryPayResult {
  military: {
    grade: string;
    separationType?: "ets" | "retiree";
    monthly: { basePay: number; bah: number; bas: number; total: number };
    annual: { grossTotal: number; taxableIncome: number; taxFreeAllowances: number };
    taxes: { federalTax: number; stateTax: number; fica: number; totalTax: number };
    netIncome: { annual: number; monthly: number };
    effectiveRate: number;
  };
  retirement: {
    monthlyPay: number;
    annualPay: number;
  } | null;
  stateEquivalents: StateEquivalent[];
  summary: {
    lowestSalaryNeeded: StateEquivalent;
    highestSalaryNeeded: StateEquivalent;
    averageSalaryNeeded: number;
  };
  insight: string;
}

export default function MilitaryPayComparisonPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [militaryInfo, setMilitaryInfo] = React.useState<MilitaryInfo>({
    grade: "",
    yearsOfService: 0,
    zipCode: "",
    withDependents: true,
    separationType: "ets",
    retirementSystem: "HIGH_3",
  });
  const [results, setResults] = React.useState<MilitaryPayResult | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"salary" | "state">("salary");
  const [statesOfInterest, setStatesOfInterest] = React.useState("");

  const rankOptions = getRankOptions();

  // Calculate retirement eligibility and pay
  const retirementEligibility = React.useMemo(() => {
    return getRetirementEligibility(militaryInfo.yearsOfService);
  }, [militaryInfo.yearsOfService]);

  const monthlyRetirementPay = React.useMemo(() => {
    if (militaryInfo.separationType !== "retiree" || !militaryInfo.grade) return 0;
    return calculateRetirementPay(
      militaryInfo.grade as PayGrade,
      militaryInfo.yearsOfService,
      militaryInfo.retirementSystem
    );
  }, [militaryInfo.grade, militaryInfo.yearsOfService, militaryInfo.separationType, militaryInfo.retirementSystem]);

  React.useEffect(() => {
    toolStarted(TOOL_NAME);
  }, []);

  const calculateEquivalents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/military/equivalent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: militaryInfo.grade,
          yearsOfService: militaryInfo.yearsOfService,
          zipCode: militaryInfo.zipCode,
          withDependents: militaryInfo.withDependents,
          separationType: militaryInfo.separationType,
          retirementSystem: militaryInfo.retirementSystem,
          monthlyRetirementPay: monthlyRetirementPay,
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("API error:", data.error);
        return;
      }

      setResults(data);
      toolCompleted(TOOL_NAME);
      setCurrentStep(2);
    } catch (error) {
      console.error("Failed to calculate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isFormValid = militaryInfo.grade && militaryInfo.zipCode.length === 5;

  // Parse states of interest into an array of state codes
  const parsedStatesOfInterest = React.useMemo(() => {
    if (!statesOfInterest.trim()) return [];
    return statesOfInterest
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length === 2);
  }, [statesOfInterest]);

  // Filter and sort states
  const filteredStates = React.useMemo(() => {
    if (!results) return [];

    let states = results.stateEquivalents;

    // Filter by states of interest (if specified)
    if (parsedStatesOfInterest.length > 0) {
      states = states.filter((s) =>
        parsedStatesOfInterest.includes(s.stateCode)
      );
    }

    // Filter by search (additional filter on top of states of interest)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      states = states.filter(
        (s) =>
          s.stateName.toLowerCase().includes(term) ||
          s.stateCode.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === "state") {
      states = [...states].sort((a, b) => a.stateName.localeCompare(b.stateName));
    }
    // Already sorted by salary from API

    return states;
  }, [results, parsedStatesOfInterest, searchTerm, sortBy]);

  return (
    <ToolLayout
      title="Military Pay Comparison Calculator"
      description="See what civilian salary you'd need in every state to match your military take-home pay."
    >
      <div className="mb-8">
        <StepIndicator currentStep={currentStep} totalSteps={2} />
      </div>

      {/* Step 1: Military Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Military Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your current military pay details to see equivalent civilian salaries.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rank">Pay Grade / Rank</Label>
                <select
                  id="rank"
                  value={militaryInfo.grade}
                  onChange={(e) => setMilitaryInfo({ ...militaryInfo, grade: e.target.value as PayGrade })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select rank...</option>
                  {rankOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Years of Service</Label>
                <Input
                  id="years"
                  type="number"
                  min="0"
                  max="40"
                  value={militaryInfo.yearsOfService || ""}
                  onChange={(e) => setMilitaryInfo({ ...militaryInfo, yearsOfService: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">Duty Station ZIP Code</Label>
                <Input
                  id="zip"
                  type="text"
                  maxLength={5}
                  value={militaryInfo.zipCode}
                  onChange={(e) => setMilitaryInfo({ ...militaryInfo, zipCode: e.target.value.replace(/\D/g, "") })}
                  placeholder="12345"
                />
                <p className="text-xs text-muted-foreground">Used to calculate your BAH rate</p>
              </div>

              <div className="space-y-2">
                <Label>Dependents</Label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={militaryInfo.withDependents}
                      onChange={() => setMilitaryInfo({ ...militaryInfo, withDependents: true })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">With Dependents</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!militaryInfo.withDependents}
                      onChange={() => setMilitaryInfo({ ...militaryInfo, withDependents: false })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Without</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Separation Type */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-base font-medium">Separation Type</Label>
                <p className="text-sm text-muted-foreground">
                  Are you separating (ETS) or retiring with pension benefits?
                </p>
                <div className="grid gap-3 sm:grid-cols-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setMilitaryInfo({ ...militaryInfo, separationType: "ets" })}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      militaryInfo.separationType === "ets"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-input hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">ETS / Separation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Leaving active duty without retirement benefits
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMilitaryInfo({ ...militaryInfo, separationType: "retiree" })}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      militaryInfo.separationType === "retiree"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-input hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <BadgeCheck className="h-4 w-4" />
                      <span className="font-medium">Retiree</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Retiring with pension benefits (20+ years)
                    </p>
                  </button>
                </div>
              </div>

              {/* Retirement System - only show for retirees */}
              {militaryInfo.separationType === "retiree" && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  {!retirementEligibility.eligible && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded text-sm text-warning">
                      <strong>Note:</strong> You need {retirementEligibility.yearsUntilEligible} more year(s) of service to be eligible for retirement (20 years required).
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Retirement System</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={militaryInfo.retirementSystem === "HIGH_3"}
                          onChange={() => setMilitaryInfo({ ...militaryInfo, retirementSystem: "HIGH_3" })}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">High-3 (Pre-2018)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={militaryInfo.retirementSystem === "BRS"}
                          onChange={() => setMilitaryInfo({ ...militaryInfo, retirementSystem: "BRS" })}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">BRS (Post-2018)</span>
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      High-3: 2.5% per year (max 75%) | BRS: 2.0% per year (max 60%) + TSP matching
                    </p>
                  </div>

                  {retirementEligibility.eligible && militaryInfo.grade && (
                    <div className="p-3 bg-success/10 border border-success/20 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Estimated Monthly Retirement Pay</span>
                        <span className="text-lg font-bold text-success">
                          {formatCurrency(monthlyRetirementPay)}/mo
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {militaryInfo.yearsOfService} years × {militaryInfo.retirementSystem === "HIGH_3" ? "2.5%" : "2.0%"} = {Math.min(militaryInfo.yearsOfService * (militaryInfo.retirementSystem === "HIGH_3" ? 2.5 : 2.0), militaryInfo.retirementSystem === "HIGH_3" ? 75 : 60)}% of base pay
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* States of Interest */}
            <div className="space-y-2">
              <Label htmlFor="states">States of Interest (optional)</Label>
              <Input
                id="states"
                type="text"
                value={statesOfInterest}
                onChange={(e) => setStatesOfInterest(e.target.value.toUpperCase())}
                placeholder="TX, CA, WA, FL"
              />
              <p className="text-xs text-muted-foreground">
                Enter state codes separated by commas. Leave blank to see all 50 states.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={calculateEquivalents} disabled={!isFormValid || isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    Calculate Equivalent Salaries
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Results */}
      {currentStep === 2 && results && (
        <div className="space-y-6">
          {/* Military Pay Summary */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Your Military Compensation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Base Pay</p>
                  <p className="text-xl font-bold">{formatCurrency(results.military.monthly.basePay)}/mo</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">BAH (Tax-Free)</p>
                  <p className="text-xl font-bold text-success">{formatCurrency(results.military.monthly.bah)}/mo</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">BAS (Tax-Free)</p>
                  <p className="text-xl font-bold text-success">{formatCurrency(results.military.monthly.bas)}/mo</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-1 p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly Take-Home</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.military.netIncome.monthly)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(results.military.netIncome.annual)}/year
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Retirement Income Card - Only for Retirees */}
          {results.retirement && (
            <Card className="border-success/30 bg-success/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-success" />
                  Your Retirement Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Retirement Pay</p>
                    <p className="text-2xl font-bold text-success">{formatCurrency(results.retirement.monthlyPay)}/mo</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Retirement Pay</p>
                    <p className="text-2xl font-bold text-success">{formatCurrency(results.retirement.annualPay)}/year</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  This retirement income reduces how much civilian salary you need to match your current take-home pay.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Key Insight */}
          <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
            <p className="text-sm">
              <strong>Key Insight:</strong> {results.insight}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultsCard
              variant="success"
              title="Lowest Salary Needed"
              value={formatCurrency(results.summary.lowestSalaryNeeded.equivalentSalary)}
              subtitle={results.summary.lowestSalaryNeeded.stateName}
            />
            <ResultsCard
              variant="info"
              title="Average Across All States"
              value={formatCurrency(results.summary.averageSalaryNeeded)}
              subtitle={parsedStatesOfInterest.length > 0 ? `Showing ${filteredStates.length} states` : "50 states + DC"}
            />
            <ResultsCard
              variant="warning"
              title="Highest Salary Needed"
              value={formatCurrency(results.summary.highestSalaryNeeded.equivalentSalary)}
              subtitle={results.summary.highestSalaryNeeded.stateName}
            />
          </div>

          {/* State Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Equivalent Salary by State
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search states..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-[180px]"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "salary" | "state")}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="salary">Sort by Salary</option>
                    <option value="state">Sort by State</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">State</th>
                      <th className="py-3 text-left font-medium">Tax Type</th>
                      <th className="py-3 text-right font-medium">Salary Needed</th>
                      <th className="py-3 text-right font-medium">Premium</th>
                      <th className="py-3 text-right font-medium">Effective Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStates.map((state, index) => (
                      <tr
                        key={state.stateCode}
                        className={`border-b hover:bg-muted/50 ${
                          state.taxType === "none" ? "bg-success/5" : ""
                        }`}
                      >
                        <td className="py-3">
                          <div className="font-medium">{state.stateName}</div>
                          <div className="text-xs text-muted-foreground">{state.stateCode}</div>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              state.taxType === "none"
                                ? "bg-green-100 text-green-800"
                                : state.taxType === "flat"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {state.taxType === "none" ? "No Income Tax" : state.taxType === "flat" ? "Flat Tax" : "Progressive"}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold">
                          {formatCurrency(state.equivalentSalary)}
                        </td>
                        <td className="py-3 text-right">
                          <span className={state.premiumPercent > 25 ? "text-warning" : "text-muted-foreground"}>
                            +{state.premiumPercent}%
                          </span>
                          <div className="text-xs text-muted-foreground">
                            +{formatCurrency(state.premiumOverMilitary)}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          {state.effectiveRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStates.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">
                  {parsedStatesOfInterest.length > 0
                    ? `No matching states found. Check your state codes: ${statesOfInterest}`
                    : "No states match your search."}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Change Military Info
            </Button>
            <SaveResultsButton toolName={TOOL_NAME} />
          </div>

          <TaxDisclaimer />
        </div>
      )}
    </ToolLayout>
  );
}
