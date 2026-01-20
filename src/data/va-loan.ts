/**
 * VA Loan Data and Calculations
 *
 * VA loans offer significant benefits:
 * - No down payment required
 * - No PMI (Private Mortgage Insurance)
 * - Competitive interest rates
 * - One-time VA funding fee (can be rolled into loan)
 *
 * Source: VA.gov
 * Last Updated: 2024
 */

// VA Funding Fee Rates (as percentage of loan amount)
// Varies by loan type, down payment, and first-time vs subsequent use
export const VA_FUNDING_FEES = {
  purchase: {
    firstTime: {
      noDownPayment: 2.15,    // 0% down
      fivePercent: 1.5,       // 5% or more down
      tenPercent: 1.25,       // 10% or more down
    },
    subsequent: {
      noDownPayment: 3.3,     // 0% down
      fivePercent: 1.5,       // 5% or more down
      tenPercent: 1.25,       // 10% or more down
    },
  },
  refinance: {
    cashOut: 2.15,            // Cash-out refinance (first time)
    cashOutSubsequent: 3.3,   // Cash-out refinance (subsequent)
    irrrl: 0.5,               // Interest Rate Reduction Refinance Loan
  },
  // Exemptions (funding fee waived)
  exemptions: [
    "Veterans receiving VA compensation for service-connected disabilities",
    "Veterans entitled to receive VA compensation but receiving retirement/active duty pay",
    "Surviving spouses of veterans who died in service or from service-connected disabilities",
    "Service members with proposed or memorandum disability ratings before loan closing",
    "Purple Heart recipients serving on active duty",
  ],
};

/**
 * Get VA funding fee percentage based on loan details
 */
export function getVAFundingFeePercent(
  isFirstTime: boolean,
  downPaymentPercent: number
): number {
  const tier = isFirstTime ? VA_FUNDING_FEES.purchase.firstTime : VA_FUNDING_FEES.purchase.subsequent;

  if (downPaymentPercent >= 10) return tier.tenPercent;
  if (downPaymentPercent >= 5) return tier.fivePercent;
  return tier.noDownPayment;
}

/**
 * Calculate VA funding fee amount
 */
export function calculateVAFundingFee(
  loanAmount: number,
  isFirstTime: boolean,
  downPaymentPercent: number,
  isExempt: boolean = false
): number {
  if (isExempt) return 0;
  const feePercent = getVAFundingFeePercent(isFirstTime, downPaymentPercent);
  return Math.round(loanAmount * (feePercent / 100));
}

// Current mortgage rates (these would be fetched from an API in production)
export const MORTGAGE_RATES = {
  va30Year: 6.25,         // VA 30-year fixed
  va15Year: 5.75,         // VA 15-year fixed
  conventional30Year: 6.75,  // Conventional 30-year
  conventional15Year: 6.25,  // Conventional 15-year
  lastUpdated: "2024-01-15",
  source: "Market average estimates",
};

// Property costs as percentages
export const PROPERTY_COSTS = {
  propertyTaxRate: 1.1,        // Annual property tax (% of home value)
  homeownersInsurance: 0.35,   // Annual insurance (% of home value)
  maintenanceRate: 1.0,        // Annual maintenance (% of home value)
  closingCostsPercent: 2.5,    // Closing costs (% of home price)
  appreciationRate: 3.0,       // Annual home appreciation estimate
};

// Rent assumptions
export const RENT_ASSUMPTIONS = {
  annualIncreaseRate: 3.5,     // Annual rent increase
  rentersInsurance: 20,        // Monthly renters insurance
  securityDepositMonths: 2,    // Security deposit in months of rent
};

// Investment assumptions for opportunity cost
export const INVESTMENT_ASSUMPTIONS = {
  expectedReturn: 7.0,         // Annual expected return on investments
  inflationRate: 2.5,          // Annual inflation rate
};

/**
 * Calculate monthly mortgage payment (P&I only)
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) {
    return principal / numPayments;
  }

  const payment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return Math.round(payment * 100) / 100;
}

/**
 * Calculate amortization schedule
 */
export function calculateAmortization(
  principal: number,
  annualRate: number,
  termYears: number
): Array<{
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}> {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);

  const schedule = [];
  let balance = principal;

  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.max(0, Math.round(balance * 100) / 100),
    });
  }

  return schedule;
}

/**
 * Calculate total cost of homeownership at specific year marks
 */
