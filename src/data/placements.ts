/**
 * Job Placements and Openings Data
 * Realistic dummy data for the heatmap visualization
 */

export interface Placement {
  id: string;
  type: "placement" | "opening";
  company: string;
  title: string;
  industry: string;
  salary: number;
  city: string;
  state: string;
  lat: number;
  lng: number;
  date: string; // ISO date string
}

// Major metros with their coordinates
const METRO_AREAS = {
  // Texas
  austin: { city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
  dallas: { city: "Dallas", state: "TX", lat: 32.7767, lng: -96.7970 },
  houston: { city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698 },
  sanAntonio: { city: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936 },

  // California
  sanFrancisco: { city: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194 },
  losAngeles: { city: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
  sanDiego: { city: "San Diego", state: "CA", lat: 32.7157, lng: -117.1611 },
  sanjose: { city: "San Jose", state: "CA", lat: 37.3382, lng: -121.8863 },

  // East Coast
  newYork: { city: "New York", state: "NY", lat: 40.7128, lng: -74.0060 },
  boston: { city: "Boston", state: "MA", lat: 42.3601, lng: -71.0589 },
  dc: { city: "Washington", state: "DC", lat: 38.9072, lng: -77.0369 },
  philadelphia: { city: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652 },

  // Southeast
  atlanta: { city: "Atlanta", state: "GA", lat: 33.7490, lng: -84.3880 },
  charlotte: { city: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431 },
  raleigh: { city: "Raleigh", state: "NC", lat: 35.7796, lng: -78.6382 },
  tampa: { city: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572 },
  miami: { city: "Miami", state: "FL", lat: 25.7617, lng: -80.1918 },

  // Midwest
  chicago: { city: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298 },
  denver: { city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903 },
  minneapolis: { city: "Minneapolis", state: "MN", lat: 44.9778, lng: -93.2650 },

  // Pacific Northwest
  seattle: { city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
  portland: { city: "Portland", state: "OR", lat: 45.5152, lng: -122.6784 },

  // Southwest
  phoenix: { city: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.0740 },
  lasVegas: { city: "Las Vegas", state: "NV", lat: 36.1699, lng: -115.1398 },
};

// Companies by industry with realistic office locations
const COMPANIES = {
  defense: [
    { name: "Lockheed Martin", metros: ["dc", "dallas", "denver", "sanDiego"] },
    { name: "Raytheon", metros: ["boston", "dallas", "phoenix", "dc"] },
    { name: "Northrop Grumman", metros: ["dc", "losAngeles", "sanDiego"] },
    { name: "General Dynamics", metros: ["dc", "dallas", "sanDiego"] },
    { name: "Boeing Defense", metros: ["seattle", "dc", "chicago", "sanAntonio"] },
    { name: "BAE Systems", metros: ["dc", "boston", "losAngeles"] },
    { name: "L3Harris", metros: ["dc", "dallas", "tampa"] },
    { name: "Leidos", metros: ["dc", "raleigh", "sanDiego"] },
    { name: "SAIC", metros: ["dc", "sanDiego", "huntsville"] },
    { name: "Booz Allen Hamilton", metros: ["dc", "sanDiego", "tampa"] },
  ],
  tech: [
    { name: "Amazon", metros: ["seattle", "austin", "dc", "newYork"] },
    { name: "Google", metros: ["sanFrancisco", "newYork", "austin", "seattle"] },
    { name: "Microsoft", metros: ["seattle", "austin", "dc", "sanFrancisco"] },
    { name: "Meta", metros: ["sanFrancisco", "austin", "seattle", "newYork"] },
    { name: "Apple", metros: ["sanjose", "austin", "seattle"] },
    { name: "Salesforce", metros: ["sanFrancisco", "austin", "chicago", "newYork"] },
    { name: "Oracle", metros: ["austin", "sanFrancisco", "denver"] },
    { name: "Cisco", metros: ["sanjose", "austin", "raleigh"] },
    { name: "Dell", metros: ["austin", "dallas"] },
    { name: "Palantir", metros: ["denver", "dc", "newYork", "sanFrancisco"] },
  ],
  consulting: [
    { name: "McKinsey", metros: ["newYork", "dc", "chicago", "sanFrancisco"] },
    { name: "BCG", metros: ["boston", "newYork", "dc", "chicago"] },
    { name: "Bain", metros: ["boston", "newYork", "dc", "sanFrancisco"] },
    { name: "Deloitte", metros: ["dc", "newYork", "chicago", "atlanta"] },
    { name: "Accenture", metros: ["dc", "chicago", "newYork", "atlanta"] },
    { name: "PwC", metros: ["newYork", "dc", "chicago", "dallas"] },
    { name: "EY", metros: ["newYork", "dc", "chicago", "atlanta"] },
    { name: "KPMG", metros: ["newYork", "dc", "chicago", "dallas"] },
  ],
  finance: [
    { name: "Goldman Sachs", metros: ["newYork", "dc", "dallas", "sanFrancisco"] },
    { name: "JPMorgan Chase", metros: ["newYork", "chicago", "dallas", "houston"] },
    { name: "Morgan Stanley", metros: ["newYork", "dc", "sanFrancisco"] },
    { name: "Bank of America", metros: ["charlotte", "newYork", "dc"] },
    { name: "Capital One", metros: ["dc", "dallas", "newYork"] },
    { name: "USAA", metros: ["sanAntonio", "phoenix", "tampa"] },
    { name: "American Express", metros: ["newYork", "phoenix", "sanFrancisco"] },
    { name: "Fidelity", metros: ["boston", "dallas", "dc"] },
  ],
  healthcare: [
    { name: "UnitedHealth Group", metros: ["minneapolis", "dc", "atlanta"] },
    { name: "Johnson & Johnson", metros: ["newYork", "philadelphia", "sanFrancisco"] },
    { name: "Pfizer", metros: ["newYork", "boston", "sanDiego"] },
    { name: "CVS Health", metros: ["boston", "phoenix", "dc"] },
    { name: "Anthem", metros: ["atlanta", "dc", "chicago"] },
    { name: "HCA Healthcare", metros: ["houston", "dallas", "denver"] },
  ],
  energy: [
    { name: "ExxonMobil", metros: ["houston", "dallas"] },
    { name: "Chevron", metros: ["houston", "sanFrancisco"] },
    { name: "ConocoPhillips", metros: ["houston", "denver"] },
    { name: "Shell", metros: ["houston", "denver"] },
    { name: "BP", metros: ["houston", "denver", "chicago"] },
    { name: "NextEra Energy", metros: ["miami", "houston"] },
  ],
};

// Role titles by industry with salary ranges
const ROLES = {
  defense: [
    { title: "Program Manager", salaryMin: 120000, salaryMax: 180000 },
    { title: "Systems Engineer", salaryMin: 100000, salaryMax: 150000 },
    { title: "Project Manager", salaryMin: 95000, salaryMax: 140000 },
    { title: "Operations Manager", salaryMin: 90000, salaryMax: 135000 },
    { title: "Business Development Manager", salaryMin: 110000, salaryMax: 170000 },
    { title: "Cybersecurity Analyst", salaryMin: 95000, salaryMax: 145000 },
    { title: "Intelligence Analyst", salaryMin: 85000, salaryMax: 130000 },
    { title: "Logistics Manager", salaryMin: 80000, salaryMax: 120000 },
  ],
  tech: [
    { title: "Product Manager", salaryMin: 130000, salaryMax: 200000 },
    { title: "Software Engineer", salaryMin: 120000, salaryMax: 190000 },
    { title: "Technical Program Manager", salaryMin: 140000, salaryMax: 210000 },
    { title: "Solutions Architect", salaryMin: 150000, salaryMax: 220000 },
    { title: "DevOps Engineer", salaryMin: 125000, salaryMax: 180000 },
    { title: "Data Engineer", salaryMin: 130000, salaryMax: 195000 },
    { title: "Cloud Architect", salaryMin: 155000, salaryMax: 230000 },
    { title: "Engineering Manager", salaryMin: 170000, salaryMax: 250000 },
  ],
  consulting: [
    { title: "Senior Consultant", salaryMin: 120000, salaryMax: 170000 },
    { title: "Management Consultant", salaryMin: 140000, salaryMax: 200000 },
    { title: "Strategy Consultant", salaryMin: 150000, salaryMax: 220000 },
    { title: "Principal", salaryMin: 200000, salaryMax: 300000 },
    { title: "Associate Partner", salaryMin: 250000, salaryMax: 400000 },
  ],
  finance: [
    { title: "Financial Analyst", salaryMin: 90000, salaryMax: 140000 },
    { title: "Investment Banking Associate", salaryMin: 150000, salaryMax: 200000 },
    { title: "Portfolio Manager", salaryMin: 140000, salaryMax: 220000 },
    { title: "Risk Analyst", salaryMin: 100000, salaryMax: 160000 },
    { title: "Compliance Manager", salaryMin: 110000, salaryMax: 170000 },
    { title: "Wealth Manager", salaryMin: 120000, salaryMax: 200000 },
  ],
  healthcare: [
    { title: "Healthcare Operations Manager", salaryMin: 95000, salaryMax: 145000 },
    { title: "Clinical Project Manager", salaryMin: 100000, salaryMax: 150000 },
    { title: "Healthcare Consultant", salaryMin: 110000, salaryMax: 165000 },
    { title: "Medical Device Sales", salaryMin: 90000, salaryMax: 180000 },
    { title: "Regulatory Affairs Manager", salaryMin: 105000, salaryMax: 160000 },
  ],
  energy: [
    { title: "Operations Manager", salaryMin: 100000, salaryMax: 155000 },
    { title: "Project Engineer", salaryMin: 95000, salaryMax: 140000 },
    { title: "HSE Manager", salaryMin: 105000, salaryMax: 160000 },
    { title: "Supply Chain Manager", salaryMin: 95000, salaryMax: 145000 },
    { title: "Field Operations Manager", salaryMin: 90000, salaryMax: 140000 },
  ],
};

// Helper to add slight randomness to coordinates
function jitterCoord(coord: number, amount: number = 0.05): number {
  return coord + (Math.random() - 0.5) * amount;
}

// Helper to get random item from array
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get random salary in range
function randomSalary(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) / 1000) * 1000;
}

// Generate placements
function generatePlacements(): Placement[] {
  const placements: Placement[] = [];
  const industries = Object.keys(COMPANIES) as (keyof typeof COMPANIES)[];

  // Distribution: more placements in defense, tech, consulting
  const industryWeights = {
    defense: 50,
    tech: 45,
    consulting: 35,
    finance: 30,
    healthcare: 20,
    energy: 20,
  };

  let id = 1;

  for (const industry of industries) {
    const count = industryWeights[industry];
    const companies = COMPANIES[industry];
    const roles = ROLES[industry];

    for (let i = 0; i < count; i++) {
      const company = randomItem(companies);
      const metroKey = randomItem(company.metros) as keyof typeof METRO_AREAS;
      const metro = METRO_AREAS[metroKey];

      if (!metro) continue;

      const role = randomItem(roles);
      const salary = randomSalary(role.salaryMin, role.salaryMax);

      // Random date in last 2 years
      const daysAgo = Math.floor(Math.random() * 730);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      placements.push({
        id: `p-${id++}`,
        type: "placement",
        company: company.name,
        title: role.title,
        industry,
        salary,
        city: metro.city,
        state: metro.state,
        lat: jitterCoord(metro.lat),
        lng: jitterCoord(metro.lng),
        date: date.toISOString().split("T")[0],
      });
    }
  }

  return placements;
}

// Generate current job openings
function generateOpenings(): Placement[] {
  const openings: Placement[] = [];
  const industries = Object.keys(COMPANIES) as (keyof typeof COMPANIES)[];

  // Distribution for openings
  const industryOpenings = {
    defense: 8,
    tech: 10,
    consulting: 5,
    finance: 4,
    healthcare: 2,
    energy: 1,
  };

  let id = 1;

  for (const industry of industries) {
    const count = industryOpenings[industry];
    const companies = COMPANIES[industry];
    const roles = ROLES[industry];

    for (let i = 0; i < count; i++) {
      const company = randomItem(companies);
      const metroKey = randomItem(company.metros) as keyof typeof METRO_AREAS;
      const metro = METRO_AREAS[metroKey];

      if (!metro) continue;

      const role = randomItem(roles);
      const salary = randomSalary(role.salaryMin, role.salaryMax);

      openings.push({
        id: `o-${id++}`,
        type: "opening",
        company: company.name,
        title: role.title,
        industry,
        salary,
        city: metro.city,
        state: metro.state,
        lat: jitterCoord(metro.lat),
        lng: jitterCoord(metro.lng),
        date: new Date().toISOString().split("T")[0],
      });
    }
  }

  return openings;
}

// Pre-generate the data
export const PLACEMENTS = generatePlacements();
export const OPENINGS = generateOpenings();
export const ALL_DATA = [...PLACEMENTS, ...OPENINGS];

// Industry display names and colors
export const INDUSTRY_INFO: Record<string, { name: string; color: string }> = {
  defense: { name: "Defense & Aerospace", color: "#1e3a5f" },
  tech: { name: "Technology", color: "#0ea5e9" },
  consulting: { name: "Consulting", color: "#8b5cf6" },
  finance: { name: "Finance", color: "#10b981" },
  healthcare: { name: "Healthcare", color: "#f43f5e" },
  energy: { name: "Energy", color: "#f97316" },
};

// Helper to get aggregated stats for a region
export function getRegionStats(data: Placement[]) {
  const byIndustry: Record<string, { count: number; totalSalary: number }> = {};

  for (const item of data) {
    if (!byIndustry[item.industry]) {
      byIndustry[item.industry] = { count: 0, totalSalary: 0 };
    }
    byIndustry[item.industry].count++;
    byIndustry[item.industry].totalSalary += item.salary;
  }

  const total = data.length;
  const stats = Object.entries(byIndustry).map(([industry, { count, totalSalary }]) => ({
    industry,
    name: INDUSTRY_INFO[industry]?.name || industry,
    color: INDUSTRY_INFO[industry]?.color || "#666",
    count,
    percent: Math.round((count / total) * 100),
    avgSalary: Math.round(totalSalary / count),
  }));

  return stats.sort((a, b) => b.count - a.count);
}
