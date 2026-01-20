/**
 * Military Pay Data - 2024
 * Source: Defense Finance and Accounting Service (DFAS)
 * Last Updated: January 2024
 *
 * This data is used for educational purposes in the Tax Impact Calculator.
 * For official pay information, visit: https://www.dfas.mil/militarymembers/payentitlements/Pay-Tables/
 */

// Pay grades and their common titles
export const PAY_GRADES = {
  // Enlisted
  E1: { grade: "E1", title: "E-1", branch: { army: "Private", navy: "Seaman Recruit", airforce: "Airman Basic", marines: "Private" } },
  E2: { grade: "E2", title: "E-2", branch: { army: "Private", navy: "Seaman Apprentice", airforce: "Airman", marines: "Private First Class" } },
  E3: { grade: "E3", title: "E-3", branch: { army: "Private First Class", navy: "Seaman", airforce: "Airman First Class", marines: "Lance Corporal" } },
  E4: { grade: "E4", title: "E-4", branch: { army: "Specialist/Corporal", navy: "Petty Officer 3rd Class", airforce: "Senior Airman", marines: "Corporal" } },
  E5: { grade: "E5", title: "E-5", branch: { army: "Sergeant", navy: "Petty Officer 2nd Class", airforce: "Staff Sergeant", marines: "Sergeant" } },
  E6: { grade: "E6", title: "E-6", branch: { army: "Staff Sergeant", navy: "Petty Officer 1st Class", airforce: "Technical Sergeant", marines: "Staff Sergeant" } },
  E7: { grade: "E7", title: "E-7", branch: { army: "Sergeant First Class", navy: "Chief Petty Officer", airforce: "Master Sergeant", marines: "Gunnery Sergeant" } },
  E8: { grade: "E8", title: "E-8", branch: { army: "Master/First Sergeant", navy: "Senior Chief Petty Officer", airforce: "Senior Master Sergeant", marines: "Master/First Sergeant" } },
  E9: { grade: "E9", title: "E-9", branch: { army: "Sergeant Major", navy: "Master Chief Petty Officer", airforce: "Chief Master Sergeant", marines: "Sergeant Major" } },
  // Warrant Officers
  W1: { grade: "W1", title: "W-1", branch: { army: "Warrant Officer 1", navy: "Warrant Officer 1", airforce: "N/A", marines: "Warrant Officer 1" } },
  W2: { grade: "W2", title: "W-2", branch: { army: "Chief Warrant Officer 2", navy: "Chief Warrant Officer 2", airforce: "N/A", marines: "Chief Warrant Officer 2" } },
  W3: { grade: "W3", title: "W-3", branch: { army: "Chief Warrant Officer 3", navy: "Chief Warrant Officer 3", airforce: "N/A", marines: "Chief Warrant Officer 3" } },
  W4: { grade: "W4", title: "W-4", branch: { army: "Chief Warrant Officer 4", navy: "Chief Warrant Officer 4", airforce: "N/A", marines: "Chief Warrant Officer 4" } },
  W5: { grade: "W5", title: "W-5", branch: { army: "Chief Warrant Officer 5", navy: "Chief Warrant Officer 5", airforce: "N/A", marines: "Chief Warrant Officer 5" } },
  // Officers
  O1: { grade: "O1", title: "O-1", branch: { army: "Second Lieutenant", navy: "Ensign", airforce: "Second Lieutenant", marines: "Second Lieutenant" } },
  O2: { grade: "O2", title: "O-2", branch: { army: "First Lieutenant", navy: "Lieutenant Junior Grade", airforce: "First Lieutenant", marines: "First Lieutenant" } },
  O3: { grade: "O3", title: "O-3", branch: { army: "Captain", navy: "Lieutenant", airforce: "Captain", marines: "Captain" } },
  O4: { grade: "O4", title: "O-4", branch: { army: "Major", navy: "Lieutenant Commander", airforce: "Major", marines: "Major" } },
  O5: { grade: "O5", title: "O-5", branch: { army: "Lieutenant Colonel", navy: "Commander", airforce: "Lieutenant Colonel", marines: "Lieutenant Colonel" } },
  O6: { grade: "O6", title: "O-6", branch: { army: "Colonel", navy: "Captain", airforce: "Colonel", marines: "Colonel" } },
  O7: { grade: "O7", title: "O-7", branch: { army: "Brigadier General", navy: "Rear Admiral Lower Half", airforce: "Brigadier General", marines: "Brigadier General" } },
  O8: { grade: "O8", title: "O-8", branch: { army: "Major General", navy: "Rear Admiral Upper Half", airforce: "Major General", marines: "Major General" } },
  O9: { grade: "O9", title: "O-9", branch: { army: "Lieutenant General", navy: "Vice Admiral", airforce: "Lieutenant General", marines: "Lieutenant General" } },
  O10: { grade: "O10", title: "O-10", branch: { army: "General", navy: "Admiral", airforce: "General", marines: "General" } },
} as const;

