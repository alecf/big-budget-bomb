import type {
  CalculationResult,
  LoanScenarioData,
  StudentType,
  YearBreakdown,
} from "./loan-data";
import { LOAN_CAP_CONSTANTS } from "./loan-data";

/**
 * Get the annual borrowing limit based on student type and enrollment percentage
 */
export const getAnnualLimit = (
  studentType: StudentType,
  enrollmentPercentage: number = 100,
): number => {
  const baseLimit =
    studentType === "professional"
      ? LOAN_CAP_CONSTANTS.PROFESSIONAL_ANNUAL
      : LOAN_CAP_CONSTANTS.GRADUATE_ANNUAL;

  // Pro-rate for part-time enrollment
  return Math.round(baseLimit * (enrollmentPercentage / 100));
};

/**
 * Get the aggregate (total) borrowing limit based on student type and existing loans
 * Takes into account both the program-specific aggregate and lifetime maximum
 */
export const getAggregateLimit = (
  studentType: StudentType,
  existingLoans: number = 0,
): number => {
  const baseLimit =
    studentType === "professional"
      ? LOAN_CAP_CONSTANTS.PROFESSIONAL_AGGREGATE
      : LOAN_CAP_CONSTANTS.GRADUATE_AGGREGATE;

  // Check lifetime limit constraint
  const lifetimeRemaining = LOAN_CAP_CONSTANTS.LIFETIME_MAX - existingLoans;

  // Return the smaller of base limit or remaining lifetime capacity
  return Math.max(0, Math.min(baseLimit, lifetimeRemaining));
};

/**
 * Check if student is eligible for interim exception (enrolled before July 1, 2026)
 */
export const isInterimExceptionEligible = (enrollmentYear: number): boolean => {
  // Students enrolled before Fall 2026 are eligible
  return enrollmentYear < 2026;
};

/**
 * Generate year-by-year breakdown of borrowing capacity
 */
export const generateYearByYearBreakdown = (
  studentType: StudentType,
  programLengthYears: number,
  annualCost: number,
  existingLoans: number,
  enrollmentPercentage: number = 100,
): YearBreakdown[] => {
  const annualLimit = getAnnualLimit(studentType, enrollmentPercentage);
  const aggregateLimit = getAggregateLimit(studentType, existingLoans);

  const breakdown: YearBreakdown[] = [];
  let cumulativeBorrowed = 0;

  for (let year = 1; year <= programLengthYears; year++) {
    const remainingCapacity = aggregateLimit - cumulativeBorrowed;
    const maxThisYear = Math.min(annualLimit, remainingCapacity);
    const annualGap = Math.max(0, annualCost - maxThisYear);

    cumulativeBorrowed += maxThisYear;

    breakdown.push({
      year,
      annualCost,
      maxBorrowing: maxThisYear,
      cumulativeBorrowed,
      remainingCapacity: aggregateLimit - cumulativeBorrowed,
      annualGap,
    });
  }

  return breakdown;
};

/**
 * Generate comparison data between new BBB limits and old system
 */
export const generateComparisonData = (
  studentType: StudentType,
  programLengthYears: number,
  annualCost: number,
  existingLoans: number,
): LoanScenarioData[] => {
  const totalCost = programLengthYears * annualCost;
  const newLimitCapacity = getAggregateLimit(studentType, existingLoans);
  const actualBorrowable = Math.min(newLimitCapacity, totalCost);

  return [
    {
      scenario: "New BBB Limits",
      loanCapacity: actualBorrowable,
      programCost: totalCost,
      fundingGap: Math.max(0, totalCost - newLimitCapacity),
    },
    {
      scenario: "Old System (Unlimited)",
      loanCapacity: totalCost, // Could borrow full cost via Grad PLUS
      programCost: totalCost,
      fundingGap: 0,
    },
  ];
};

/**
 * Calculate all loan metrics for the calculator
 */
export const calculateLoanMetrics = (
  studentType: StudentType,
  programLengthYears: number,
  annualCost: number,
  existingLoans: number,
  enrollmentPercentage: number = 100,
): CalculationResult => {
  const totalProgramCost = programLengthYears * annualCost;
  const annualLimit = getAnnualLimit(studentType, enrollmentPercentage);
  const aggregateLimit = getAggregateLimit(studentType, existingLoans);

  // Calculate what can actually be borrowed over the program
  const yearBreakdown = generateYearByYearBreakdown(
    studentType,
    programLengthYears,
    annualCost,
    existingLoans,
    enrollmentPercentage,
  );

  const totalBorrowingCapacity =
    yearBreakdown.length > 0
      ? yearBreakdown[yearBreakdown.length - 1].cumulativeBorrowed
      : 0;

  const fundingGap = Math.max(0, totalProgramCost - totalBorrowingCapacity);

  const comparisonData = generateComparisonData(
    studentType,
    programLengthYears,
    annualCost,
    existingLoans,
  );

  return {
    totalProgramCost,
    totalBorrowingCapacity,
    fundingGap,
    annualLimit,
    aggregateLimit,
    yearBreakdown,
    comparisonData,
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get the limit type label for display
 */
export const getLimitLabel = (studentType: StudentType): string => {
  return studentType === "professional"
    ? "Professional Student"
    : "Graduate Student";
};
