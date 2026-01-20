/**
 * Tax Bracket Data - 2024
 * Federal tax brackets and state income tax rates
 *
 * Note: This is simplified for the calculator. Real tax situations involve
 * deductions, credits, and more complex calculations.
 */

// Federal Tax Brackets 2024 (Single filer)
export const FEDERAL_BRACKETS_SINGLE_2024 = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

// Federal Tax Brackets 2024 (Married Filing Jointly)
export const FEDERAL_BRACKETS_MARRIED_2024 = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];

// Standard Deduction 2024
export const STANDARD_DEDUCTION_2024 = {
  single: 14600,
  married: 29200,
  headOfHousehold: 21900,
};

// State Income Tax Data 2024
// Rates shown are for single filers at median income levels
// States with graduated rates use an effective rate estimate
export interface StateTaxInfo {
  name: string;
  abbreviation: string;
  type: "none" | "flat" | "graduated";
  rate: number; // Effective rate for $75k income (single)
  brackets?: { min: number; max: number; rate: number }[];
  notes?: string;
}

export const STATE_TAXES: Record<string, StateTaxInfo> = {
  AL: { name: "Alabama", abbreviation: "AL", type: "graduated", rate: 0.05, notes: "2-5% graduated" },
  AK: { name: "Alaska", abbreviation: "AK", type: "none", rate: 0, notes: "No state income tax" },
  AZ: { name: "Arizona", abbreviation: "AZ", type: "flat", rate: 0.025, notes: "2.5% flat rate" },
  AR: { name: "Arkansas", abbreviation: "AR", type: "graduated", rate: 0.044, notes: "2-4.4% graduated" },
  CA: { name: "California", abbreviation: "CA", type: "graduated", rate: 0.093, brackets: [
    { min: 0, max: 10412, rate: 0.01 },
    { min: 10412, max: 24684, rate: 0.02 },
    { min: 24684, max: 38959, rate: 0.04 },
    { min: 38959, max: 54081, rate: 0.06 },
    { min: 54081, max: 68350, rate: 0.08 },
    { min: 68350, max: 349137, rate: 0.093 },
    { min: 349137, max: 418961, rate: 0.103 },
    { min: 418961, max: 698271, rate: 0.113 },
    { min: 698271, max: Infinity, rate: 0.123 },
  ] },
  CO: { name: "Colorado", abbreviation: "CO", type: "flat", rate: 0.044, notes: "4.4% flat rate" },
  CT: { name: "Connecticut", abbreviation: "CT", type: "graduated", rate: 0.055, notes: "3-6.99% graduated" },
  DE: { name: "Delaware", abbreviation: "DE", type: "graduated", rate: 0.066, notes: "2.2-6.6% graduated" },
  FL: { name: "Florida", abbreviation: "FL", type: "none", rate: 0, notes: "No state income tax" },
  GA: { name: "Georgia", abbreviation: "GA", type: "flat", rate: 0.055, notes: "5.49% flat rate (transitioning)" },
  HI: { name: "Hawaii", abbreviation: "HI", type: "graduated", rate: 0.0825, notes: "1.4-11% graduated" },
  ID: { name: "Idaho", abbreviation: "ID", type: "flat", rate: 0.058, notes: "5.8% flat rate" },
  IL: { name: "Illinois", abbreviation: "IL", type: "flat", rate: 0.0495, notes: "4.95% flat rate" },
  IN: { name: "Indiana", abbreviation: "IN", type: "flat", rate: 0.0305, notes: "3.05% flat rate" },
  IA: { name: "Iowa", abbreviation: "IA", type: "graduated", rate: 0.057, notes: "4.4-5.7% graduated" },
  KS: { name: "Kansas", abbreviation: "KS", type: "graduated", rate: 0.057, notes: "3.1-5.7% graduated" },
  KY: { name: "Kentucky", abbreviation: "KY", type: "flat", rate: 0.04, notes: "4% flat rate" },
  LA: { name: "Louisiana", abbreviation: "LA", type: "graduated", rate: 0.0425, notes: "1.85-4.25% graduated" },
  ME: { name: "Maine", abbreviation: "ME", type: "graduated", rate: 0.0715, notes: "5.8-7.15% graduated" },
  MD: { name: "Maryland", abbreviation: "MD", type: "graduated", rate: 0.05, notes: "2-5.75% graduated + local" },
  MA: { name: "Massachusetts", abbreviation: "MA", type: "flat", rate: 0.05, notes: "5% flat rate (9% on >$1M)" },
  MI: { name: "Michigan", abbreviation: "MI", type: "flat", rate: 0.0425, notes: "4.25% flat rate" },
  MN: { name: "Minnesota", abbreviation: "MN", type: "graduated", rate: 0.0785, notes: "5.35-9.85% graduated" },
  MS: { name: "Mississippi", abbreviation: "MS", type: "flat", rate: 0.05, notes: "5% flat rate" },
  MO: { name: "Missouri", abbreviation: "MO", type: "graduated", rate: 0.048, notes: "2-4.8% graduated" },
  MT: { name: "Montana", abbreviation: "MT", type: "graduated", rate: 0.059, notes: "4.7-5.9% graduated" },
  NE: { name: "Nebraska", abbreviation: "NE", type: "graduated", rate: 0.0584, notes: "2.46-5.84% graduated" },
  NV: { name: "Nevada", abbreviation: "NV", type: "none", rate: 0, notes: "No state income tax" },
  NH: { name: "New Hampshire", abbreviation: "NH", type: "none", rate: 0, notes: "No income tax (interest/dividends phasing out)" },
  NJ: { name: "New Jersey", abbreviation: "NJ", type: "graduated", rate: 0.0637, notes: "1.4-10.75% graduated" },
  NM: { name: "New Mexico", abbreviation: "NM", type: "graduated", rate: 0.049, notes: "1.7-5.9% graduated" },
  NY: { name: "New York", abbreviation: "NY", type: "graduated", rate: 0.0685, brackets: [
    { min: 0, max: 8500, rate: 0.04 },
    { min: 8500, max: 11700, rate: 0.045 },
    { min: 11700, max: 13900, rate: 0.0525 },
    { min: 13900, max: 80650, rate: 0.055 },
    { min: 80650, max: 215400, rate: 0.06 },
    { min: 215400, max: 1077550, rate: 0.0685 },
    { min: 1077550, max: Infinity, rate: 0.109 },
  ], notes: "+ NYC tax if applicable" },
  NC: { name: "North Carolina", abbreviation: "NC", type: "flat", rate: 0.0475, notes: "4.75% flat rate" },
  ND: { name: "North Dakota", abbreviation: "ND", type: "graduated", rate: 0.0195, notes: "1.1-2.5% graduated" },
  OH: { name: "Ohio", abbreviation: "OH", type: "graduated", rate: 0.035, notes: "0-3.5% graduated" },
  OK: { name: "Oklahoma", abbreviation: "OK", type: "graduated", rate: 0.0475, notes: "0.25-4.75% graduated" },
  OR: { name: "Oregon", abbreviation: "OR", type: "graduated", rate: 0.09, notes: "4.75-9.9% graduated" },
  PA: { name: "Pennsylvania", abbreviation: "PA", type: "flat", rate: 0.0307, notes: "3.07% flat rate" },
  RI: { name: "Rhode Island", abbreviation: "RI", type: "graduated", rate: 0.0475, notes: "3.75-5.99% graduated" },
  SC: { name: "South Carolina", abbreviation: "SC", type: "graduated", rate: 0.065, notes: "3-6.4% graduated" },
  SD: { name: "South Dakota", abbreviation: "SD", type: "none", rate: 0, notes: "No state income tax" },
  TN: { name: "Tennessee", abbreviation: "TN", type: "none", rate: 0, notes: "No state income tax" },
  TX: { name: "Texas", abbreviation: "TX", type: "none", rate: 0, notes: "No state income tax" },
  UT: { name: "Utah", abbreviation: "UT", type: "flat", rate: 0.0465, notes: "4.65% flat rate" },
  VT: { name: "Vermont", abbreviation: "VT", type: "graduated", rate: 0.0675, notes: "3.35-8.75% graduated" },
  VA: { name: "Virginia", abbreviation: "VA", type: "graduated", rate: 0.0575, notes: "2-5.75% graduated" },
  WA: { name: "Washington", abbreviation: "WA", type: "none", rate: 0, notes: "No state income tax (7% on cap gains >$250k)" },
  WV: { name: "West Virginia", abbreviation: "WV", type: "graduated", rate: 0.052, notes: "2.36-5.12% graduated" },
  WI: { name: "Wisconsin", abbreviation: "WI", type: "graduated", rate: 0.053, notes: "3.5-7.65% graduated" },
  WY: { name: "Wyoming", abbreviation: "WY", type: "none", rate: 0, notes: "No state income tax" },
  DC: { name: "District of Columbia", abbreviation: "DC", type: "graduated", rate: 0.085, notes: "4-10.75% graduated" },
};

