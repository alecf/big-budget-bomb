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
export const programPresets = [
  {
    id: "masters",
    label: "Master's Degree",
    studentType: "graduate" as const,
    years: 2,
    annualCost: 40000,
  },
  {
    id: "phd",
    label: "PhD Program",
    studentType: "graduate" as const,
    years: 5,
    annualCost: 35000,
  },
  {
    id: "law",
    label: "Law School (JD)",
    studentType: "professional" as const,
    years: 3,
    annualCost: 60000,
  },
  {
    id: "medical",
    label: "Medical School (MD/DO)",
    studentType: "professional" as const,
    years: 4,
    annualCost: 75000,
  },
  {
    id: "dental",
    label: "Dental School (DDS/DMD)",
    studentType: "professional" as const,
    years: 4,
    annualCost: 70000,
  },
  {
    id: "pharmacy",
    label: "Pharmacy School (PharmD)",
    studentType: "professional" as const,
    years: 4,
    annualCost: 45000,
  },
] as const;

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
