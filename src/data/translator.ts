/**
 * Defense to Corporate Translator Data
 *
 * Maps military staff functions (G/J/A/N/S designations) to corporate equivalents.
 * Helps veterans understand how their military experience translates to civilian roles.
 *
 * Staff Section Designations by Branch:
 * - G = Army (Division/Corps level)
 * - J = Joint (Joint Commands, multi-service)
 * - A = Air Force
 * - N = Navy
 * - S = Marines (Battalion/Regiment level, also used by Army at lower echelons)
 */

// Branch information
export const BRANCHES = {
  army: { name: "Army", prefix: "G", description: "Division, Corps, and higher echelons" },
  joint: { name: "Joint", prefix: "J", description: "Joint Commands, Combatant Commands" },
  airforce: { name: "Air Force", prefix: "A", description: "Wing, MAJCOM, and higher" },
  navy: { name: "Navy", prefix: "N", description: "Fleet, Type Command, and higher" },
  marines: { name: "Marines", prefix: "S", description: "Battalion, Regiment, and MEF" },
} as const;

export type BranchKey = keyof typeof BRANCHES;

// Staff section functional areas
export interface StaffSection {
  number: number;
  name: string;
  militaryDescription: string;
  corporateEquivalents: CorporateRole[];
  keySkills: string[];
  typicalMilitaryTitles: string[];
  industryFit: string[];
}

export interface CorporateRole {
  title: string;
  level: "entry" | "mid" | "senior" | "executive";
  description: string;
  salaryRange: { min: number; max: number };
  demandLevel: "high" | "medium" | "low";
}

export interface CareerPath {
  id: string;
  name: string;
  description: string;
  militaryBackground: string;
  steps: CareerStep[];
  timelineYears: number;
  potentialSalary: number;
}

export interface CareerStep {
  year: number;
  title: string;
  description: string;
  skills: string[];
}