export type PayGrade = keyof typeof PAY_GRADES;

// 2024 Monthly Base Pay by grade and years of service
// Years: 0 (< 2), 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40
export const BASE_PAY_2024: Record<PayGrade, number[]> = {
  // Enlisted
  E1: [1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60, 1917.60],
  E2: [2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20, 2149.20],
  E3: [2259.90, 2402.10, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80, 2545.80],
  E4: [2503.50, 2633.40, 2777.10, 2916.60, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40, 3038.40],
  E5: [2730.30, 2913.60, 3057.30, 3196.80, 3420.30, 3631.20, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10, 3815.10],
  E6: [2980.50, 3280.50, 3424.20, 3563.70, 3707.40, 4039.80, 4166.40, 4292.70, 4404.00, 4459.50, 4503.00, 4503.00, 4503.00, 4503.00, 4503.00, 4503.00, 4503.00, 4503.00, 4503.00, 4503.00, 4503.00, 4503.00],
  E7: [3445.80, 3760.50, 3904.20, 4094.10, 4247.70, 4502.10, 4642.20, 4899.30, 5068.80, 5197.80, 5337.60, 5442.90, 5583.00, 5583.00, 5583.00, 5583.00, 5583.00, 5583.00, 5583.00, 5583.00, 5583.00, 5583.00],
  E8: [4957.20, 5141.70, 5285.10, 5468.40, 5668.50, 5998.50, 6141.60, 6395.10, 6535.50, 6708.60, 6879.30, 6879.30, 6879.30, 6879.30, 6879.30, 6879.30, 6879.30, 6879.30, 6879.30, 6879.30, 6879.30, 6879.30],
  E9: [6055.50, 6192.60, 6368.70, 6574.80, 6827.40, 7175.70, 7438.50, 7696.50, 7943.70, 8202.60, 8545.80, 8795.10, 9066.90, 9066.90, 9066.90, 9066.90, 9066.90, 9066.90, 9066.90, 9066.90, 9066.90, 9066.90],
  // Warrant Officers
  W1: [3555.90, 3939.30, 4042.80, 4247.70, 4453.80, 4814.70, 4960.20, 5263.20, 5512.50, 5760.30, 5943.60, 6192.60, 6192.60, 6192.60, 6192.60, 6192.60, 6192.60, 6192.60, 6192.60, 6192.60, 6192.60, 6192.60],
  W2: [4066.80, 4450.50, 4568.70, 4643.10, 4868.70, 5229.90, 5492.70, 5696.40, 5900.10, 6095.70, 6259.20, 6455.10, 6669.30, 6839.40, 6839.40, 6839.40, 6839.40, 6839.40, 6839.40, 6839.40, 6839.40, 6839.40],
  W3: [4615.80, 4804.80, 5001.60, 5063.70, 5270.40, 5586.30, 5945.10, 6157.20, 6389.10, 6634.80, 6922.50, 7139.40, 7373.40, 7599.90, 7881.90, 7881.90, 7881.90, 7881.90, 7881.90, 7881.90, 7881.90, 7881.90],
  W4: [5044.80, 5427.60, 5585.40, 5645.10, 5907.30, 6168.30, 6429.60, 6786.00, 7073.40, 7358.40, 7632.90, 7889.40, 8146.80, 8400.30, 8706.60, 8899.20, 8899.20, 8899.20, 8899.20, 8899.20, 8899.20, 8899.20],
  W5: [7182.60, 7486.80, 7676.70, 7869.60, 8061.00, 8352.00, 8643.00, 8970.00, 9297.00, 9666.00, 10011.00, 10302.00, 10593.00, 10926.00, 11205.00, 11475.00, 11475.00, 11475.00, 11475.00, 11475.00, 11475.00, 11475.00],
  // Officers
  O1: [3637.20, 3786.90, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80, 4579.80],
  O2: [4190.10, 4768.80, 5493.00, 5680.80, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70, 5795.70],
  O3: [4849.80, 5497.50, 5936.40, 6471.00, 6785.10, 7125.30, 7350.30, 7712.10, 7973.40, 7973.40, 7973.40, 7973.40, 7973.40, 7973.40, 7973.40, 7973.40, 7973.40, 7973.40, 7973.40, 7973.40, 7973.40, 7973.40],
  O4: [5516.10, 6387.00, 6815.10, 6902.40, 7299.30, 7719.00, 8236.50, 8639.10, 8884.50, 9176.10, 9399.30, 9538.20, 9538.20, 9538.20, 9538.20, 9538.20, 9538.20, 9538.20, 9538.20, 9538.20, 9538.20, 9538.20],
  O5: [6393.30, 7204.80, 7701.60, 7801.50, 8108.40, 8270.70, 8672.40, 8975.10, 9382.80, 9704.40, 9985.50, 10220.10, 10526.10, 10526.10, 10526.10, 10526.10, 10526.10, 10526.10, 10526.10, 10526.10, 10526.10, 10526.10],
  O6: [7690.20, 8449.20, 8999.10, 8999.10, 9036.00, 9422.40, 9475.80, 9475.80, 10027.80, 10949.40, 11506.50, 11798.10, 12118.50, 12688.80, 13307.70, 13307.70, 13307.70, 13307.70, 13307.70, 13307.70, 13307.70, 13307.70],
  O7: [10156.20, 10624.50, 10842.90, 11017.20, 11330.40, 11640.90, 11998.80, 12357.90, 12716.70, 13892.70, 14848.20, 14848.20, 14848.20, 14848.20, 14848.20, 14848.20, 15445.50, 15445.50, 15445.50, 15445.50, 15445.50, 15445.50],
  O8: [12252.00, 12644.70, 12898.80, 12963.90, 13302.00, 13860.00, 13987.50, 14498.70, 14846.40, 15445.50, 15923.40, 16398.30, 16752.30, 16752.30, 16752.30, 16752.30, 16752.30, 16752.30, 16752.30, 16752.30, 16752.30, 16752.30],
  O9: [15073.50, 15289.50, 15570.90, 15726.00, 16101.30, 16398.30, 16752.30, 17429.10, 17429.10, 17998.80, 17998.80, 17998.80, 17998.80, 17998.80, 17998.80, 17998.80, 17998.80, 17998.80, 17998.80, 17998.80, 17998.80, 17998.80],
  O10: [17998.80, 18169.80, 18169.80, 18169.80, 18169.80, 18306.60, 18306.60, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50, 19240.50],
};

