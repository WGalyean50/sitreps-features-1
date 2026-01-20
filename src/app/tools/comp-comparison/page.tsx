"use client";

import * as React from "react";
import { ToolLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialDisclaimer } from "@/components/disclaimer";
import { CurrencyInput } from "@/components/currency-input";
import { toolStarted, toolCompleted } from "@/lib/analytics";
import { getLocationOptions, type JobOffer, type VestingSchedule } from "@/data/compensation";
import { Loader2, Trophy, Check } from "lucide-react";

const TOOL_NAME = "comp-comparison";

interface OfferFormData {
  id: string;
  companyName: string;
  location: string;
  baseSalary: number;
  signingBonus: number;
  annualBonusTarget: number;
  equityType: "options" | "rsus" | "none";
  equityValue: number;
  vestingSchedule: VestingSchedule;
  has401kMatch: boolean;
  matchPercent: number;
  maxMatchUpTo: number;
  healthcareQuality: "excellent" | "good" | "basic" | "none";
  ptoDays: number;
}

interface ComparisonResult {
  comparisons: Array<{
    offerId: string;
    companyName: string;
    location: string;
    locationCOL: number;
    baseSalary: number;
    compensation: Array<{
      year: number;
      cash: number;
      equity: number;
      benefits: number;
      total: number;
      colAdjusted: number;
    }>;
  }>;
  winners: Array<{
    year: number;
    byTotalComp: { companyName: string; value: number; margin: number };
    byCOLAdjusted: { companyName: string; value: number; margin: number };
  }>;
}

const defaultOffer = (name: string): OfferFormData => ({
  id: Date.now().toString() + name,
  companyName: "",
  location: "remote",
  baseSalary: 0,
  signingBonus: 0,
  annualBonusTarget: 0,
  equityType: "none",
  equityValue: 0,
  vestingSchedule: "4year-1cliff",
  has401kMatch: true,
  matchPercent: 50,
  maxMatchUpTo: 6,
  healthcareQuality: "good",
  ptoDays: 15,
});

