/**
 * Credential ROI Calculator Data
 *
 * Data for calculating return on investment for degrees, certifications, and bootcamps.
 * Includes cost estimates, time to complete, and expected salary impacts.
 */

// GI Bill benefit rates (2024)
export const GI_BILL = {
  // Post-9/11 GI Bill (Chapter 33)
  maxMonths: 36,
  tuitionCapPublic: 0, // Full in-state tuition for public schools
  tuitionCapPrivate: 28937.94, // Per academic year cap for private schools
  yellowRibbonEligible: true,

  // Monthly Housing Allowance (MHA) - based on E-5 with dependents BAH
  // This varies by ZIP code, using national average
  averageMHA: 1800,

  // Book stipend
  bookStipend: 1000, // Per year

  // Transferability
  canTransfer: true,
  minServiceForTransfer: 6, // years

  // Kicker (if applicable)
  maxKicker: 950, // Per month
};

// Credential types
export type CredentialType = "degree" | "certification" | "bootcamp";
export type DegreeLevel = "associates" | "bachelors" | "masters" | "mba" | "doctorate";

// Industry categories
export type Industry =
  | "technology"
  | "business"
  | "healthcare"
  | "finance"
  | "project_management"
  | "data_analytics"
  | "cybersecurity"
  | "supply_chain"
  | "hr"
  | "general";

// Credential definition
export interface Credential {
  id: string;
  name: string;
  type: CredentialType;
  level?: DegreeLevel;
  industry: Industry;
  description: string;
  provider?: string;

  // Costs
  totalCost: { min: number; max: number };
  giCostAfterBenefits?: { min: number; max: number }; // Cost after GI Bill

  // Time investment
  monthsToComplete: { min: number; max: number };
  hoursPerWeek: { min: number; max: number };

  // Salary impact
  salaryIncrease: {
    entry: { min: number; max: number }; // Entry level increase
    experienced: { min: number; max: number }; // 5+ years experience increase
  };
  salaryMultiplier?: number; // Alternative: percentage increase

  // Success metrics
  passRate?: number; // For certifications
  completionRate?: number; // For bootcamps/degrees
  employmentRate?: number;

  // Job market
  jobsAvailable: "high" | "medium" | "low";
  remoteEligible: boolean;

  // Prerequisites
  prerequisites?: string[];
  minimumEducation?: string;
}