// Years of service breakpoints (index corresponds to column in BASE_PAY_2024)
export const YEARS_OF_SERVICE = [0, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];

/**
 * Get base pay for a given rank and years of service
 */
export function getBasePay(grade: PayGrade, yearsOfService: number): number {
  const payTable = BASE_PAY_2024[grade];
  if (!payTable) return 0;

  // Find the appropriate column based on years of service
  let index = 0;
  for (let i = YEARS_OF_SERVICE.length - 1; i >= 0; i--) {
    if (yearsOfService >= YEARS_OF_SERVICE[i]) {
      index = i;
      break;
    }
  }

  return payTable[index];
}

// 2024 Basic Allowance for Subsistence (BAS) - Monthly rates
export const BAS_2024 = {
  enlisted: 460.25,
  officer: 316.98,
} as const;

/**
 * Get BAS for a given grade
 */
export function getBAS(grade: PayGrade): number {
  if (grade.startsWith("E")) {
    return BAS_2024.enlisted;
  }
  return BAS_2024.officer;
}

// Sample BAH data for common military areas (2024 rates with dependents)
// In production, this would come from the DFAS BAH calculator API
export const BAH_SAMPLES_2024: Record<string, Record<PayGrade, number>> = {
  // San Diego, CA (high cost)
  "92101": {
    E1: 2577, E2: 2577, E3: 2577, E4: 2577, E5: 2949, E6: 3069, E7: 3186, E8: 3300, E9: 3441,
    W1: 3069, W2: 3186, W3: 3300, W4: 3441, W5: 3591,
    O1: 2949, O2: 3069, O3: 3186, O4: 3441, O5: 3591, O6: 3723, O7: 3723, O8: 3723, O9: 3723, O10: 3723,
  },
  // Washington, DC area
  "22202": {
    E1: 2637, E2: 2637, E3: 2637, E4: 2637, E5: 2964, E6: 3084, E7: 3204, E8: 3324, E9: 3444,
    W1: 3084, W2: 3204, W3: 3324, W4: 3444, W5: 3564,
    O1: 2964, O2: 3084, O3: 3204, O4: 3444, O5: 3564, O6: 3684, O7: 3684, O8: 3684, O9: 3684, O10: 3684,
  },
  // Fort Bragg, NC area
  "28307": {
    E1: 1470, E2: 1470, E3: 1470, E4: 1470, E5: 1614, E6: 1722, E7: 1830, E8: 1938, E9: 2049,
    W1: 1722, W2: 1830, W3: 1938, W4: 2049, W5: 2157,
    O1: 1614, O2: 1722, O3: 1830, O4: 2049, O5: 2157, O6: 2265, O7: 2265, O8: 2265, O9: 2265, O10: 2265,
  },
  // Fort Hood, TX area
  "76544": {
    E1: 1425, E2: 1425, E3: 1425, E4: 1425, E5: 1557, E6: 1647, E7: 1737, E8: 1830, E9: 1920,
    W1: 1647, W2: 1737, W3: 1830, W4: 1920, W5: 2010,
    O1: 1557, O2: 1647, O3: 1737, O4: 1920, O5: 2010, O6: 2100, O7: 2100, O8: 2100, O9: 2100, O10: 2100,
  },
  // Joint Base Lewis-McChord, WA
  "98433": {
    E1: 2151, E2: 2151, E3: 2151, E4: 2151, E5: 2376, E6: 2499, E7: 2622, E8: 2745, E9: 2868,
    W1: 2499, W2: 2622, W3: 2745, W4: 2868, W5: 2991,
    O1: 2376, O2: 2499, O3: 2622, O4: 2868, O5: 2991, O6: 3114, O7: 3114, O8: 3114, O9: 3114, O10: 3114,
  },
};

