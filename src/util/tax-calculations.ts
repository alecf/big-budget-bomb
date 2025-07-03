import type { FilingStatus, SaltScenarioData, StateName } from "./tax-data";
import { federalTaxBrackets, statesTaxInfo } from "./tax-data";

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
 * Estimate state tax based on income and state
 * This is a simplified calculation using effective rates
 */
export const estimateStateTax = (income: number, state: StateName): number => {
  const stateInfo = statesTaxInfo[state];
  if (!stateInfo || !stateInfo.hasStateTax) return 0;

  // Simplified calculation - in reality this would need brackets too
  // This is a rough estimate using effective rate
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
