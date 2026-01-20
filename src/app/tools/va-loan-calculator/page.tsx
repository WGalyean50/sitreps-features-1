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
import { Loader2, Home, Key, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TOOL_NAME = "va-loan-calculator";

interface ComparisonResult {
  years: number;
  buying: {
    totalCashOutflow: number;
    homeEquity: number;
    homeValue: number;
    netCost: number;
  };
  renting: {
    totalCashOutflow: number;
    netCost: number;
    netCostWithOpportunity: number;
    opportunityCostOfDownPayment: number;
  };
  difference: {
    absoluteDifference: number;
    withOpportunityCost: number;
    buyingIsBetter: boolean;
  };
}

interface CalculationResult {
  inputs: {
    homePrice: number;
    downPayment: number;
    downPaymentPercent: number;
    monthlyRent: number;
    interestRate: number;
    loanTermYears: number;
  };
  vaLoan: {
    loanAmount: number;
    fundingFee: number;
    fundingFeePercent: number;
    totalLoanAmount: number;
  };
  monthly: {
    buying: {
      mortgagePayment: number;
      propertyTax: number;
      insurance: number;
      maintenance: number;
      total: number;
    };
    renting: {
      rent: number;
      insurance: number;
      total: number;
    };
    difference: number;
  };
  comparisons: ComparisonResult[];
  breakEvenYear: number | null;
  assumptions: Record<string, number>;
}

export default function VALoanCalculatorPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [homePrice, setHomePrice] = React.useState<number | undefined>(undefined);
  const [monthlyRent, setMonthlyRent] = React.useState<number | undefined>(undefined);
  const [downPaymentPercent, setDownPaymentPercent] = React.useState(0);
  const [loanTerm, setLoanTerm] = React.useState(30);
  const [isFirstTime, setIsFirstTime] = React.useState(true);
  const [results, setResults] = React.useState<CalculationResult | null>(null);

  // Track tool started on mount
  React.useEffect(() => {
    toolStarted(TOOL_NAME);
  }, []);

  // Calculate comparison
  const handleCalculate = async () => {
    if (!homePrice || !monthlyRent) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/housing/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homePrice,
          downPaymentPercent,
          monthlyRent,
          loanTermYears: loanTerm,
          isFirstTimeVA: isFirstTime,
        }),
      });

      const data = await response.json();
      setResults(data);
      toolCompleted(TOOL_NAME);
    } catch (error) {
      console.error("Failed to calculate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare chart data
  const chartData = results?.comparisons.map((c) => ({
    year: `Year ${c.years}`,
    "Buying (Net Cost)": c.buying.netCost,
    "Renting (Net Cost)": c.renting.netCostWithOpportunity,
  })) || [];

  const isValid = homePrice && homePrice > 0 && monthlyRent && monthlyRent > 0;

  return (
    <ToolLayout
      title="VA Loan Rent vs Buy Calculator"
      description="Compare the true cost of buying with a VA loan versus renting. See when buying becomes the better financial decision."
    >
      <div className="space-y-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Housing Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <CurrencyInput
                id="home-price"
                label="Home Purchase Price"
                value={homePrice}
                onChange={setHomePrice}
                placeholder="350,000"
              />

              <CurrencyInput
                id="monthly-rent"
                label="Current/Comparable Monthly Rent"
                value={monthlyRent}
                onChange={setMonthlyRent}
                placeholder="2,000"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="down-payment">Down Payment (%)</Label>
                <select
                  id="down-payment"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value={0}>0% (VA Loan Benefit)</option>
                  <option value={5}>5%</option>
                  <option value={10}>10%</option>
                  <option value={20}>20%</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  VA loans allow 0% down payment
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan-term">Loan Term</Label>
                <select
                  id="loan-term"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value={30}>30 Years</option>
                  <option value={15}>15 Years</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>VA Loan Usage</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={isFirstTime}
                    onChange={() => setIsFirstTime(true)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">First-time use (lower funding fee)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!isFirstTime}
                    onChange={() => setIsFirstTime(false)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Subsequent use</span>
                </label>
              </div>
            </div>

            <Button
              onClick={handleCalculate}
              disabled={!isValid || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Compare Costs"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Break-Even Highlight */}
            <ResultsCard
              variant={results.breakEvenYear && results.breakEvenYear <= 5 ? "success" : "info"}
              title="Break-Even Analysis"
              value={
                results.breakEvenYear
                  ? `Year ${results.breakEvenYear}`
                  : "10+ years"
              }
              subtitle={
                results.breakEvenYear
                  ? `Buying becomes financially better than renting after ${results.breakEvenYear} year${results.breakEvenYear > 1 ? "s" : ""}`
                  : "Renting may be more cost-effective for your situation, or break-even occurs after 10+ years"
              }
            />

            {/* Monthly Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Monthly Payment Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4 p-4 rounded-lg bg-primary/5">
                    <h4 className="font-semibold">Buying (VA Loan)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mortgage (P&I)</span>
                        <span>{formatCurrency(results.monthly.buying.mortgagePayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Property Tax</span>
                        <span>{formatCurrency(results.monthly.buying.propertyTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Home Insurance</span>
                        <span>{formatCurrency(results.monthly.buying.insurance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Maintenance</span>
                        <span>{formatCurrency(results.monthly.buying.maintenance)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total Monthly</span>
                        <span>{formatCurrency(results.monthly.buying.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold">Renting</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Rent</span>
                        <span>{formatCurrency(results.monthly.renting.rent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Renters Insurance</span>
                        <span>{formatCurrency(results.monthly.renting.insurance)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total Monthly</span>
                        <span>{formatCurrency(results.monthly.renting.total)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Note: Rent assumed to increase {results.assumptions.rentIncreaseRate}% annually
                    </p>
                  </div>
                </div>

                {/* VA Loan Details */}
                <div className="mt-6 p-4 rounded-lg border bg-info/5 border-info/20">
                  <h4 className="font-semibold text-sm mb-2">VA Loan Details</h4>
                  <div className="grid gap-2 text-sm sm:grid-cols-3">
                    <div>
                      <span className="text-muted-foreground">Loan Amount: </span>
                      <span className="font-medium">{formatCurrency(results.vaLoan.loanAmount)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Funding Fee ({results.vaLoan.fundingFeePercent}%): </span>
                      <span className="font-medium">{formatCurrency(results.vaLoan.fundingFee)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Financed: </span>
                      <span className="font-medium">{formatCurrency(results.vaLoan.totalLoanAmount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Over Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Net Cost Over Time
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Buying net cost = total paid - home equity. Renting includes opportunity cost of down payment if invested.
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis
                        tickFormatter={(value) =>
                          `$${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "",
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Buying (Net Cost)"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Renting (Net Cost)"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison by Year</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left font-medium">Year</th>
                        <th className="py-3 text-right font-medium">Buying Total Paid</th>
                        <th className="py-3 text-right font-medium">Home Equity</th>
                        <th className="py-3 text-right font-medium">Buying Net Cost</th>
                        <th className="py-3 text-right font-medium">Renting Total Paid</th>
                        <th className="py-3 text-right font-medium">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.comparisons.map((c) => (
                        <tr key={c.years} className="border-b">
                          <td className="py-3 font-medium">Year {c.years}</td>
                          <td className="py-3 text-right">{formatCurrency(c.buying.totalCashOutflow)}</td>
                          <td className="py-3 text-right text-success">{formatCurrency(c.buying.homeEquity)}</td>
                          <td className="py-3 text-right">{formatCurrency(c.buying.netCost)}</td>
                          <td className="py-3 text-right">{formatCurrency(c.renting.netCostWithOpportunity)}</td>
                          <td className={`py-3 text-right font-medium ${c.difference.buyingIsBetter ? "text-success" : "text-warning"}`}>
                            {c.difference.buyingIsBetter ? "Buying wins by " : "Renting wins by "}
                            {formatCurrency(Math.abs(c.difference.withOpportunityCost))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setResults(null)}
              >
                Start Over
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