export default function CompComparisonPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [offerA, setOfferA] = React.useState<OfferFormData>(defaultOffer("A"));
  const [offerB, setOfferB] = React.useState<OfferFormData>(defaultOffer("B"));
  const [results, setResults] = React.useState<ComparisonResult | null>(null);

  const locationOptions = getLocationOptions();

  React.useEffect(() => {
    toolStarted(TOOL_NAME);
  }, []);

  const updateOfferA = (field: keyof OfferFormData, value: unknown) => {
    setOfferA({ ...offerA, [field]: value });
  };

  const updateOfferB = (field: keyof OfferFormData, value: unknown) => {
    setOfferB({ ...offerB, [field]: value });
  };

  const handleCompare = async () => {
    setIsLoading(true);
    try {
      const offers = [offerA, offerB];
      const apiOffers: JobOffer[] = offers.map((o, i) => ({
        id: o.id,
        companyName: o.companyName || `Offer ${i === 0 ? "A" : "B"}`,
        location: o.location,
        baseSalary: o.baseSalary,
        signingBonus: o.signingBonus,
        annualBonus: o.annualBonusTarget,
        annualBonusTarget: o.annualBonusTarget,
        equityType: o.equityType,
        equityValue: o.equityValue,
        vestingSchedule: o.vestingSchedule,
        has401kMatch: o.has401kMatch,
        matchPercent: o.matchPercent,
        maxMatchUpTo: o.maxMatchUpTo,
        healthcareQuality: o.healthcareQuality,
        ptoDays: o.ptoDays,
        hasOtherBenefits: [],
      }));

      const response = await fetch("/api/compensation/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offers: apiOffers }),
      });

      const data = await response.json();
      setResults(data);
      toolCompleted(TOOL_NAME);
    } catch (error) {
      console.error("Failed to compare:", error);
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

  const isValid = offerA.baseSalary > 0 && offerB.baseSalary > 0;

  // Helper to render a form field row
  const FormRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-[140px_1fr_1fr] gap-4 items-center py-3 border-b border-border/50">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {children}
    </div>
  );

  // Helper to render select
  const SelectField = ({
    value,
    onChange,
    options,
  }: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  if (results) {
    const compA = results.comparisons[0];
    const compB = results.comparisons[1];
    const year1Winner = results.winners.find((w) => w.year === 1);
    const year4Winner = results.winners.find((w) => w.year === 4);

    const getYear = (comp: typeof compA, year: number) => comp.compensation.find((c) => c.year === year);

    return (
      <ToolLayout
        title="Offer Comparison Tool"
        description="Compare total compensation across job offers"
      >
        <div className="space-y-6">
          {/* Header Row */}
          <div className="grid grid-cols-[140px_1fr_1fr] gap-4">
            <div />
            <Card className={year4Winner?.byTotalComp.companyName === compA.companyName ? "ring-2 ring-green-500" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  {compA.companyName}
                  {year4Winner?.byTotalComp.companyName === compA.companyName && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> Winner
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className={year4Winner?.byTotalComp.companyName === compB.companyName ? "ring-2 ring-green-500" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  {compB.companyName}
                  {year4Winner?.byTotalComp.companyName === compB.companyName && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> Winner
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Results Comparison */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <FormRow label="Base Salary">
                  <div className="font-medium">{formatCurrency(compA.baseSalary)}</div>
                  <div className="font-medium">{formatCurrency(compB.baseSalary)}</div>
                </FormRow>
                <FormRow label="Location COL">
                  <div>{compA.locationCOL}</div>
                  <div>{compB.locationCOL}</div>
                </FormRow>
                <FormRow label="Year 1 Total">
                  <div className={year1Winner?.byTotalComp.companyName === compA.companyName ? "font-bold text-green-600" : ""}>
                    {formatCurrency(getYear(compA, 1)?.total || 0)}
                  </div>
                  <div className={year1Winner?.byTotalComp.companyName === compB.companyName ? "font-bold text-green-600" : ""}>
                    {formatCurrency(getYear(compB, 1)?.total || 0)}
                  </div>
                </FormRow>
                <FormRow label="Year 1 Cash">
                  <div className="text-muted-foreground">{formatCurrency(getYear(compA, 1)?.cash || 0)}</div>
                  <div className="text-muted-foreground">{formatCurrency(getYear(compB, 1)?.cash || 0)}</div>
                </FormRow>
                <FormRow label="Year 1 Equity">
                  <div className="text-muted-foreground">{formatCurrency(getYear(compA, 1)?.equity || 0)}</div>
                  <div className="text-muted-foreground">{formatCurrency(getYear(compB, 1)?.equity || 0)}</div>
                </FormRow>
                <FormRow label="Year 4 Total">
                  <div className={year4Winner?.byTotalComp.companyName === compA.companyName ? "font-bold text-green-600" : ""}>
                    {formatCurrency(getYear(compA, 4)?.total || 0)}
                  </div>
                  <div className={year4Winner?.byTotalComp.companyName === compB.companyName ? "font-bold text-green-600" : ""}>
                    {formatCurrency(getYear(compB, 4)?.total || 0)}
                  </div>
                </FormRow>
                <FormRow label="Year 4 COL Adjusted">
                  <div>{formatCurrency(getYear(compA, 4)?.colAdjusted || 0)}</div>
                  <div>{formatCurrency(getYear(compB, 4)?.colAdjusted || 0)}</div>
                </FormRow>
                <FormRow label="Benefits Value">
                  <div className="text-muted-foreground">{formatCurrency(getYear(compA, 4)?.benefits || 0)}</div>
                  <div className="text-muted-foreground">{formatCurrency(getYear(compB, 4)?.benefits || 0)}</div>
                </FormRow>
              </div>
            </CardContent>
          </Card>

          {/* Winner Summary */}
          {year4Winner && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Trophy className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">
                      {year4Winner.byTotalComp.companyName} wins by {formatCurrency(year4Winner.byTotalComp.margin)} over 4 years
                    </p>
                    <p className="text-sm text-green-700">
                      Total compensation: {formatCurrency(year4Winner.byTotalComp.value)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setResults(null)} className="flex-1">
              Modify Offers
            </Button>
          </div>

          <FinancialDisclaimer />
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="Offer Comparison Tool"
      description="Compare total compensation across two job offers side by side. See which offer wins over 1, 2, and 4 years."
    >
      <div className="space-y-6">
        {/* Header Row */}
        <div className="grid grid-cols-[140px_1fr_1fr] gap-4">
          <div />
          <Card>
            <CardHeader className="pb-2">
              <Input
                value={offerA.companyName}
                onChange={(e) => updateOfferA("companyName", e.target.value)}
                placeholder="Offer A"
                className="text-lg font-semibold border-0 p-0 h-auto focus-visible:ring-0"
              />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Input
                value={offerB.companyName}
                onChange={(e) => updateOfferB("companyName", e.target.value)}
                placeholder="Offer B"
                className="text-lg font-semibold border-0 p-0 h-auto focus-visible:ring-0"
              />
            </CardHeader>
          </Card>
        </div>

        {/* Form Fields */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              {/* Cash Compensation */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2">Cash Compensation</p>

              <FormRow label="Base Salary">
                <CurrencyInput
                  id="base-a"
                  value={offerA.baseSalary || undefined}
                  onChange={(v) => updateOfferA("baseSalary", v || 0)}
                  placeholder="120,000"
                />
                <CurrencyInput
                  id="base-b"
                  value={offerB.baseSalary || undefined}
                  onChange={(v) => updateOfferB("baseSalary", v || 0)}
                  placeholder="120,000"
                />
              </FormRow>

              <FormRow label="Signing Bonus">
                <CurrencyInput
                  id="signing-a"
                  value={offerA.signingBonus || undefined}
                  onChange={(v) => updateOfferA("signingBonus", v || 0)}
                  placeholder="0"
                />
                <CurrencyInput
                  id="signing-b"
                  value={offerB.signingBonus || undefined}
                  onChange={(v) => updateOfferB("signingBonus", v || 0)}
                  placeholder="0"
                />
              </FormRow>

              <FormRow label="Annual Bonus %">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={offerA.annualBonusTarget || ""}
                  onChange={(e) => updateOfferA("annualBonusTarget", parseInt(e.target.value) || 0)}
                  placeholder="15"
                />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={offerB.annualBonusTarget || ""}
                  onChange={(e) => updateOfferB("annualBonusTarget", parseInt(e.target.value) || 0)}
                  placeholder="15"
                />
              </FormRow>

              <FormRow label="Location">
                <SelectField
                  value={offerA.location}
                  onChange={(v) => updateOfferA("location", v)}
                  options={locationOptions}
                />
                <SelectField
                  value={offerB.location}
                  onChange={(v) => updateOfferB("location", v)}
                  options={locationOptions}
                />
              </FormRow>

              {/* Equity */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 pt-6">Equity</p>

              <FormRow label="Equity Type">
                <SelectField
                  value={offerA.equityType}
                  onChange={(v) => updateOfferA("equityType", v)}
                  options={[
                    { value: "none", label: "No Equity" },
                    { value: "rsus", label: "RSUs" },
                    { value: "options", label: "Stock Options" },
                  ]}
                />
                <SelectField
                  value={offerB.equityType}
                  onChange={(v) => updateOfferB("equityType", v)}
                  options={[
                    { value: "none", label: "No Equity" },
                    { value: "rsus", label: "RSUs" },
                    { value: "options", label: "Stock Options" },
                  ]}
                />
              </FormRow>

              <FormRow label="Grant Value (4yr)">
                <CurrencyInput
                  id="equity-a"
                  value={offerA.equityValue || undefined}
                  onChange={(v) => updateOfferA("equityValue", v || 0)}
                  placeholder="0"
                  disabled={offerA.equityType === "none"}
                />
                <CurrencyInput
                  id="equity-b"
                  value={offerB.equityValue || undefined}
                  onChange={(v) => updateOfferB("equityValue", v || 0)}
                  placeholder="0"
                  disabled={offerB.equityType === "none"}
                />
              </FormRow>

              <FormRow label="Vesting">
                <SelectField
                  value={offerA.vestingSchedule}
                  onChange={(v) => updateOfferA("vestingSchedule", v)}
                  options={[
                    { value: "4year-1cliff", label: "4yr / 1yr cliff" },
                    { value: "4year-monthly", label: "4yr monthly" },
                    { value: "3year-monthly", label: "3yr monthly" },
                    { value: "immediate", label: "Immediate" },
                  ]}
                />
                <SelectField
                  value={offerB.vestingSchedule}
                  onChange={(v) => updateOfferB("vestingSchedule", v)}
                  options={[
                    { value: "4year-1cliff", label: "4yr / 1yr cliff" },
                    { value: "4year-monthly", label: "4yr monthly" },
                    { value: "3year-monthly", label: "3yr monthly" },
                    { value: "immediate", label: "Immediate" },
                  ]}
                />
              </FormRow>

              {/* Benefits */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 pt-6">Benefits</p>

              <FormRow label="Healthcare">
                <SelectField
                  value={offerA.healthcareQuality}
                  onChange={(v) => updateOfferA("healthcareQuality", v)}
                  options={[
                    { value: "excellent", label: "Excellent (~$15k)" },
                    { value: "good", label: "Good (~$10k)" },
                    { value: "basic", label: "Basic (~$5k)" },
                    { value: "none", label: "None" },
                  ]}
                />
                <SelectField
                  value={offerB.healthcareQuality}
                  onChange={(v) => updateOfferB("healthcareQuality", v)}
                  options={[
                    { value: "excellent", label: "Excellent (~$15k)" },
                    { value: "good", label: "Good (~$10k)" },
                    { value: "basic", label: "Basic (~$5k)" },
                    { value: "none", label: "None" },
                  ]}
                />
              </FormRow>

              <FormRow label="401k Match">
                <SelectField
                  value={offerA.has401kMatch ? `${offerA.matchPercent}-${offerA.maxMatchUpTo}` : "none"}
                  onChange={(v) => {
                    if (v === "none") {
                      updateOfferA("has401kMatch", false);
                    } else {
                      const [match, max] = v.split("-").map(Number);
                      updateOfferA("has401kMatch", true);
                      updateOfferA("matchPercent", match);
                      updateOfferA("maxMatchUpTo", max);
                    }
                  }}
                  options={[
                    { value: "100-6", label: "100% up to 6%" },
                    { value: "50-6", label: "50% up to 6%" },
                    { value: "100-4", label: "100% up to 4%" },
                    { value: "50-4", label: "50% up to 4%" },
                    { value: "none", label: "No Match" },
                  ]}
                />
                <SelectField
                  value={offerB.has401kMatch ? `${offerB.matchPercent}-${offerB.maxMatchUpTo}` : "none"}
                  onChange={(v) => {
                    if (v === "none") {
                      updateOfferB("has401kMatch", false);
                    } else {
                      const [match, max] = v.split("-").map(Number);
                      updateOfferB("has401kMatch", true);
                      updateOfferB("matchPercent", match);
                      updateOfferB("maxMatchUpTo", max);
                    }
                  }}
                  options={[
                    { value: "100-6", label: "100% up to 6%" },
                    { value: "50-6", label: "50% up to 6%" },
                    { value: "100-4", label: "100% up to 4%" },
                    { value: "50-4", label: "50% up to 4%" },
                    { value: "none", label: "No Match" },
                  ]}
                />
              </FormRow>

              <FormRow label="PTO Days">
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={offerA.ptoDays}
                  onChange={(e) => updateOfferA("ptoDays", parseInt(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={offerB.ptoDays}
                  onChange={(e) => updateOfferB("ptoDays", parseInt(e.target.value) || 0)}
                />
              </FormRow>
            </div>
          </CardContent>
        </Card>

        {/* Compare Button */}
        <Button
          onClick={handleCompare}
          disabled={!isValid || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Comparing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Compare Offers
            </>
          )}
        </Button>
      </div>
    </ToolLayout>
  );
}
