import type {
  FilingStatus,
  SaltScenarioData,
  StateName,
  StateTaxResult,
} from "./tax-data";
import {
  federalTaxBrackets,
  getPhasedownThreshold,
  isAbovePhasedownThreshold,
  SALT_CAP_CONSTANTS,
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
 * Returns both the tax amount and whether it's an estimate
 */
export const estimateStateTax = (
  income: number,
  state: StateName,
  filingStatus: FilingStatus = "single",
): StateTaxResult => {
  const stateInfo = statesTaxInfo[state];
  if (!stateInfo || !stateInfo.hasStateTax) {
    return { amount: 0, isEstimate: false };
  }

  // Use actual brackets if available
  if ("hasBrackets" in stateInfo && stateInfo.hasBrackets) {
    const amount = calculateStateTaxWithBrackets(income, state, filingStatus);
    return { amount, isEstimate: false };
  }

  // Fall back to simplified calculation using effective rate
  const amount =
    income *
    stateInfo.rate *
    SALT_CAP_CONSTANTS.STATE_TAX_EFFECTIVE_RATE_MULTIPLIER;
  return { amount, isEstimate: true };
};

/**
 * Calculate tax savings from SALT deduction
 */
export const calculateSaltTaxSavings = (
  saltDeduction: number,
  marginalTaxRate: number = SALT_CAP_CONSTANTS.DEFAULT_MARGINAL_TAX_RATE,
): number => {
  return saltDeduction * marginalTaxRate;
};

/**
 * Calculate total tax with SALT deduction applied
 */
export const calculateTotalTaxWithSalt = (
  federalTax: number,
  stateTax: number,
  saltDeduction: number,
  marginalTaxRate: number = SALT_CAP_CONSTANTS.DEFAULT_MARGINAL_TAX_RATE,
): number => {
  const taxSavings = calculateSaltTaxSavings(saltDeduction, marginalTaxRate);
  return federalTax + stateTax - taxSavings;
};

/**
 * Calculate the effective SALT cap under the BBB with phasedown
 * Based on bill text: 30% reduction for income over $500k threshold, minimum $10k
 */
export const calculateProposedSaltCap = (
  agi: number,
  filingStatus: FilingStatus,
): number => {
  const threshold = getPhasedownThreshold(filingStatus);

  if (!isAbovePhasedownThreshold(agi, filingStatus)) {
    return SALT_CAP_CONSTANTS.BBB_BASE_CAP; // No phasedown
  }

  // Calculate phasedown reduction
  const excess = agi - threshold;
  const reduction = excess * SALT_CAP_CONSTANTS.PHASEDOWN_RATE;
  const effectiveCap = SALT_CAP_CONSTANTS.BBB_BASE_CAP - reduction;

  // Cannot go below current cap
  return Math.max(effectiveCap, SALT_CAP_CONSTANTS.CURRENT_CAP);
};

/**
 * Generate chart data comparing different SALT cap scenarios
 */
export const generateSaltComparisonData = (
  federalTax: number,
  stateTax: number,
  marginalTaxRate: number = SALT_CAP_CONSTANTS.DEFAULT_MARGINAL_TAX_RATE,
  agi: number = 0,
  filingStatus: FilingStatus = "single",
): SaltScenarioData[] => {
  // Calculate SALT deductions for each scenario
  const noCapDeduction = stateTax;
  const currentCapDeduction = Math.min(
    stateTax,
    SALT_CAP_CONSTANTS.CURRENT_CAP,
  );

  // Calculate the effective new law cap with phasedown
  const newLawCap = calculateProposedSaltCap(agi, filingStatus);
  const newLawCapDeduction = Math.min(stateTax, newLawCap);

  // Calculate total tax for each scenario
  const noCapTotal = calculateTotalTaxWithSalt(
    federalTax,
    stateTax,
    noCapDeduction,
    marginalTaxRate,
  );
  const currentCapTotal = calculateTotalTaxWithSalt(
    federalTax,
    stateTax,
    currentCapDeduction,
    marginalTaxRate,
  );
  const newLawCapTotal = calculateTotalTaxWithSalt(
    federalTax,
    stateTax,
    newLawCapDeduction,
    marginalTaxRate,
  );

  // Create scenario label that shows effective cap amount
  const bbbScenarioLabel =
    newLawCap === SALT_CAP_CONSTANTS.BBB_BASE_CAP
      ? "BBB ($40k Cap)"
      : newLawCap === SALT_CAP_CONSTANTS.CURRENT_CAP
      ? "BBB ($10k Cap - Phased Out)"
      : `BBB ($${Math.round(newLawCap / 1000)}k Cap)`;

  return [
    {
      scenario: "Current ($10k Cap)",
      totalTax: Math.round(currentCapTotal),
      saltDeduction: Math.round(currentCapDeduction),
      taxSavings: Math.round(
        calculateSaltTaxSavings(currentCapDeduction, marginalTaxRate),
      ),
    },
    {
      scenario: bbbScenarioLabel,
      totalTax: Math.round(newLawCapTotal),
      saltDeduction: Math.round(newLawCapDeduction),
      taxSavings: Math.round(
        calculateSaltTaxSavings(newLawCapDeduction, marginalTaxRate),
      ),
    },
    {
      scenario: "No Cap",
      totalTax: Math.round(noCapTotal),
      saltDeduction: Math.round(noCapDeduction),
      taxSavings: Math.round(
        calculateSaltTaxSavings(noCapDeduction, marginalTaxRate),
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

  // Default to the constant if we can't determine
  return SALT_CAP_CONSTANTS.DEFAULT_MARGINAL_TAX_RATE;
};
