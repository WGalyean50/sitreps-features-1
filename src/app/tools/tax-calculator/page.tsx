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
import { CurrencyInput } from "@/components/currency-input";
import { LocationSelect } from "@/components/location-select";
import { toolStarted, toolStepCompleted, toolCompleted } from "@/lib/analytics";
import { getRankOptions, type PayGrade } from "@/data/military-pay";
import { getStateOptions } from "@/data/tax-brackets";
import { Plus, Trash2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const TOOL_NAME = "tax-calculator";

interface MilitaryInfo {
  grade: PayGrade | "";
  yearsOfService: number;
  zipCode: string;
  withDependents: boolean;
}

interface CivilianScenario {
  id: string;
  salary: number;
  state: string;
  bonus: number;
}

interface MilitaryPay {
  basePay: number;
  bas: number;
  bah: number;
}

interface TaxResult {
  military: {
    monthly: { basePay: number; bas: number; bah: number; total: number };
    annual: { grossTotal: number; taxableIncome: number; taxFreeAllowances: number };
    taxes: { federalTax: number; stateTax: number; fica: { total: number }; totalTax: number };
    netIncome: { annual: number; monthly: number };
    effectiveRate: number;
  };
  civilian: Array<{
    scenario: number;
    grossIncome: number;
    federalTax: number;
    stateTax: number;
    fica: { total: number };
    totalTax: number;
    netIncome: number;
    effectiveRate: number;
    stateName: string;
  }>;
  civilianEquivalent: {
    targetNetIncome: number;
    estimatedGrossSalary: number;
  };
}

export default function TaxCalculatorPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [militaryInfo, setMilitaryInfo] = React.useState<MilitaryInfo>({
    grade: "",
    yearsOfService: 0,
    zipCode: "",
    withDependents: true,
  });
  const [militaryPay, setMilitaryPay] = React.useState<MilitaryPay | null>(null);
  const [civilianScenarios, setCivilianScenarios] = React.useState<CivilianScenario[]>([
    { id: "1", salary: 0, state: "", bonus: 0 },
  ]);
  const [results, setResults] = React.useState<TaxResult | null>(null);

  const rankOptions = getRankOptions();
  const stateOptions = getStateOptions();

  // Track tool started on mount
  React.useEffect(() => {
    toolStarted(TOOL_NAME);
  }, []);

  // Fetch military pay when Step 1 is complete
  const fetchMilitaryPay = async () => {
    if (!militaryInfo.grade || !militaryInfo.zipCode) return;

    setIsLoading(true);
    try {
      const [payRes, bahRes] = await Promise.all([
        fetch(`/api/military/pay?grade=${militaryInfo.grade}&years=${militaryInfo.yearsOfService}`),
        fetch(`/api/military/bah?grade=${militaryInfo.grade}&zip=${militaryInfo.zipCode}&dependents=${militaryInfo.withDependents}`),
      ]);

      const payData = await payRes.json();
      const bahData = await bahRes.json();

      setMilitaryPay({
        basePay: payData.monthly.basePay,
        bas: payData.monthly.bas,
        bah: bahData.monthly,
      });
    } catch (error) {
      console.error("Failed to fetch military pay:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 1 completion
  const handleStep1Complete = async () => {
    await fetchMilitaryPay();
    toolStepCompleted(TOOL_NAME, 1, 3);
    setCurrentStep(2);
  };

  // Handle Step 2 completion
  const handleStep2Complete = () => {
    toolStepCompleted(TOOL_NAME, 2, 3);
    calculateTaxes();
  };

  // Calculate taxes
  const calculateTaxes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tax/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          military: {
            grade: militaryInfo.grade,
            yearsOfService: militaryInfo.yearsOfService,
            zipCode: militaryInfo.zipCode,
            withDependents: militaryInfo.withDependents,
          },
          civilian: civilianScenarios
            .filter((s) => s.salary > 0 && s.state)
            .map((s) => ({
              salary: s.salary,
              state: s.state,
              bonus: s.bonus,
            })),
          filingStatus: "single",
        }),
      });

      const data = await response.json();
      setResults(data);
      toolStepCompleted(TOOL_NAME, 3, 3);
      toolCompleted(TOOL_NAME);
      setCurrentStep(3);
    } catch (error) {
      console.error("Failed to calculate taxes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add civilian scenario
  const addScenario = () => {
    if (civilianScenarios.length < 3) {
      setCivilianScenarios([
        ...civilianScenarios,
        { id: Date.now().toString(), salary: 0, state: "", bonus: 0 },
      ]);
    }
  };

  // Remove civilian scenario
  const removeScenario = (id: string) => {
    if (civilianScenarios.length > 1) {
      setCivilianScenarios(civilianScenarios.filter((s) => s.id !== id));
    }
  };

  // Update scenario
  const updateScenario = (id: string, field: keyof CivilianScenario, value: string | number) => {
    setCivilianScenarios(
      civilianScenarios.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Validation
  const isStep1Valid = militaryInfo.grade && militaryInfo.zipCode.length === 5;
  const isStep2Valid = civilianScenarios.some((s) => s.salary > 0 && s.state);

  return (
    <ToolLayout
      title="Tax Impact Calculator"
      description="Compare your military compensation to civilian job offers and see what salary you really need to maintain your take-home pay."
    >
      <div className="mb-8">
        <StepIndicator currentStep={currentStep} totalSteps={3} />
      </div>

        {/* Step 1: Military Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Your Military Information</CardTitle>
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
                  <p className="text-xs text-muted-foreground">Used to calculate BAH</p>
                </div>

                <div className="space-y-2">
                  <Label>Dependents</Label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={militaryInfo.withDependents}
                        onChange={() => setMilitaryInfo({ ...militaryInfo, withDependents: true })}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">With Dependents</span>
                    </label>
                    <label className="flex items-center gap-2">
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

              <div className="flex justify-end">
                <Button onClick={handleStep1Complete} disabled={!isStep1Valid || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Civilian Scenarios */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Military Pay Summary */}
            {militaryPay && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Your Military Compensation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Base Pay</p>
                      <p className="font-semibold">{formatCurrency(militaryPay.basePay)}/mo</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">BAH (Tax-Free)</p>
                      <p className="font-semibold text-success">{formatCurrency(militaryPay.bah)}/mo</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">BAS (Tax-Free)</p>
                      <p className="font-semibold text-success">{formatCurrency(militaryPay.bas)}/mo</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Monthly</p>
                      <p className="font-bold text-lg">{formatCurrency(militaryPay.basePay + militaryPay.bah + militaryPay.bas)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Step 2: Civilian Job Scenarios</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add up to 3 civilian salary scenarios to compare
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {civilianScenarios.map((scenario, index) => (
                  <div key={scenario.id} className="rounded-lg border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Scenario {index + 1}</h4>
                      {civilianScenarios.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeScenario(scenario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <CurrencyInput
                        id={`salary-${scenario.id}`}
                        label="Annual Salary"
                        value={scenario.salary || undefined}
                        onChange={(value) => updateScenario(scenario.id, "salary", value || 0)}
                        placeholder="75,000"
                      />

                      <LocationSelect
                        id={`state-${scenario.id}`}
                        label="State"
                        value={scenario.state}
                        onChange={(value) => updateScenario(scenario.id, "state", value)}
                        placeholder="Select state..."
                      />

                      <CurrencyInput
                        id={`bonus-${scenario.id}`}
                        label="Annual Bonus (Optional)"
                        value={scenario.bonus || undefined}
                        onChange={(value) => updateScenario(scenario.id, "bonus", value || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}

                {civilianScenarios.length < 3 && (
                  <Button variant="outline" onClick={addScenario} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Scenario
                  </Button>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleStep2Complete} disabled={!isStep2Valid || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        Calculate
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && results && (
          <div className="space-y-6">
            {/* Headline Result */}
            <ResultsCard
              variant="info"
              title="Your Civilian Equivalent Salary"
              value={formatCurrency(results.civilianEquivalent.estimatedGrossSalary)}
              subtitle={`This is the approximate civilian salary you'd need to match your current military take-home pay of ${formatCurrency(results.military.netIncome.annual)}/year.`}
            />

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Side-by-Side Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left font-medium"></th>
                        <th className="py-3 text-right font-medium bg-primary/5 px-4">Military</th>
                        {results.civilian.map((civ) => (
                          <th key={civ.scenario} className="py-3 text-right font-medium px-4">
                            Scenario {civ.scenario}
                            <br />
                            <span className="font-normal text-muted-foreground">({civ.stateName})</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 font-medium">Gross Income</td>
                        <td className="py-3 text-right bg-primary/5 px-4">{formatCurrency(results.military.annual.grossTotal)}</td>
                        {results.civilian.map((civ) => (
                          <td key={civ.scenario} className="py-3 text-right px-4">{formatCurrency(civ.grossIncome)}</td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 font-medium">Tax-Free Allowances</td>
                        <td className="py-3 text-right bg-primary/5 px-4 text-success">{formatCurrency(results.military.annual.taxFreeAllowances)}</td>
                        {results.civilian.map((civ) => (
                          <td key={civ.scenario} className="py-3 text-right px-4 text-muted-foreground">$0</td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 font-medium">Federal Tax</td>
                        <td className="py-3 text-right bg-primary/5 px-4">({formatCurrency(results.military.taxes.federalTax)})</td>
                        {results.civilian.map((civ) => (
                          <td key={civ.scenario} className="py-3 text-right px-4">({formatCurrency(civ.federalTax)})</td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 font-medium">State Tax</td>
                        <td className="py-3 text-right bg-primary/5 px-4">({formatCurrency(results.military.taxes.stateTax)})</td>
                        {results.civilian.map((civ) => (
                          <td key={civ.scenario} className="py-3 text-right px-4">({formatCurrency(civ.stateTax)})</td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 font-medium">FICA (SS + Medicare)</td>
                        <td className="py-3 text-right bg-primary/5 px-4">({formatCurrency(results.military.taxes.fica.total)})</td>
                        {results.civilian.map((civ) => (
                          <td key={civ.scenario} className="py-3 text-right px-4">({formatCurrency(civ.fica.total)})</td>
                        ))}
                      </tr>
                      <tr className="border-b bg-muted/50">
                        <td className="py-3 font-bold">Net Annual Income</td>
                        <td className="py-3 text-right bg-primary/10 px-4 font-bold">{formatCurrency(results.military.netIncome.annual)}</td>
                        {results.civilian.map((civ) => (
                          <td key={civ.scenario} className="py-3 text-right px-4 font-bold">{formatCurrency(civ.netIncome)}</td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 font-medium">Net Monthly Income</td>
                        <td className="py-3 text-right bg-primary/5 px-4">{formatCurrency(results.military.netIncome.monthly)}</td>
                        {results.civilian.map((civ) => (
                          <td key={civ.scenario} className="py-3 text-right px-4">{formatCurrency(civ.netIncome / 12)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Effective Tax Rate</td>
                        <td className="py-3 text-right bg-primary/5 px-4">{results.military.effectiveRate}%</td>
                        {results.civilian.map((civ) => (
                          <td key={civ.scenario} className="py-3 text-right px-4">{civ.effectiveRate}%</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Difference Summary */}
            <div className="grid gap-4 sm:grid-cols-3">
              {results.civilian.map((civ) => {
                const diff = results.military.netIncome.annual - civ.netIncome;
                const isPositive = diff > 0;
                return (
                  <ResultsCard
                    key={civ.scenario}
                    variant={isPositive ? "success" : "warning"}
                    title={`vs. Scenario ${civ.scenario}`}
                    value={`${isPositive ? "+" : ""}${formatCurrency(diff)}/yr`}
                    subtitle={`Military is ${isPositive ? "better" : "worse"} by ${formatCurrency(Math.abs(diff / 12))}/month`}
                  />
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Modify Scenarios
              </Button>
              <SaveResultsButton toolName={TOOL_NAME} />
            </div>

            <TaxDisclaimer />
          </div>
        )}
    </ToolLayout>
  );
}