// Credential library
export const CREDENTIALS: Credential[] = [
  // DEGREES
  {
    id: "bachelors-cs",
    name: "Bachelor's in Computer Science",
    type: "degree",
    level: "bachelors",
    industry: "technology",
    description: "Four-year degree covering programming, algorithms, data structures, and software engineering",
    totalCost: { min: 40000, max: 160000 },
    giCostAfterBenefits: { min: 0, max: 20000 },
    monthsToComplete: { min: 36, max: 48 },
    hoursPerWeek: { min: 20, max: 40 },
    salaryIncrease: {
      entry: { min: 25000, max: 45000 },
      experienced: { min: 35000, max: 60000 },
    },
    jobsAvailable: "high",
    remoteEligible: true,
    employmentRate: 0.92,
  },
  {
    id: "bachelors-business",
    name: "Bachelor's in Business Administration",
    type: "degree",
    level: "bachelors",
    industry: "business",
    description: "Four-year degree covering management, finance, marketing, and operations",
    totalCost: { min: 35000, max: 140000 },
    giCostAfterBenefits: { min: 0, max: 15000 },
    monthsToComplete: { min: 36, max: 48 },
    hoursPerWeek: { min: 15, max: 30 },
    salaryIncrease: {
      entry: { min: 15000, max: 30000 },
      experienced: { min: 25000, max: 45000 },
    },
    jobsAvailable: "high",
    remoteEligible: true,
    employmentRate: 0.88,
  },
  {
    id: "masters-mba",
    name: "MBA (Master of Business Administration)",
    type: "degree",
    level: "mba",
    industry: "business",
    description: "Graduate business degree for leadership and management roles",
    provider: "Various universities",
    totalCost: { min: 50000, max: 200000 },
    giCostAfterBenefits: { min: 0, max: 50000 },
    monthsToComplete: { min: 18, max: 24 },
    hoursPerWeek: { min: 25, max: 50 },
    salaryIncrease: {
      entry: { min: 30000, max: 50000 },
      experienced: { min: 50000, max: 100000 },
    },
    jobsAvailable: "high",
    remoteEligible: true,
    minimumEducation: "Bachelor's degree",
    employmentRate: 0.94,
  },
  {
    id: "masters-cybersecurity",
    name: "Master's in Cybersecurity",
    type: "degree",
    level: "masters",
    industry: "cybersecurity",
    description: "Graduate degree focusing on information security, risk management, and cyber defense",
    totalCost: { min: 30000, max: 100000 },
    giCostAfterBenefits: { min: 0, max: 25000 },
    monthsToComplete: { min: 18, max: 24 },
    hoursPerWeek: { min: 20, max: 35 },
    salaryIncrease: {
      entry: { min: 25000, max: 40000 },
      experienced: { min: 40000, max: 70000 },
    },
    jobsAvailable: "high",
    remoteEligible: true,
    minimumEducation: "Bachelor's degree",
    employmentRate: 0.96,
  },

  // CERTIFICATIONS
  {
    id: "pmp",
    name: "PMP (Project Management Professional)",
    type: "certification",
    industry: "project_management",
    description: "Industry-standard project management certification from PMI",
    provider: "Project Management Institute",
    totalCost: { min: 2000, max: 4000 },
    monthsToComplete: { min: 2, max: 6 },
    hoursPerWeek: { min: 10, max: 20 },
    salaryIncrease: {
      entry: { min: 8000, max: 15000 },
      experienced: { min: 15000, max: 25000 },
    },
    passRate: 0.60,
    jobsAvailable: "high",
    remoteEligible: true,
    prerequisites: ["35 hours PM education", "3-5 years PM experience"],
  },
  {
    id: "cissp",
    name: "CISSP (Certified Information Systems Security Professional)",
    type: "certification",
    industry: "cybersecurity",
    description: "Gold standard cybersecurity certification for experienced professionals",
    provider: "ISC²",
    totalCost: { min: 2500, max: 5000 },
    monthsToComplete: { min: 3, max: 6 },
    hoursPerWeek: { min: 15, max: 25 },
    salaryIncrease: {
      entry: { min: 15000, max: 25000 },
      experienced: { min: 25000, max: 40000 },
    },
    passRate: 0.70,
    jobsAvailable: "high",
    remoteEligible: true,
    prerequisites: ["5 years security experience"],
  },
  {
    id: "aws-solutions-architect",
    name: "AWS Solutions Architect Associate",
    type: "certification",
    industry: "technology",
    description: "Entry-level AWS cloud certification for architects",
    provider: "Amazon Web Services",
    totalCost: { min: 500, max: 2000 },
    monthsToComplete: { min: 1, max: 3 },
    hoursPerWeek: { min: 10, max: 20 },
    salaryIncrease: {
      entry: { min: 10000, max: 18000 },
      experienced: { min: 15000, max: 25000 },
    },
    passRate: 0.72,
    jobsAvailable: "high",
    remoteEligible: true,
  },
  {
    id: "comptia-security-plus",
    name: "CompTIA Security+",
    type: "certification",
    industry: "cybersecurity",
    description: "Entry-level cybersecurity certification, DoD 8570 compliant",
    provider: "CompTIA",
    totalCost: { min: 400, max: 1500 },
    monthsToComplete: { min: 1, max: 3 },
    hoursPerWeek: { min: 10, max: 15 },
    salaryIncrease: {
      entry: { min: 8000, max: 12000 },
      experienced: { min: 10000, max: 18000 },
    },
    passRate: 0.75,
    jobsAvailable: "high",
    remoteEligible: true,
  },
  {
    id: "cpa",
    name: "CPA (Certified Public Accountant)",
    type: "certification",
    industry: "finance",
    description: "Professional accounting certification required for many finance roles",
    provider: "State Boards of Accountancy",
    totalCost: { min: 3000, max: 6000 },
    monthsToComplete: { min: 6, max: 18 },
    hoursPerWeek: { min: 15, max: 25 },
    salaryIncrease: {
      entry: { min: 15000, max: 25000 },
      experienced: { min: 25000, max: 45000 },
    },
    passRate: 0.50,
    jobsAvailable: "high",
    remoteEligible: true,
    prerequisites: ["150 semester hours", "Bachelor's degree in accounting preferred"],
  },
  {
    id: "six-sigma-black-belt",
    name: "Six Sigma Black Belt",
    type: "certification",
    industry: "supply_chain",
    description: "Process improvement and quality management certification",
    provider: "ASQ / IASSC",
    totalCost: { min: 2000, max: 5000 },
    monthsToComplete: { min: 3, max: 6 },
    hoursPerWeek: { min: 10, max: 20 },
    salaryIncrease: {
      entry: { min: 10000, max: 18000 },
      experienced: { min: 18000, max: 30000 },
    },
    passRate: 0.65,
    jobsAvailable: "medium",
    remoteEligible: true,
    prerequisites: ["Green Belt recommended", "Project experience"],
  },
  {
    id: "shrm-cp",
    name: "SHRM-CP (HR Certification)",
    type: "certification",
    industry: "hr",
    description: "Society for Human Resource Management certification for HR professionals",
    provider: "SHRM",
    totalCost: { min: 500, max: 2000 },
    monthsToComplete: { min: 2, max: 4 },
    hoursPerWeek: { min: 8, max: 15 },
    salaryIncrease: {
      entry: { min: 6000, max: 12000 },
      experienced: { min: 12000, max: 20000 },
    },
    passRate: 0.68,
    jobsAvailable: "medium",
    remoteEligible: true,
    prerequisites: ["HR experience recommended"],
  },
  {
    id: "google-data-analytics",
    name: "Google Data Analytics Certificate",
    type: "certification",
    industry: "data_analytics",
    description: "Entry-level data analytics certification covering spreadsheets, SQL, and visualization",
    provider: "Google / Coursera",
    totalCost: { min: 300, max: 500 },
    monthsToComplete: { min: 3, max: 6 },
    hoursPerWeek: { min: 10, max: 15 },
    salaryIncrease: {
      entry: { min: 8000, max: 15000 },
      experienced: { min: 12000, max: 20000 },
    },
    completionRate: 0.40,
    jobsAvailable: "high",
    remoteEligible: true,
  },

  // BOOTCAMPS
  {
    id: "bootcamp-fullstack",
    name: "Full-Stack Web Development Bootcamp",
    type: "bootcamp",
    industry: "technology",
    description: "Intensive coding bootcamp covering front-end, back-end, and deployment",
    totalCost: { min: 10000, max: 20000 },
    monthsToComplete: { min: 3, max: 6 },
    hoursPerWeek: { min: 40, max: 60 },
    salaryIncrease: {
      entry: { min: 20000, max: 40000 },
      experienced: { min: 30000, max: 50000 },
    },
    completionRate: 0.75,
    employmentRate: 0.80,
    jobsAvailable: "high",
    remoteEligible: true,
  },
  {
    id: "bootcamp-data-science",
    name: "Data Science Bootcamp",
    type: "bootcamp",
    industry: "data_analytics",
    description: "Intensive program covering Python, statistics, machine learning, and data visualization",
    totalCost: { min: 12000, max: 25000 },
    monthsToComplete: { min: 3, max: 6 },
    hoursPerWeek: { min: 40, max: 60 },
    salaryIncrease: {
      entry: { min: 25000, max: 45000 },
      experienced: { min: 35000, max: 60000 },
    },
    completionRate: 0.70,
    employmentRate: 0.78,
    jobsAvailable: "high",
    remoteEligible: true,
    prerequisites: ["Basic math/statistics helpful"],
  },
  {
    id: "bootcamp-cybersecurity",
    name: "Cybersecurity Bootcamp",
    type: "bootcamp",
    industry: "cybersecurity",
    description: "Intensive security training covering penetration testing, incident response, and compliance",
    totalCost: { min: 10000, max: 18000 },
    monthsToComplete: { min: 3, max: 6 },
    hoursPerWeek: { min: 40, max: 50 },
    salaryIncrease: {
      entry: { min: 20000, max: 35000 },
      experienced: { min: 30000, max: 50000 },
    },
    completionRate: 0.78,
    employmentRate: 0.82,
    jobsAvailable: "high",
    remoteEligible: true,
  },
  {
    id: "bootcamp-product-management",
    name: "Product Management Bootcamp",
    type: "bootcamp",
    industry: "technology",
    description: "Program covering product strategy, user research, and agile development",
    totalCost: { min: 5000, max: 12000 },
    monthsToComplete: { min: 2, max: 4 },
    hoursPerWeek: { min: 20, max: 30 },
    salaryIncrease: {
      entry: { min: 15000, max: 30000 },
      experienced: { min: 25000, max: 45000 },
    },
    completionRate: 0.80,
    employmentRate: 0.75,
    jobsAvailable: "medium",
    remoteEligible: true,
  },
];