// No income tax states for quick reference
export const NO_TAX_STATES = ["AK", "FL", "NV", "NH", "SD", "TN", "TX", "WA", "WY"];

// FICA rates (Social Security + Medicare)
export const FICA_RATES = {
  socialSecurity: {
    rate: 0.062,
    wageBase: 168600, // 2024 wage base
  },
  medicare: {
    rate: 0.0145,
    additionalRate: 0.009, // Additional Medicare tax
    additionalThreshold: 200000, // Single filer threshold
  },
};

/**
 * Calculate federal income tax using progressive brackets
 */
export function calculateFederalTax(
  taxableIncome: number,
  filingStatus: "single" | "married" = "single"
): number {
  const brackets = filingStatus === "single"
    ? FEDERAL_BRACKETS_SINGLE_2024
    : FEDERAL_BRACKETS_MARRIED_2024;

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const taxableInBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    );
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return Math.round(tax * 100) / 100;
}

/**
 * Calculate state income tax
 */
export function calculateStateTax(
  taxableIncome: number,
  state: string
): number {
  const stateInfo = STATE_TAXES[state];
  if (!stateInfo || stateInfo.type === "none") {
    return 0;
  }

  // If state has detailed brackets, calculate progressively
  if (stateInfo.brackets) {
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of stateInfo.brackets) {
      if (remainingIncome <= 0) break;

      const taxableInBracket = Math.min(
        remainingIncome,
        bracket.max - bracket.min
      );
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }

    return Math.round(tax * 100) / 100;
  }

  // Otherwise use the effective rate
  return Math.round(taxableIncome * stateInfo.rate * 100) / 100;
}

