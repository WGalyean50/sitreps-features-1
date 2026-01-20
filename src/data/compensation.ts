/**
 * Compensation Comparison Data and Calculations
 *
 * Helps compare total compensation across job offers including:
 * - Base salary
 * - Bonuses (signing, annual)
 * - Equity (stock options, RSUs)
 * - Benefits (401k, healthcare, PTO)
 * - Cost of living adjustments
 */

// Cost of Living Index by metro area (100 = national average)
// Source: BLS Regional Price Parities and Cost of Living estimates
export const COST_OF_LIVING: Record<string, { name: string; index: number }> = {
  // Very High Cost (>130)
  "san-francisco": { name: "San Francisco, CA", index: 180 },
  "new-york": { name: "New York, NY", index: 170 },
  "san-jose": { name: "San Jose, CA", index: 165 },
  "los-angeles": { name: "Los Angeles, CA", index: 145 },
  "boston": { name: "Boston, MA", index: 140 },
  "seattle": { name: "Seattle, WA", index: 135 },
  "washington-dc": { name: "Washington, DC", index: 130 },

  // High Cost (110-130)
  "san-diego": { name: "San Diego, CA", index: 125 },
  "denver": { name: "Denver, CO", index: 115 },
  "portland": { name: "Portland, OR", index: 115 },
  "austin": { name: "Austin, TX", index: 112 },
  "chicago": { name: "Chicago, IL", index: 110 },

  // Average Cost (95-110)
  "miami": { name: "Miami, FL", index: 108 },
  "philadelphia": { name: "Philadelphia, PA", index: 105 },
  "atlanta": { name: "Atlanta, GA", index: 103 },
  "dallas": { name: "Dallas, TX", index: 100 },
  "phoenix": { name: "Phoenix, AZ", index: 100 },
  "minneapolis": { name: "Minneapolis, MN", index: 98 },
  "houston": { name: "Houston, TX", index: 97 },
  "charlotte": { name: "Charlotte, NC", index: 96 },
  "tampa": { name: "Tampa, FL", index: 95 },

  // Lower Cost (<95)
  "raleigh": { name: "Raleigh, NC", index: 94 },
  "nashville": { name: "Nashville, TN", index: 93 },
  "salt-lake-city": { name: "Salt Lake City, UT", index: 92 },
  "columbus": { name: "Columbus, OH", index: 90 },
  "kansas-city": { name: "Kansas City, MO", index: 88 },
  "indianapolis": { name: "Indianapolis, IN", index: 87 },
  "san-antonio": { name: "San Antonio, TX", index: 85 },
  "remote": { name: "Remote (National Average)", index: 100 },
};

/**
 * Calculate COL-adjusted salary
 * If comparing offers, this normalizes to a base location
 */
export function adjustForCOL(
  salary: number,
  location: string,
  baseLocation: string = "remote"
): number {
  const locationIndex = COST_OF_LIVING[location]?.index || 100;
  const baseIndex = COST_OF_LIVING[baseLocation]?.index || 100;

  // Adjust salary relative to base location
  // Higher COL location = salary is worth less in purchasing power
  return Math.round(salary * (baseIndex / locationIndex));
}

// Benefits valuation constants
export const BENEFITS_VALUATION = {
  // 401k match value (assumes 50% match up to 6% = max 3% of salary)
  maxMatchPercent: 6,
  typicalMatchRate: 0.5, // 50 cents per dollar
  maxMatchValue: 0.03, // 3% of salary max value

  // Healthcare (annual employer contribution value)
  healthcareValues: {
    excellent: 15000, // Premium plan, low deductible
    good: 10000, // Standard plan
    basic: 5000, // High deductible
    none: 0,
  },

  // PTO value (based on daily rate and extra days beyond 10 standard)
  basePTODays: 10,
  ptoValuePerExtraDay: 0.004, // ~1/250 of salary per day

  // Other benefits
  otherBenefits: {
    tuitionReimbursement: 5250, // Tax-free limit
    commuter: 3000, // Transit/parking benefit
    wellness: 500, // Gym, wellness stipend
    phone: 600, // Phone allowance
    internet: 600, // Internet stipend
  },
};

/**
 * Calculate 401k match value
 */
export function calculate401kMatch(
  salary: number,
  matchPercent: number, // e.g., 50 for 50%
  maxMatchUpTo: number // e.g., 6 for 6% of salary
): number {
  const matchRate = matchPercent / 100;
  const maxContribution = salary * (maxMatchUpTo / 100);
  return Math.round(maxContribution * matchRate);
}

// Equity types and vesting schedules
export type VestingSchedule = "4year-1cliff" | "4year-monthly" | "3year-monthly" | "immediate";

export const VESTING_SCHEDULES: Record<VestingSchedule, { cliffMonths: number; totalMonths: number; monthlyAfterCliff: boolean }> = {
  "4year-1cliff": { cliffMonths: 12, totalMonths: 48, monthlyAfterCliff: true }, // Standard startup
  "4year-monthly": { cliffMonths: 0, totalMonths: 48, monthlyAfterCliff: true }, // No cliff
  "3year-monthly": { cliffMonths: 0, totalMonths: 36, monthlyAfterCliff: true }, // Faster vest
  "immediate": { cliffMonths: 0, totalMonths: 0, monthlyAfterCliff: false }, // Immediate
};

/**
 * Calculate vested equity value at specific year marks
 */