// Helper functions
export function getCredentialById(id: string): Credential | undefined {
  return CREDENTIALS.find((c) => c.id === id);
}

export function getCredentialsByType(type: CredentialType): Credential[] {
  return CREDENTIALS.filter((c) => c.type === type);
}

export function getCredentialsByIndustry(industry: Industry): Credential[] {
  return CREDENTIALS.filter((c) => c.industry === industry);
}

export function getAllIndustries(): Industry[] {
  return Array.from(new Set(CREDENTIALS.map((c) => c.industry)));
}

/**
 * Calculate GI Bill benefits for a credential
 */
export function calculateGIBillBenefit(
  credential: Credential,
  isPrivateSchool: boolean = false
): {
  tuitionCovered: number;
  housingAllowance: number;
  bookStipend: number;
  totalBenefit: number;
  outOfPocket: number;
} {
  const avgCost = (credential.totalCost.min + credential.totalCost.max) / 2;
  const months = (credential.monthsToComplete.min + credential.monthsToComplete.max) / 2;
  const academicYears = months / 9; // Assuming 9 months per academic year

  // Tuition calculation
  let tuitionCovered: number;
  if (isPrivateSchool) {
    tuitionCovered = Math.min(avgCost, GI_BILL.tuitionCapPrivate * academicYears);
  } else {
    tuitionCovered = avgCost; // Public schools fully covered
  }

  // Housing allowance (only for more than half-time students)
  const housingMonths = Math.min(months, GI_BILL.maxMonths);
  const housingAllowance = GI_BILL.averageMHA * housingMonths;

  // Book stipend
  const bookStipend = GI_BILL.bookStipend * academicYears;

  const totalBenefit = tuitionCovered + housingAllowance + bookStipend;
  const outOfPocket = Math.max(0, avgCost - tuitionCovered);

  return {
    tuitionCovered,
    housingAllowance,
    bookStipend,
    totalBenefit,
    outOfPocket,
  };
}