// Default BAH rates by grade (national average approximation)
export const BAH_DEFAULT: Record<PayGrade, number> = {
  E1: 1500, E2: 1500, E3: 1500, E4: 1500, E5: 1725, E6: 1875, E7: 2025, E8: 2175, E9: 2325,
  W1: 1875, W2: 2025, W3: 2175, W4: 2325, W5: 2475,
  O1: 1725, O2: 1875, O3: 2025, O4: 2325, O5: 2475, O6: 2625, O7: 2625, O8: 2625, O9: 2625, O10: 2625,
};

/**
 * Get BAH for a given grade and zip code
 */
export function getBAH(grade: PayGrade, zipCode: string, withDependents: boolean = true): number {
  // Try to find exact zip code match
  const zipData = BAH_SAMPLES_2024[zipCode];
  if (zipData && zipData[grade]) {
    // If no dependents, BAH is typically 75-80% of with-dependents rate
    return withDependents ? zipData[grade] : Math.round(zipData[grade] * 0.77);
  }

  // Fall back to default rates
  const defaultRate = BAH_DEFAULT[grade];
  return withDependents ? defaultRate : Math.round(defaultRate * 0.77);
}

/**
 * Get all ranks for dropdown selection
 */
export function getRankOptions() {
  return Object.entries(PAY_GRADES).map(([grade, info]) => ({
    value: grade,
    label: `${info.title} (${info.branch.army})`,
    grade: grade as PayGrade,
  }));
}

/**
 * Data source information for disclaimers
 */
export const DATA_SOURCE = {
  name: "Defense Finance and Accounting Service (DFAS)",
  year: 2024,
  lastUpdated: "January 2024",
  url: "https://www.dfas.mil/militarymembers/payentitlements/Pay-Tables/",
  disclaimer: "Pay data is for educational purposes only. Actual military compensation may vary. Consult official DFAS resources for current rates.",
};

/**
 * Retirement system types
 * - HIGH_3: For those who entered service before Jan 1, 2018 (2.5% per year)
 * - BRS: Blended Retirement System for those who entered after Jan 1, 2018 (2.0% per year)
 */
export type RetirementSystem = "HIGH_3" | "BRS";

/**
 * Calculate military retirement pay
 * @param grade - Pay grade at retirement
 * @param yearsOfService - Total years of creditable service (minimum 20 for retirement)
 * @param retirementSystem - HIGH_3 or BRS
 * @returns Monthly retirement pay amount
 */
export function calculateRetirementPay(
  grade: PayGrade,
  yearsOfService: number,
  retirementSystem: RetirementSystem
): number {
  // Must have at least 20 years for traditional retirement
  if (yearsOfService < 20) {
    return 0;
  }

  // Get the base pay (simplified - uses current pay as proxy for "High-3" average)
  // In reality, High-3 is average of highest 36 months
  const basePay = getBasePay(grade, yearsOfService);

  // Multiplier per year of service
  const multiplier = retirementSystem === "HIGH_3" ? 0.025 : 0.02;

  // Calculate retirement percentage (capped at 75% for High-3, 60% for BRS)
  const maxPercent = retirementSystem === "HIGH_3" ? 0.75 : 0.60;
  const retirementPercent = Math.min(yearsOfService * multiplier, maxPercent);

  return Math.round(basePay * retirementPercent);
}

/**
 * Get retirement eligibility info
 */
export function getRetirementEligibility(yearsOfService: number): {
  eligible: boolean;
  yearsUntilEligible: number;
  message: string;
} {
  if (yearsOfService >= 20) {
    return {
      eligible: true,
      yearsUntilEligible: 0,
      message: "Eligible for retirement",
    };
  }
  return {
    eligible: false,
    yearsUntilEligible: 20 - yearsOfService,
    message: `${20 - yearsOfService} years until retirement eligible (20 years required)`,
  };
}