export function calculateVestedEquity(
  totalValue: number,
  schedule: VestingSchedule,
  years: number
): number {
  const scheduleInfo = VESTING_SCHEDULES[schedule];
  const months = years * 12;

  if (schedule === "immediate") {
    return totalValue;
  }

  // Before cliff
  if (months < scheduleInfo.cliffMonths) {
    return 0;
  }

  // After cliff
  const vestingMonths = Math.min(months, scheduleInfo.totalMonths);

  if (schedule === "4year-1cliff") {
    // 25% at 1 year cliff, then monthly
    if (months >= 12) {
      const cliffValue = totalValue * 0.25;
      const monthsAfterCliff = Math.min(months - 12, 36);
      const monthlyValue = (totalValue * 0.75) / 36;
      return Math.round(cliffValue + (monthsAfterCliff * monthlyValue));
    }
    return 0;
  }

  // Monthly vesting from start
  const vestedFraction = vestingMonths / scheduleInfo.totalMonths;
  return Math.round(totalValue * vestedFraction);
}

/**
 * Calculate stock option value (simplified Black-Scholes approximation)
 * Assumes options are worth ~25-30% of spread for early stage, more for later
 */
export function calculateOptionValue(
  numOptions: number,
  strikePrice: number,
  currentPrice: number,
  exerciseWindow: "90days" | "10years" = "90days"
): number {
  const spread = Math.max(0, currentPrice - strikePrice);

  // Options have additional time value beyond spread
  // Simplified: use 1.2x for 10-year window, 1.0x for 90-day post-departure
  const timeValueMultiplier = exerciseWindow === "10years" ? 1.2 : 1.0;

  return Math.round(numOptions * spread * timeValueMultiplier);
}

/**
 * Calculate RSU value (straightforward - just shares * price)
 */
export function calculateRSUValue(
  numShares: number,
  pricePerShare: number
): number {
  return Math.round(numShares * pricePerShare);
}

// Full offer structure for comparison
export interface JobOffer {
  id: string;
  companyName: string;
  location: string;

  // Cash compensation
  baseSalary: number;
  signingBonus: number;
  annualBonus: number; // As percentage of base (e.g., 15 for 15%)
  annualBonusTarget: number; // Target percentage

  // Equity
  equityType: "options" | "rsus" | "none";
  equityValue: number; // Total grant value
  vestingSchedule: VestingSchedule;
  // For options specifically
  numOptions?: number;
  strikePrice?: number;
  currentPrice?: number;

  // Benefits
  has401kMatch: boolean;
  matchPercent: number; // e.g., 100 for 100% match
  maxMatchUpTo: number; // e.g., 6 for up to 6% of salary
  healthcareQuality: "excellent" | "good" | "basic" | "none";
  ptoDays: number;
  hasOtherBenefits: string[]; // Array of benefit names
}

/**
 * Calculate total compensation for a job offer at year marks
 */
export function calculateTotalComp(
  offer: JobOffer,
  years: 1 | 2 | 4
): {
  cash: number;
  equity: number;
  benefits: number;
  total: number;
  colAdjusted: number;
  breakdown: {
    baseSalary: number;
    signingBonus: number;
    annualBonus: number;
    vestedEquity: number;
    match401k: number;
    healthcareValue: number;
    ptoValue: number;
    otherBenefits: number;
  };
} {
  // Cash compensation
  const baseSalary = offer.baseSalary * years;
  const signingBonus = years === 1 ? offer.signingBonus : offer.signingBonus; // Signing bonus in year 1 only
  const annualBonus = offer.baseSalary * (offer.annualBonusTarget / 100) * years;
  const totalCash = baseSalary + signingBonus + annualBonus;

  // Equity
  const vestedEquity = calculateVestedEquity(offer.equityValue, offer.vestingSchedule, years);

  // Benefits
  const match401k = offer.has401kMatch
    ? calculate401kMatch(offer.baseSalary, offer.matchPercent, offer.maxMatchUpTo) * years
    : 0;

  const healthcareValue = BENEFITS_VALUATION.healthcareValues[offer.healthcareQuality] * years;

  const extraPTODays = Math.max(0, offer.ptoDays - BENEFITS_VALUATION.basePTODays);
  const ptoValue = Math.round(offer.baseSalary * BENEFITS_VALUATION.ptoValuePerExtraDay * extraPTODays * years);

  const otherBenefits = offer.hasOtherBenefits.reduce((sum, benefit) => {
    const key = benefit as keyof typeof BENEFITS_VALUATION.otherBenefits;
    return sum + (BENEFITS_VALUATION.otherBenefits[key] || 0);
  }, 0) * years;

  const totalBenefits = match401k + healthcareValue + ptoValue + otherBenefits;

  const total = totalCash + vestedEquity + totalBenefits;

  // COL adjusted (normalizing to national average)
  const colAdjusted = adjustForCOL(total / years, offer.location, "remote") * years;

  return {
    cash: totalCash,
    equity: vestedEquity,
    benefits: totalBenefits,
    total,
    colAdjusted,
    breakdown: {
      baseSalary,
      signingBonus,
      annualBonus,
      vestedEquity,
      match401k,
      healthcareValue,
      ptoValue,
      otherBenefits,
    },
  };
}

/**
 * Get location options for dropdown
 */
export function getLocationOptions() {
  return Object.entries(COST_OF_LIVING)
    .map(([value, info]) => ({
      value,
      label: `${info.name} (COL: ${info.index})`,
      index: info.index,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