// Staff section mappings (universal across branches)
export const STAFF_SECTIONS: StaffSection[] = [
  {
    number: 1,
    name: "Personnel / Manpower",
    militaryDescription: "Manages personnel readiness, assignments, promotions, awards, and human resources administration. Oversees manning levels, casualty reporting, and personnel services.",
    corporateEquivalents: [
      {
        title: "HR Coordinator",
        level: "entry",
        description: "Handles employee onboarding, benefits administration, and HR operations",
        salaryRange: { min: 45000, max: 60000 },
        demandLevel: "high",
      },
      {
        title: "HR Business Partner",
        level: "mid",
        description: "Partners with business units on talent strategy, employee relations, and organizational development",
        salaryRange: { min: 70000, max: 100000 },
        demandLevel: "high",
      },
      {
        title: "People Operations Manager",
        level: "mid",
        description: "Leads HR operations, HRIS management, and process improvement",
        salaryRange: { min: 80000, max: 120000 },
        demandLevel: "high",
      },
      {
        title: "Director of Human Resources",
        level: "senior",
        description: "Oversees HR strategy, compliance, and organizational development",
        salaryRange: { min: 120000, max: 180000 },
        demandLevel: "medium",
      },
      {
        title: "Chief Human Resources Officer (CHRO)",
        level: "executive",
        description: "Executive leadership of all people functions, talent strategy, and culture",
        salaryRange: { min: 200000, max: 400000 },
        demandLevel: "low",
      },
    ],
    keySkills: [
      "Talent acquisition and retention",
      "Performance management",
      "Employee relations",
      "HRIS systems (Workday, SAP)",
      "Compliance and policy",
      "Workforce planning",
      "Change management",
    ],
    typicalMilitaryTitles: [
      "Personnel Officer (S-1/G-1)",
      "Human Resources Specialist",
      "Personnel NCO",
      "Adjutant",
      "Admin Chief",
    ],
    industryFit: ["Tech", "Healthcare", "Finance", "Consulting", "Government Contractors"],
  },
  {
    number: 2,
    name: "Intelligence / Security",
    militaryDescription: "Collects, analyzes, and disseminates intelligence. Manages security clearances, counterintelligence, and threat assessments. Provides situational awareness to commanders.",
    corporateEquivalents: [
      {
        title: "Security Analyst",
        level: "entry",
        description: "Monitors security systems, investigates incidents, and maintains compliance",
        salaryRange: { min: 55000, max: 75000 },
        demandLevel: "high",
      },
      {
        title: "Competitive Intelligence Analyst",
        level: "mid",
        description: "Researches competitors, market trends, and provides strategic insights",
        salaryRange: { min: 70000, max: 100000 },
        demandLevel: "medium",
      },
      {
        title: "Cybersecurity Analyst",
        level: "mid",
        description: "Protects digital assets, conducts threat analysis, and implements security measures",
        salaryRange: { min: 80000, max: 130000 },
        demandLevel: "high",
      },
      {
        title: "Director of Security",
        level: "senior",
        description: "Leads physical and information security programs, risk management",
        salaryRange: { min: 130000, max: 200000 },
        demandLevel: "medium",
      },
      {
        title: "Chief Information Security Officer (CISO)",
        level: "executive",
        description: "Executive responsibility for enterprise security strategy and risk",
        salaryRange: { min: 200000, max: 450000 },
        demandLevel: "medium",
      },
    ],
    keySkills: [
      "Threat analysis and assessment",
      "Security clearance management",
      "Risk analysis",
      "Data analytics",
      "Report writing and briefing",
      "OSINT and research",
      "Cybersecurity frameworks",
    ],
    typicalMilitaryTitles: [
      "Intelligence Officer (S-2/G-2)",
      "Intelligence Analyst",
      "Counterintelligence Agent",
      "All-Source Analyst",
      "SIGINT Specialist",
    ],
    industryFit: ["Defense Contractors", "Tech", "Finance", "Consulting", "Government"],
  },
  {
    number: 3,
    name: "Operations / Training",
    militaryDescription: "Plans and executes operations. Manages training programs, exercises, and readiness. Coordinates battle rhythm, orders production, and operational planning.",
    corporateEquivalents: [
      {
        title: "Operations Coordinator",
        level: "entry",
        description: "Supports daily operations, scheduling, and coordination",
        salaryRange: { min: 45000, max: 65000 },
        demandLevel: "high",
      },
      {
        title: "Program Manager",
        level: "mid",
        description: "Manages complex programs, timelines, budgets, and cross-functional teams",
        salaryRange: { min: 90000, max: 140000 },
        demandLevel: "high",
      },
      {
        title: "Operations Manager",
        level: "mid",
        description: "Oversees operational processes, efficiency, and team performance",
        salaryRange: { min: 80000, max: 120000 },
        demandLevel: "high",
      },
      {
        title: "Director of Operations",
        level: "senior",
        description: "Leads operational strategy, process improvement, and organizational efficiency",
        salaryRange: { min: 140000, max: 200000 },
        demandLevel: "medium",
      },
      {
        title: "Chief Operating Officer (COO)",
        level: "executive",
        description: "Executive leadership of all operations, often second-in-command",
        salaryRange: { min: 250000, max: 500000 },
        demandLevel: "low",
      },
    ],
    keySkills: [
      "Strategic planning",
      "Project/Program management",
      "Process improvement",
      "Cross-functional coordination",
      "Risk management",
      "Decision-making under pressure",
      "Resource allocation",
    ],
    typicalMilitaryTitles: [
      "Operations Officer (S-3/G-3)",
      "Battle Captain",
      "Plans Officer",
      "Training Officer",
      "Executive Officer",
    ],
    industryFit: ["Tech", "Consulting", "Manufacturing", "Logistics", "Healthcare"],
  },
  {
    number: 4,
    name: "Logistics / Supply Chain",
    militaryDescription: "Manages supply, maintenance, transportation, and services. Oversees equipment readiness, distribution, and sustainment operations.",
    corporateEquivalents: [
      {
        title: "Supply Chain Coordinator",
        level: "entry",
        description: "Coordinates procurement, inventory, and distribution activities",
        salaryRange: { min: 45000, max: 60000 },
        demandLevel: "high",
      },
      {
        title: "Logistics Manager",
        level: "mid",
        description: "Manages warehousing, transportation, and distribution operations",
        salaryRange: { min: 70000, max: 100000 },
        demandLevel: "high",
      },
      {
        title: "Supply Chain Manager",
        level: "mid",
        description: "Oversees end-to-end supply chain, vendor relationships, and optimization",
        salaryRange: { min: 85000, max: 130000 },
        demandLevel: "high",
      },
      {
        title: "Director of Supply Chain",
        level: "senior",
        description: "Leads supply chain strategy, global logistics, and procurement",
        salaryRange: { min: 140000, max: 200000 },
        demandLevel: "medium",
      },
      {
        title: "VP of Operations / Supply Chain",
        level: "executive",
        description: "Executive oversight of global supply chain and logistics operations",
        salaryRange: { min: 200000, max: 350000 },
        demandLevel: "low",
      },
    ],
    keySkills: [
      "Inventory management",
      "Vendor/contract management",
      "Distribution planning",
      "ERP systems (SAP, Oracle)",
      "Cost optimization",
      "Quality control",
      "Demand forecasting",
    ],
    typicalMilitaryTitles: [
      "Logistics Officer (S-4/G-4)",
      "Supply Officer",
      "Maintenance Officer",
      "Transportation Officer",
      "Property Book Officer",
    ],
    industryFit: ["Manufacturing", "Retail", "E-commerce", "Defense", "Healthcare"],
  },
  {
    number: 5,
    name: "Plans / Strategy",
    militaryDescription: "Develops long-range plans, policies, and strategies. Conducts future operations planning, exercises, and strategic assessments.",
    corporateEquivalents: [
      {
        title: "Business Analyst",
        level: "entry",
        description: "Analyzes business processes, data, and recommends improvements",
        salaryRange: { min: 55000, max: 75000 },
        demandLevel: "high",
      },
      {
        title: "Strategy Analyst",
        level: "mid",
        description: "Supports strategic initiatives, market analysis, and business planning",
        salaryRange: { min: 80000, max: 120000 },
        demandLevel: "medium",
      },
      {
        title: "Business Development Manager",
        level: "mid",
        description: "Identifies growth opportunities, partnerships, and new markets",
        salaryRange: { min: 90000, max: 140000 },
        demandLevel: "high",
      },
      {
        title: "Director of Strategy",
        level: "senior",
        description: "Leads corporate strategy development and strategic planning",
        salaryRange: { min: 150000, max: 220000 },
        demandLevel: "medium",
      },
      {
        title: "Chief Strategy Officer (CSO)",
        level: "executive",
        description: "Executive leadership of corporate strategy and long-term planning",
        salaryRange: { min: 220000, max: 400000 },
        demandLevel: "low",
      },
    ],
    keySkills: [
      "Strategic planning",
      "Market analysis",
      "Scenario planning",
      "Business case development",
      "Stakeholder management",
      "Data-driven decision making",
      "Presentation and communication",
    ],
    typicalMilitaryTitles: [
      "Plans Officer (S-5/G-5)",
      "Strategic Planner",
      "Future Operations Officer",
      "Policy Officer",
      "Civil-Military Operations Officer",
    ],
    industryFit: ["Consulting", "Tech", "Finance", "Healthcare", "Defense"],
  },
  {
    number: 6,
    name: "Communications / IT",
    militaryDescription: "Manages communications systems, networks, and information technology. Oversees cybersecurity, spectrum management, and digital infrastructure.",
    corporateEquivalents: [
      {
        title: "IT Support Specialist",
        level: "entry",
        description: "Provides technical support, troubleshooting, and system maintenance",
        salaryRange: { min: 45000, max: 65000 },
        demandLevel: "high",
      },
      {
        title: "Network Engineer",
        level: "mid",
        description: "Designs, implements, and maintains network infrastructure",
        salaryRange: { min: 75000, max: 110000 },
        demandLevel: "high",
      },
      {
        title: "IT Manager",
        level: "mid",
        description: "Manages IT operations, team, and technology projects",
        salaryRange: { min: 90000, max: 130000 },
        demandLevel: "high",
      },
      {
        title: "Director of IT / Infrastructure",
        level: "senior",
        description: "Leads IT strategy, infrastructure, and digital transformation",
        salaryRange: { min: 140000, max: 200000 },
        demandLevel: "medium",
      },
      {
        title: "Chief Technology Officer (CTO)",
        level: "executive",
        description: "Executive leadership of technology strategy and innovation",
        salaryRange: { min: 200000, max: 450000 },
        demandLevel: "medium",
      },
    ],
    keySkills: [
      "Network administration",
      "Systems engineering",
      "Cybersecurity",
      "Cloud platforms (AWS, Azure)",
      "IT service management",
      "Project management",
      "Vendor management",
    ],
    typicalMilitaryTitles: [
      "Signal Officer (S-6/G-6)",
      "Communications Officer",
      "Information Systems Officer",
      "Network Operations Chief",
      "Cyber Officer",
    ],
    industryFit: ["Tech", "Defense", "Finance", "Healthcare", "Consulting"],
  },
  {
    number: 7,
    name: "Training / Exercises",
    militaryDescription: "Develops and manages training programs, doctrine, and professional development. Oversees exercises, certifications, and readiness training.",
    corporateEquivalents: [
      {
        title: "Training Coordinator",
        level: "entry",
        description: "Coordinates training programs, schedules, and logistics",
        salaryRange: { min: 45000, max: 60000 },
        demandLevel: "medium",
      },
      {
        title: "Instructional Designer",
        level: "mid",
        description: "Designs learning programs, e-learning content, and curricula",
        salaryRange: { min: 65000, max: 95000 },
        demandLevel: "medium",
      },
      {
        title: "Learning & Development Manager",
        level: "mid",
        description: "Manages corporate training programs and employee development",
        salaryRange: { min: 85000, max: 120000 },
        demandLevel: "medium",
      },
      {
        title: "Director of Learning & Development",
        level: "senior",
        description: "Leads organizational learning strategy and talent development",
        salaryRange: { min: 130000, max: 180000 },
        demandLevel: "medium",
      },
      {
        title: "Chief Learning Officer (CLO)",
        level: "executive",
        description: "Executive leadership of organizational learning and development",
        salaryRange: { min: 180000, max: 300000 },
        demandLevel: "low",
      },
    ],
    keySkills: [
      "Curriculum development",
      "Adult learning theory",
      "LMS administration",
      "Performance assessment",
      "Facilitation",
      "Program evaluation",
      "Change management",
    ],
    typicalMilitaryTitles: [
      "Training Officer (S-7/G-7)",
      "Master Trainer",
      "Instructor",
      "Doctrine Developer",
      "Exercise Planner",
    ],
    industryFit: ["Tech", "Healthcare", "Finance", "Consulting", "Education"],
  },
  {
    number: 8,
    name: "Finance / Resource Management",
    militaryDescription: "Manages budgets, financial planning, and resource allocation. Oversees funding, cost analysis, and financial reporting.",
    corporateEquivalents: [
      {
        title: "Financial Analyst",
        level: "entry",
        description: "Analyzes financial data, builds models, and supports planning",
        salaryRange: { min: 55000, max: 75000 },
        demandLevel: "high",
      },
      {
        title: "Budget Manager",
        level: "mid",
        description: "Manages departmental budgets, forecasting, and variance analysis",
        salaryRange: { min: 75000, max: 110000 },
        demandLevel: "medium",
      },
      {
        title: "FP&A Manager",
        level: "mid",
        description: "Leads financial planning, analysis, and business partnering",
        salaryRange: { min: 100000, max: 150000 },
        demandLevel: "high",
      },
      {
        title: "Director of Finance",
        level: "senior",
        description: "Oversees financial operations, reporting, and strategic finance",
        salaryRange: { min: 150000, max: 220000 },
        demandLevel: "medium",
      },
      {
        title: "Chief Financial Officer (CFO)",
        level: "executive",
        description: "Executive leadership of all financial functions",
        salaryRange: { min: 250000, max: 500000 },
        demandLevel: "low",
      },
    ],
    keySkills: [
      "Financial modeling",
      "Budget management",
      "Cost analysis",
      "Excel/financial software",
      "Forecasting",
      "Variance analysis",
      "Strategic planning",
    ],
    typicalMilitaryTitles: [
      "Resource Manager (G-8)",
      "Comptroller",
      "Budget Officer",
      "Financial Management Officer",
      "Cost Analyst",
    ],
    industryFit: ["Finance", "Tech", "Consulting", "Healthcare", "Defense"],
  },
  {
    number: 9,
    name: "Civil Affairs / Analysis",
    militaryDescription: "Manages civil-military operations, public affairs, and external relations. Conducts operational analysis, studies, and assessments.",
    corporateEquivalents: [
      {
        title: "Public Relations Specialist",
        level: "entry",
        description: "Manages media relations, communications, and public image",
        salaryRange: { min: 45000, max: 65000 },
        demandLevel: "medium",
      },
      {
        title: "Government Relations Analyst",
        level: "mid",
        description: "Manages government relationships, policy analysis, and compliance",
        salaryRange: { min: 70000, max: 100000 },
        demandLevel: "medium",
      },
      {
        title: "Business Intelligence Analyst",
        level: "mid",
        description: "Analyzes data, creates dashboards, and provides business insights",
        salaryRange: { min: 75000, max: 110000 },
        demandLevel: "high",
      },
      {
        title: "Director of External Affairs",
        level: "senior",
        description: "Leads government relations, community engagement, and partnerships",
        salaryRange: { min: 130000, max: 190000 },
        demandLevel: "medium",
      },
      {
        title: "VP of Corporate Affairs",
        level: "executive",
        description: "Executive leadership of external relations and corporate communications",
        salaryRange: { min: 180000, max: 350000 },
        demandLevel: "low",
      },
    ],
    keySkills: [
      "Stakeholder engagement",
      "Data analysis and visualization",
      "Public speaking",
      "Report writing",
      "Policy analysis",
      "Research methods",
      "Cross-cultural communication",
    ],
    typicalMilitaryTitles: [
      "Civil Affairs Officer (G-9)",
      "Public Affairs Officer",
      "Operations Research Analyst",
      "Assessment Officer",
      "External Affairs Officer",
    ],
    industryFit: ["Government", "Defense", "Consulting", "Tech", "Non-profit"],
  },
];

