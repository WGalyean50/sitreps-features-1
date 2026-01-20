"use client";

import * as React from "react";
import { ToolLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsCard } from "@/components/results-card";
import { SaveResultsButton } from "@/components/save-results-button";
import { FinancialDisclaimer } from "@/components/disclaimer";
import { CurrencyInput } from "@/components/currency-input";
import { toolStarted, toolCompleted } from "@/lib/analytics";
import { getLocationOptions, type JobOffer, type VestingSchedule } from "@/data/compensation";
import { Plus, Trash2, Loader2, Building2, Trophy, DollarSign } from "lucide-react";

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

const defaultOffer = (): OfferFormData => ({
  id: Date.now().toString(),
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
  const [offers, setOffers] = React.useState<OfferFormData[]>([
    defaultOffer(),
    { ...defaultOffer(), id: Date.now().toString() + "1" },
  ]);
  const [results, setResults] = React.useState<ComparisonResult | null>(null);

  const locationOptions = getLocationOptions();

  React.useEffect(() => {
    toolStarted(TOOL_NAME);
  }, []);

  const addOffer = () => {
    if (offers.length < 4) {
      setOffers([...offers, defaultOffer()]);
    }
  };

  const removeOffer = (id: string) => {
    if (offers.length > 2) {
      setOffers(offers.filter((o) => o.id !== id));
    }
  };

  const updateOffer = (id: string, field: keyof OfferFormData, value: unknown) => {
    setOffers(offers.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  };

  const handleCompare = async () => {
    setIsLoading(true);
    try {
      // Transform form data to API format
      const apiOffers: JobOffer[] = offers.map((o) => ({
        id: o.id,
        companyName: o.companyName || `Offer ${offers.indexOf(o) + 1}`,
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

  const isValid = offers.every((o) => o.baseSalary > 0);

  return (
    <ToolLayout
      title="Compensation Comparison Tool"
      description="Compare total compensation across job offers including salary, equity, bonuses, and benefits. See which offer wins over 1, 2, and 4 years."
    >
      <div className="space-y-8">
        {/* Offer Forms */}
        {offers.map((offer, index) => (
          <Card key={offer.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <Input
                  value={offer.companyName}
                  onChange={(e) => updateOffer(offer.id, "companyName", e.target.value)}
                  placeholder={`Company ${index + 1}`}
                  className="max-w-[200px] text-lg font-semibold h-auto py-1"
                />
              </CardTitle>
              {offers.length > 2 && (
                <Button variant="ghost" size="sm" onClick={() => removeOffer(offer.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cash Compensation */}
              <div>
                <h4 className="font-medium mb-4">Cash Compensation</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <CurrencyInput
                    id={`base-${offer.id}`}
                    label="Base Salary"
                    value={offer.baseSalary || undefined}
                    onChange={(v) => updateOffer(offer.id, "baseSalary", v || 0)}
                    placeholder="120,000"
                  />
                  <CurrencyInput
                    id={`signing-${offer.id}`}
                    label="Signing Bonus"
                    value={offer.signingBonus || undefined}
                    onChange={(v) => updateOffer(offer.id, "signingBonus", v || 0)}
                    placeholder="0"
                  />
                  <div className="space-y-2">
                    <Label htmlFor={`bonus-${offer.id}`}>Annual Bonus Target (%)</Label>
                    <Input
                      id={`bonus-${offer.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={offer.annualBonusTarget || ""}
                      onChange={(e) => updateOffer(offer.id, "annualBonusTarget", parseInt(e.target.value) || 0)}
                      placeholder="15"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`location-${offer.id}`}>Location</Label>
                  <select
                    id={`location-${offer.id}`}
                    value={offer.location}
                    onChange={(e) => updateOffer(offer.id, "location", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {locationOptions.map((loc) => (
                      <option key={loc.value} value={loc.value}>
                        {loc.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Equity */}
              <div>
                <h4 className="font-medium mb-4">Equity</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`equity-type-${offer.id}`}>Equity Type</Label>
                    <select
                      id={`equity-type-${offer.id}`}
                      value={offer.equityType}
                      onChange={(e) => updateOffer(offer.id, "equityType", e.target.value as "options" | "rsus" | "none")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="none">No Equity</option>
                      <option value="rsus">RSUs</option>
                      <option value="options">Stock Options</option>
                    </select>
                  </div>

                  {offer.equityType !== "none" && (
                    <>
                      <CurrencyInput
                        id={`equity-value-${offer.id}`}
                        label="Total Grant Value"
                        value={offer.equityValue || undefined}
                        onChange={(v) => updateOffer(offer.id, "equityValue", v || 0)}
                        placeholder="100,000"
                        helperText="Total value of 4-year grant"
                      />
                      <div className="space-y-2">
                        <Label htmlFor={`vesting-${offer.id}`}>Vesting Schedule</Label>
                        <select
                          id={`vesting-${offer.id}`}
                          value={offer.vestingSchedule}
                          onChange={(e) => updateOffer(offer.id, "vestingSchedule", e.target.value as VestingSchedule)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="4year-1cliff">4 Year / 1 Year Cliff</option>
                          <option value="4year-monthly">4 Year Monthly</option>
                          <option value="3year-monthly">3 Year Monthly</option>
                          <option value="immediate">Immediate</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-medium mb-4">Benefits</h4>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor={`healthcare-${offer.id}`}>Healthcare</Label>
                    <select
                      id={`healthcare-${offer.id}`}
                      value={offer.healthcareQuality}
                      onChange={(e) => updateOffer(offer.id, "healthcareQuality", e.target.value as "excellent" | "good" | "basic" | "none")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="excellent">Excellent (~$15k/yr)</option>
                      <option value="good">Good (~$10k/yr)</option>
                      <option value="basic">Basic (~$5k/yr)</option>
                      <option value="none">None</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`match-${offer.id}`}>401k Match</Label>
                    <select
                      id={`match-${offer.id}`}
                      value={offer.has401kMatch ? `${offer.matchPercent}-${offer.maxMatchUpTo}` : "none"}
                      onChange={(e) => {
                        if (e.target.value === "none") {
                          updateOffer(offer.id, "has401kMatch", false);
                        } else {
                          const [match, max] = e.target.value.split("-").map(Number);
                          updateOffer(offer.id, "has401kMatch", true);
                          updateOffer(offer.id, "matchPercent", match);
                          updateOffer(offer.id, "maxMatchUpTo", max);
                        }
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="100-6">100% up to 6%</option>
                      <option value="50-6">50% up to 6%</option>
                      <option value="100-4">100% up to 4%</option>
                      <option value="50-4">50% up to 4%</option>
                      <option value="none">No Match</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`pto-${offer.id}`}>PTO Days</Label>
                    <Input
                      id={`pto-${offer.id}`}
                      type="number"
                      min="0"
                      max="50"
                      value={offer.ptoDays}
                      onChange={(e) => updateOffer(offer.id, "ptoDays", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Offer Button */}
        {offers.length < 4 && (
          <Button variant="outline" onClick={addOffer} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Another Offer
          </Button>
        )}

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
              <DollarSign className="mr-2 h-4 w-4" />
              Compare Offers
            </>
          )}
        </Button>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Winner Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {results.winners.map((w) => (
                <ResultsCard
                  key={w.year}
                  variant="success"
                  title={`Year ${w.year} Winner`}
                  value={w.byTotalComp.companyName}
                  subtitle={`${formatCurrency(w.byTotalComp.value)} total (${formatCurrency(w.byTotalComp.margin)} ahead)`}
                />
              ))}
            </div>

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Total Compensation Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left font-medium">Company</th>
                        <th className="py-3 text-right font-medium">Year 1</th>
                        <th className="py-3 text-right font-medium">Year 2</th>
                        <th className="py-3 text-right font-medium">Year 4</th>
                        <th className="py-3 text-right font-medium">COL Adjusted (Yr 4)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.comparisons.map((comp) => {
                        const year1 = comp.compensation.find((c) => c.year === 1);
                        const year2 = comp.compensation.find((c) => c.year === 2);
                        const year4 = comp.compensation.find((c) => c.year === 4);
                        const isWinner = results.winners.find((w) => w.year === 4)?.byTotalComp.companyName === comp.companyName;

                        return (
                          <tr key={comp.offerId} className={`border-b ${isWinner ? "bg-success/5" : ""}`}>
                            <td className="py-3 font-medium">
                              {comp.companyName}
                              <span className="block text-xs text-muted-foreground">
                                COL: {comp.locationCOL}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {formatCurrency(year1?.total || 0)}
                              <span className="block text-xs text-muted-foreground">
                                Cash: {formatCurrency(year1?.cash || 0)}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {formatCurrency(year2?.total || 0)}
                              <span className="block text-xs text-muted-foreground">
                                Equity: {formatCurrency(year2?.equity || 0)}
                              </span>
                            </td>
                            <td className="py-3 text-right font-semibold">
                              {formatCurrency(year4?.total || 0)}
                              <span className="block text-xs text-muted-foreground">
                                Benefits: {formatCurrency(year4?.benefits || 0)}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {formatCurrency(year4?.colAdjusted || 0)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Button variant="outline" onClick={() => setResults(null)}>
                Modify Offers
              </Button>
              <SaveResultsButton toolName={TOOL_NAME} />
            </div>

            <FinancialDisclaimer />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