export function calculateHomeownershipCosts(
  homePrice: number,
  downPayment: number,
  interestRate: number,
  termYears: number,
  vaFundingFee: number,
  years: number
): {
  totalMortgagePayments: number;
  totalInterestPaid: number;
  principalPaid: number;
  remainingBalance: number;
  propertyTaxes: number;
  insurance: number;
  maintenance: number;
  closingCosts: number;
  totalCashOutflow: number;
  homeEquity: number;
  homeValue: number;
} {
  const loanAmount = homePrice - downPayment + vaFundingFee;
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, termYears);
  const months = years * 12;

  // Get amortization details for the period
  const amortization = calculateAmortization(loanAmount, interestRate, termYears);
  const paymentsInPeriod = amortization.slice(0, months);

  const totalMortgagePayments = paymentsInPeriod.reduce((sum, p) => sum + p.payment, 0);
  const totalInterestPaid = paymentsInPeriod.reduce((sum, p) => sum + p.interest, 0);
  const principalPaid = paymentsInPeriod.reduce((sum, p) => sum + p.principal, 0);
  const remainingBalance = paymentsInPeriod[months - 1]?.balance || loanAmount;

  // Calculate property-related costs over the years
  // Using compounding for appreciation
  let totalPropertyTaxes = 0;
  let totalInsurance = 0;
  let totalMaintenance = 0;
  let currentHomeValue = homePrice;

  for (let year = 1; year <= years; year++) {
    totalPropertyTaxes += currentHomeValue * (PROPERTY_COSTS.propertyTaxRate / 100);
    totalInsurance += currentHomeValue * (PROPERTY_COSTS.homeownersInsurance / 100);
    totalMaintenance += currentHomeValue * (PROPERTY_COSTS.maintenanceRate / 100);
    currentHomeValue *= 1 + PROPERTY_COSTS.appreciationRate / 100;
  }

  const closingCosts = homePrice * (PROPERTY_COSTS.closingCostsPercent / 100);

  const totalCashOutflow =
    downPayment +
    closingCosts +
    totalMortgagePayments +
    totalPropertyTaxes +
    totalInsurance +
    totalMaintenance;

  const homeEquity = currentHomeValue - remainingBalance;

  return {
    totalMortgagePayments: Math.round(totalMortgagePayments),
    totalInterestPaid: Math.round(totalInterestPaid),
    principalPaid: Math.round(principalPaid),
    remainingBalance: Math.round(remainingBalance),
    propertyTaxes: Math.round(totalPropertyTaxes),
    insurance: Math.round(totalInsurance),
    maintenance: Math.round(totalMaintenance),
    closingCosts: Math.round(closingCosts),
    totalCashOutflow: Math.round(totalCashOutflow),
    homeEquity: Math.round(homeEquity),
    homeValue: Math.round(currentHomeValue),
  };
}

/**
 * Calculate total cost of renting over time
 */
export function calculateRentingCosts(
  monthlyRent: number,
  years: number
): {
  totalRentPaid: number;
  totalInsurance: number;
  securityDeposit: number;
  totalCashOutflow: number;
  investmentValue: number;
} {
  let totalRent = 0;
  let currentRent = monthlyRent;

  // Calculate rent with annual increases
  for (let year = 1; year <= years; year++) {
    totalRent += currentRent * 12;
    currentRent *= 1 + RENT_ASSUMPTIONS.annualIncreaseRate / 100;
  }

  const totalInsurance = RENT_ASSUMPTIONS.rentersInsurance * 12 * years;
  const securityDeposit = monthlyRent * RENT_ASSUMPTIONS.securityDepositMonths;

  // Note: Security deposit is typically returned, so it's not a true cost
  const totalCashOutflow = totalRent + totalInsurance;

  // Calculate what savings could have grown to if invested
  // This is the opportunity cost of NOT having a down payment tied up
  const investmentValue = 0; // Renter has no equity, but also no capital tied up

  return {
    totalRentPaid: Math.round(totalRent),
    totalInsurance: Math.round(totalInsurance),
    securityDeposit: Math.round(securityDeposit),
    totalCashOutflow: Math.round(totalCashOutflow),
    investmentValue: 0, // Will be calculated with opportunity cost separately
  };
}

/**
 * Calculate opportunity cost of down payment if invested instead
 */
export function calculateOpportunityCost(
  downPayment: number,
  years: number
): number {
  // Future value of down payment if invested
  const futureValue =
    downPayment * Math.pow(1 + INVESTMENT_ASSUMPTIONS.expectedReturn / 100, years);
  return Math.round(futureValue - downPayment);
}

/**
 * Find break-even year where buying becomes better than renting
 */
export function findBreakEvenYear(
  homePrice: number,
  downPayment: number,
  monthlyRent: number,
  interestRate: number,
  termYears: number,
  vaFundingFee: number,
  maxYears: number = 30
): number | null {
  for (let year = 1; year <= maxYears; year++) {
    const buyingCosts = calculateHomeownershipCosts(
      homePrice,
      downPayment,
      interestRate,
      termYears,
      vaFundingFee,
      year
    );

    const rentingCosts = calculateRentingCosts(monthlyRent, year);
    const opportunityCost = calculateOpportunityCost(downPayment, year);

    // Net cost of buying = cash outflow - equity built
    const netBuyingCost = buyingCosts.totalCashOutflow - buyingCosts.homeEquity;

    // Net cost of renting = cash outflow + opportunity cost of not investing down payment
    const netRentingCost = rentingCosts.totalCashOutflow + opportunityCost;

    if (netBuyingCost < netRentingCost) {
      return year;
    }
  }

  return null; // No break-even within maxYears
}