// Example career paths for inspiration
export const CAREER_PATHS: CareerPath[] = [
  {
    id: "ops-to-pm",
    name: "Operations to Program Management",
    description: "Leverage operational planning experience into tech program management",
    militaryBackground: "S-3/G-3 Operations Officer",
    steps: [
      {
        year: 1,
        title: "Program Coordinator",
        description: "Entry role managing project schedules, documentation, and stakeholder communication",
        skills: ["Project coordination", "Documentation", "Stakeholder management"],
      },
      {
        year: 2,
        title: "Project Manager",
        description: "Own smaller projects end-to-end, manage timelines and budgets",
        skills: ["Budget management", "Risk mitigation", "Agile/Scrum"],
      },
      {
        year: 4,
        title: "Senior Program Manager",
        description: "Lead complex, cross-functional programs with multiple workstreams",
        skills: ["Strategic planning", "Executive communication", "Organizational change"],
      },
    ],
    timelineYears: 4,
    potentialSalary: 150000,
  },
  {
    id: "intel-to-cyber",
    name: "Intelligence to Cybersecurity",
    description: "Transition intelligence analysis skills to cybersecurity and threat intelligence",
    militaryBackground: "S-2/G-2 Intelligence Officer or Analyst",
    steps: [
      {
        year: 1,
        title: "Security Operations Analyst",
        description: "Monitor security systems, investigate alerts, and document incidents",
        skills: ["SIEM tools", "Incident response", "Threat analysis"],
      },
      {
        year: 2,
        title: "Threat Intelligence Analyst",
        description: "Analyze threat actors, TTPs, and provide actionable intelligence",
        skills: ["Threat modeling", "OSINT", "Report writing"],
      },
      {
        year: 4,
        title: "Cybersecurity Manager",
        description: "Lead security team, develop strategy, and manage security programs",
        skills: ["Team leadership", "Security architecture", "Risk management"],
      },
    ],
    timelineYears: 4,
    potentialSalary: 140000,
  },
  {
    id: "logistics-to-supply",
    name: "Logistics to Supply Chain Leadership",
    description: "Apply military logistics expertise to corporate supply chain management",
    militaryBackground: "S-4/G-4 Logistics Officer",
    steps: [
      {
        year: 1,
        title: "Supply Chain Analyst",
        description: "Analyze supply chain data, optimize inventory, support operations",
        skills: ["Data analysis", "Inventory management", "Process improvement"],
      },
      {
        year: 2,
        title: "Logistics Manager",
        description: "Manage distribution operations, vendor relationships, and team",
        skills: ["Vendor management", "Operations leadership", "Cost optimization"],
      },
      {
        year: 4,
        title: "Director of Supply Chain",
        description: "Lead global supply chain strategy, procurement, and logistics",
        skills: ["Strategic sourcing", "Global logistics", "Digital transformation"],
      },
    ],
    timelineYears: 4,
    potentialSalary: 160000,
  },
  {
    id: "hr-to-people-ops",
    name: "Personnel to People Operations",
    description: "Transition HR administration to modern people operations in tech",
    militaryBackground: "S-1/G-1 Personnel Officer",
    steps: [
      {
        year: 1,
        title: "HR Coordinator",
        description: "Support HR operations, onboarding, and employee services",
        skills: ["HRIS systems", "Employee relations", "Compliance"],
      },
      {
        year: 2,
        title: "HR Business Partner",
        description: "Partner with business units on talent strategy and employee experience",
        skills: ["Talent management", "Performance coaching", "Change management"],
      },
      {
        year: 4,
        title: "Director of People Operations",
        description: "Lead HR strategy, culture initiatives, and organizational development",
        skills: ["Strategic HR", "Culture building", "Executive partnership"],
      },
    ],
    timelineYears: 4,
    potentialSalary: 145000,
  },
  {
    id: "plans-to-strategy",
    name: "Plans to Corporate Strategy",
    description: "Apply strategic planning skills to corporate strategy and consulting",
    militaryBackground: "S-5/G-5 Plans Officer",
    steps: [
      {
        year: 1,
        title: "Strategy Analyst",
        description: "Support strategic initiatives, conduct research, and build analyses",
        skills: ["Market research", "Financial modeling", "Presentation skills"],
      },
      {
        year: 2,
        title: "Strategy Manager",
        description: "Lead strategic projects, M&A support, and business planning",
        skills: ["Project leadership", "Stakeholder management", "Business case development"],
      },
      {
        year: 4,
        title: "Director of Corporate Strategy",
        description: "Shape company direction, lead strategic planning, and advise executives",
        skills: ["Executive influence", "Long-range planning", "Portfolio strategy"],
      },
    ],
    timelineYears: 4,
    potentialSalary: 180000,
  },
];

