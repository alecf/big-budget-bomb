import type { FilingStatus, SaltScenarioData, StateName } from "./tax-data";
import {
  federalTaxBrackets,
  statesTaxInfo,
  stateTaxBrackets,
} from "./tax-data";

/**
 * Calculate federal tax based on income and filing status using progressive tax brackets
 */
export const calculateFederalTax = (
  income: number,
  status: FilingStatus,
): number => {
  const brackets = federalTaxBrackets[status];
  let totalTax = 0;

  for (const bracket of brackets) {
    if (income <= bracket.min) break;

    const taxableInThisBracket = Math.min(income, bracket.max) - bracket.min;
    totalTax += taxableInThisBracket * bracket.rate;
  }

  return totalTax;
};

/**
 * Calculate state tax using progressive brackets when available
 */
const calculateStateTaxWithBrackets = (
  income: number,
  state: StateName,
  status: FilingStatus,
): number => {
  const stateBrackets =
    stateTaxBrackets[state as keyof typeof stateTaxBrackets];
  if (!stateBrackets) return 0;

  // Map filing status to state bracket system (some states may not have all filing statuses)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let brackets: any = stateBrackets.single; // Default fallback

  // For now, most states only have single and marriedJointly brackets
  // Use marriedJointly for married filing jointly, otherwise default to single
  if (
    status === "marriedJointly" &&
    "marriedJointly" in stateBrackets &&
    stateBrackets.marriedJointly
  ) {
    brackets = stateBrackets.marriedJointly;
  }

  let totalTax = 0;

  for (const bracket of brackets) {
    if (income <= bracket.min) break;

    const taxableInThisBracket = Math.min(income, bracket.max) - bracket.min;
    totalTax += taxableInThisBracket * bracket.rate;
  }

  return totalTax;
};

/**
 * Estimate state tax based on income and state
 * Uses progressive brackets when available, falls back to simplified calculation
 */
export const estimateStateTax = (
  income: number,
  state: StateName,
  filingStatus: FilingStatus = "single",
): number => {
  const stateInfo = statesTaxInfo[state];
  if (!stateInfo || !stateInfo.hasStateTax) return 0;

  // Use actual brackets if available
  if ("hasBrackets" in stateInfo && stateInfo.hasBrackets) {
    return calculateStateTaxWithBrackets(income, state, filingStatus);
  }

  // Fall back to simplified calculation using effective rate
  return income * stateInfo.rate * 0.8; // Assume 80% effective rate
};

/**
 * Calculate tax savings from SALT deduction
 */
export const calculateSaltTaxSavings = (
  saltDeduction: number,
  marginalTaxRate: number = 0.22,
): number => {
  return saltDeduction * marginalTaxRate;
};

/**
 * Calculate total tax burden with SALT deduction applied
 */
export const calculateTotalTaxWithSalt = (
  federalTax: number,
  stateTax: number,
  saltDeduction: number,
  marginalTaxRate: number = 0.22,
): number => {
  const taxSavings = calculateSaltTaxSavings(saltDeduction, marginalTaxRate);
  return federalTax + stateTax - taxSavings;
};

/**
 * Generate chart data comparing different SALT cap scenarios
 */
export const generateSaltComparisonData = (
  federalTax: number,
  stateTax: number,
  marginalTaxRate: number = 0.22,
): SaltScenarioData[] => {
  // Calculate SALT deductions for each scenario
  const noCapDeduction = stateTax;
  const cap10kDeduction = Math.min(stateTax, 10000);
  const cap40kDeduction = Math.min(stateTax, 40000);

  // Calculate total tax for each scenario
  const noCapTotal = calculateTotalTaxWithSalt(
    federalTax,
    stateTax,
    noCapDeduction,
    marginalTaxRate,
  );
  const cap10kTotal = calculateTotalTaxWithSalt(
    federalTax,
    stateTax,
    cap10kDeduction,
    marginalTaxRate,
  );
  const cap40kTotal = calculateTotalTaxWithSalt(
    federalTax,
    stateTax,
    cap40kDeduction,
    marginalTaxRate,
  );

  return [
    {
      scenario: "No Cap",
      totalTax: Math.round(noCapTotal),
      saltDeduction: Math.round(noCapDeduction),
      taxSavings: Math.round(
        calculateSaltTaxSavings(noCapDeduction, marginalTaxRate),
      ),
    },
    {
      scenario: "Current ($10k Cap)",
      totalTax: Math.round(cap10kTotal),
      saltDeduction: Math.round(cap10kDeduction),
      taxSavings: Math.round(
        calculateSaltTaxSavings(cap10kDeduction, marginalTaxRate),
      ),
    },
    {
      scenario: "Proposed ($40k Cap)",
      totalTax: Math.round(cap40kTotal),
      saltDeduction: Math.round(cap40kDeduction),
      taxSavings: Math.round(
        calculateSaltTaxSavings(cap40kDeduction, marginalTaxRate),
      ),
    },
  ];
};

/**
 * Get the estimated marginal tax rate for a given income and filing status
 * This is a simplified calculation for SALT deduction benefit estimation
 */
export const getEstimatedMarginalTaxRate = (
  income: number,
  status: FilingStatus,
): number => {
  const brackets = federalTaxBrackets[status];

  for (const bracket of brackets) {
    if (income > bracket.min && income <= bracket.max) {
      return bracket.rate;
    }
  }

  // Default to 22% if we can't determine (this is a reasonable middle-class rate)
  return 0.22;
};