/**
 * Calculate FICA taxes (Social Security + Medicare)
 */
export function calculateFICA(grossIncome: number): {
  socialSecurity: number;
  medicare: number;
  total: number;
} {
  // Social Security (capped at wage base)
  const ssWages = Math.min(grossIncome, FICA_RATES.socialSecurity.wageBase);
  const socialSecurity = ssWages * FICA_RATES.socialSecurity.rate;

  // Medicare (no cap, but additional tax over threshold)
  let medicare = grossIncome * FICA_RATES.medicare.rate;
  if (grossIncome > FICA_RATES.medicare.additionalThreshold) {
    medicare += (grossIncome - FICA_RATES.medicare.additionalThreshold) * FICA_RATES.medicare.additionalRate;
  }

  return {
    socialSecurity: Math.round(socialSecurity * 100) / 100,
    medicare: Math.round(medicare * 100) / 100,
    total: Math.round((socialSecurity + medicare) * 100) / 100,
  };
}

/**
 * Get state options for dropdown
 */
export function getStateOptions() {
  return Object.entries(STATE_TAXES)
    .map(([abbr, info]) => ({
      value: abbr,
      label: `${info.name}${info.type === "none" ? " (No Income Tax)" : ""}`,
      rate: info.rate,
      type: info.type,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
