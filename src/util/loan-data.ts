// Student Loan Cap Constants from Big Beautiful Bill (Section 81001)
export const LOAN_CAP_CONSTANTS = {
  // Graduate (non-professional) limits
  GRADUATE_ANNUAL: 20500,
  GRADUATE_AGGREGATE: 100000,

  // Professional student limits (MD, JD, etc.)
  PROFESSIONAL_ANNUAL: 50000,
  PROFESSIONAL_AGGREGATE: 200000,

  // Parent PLUS limits
  PARENT_ANNUAL: 20000,
  PARENT_AGGREGATE: 65000,

  // Overall lifetime maximum (all federal student loans)
  LIFETIME_MAX: 257500,

  // Effective date for new limits
  EFFECTIVE_DATE: "2026-07-01",

  // Interim exception period for students enrolled before effective date
  INTERIM_EXCEPTION_YEARS: 3,
} as const;

// Student type options for dropdown
export const studentTypes = [
  { value: "graduate", label: "Graduate (Masters, PhD)" },
  { value: "professional", label: "Professional (MD, JD, DDS, PharmD, etc.)" },
] as const;

// Program presets for quick selection
// Base annual costs reflect public in-state tuition (2025 data)
// School type multiplier adjusts for out-of-state and private schools
export const programPresets = [
  {
    id: "masters",
    label: "Master's Degree",
    studentType: "graduate" as const,
    years: 2,
    annualCost: 22000, // Public in-state avg ~$22k/yr
  },
  {
    id: "phd",
    label: "PhD Program",
    studentType: "graduate" as const,
    years: 5,
    annualCost: 0, // Most PhDs are fully funded
    isFunded: true,
    fundedNote: "Most PhD programs are fully funded with tuition waiver + stipend",
  },
  {
    id: "phd-unfunded",
    label: "PhD (Unfunded)",
    studentType: "graduate" as const,
    years: 5,
    annualCost: 30000, // For rare unfunded programs
  },
  {
    id: "law",
    label: "Law School (JD)",
    studentType: "professional" as const,
    years: 3,
    annualCost: 31000, // Public in-state avg ~$31k/yr
  },
  {
    id: "medical",
    label: "Medical School (MD/DO)",
    studentType: "professional" as const,
    years: 4,
    annualCost: 42000, // Public in-state avg ~$42k/yr
  },
  {
    id: "dental",
    label: "Dental School (DDS/DMD)",
    studentType: "professional" as const,
    years: 4,
    annualCost: 42000, // Public in-state avg ~$42k/yr
  },
  {
    id: "pharmacy",
    label: "Pharmacy School (PharmD)",
    studentType: "professional" as const,
    years: 4,
    annualCost: 30000, // Public in-state avg ~$30k/yr
  },
] as const;

// School type options with cost multipliers
// Base costs are set for public in-state; multipliers adjust for other types
export const schoolTypes = [
  { value: "public-in-state", label: "Public (In-State)", multiplier: 1.0 },
  { value: "public-out-of-state", label: "Public (Out-of-State)", multiplier: 1.5 },
  { value: "private", label: "Private", multiplier: 1.8 },
] as const;

export type SchoolType = (typeof schoolTypes)[number]["value"];

// Enrollment status options
export const enrollmentStatuses = [
  { value: 100, label: "Full-time (100%)" },
  { value: 75, label: "Three-quarter time (75%)" },
  { value: 50, label: "Half-time (50%)" },
] as const;

// Types
export type StudentType = "graduate" | "professional";

export interface LoanScenarioData {
  scenario: string;
  loanCapacity: number;
  programCost: number;
  fundingGap: number;
}

export interface YearBreakdown {
  year: number;
  annualCost: number;
  maxBorrowing: number;
  cumulativeBorrowed: number;
  remainingCapacity: number;
  annualGap: number;
}

export interface CalculationResult {
  totalProgramCost: number;
  totalBorrowingCapacity: number;
  fundingGap: number;
  annualLimit: number;
  aggregateLimit: number;
  yearBreakdown: YearBreakdown[];
  comparisonData: LoanScenarioData[];
}