/**
 * Get staff section by number
 */
export function getStaffSection(sectionNumber: number): StaffSection | undefined {
  return STAFF_SECTIONS.find((s) => s.number === sectionNumber);
}

/**
 * Get corporate roles by level
 */
export function getRolesByLevel(
  section: StaffSection,
  level: CorporateRole["level"]
): CorporateRole[] {
  return section.corporateEquivalents.filter((r) => r.level === level);
}

/**
 * Get all unique industries across sections
 */
export function getAllIndustries(): string[] {
  const industries = new Set<string>();
  STAFF_SECTIONS.forEach((section) => {
    section.industryFit.forEach((industry) => industries.add(industry));
  });
  return Array.from(industries).sort();
}

/**
 * Find sections that match a given industry
 */
export function getSectionsByIndustry(industry: string): StaffSection[] {
  return STAFF_SECTIONS.filter((section) =>
    section.industryFit.includes(industry)
  );
}

/**
 * Get the full designation (e.g., "G-3", "S-1")
 */
export function getDesignation(branch: BranchKey, sectionNumber: number): string {
  return `${BRANCHES[branch].prefix}-${sectionNumber}`;
}

/**
 * Parse a designation string into branch and section
 */
export function parseDesignation(designation: string): { branch: BranchKey; section: number } | null {
  const match = designation.match(/^([GJANS])-(\d)$/i);
  if (!match) return null;

  const prefix = match[1].toUpperCase();
  const section = parseInt(match[2], 10);

  const branchEntry = Object.entries(BRANCHES).find(
    ([, info]) => info.prefix === prefix
  );

  if (!branchEntry || section < 1 || section > 9) return null;

  return {
    branch: branchEntry[0] as BranchKey,
    section,
  };
}

/**
 * Calculate average salary for a section at a given level
 */
export function getAverageSalary(
  section: StaffSection,
  level: CorporateRole["level"]
): number {
  const roles = getRolesByLevel(section, level);
  if (roles.length === 0) return 0;

  const total = roles.reduce(
    (sum, role) => sum + (role.salaryRange.min + role.salaryRange.max) / 2,
    0
  );
  return Math.round(total / roles.length);
}