/**
 * Calculate NPV (Net Present Value) of a credential investment
 */
export function calculateNPV(
  totalInvestment: number,
  annualSalaryIncrease: number,
  years: number = 10,
  discountRate: number = 0.05
): number {
  let npv = -totalInvestment;

  for (let year = 1; year <= years; year++) {
    const presentValue = annualSalaryIncrease / Math.pow(1 + discountRate, year);
    npv += presentValue;
  }

  return Math.round(npv);
}

/**
 * Calculate break-even point in months
 */
export function calculateBreakEven(
  totalInvestment: number,
  monthlySalaryIncrease: number,
  monthsToComplete: number
): number {
  if (monthlySalaryIncrease <= 0) return Infinity;

  // Months to recoup investment after completing credential
  const monthsToRecoup = Math.ceil(totalInvestment / monthlySalaryIncrease);

  return monthsToComplete + monthsToRecoup;
}

/**
 * Calculate cumulative returns over time
 */
export function calculateCumulativeReturns(
  totalInvestment: number,
  annualSalaryIncrease: number,
  monthsToComplete: number,
  years: number = 10
): { year: number; cumulative: number; netReturn: number }[] {
  const monthlyIncrease = annualSalaryIncrease / 12;
  const results: { year: number; cumulative: number; netReturn: number }[] = [];

  let cumulative = -totalInvestment;
  const startEarningMonth = monthsToComplete;

  for (let year = 1; year <= years; year++) {
    const monthsThisYear = 12;
    const earningMonthsThisYear = Math.max(
      0,
      Math.min(monthsThisYear, year * 12 - startEarningMonth)
    );
    const prevEarningMonths = Math.max(0, (year - 1) * 12 - startEarningMonth);
    const actualEarningMonths = earningMonthsThisYear - prevEarningMonths;

    cumulative += actualEarningMonths * monthlyIncrease;

    results.push({
      year,
      cumulative: Math.round(cumulative),
      netReturn: Math.round(cumulative + totalInvestment),
    });
  }

  return results;
}

/**
 * Industry display names
 */
export const INDUSTRY_NAMES: Record<Industry, string> = {
  technology: "Technology",
  business: "Business",
  healthcare: "Healthcare",
  finance: "Finance",
  project_management: "Project Management",
  data_analytics: "Data Analytics",
  cybersecurity: "Cybersecurity",
  supply_chain: "Supply Chain & Operations",
  hr: "Human Resources",
  general: "General",
};

/**
 * Credential type display names
 */
export const CREDENTIAL_TYPE_NAMES: Record<CredentialType, string> = {
  degree: "Degree",
  certification: "Professional Certification",
  bootcamp: "Bootcamp",
};
