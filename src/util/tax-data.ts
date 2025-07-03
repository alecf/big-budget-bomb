// SALT Deduction Constants
export const SALT_CAP_CONSTANTS = {
  CURRENT_CAP: 10000,
  PROPOSED_BASE_CAP: 40000,
  PHASEDOWN_RATE: 0.3, // 30% reduction
  PHASEDOWN_THRESHOLD_DEFAULT: 500000,
  PHASEDOWN_THRESHOLD_MARRIED_SEPARATELY: 250000,
  DEFAULT_MARGINAL_TAX_RATE: 0.22,
  STATE_TAX_EFFECTIVE_RATE_MULTIPLIER: 0.8, // 80% effective rate
} as const;

// Helper functions for filing status and threshold logic
export const getPhasedownThreshold = (filingStatus: string): number => {
  return filingStatus === "marriedSeparately"
    ? SALT_CAP_CONSTANTS.PHASEDOWN_THRESHOLD_MARRIED_SEPARATELY
    : SALT_CAP_CONSTANTS.PHASEDOWN_THRESHOLD_DEFAULT;
};

export const isAbovePhasedownThreshold = (
  agi: number,
  filingStatus: string,
): boolean => {
  return agi > getPhasedownThreshold(filingStatus);
};

export const isMarriedSeparately = (filingStatus: string): boolean => {
  return filingStatus === "marriedSeparately";
};

// Federal tax brackets for 2024 (can be easily updated)
export const federalTaxBrackets = {
  single: [
    { min: 0, max: 11000, rate: 0.1 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 },
  ],
  marriedJointly: [
    { min: 0, max: 22000, rate: 0.1 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 },
  ],
  marriedSeparately: [
    { min: 0, max: 11000, rate: 0.1 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182100, rate: 0.24 },
    { min: 182100, max: 231250, rate: 0.32 },
    { min: 231250, max: 346875, rate: 0.35 },
    { min: 346875, max: Infinity, rate: 0.37 },
  ],
  headOfHousehold: [
    { min: 0, max: 15700, rate: 0.1 },
    { min: 15700, max: 59850, rate: 0.12 },
    { min: 59850, max: 95350, rate: 0.22 },
    { min: 95350, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578100, rate: 0.35 },
    { min: 578100, max: Infinity, rate: 0.37 },
  ],
} as const;

// State tax brackets for 2025 (where available)
export const stateTaxBrackets = {
  California: {
    single: [
      { min: 0, max: 10099, rate: 0.01 },
      { min: 10099, max: 23942, rate: 0.02 },
      { min: 23942, max: 37788, rate: 0.04 },
      { min: 37788, max: 52455, rate: 0.06 },
      { min: 52455, max: 66295, rate: 0.08 },
      { min: 66295, max: 338639, rate: 0.093 },
      { min: 338639, max: 406364, rate: 0.103 },
      { min: 406364, max: 677278, rate: 0.113 },
      { min: 677278, max: Infinity, rate: 0.123 },
    ],
    marriedJointly: [
      { min: 0, max: 20198, rate: 0.01 },
      { min: 20198, max: 47884, rate: 0.02 },
      { min: 47884, max: 75576, rate: 0.04 },
      { min: 75576, max: 104910, rate: 0.06 },
      { min: 104910, max: 132590, rate: 0.08 },
      { min: 132590, max: 677278, rate: 0.093 },
      { min: 677278, max: 812728, rate: 0.103 },
      { min: 812728, max: 1354556, rate: 0.113 },
      { min: 1354556, max: Infinity, rate: 0.123 },
    ],
  },
  "New York": {
    single: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8500, max: 11700, rate: 0.045 },
      { min: 11700, max: 13900, rate: 0.0525 },
      { min: 13900, max: 80650, rate: 0.059 },
      { min: 80650, max: 215400, rate: 0.0645 },
      { min: 215400, max: 1077550, rate: 0.0685 },
      { min: 1077550, max: 5000000, rate: 0.0965 },
      { min: 5000000, max: 25000000, rate: 0.103 },
      { min: 25000000, max: Infinity, rate: 0.109 },
    ],
    marriedJointly: [
      { min: 0, max: 17150, rate: 0.04 },
      { min: 17150, max: 23600, rate: 0.045 },
      { min: 23600, max: 27900, rate: 0.0525 },
      { min: 27900, max: 161550, rate: 0.059 },
      { min: 161550, max: 323200, rate: 0.0645 },
      { min: 323200, max: 2155350, rate: 0.0685 },
      { min: 2155350, max: 5000000, rate: 0.0965 },
      { min: 5000000, max: 25000000, rate: 0.103 },
      { min: 25000000, max: Infinity, rate: 0.109 },
    ],
  },
  Minnesota: {
    single: [
      { min: 0, max: 29458, rate: 0.0535 },
      { min: 29458, max: 96770, rate: 0.068 },
      { min: 96770, max: 174020, rate: 0.0785 },
      { min: 174020, max: Infinity, rate: 0.0985 },
    ],
    marriedJointly: [
      { min: 0, max: 44690, rate: 0.0535 },
      { min: 44690, max: 177460, rate: 0.068 },
      { min: 177460, max: 284810, rate: 0.0785 },
      { min: 284810, max: Infinity, rate: 0.0985 },
    ],
  },
  Oregon: {
    single: [
      { min: 0, max: 4050, rate: 0.0475 },
      { min: 4050, max: 10200, rate: 0.0675 },
      { min: 10200, max: 25550, rate: 0.0875 },
      { min: 25550, max: 64000, rate: 0.099 },
      { min: 64000, max: Infinity, rate: 0.099 },
    ],
    marriedJointly: [
      { min: 0, max: 8100, rate: 0.0475 },
      { min: 8100, max: 20400, rate: 0.0675 },
      { min: 20400, max: 51100, rate: 0.0875 },
      { min: 51100, max: 128000, rate: 0.099 },
      { min: 128000, max: Infinity, rate: 0.099 },
    ],
  },
  Hawaii: {
    single: [
      { min: 0, max: 2400, rate: 0.014 },
      { min: 2400, max: 4800, rate: 0.032 },
      { min: 4800, max: 9600, rate: 0.055 },
      { min: 9600, max: 14400, rate: 0.064 },
      { min: 14400, max: 19200, rate: 0.068 },
      { min: 19200, max: 24000, rate: 0.072 },
      { min: 24000, max: 36000, rate: 0.076 },
      { min: 36000, max: 48000, rate: 0.079 },
      { min: 48000, max: 150000, rate: 0.0825 },
      { min: 150000, max: 175000, rate: 0.09 },
      { min: 175000, max: 200000, rate: 0.1 },
      { min: 200000, max: Infinity, rate: 0.11 },
    ],
    marriedJointly: [
      { min: 0, max: 4800, rate: 0.014 },
      { min: 4800, max: 9600, rate: 0.032 },
      { min: 9600, max: 19200, rate: 0.055 },
      { min: 19200, max: 28800, rate: 0.064 },
      { min: 28800, max: 38400, rate: 0.068 },
      { min: 38400, max: 48000, rate: 0.072 },
      { min: 48000, max: 72000, rate: 0.076 },
      { min: 72000, max: 96000, rate: 0.079 },
      { min: 96000, max: 300000, rate: 0.0825 },
      { min: 300000, max: 350000, rate: 0.09 },
      { min: 350000, max: 400000, rate: 0.1 },
      { min: 400000, max: Infinity, rate: 0.11 },
    ],
  },
  Vermont: {
    single: [
      { min: 0, max: 42150, rate: 0.0335 },
      { min: 42150, max: 102050, rate: 0.066 },
      { min: 102050, max: 208450, rate: 0.076 },
      { min: 208450, max: Infinity, rate: 0.0875 },
    ],
    marriedJointly: [
      { min: 0, max: 70400, rate: 0.0335 },
      { min: 70400, max: 170050, rate: 0.066 },
      { min: 170050, max: 260550, rate: 0.076 },
      { min: 260550, max: Infinity, rate: 0.0875 },
    ],
  },
  Maine: {
    single: [
      { min: 0, max: 24500, rate: 0.058 },
      { min: 24500, max: 58050, rate: 0.0675 },
      { min: 58050, max: Infinity, rate: 0.0715 },
    ],
    marriedJointly: [
      { min: 0, max: 49000, rate: 0.058 },
      { min: 49000, max: 116100, rate: 0.0675 },
      { min: 116100, max: Infinity, rate: 0.0715 },
    ],
  },
  Massachusetts: {
    single: [{ min: 0, max: Infinity, rate: 0.05 }],
    marriedJointly: [{ min: 0, max: Infinity, rate: 0.05 }],
  },
  "New Jersey": {
    single: [
      { min: 0, max: 20000, rate: 0.014 },
      { min: 20000, max: 35000, rate: 0.0175 },
      { min: 35000, max: 40000, rate: 0.035 },
      { min: 40000, max: 75000, rate: 0.0553 },
      { min: 75000, max: 500000, rate: 0.0637 },
      { min: 500000, max: 1000000, rate: 0.0897 },
      { min: 1000000, max: Infinity, rate: 0.1075 },
    ],
    marriedJointly: [
      { min: 0, max: 20000, rate: 0.014 },
      { min: 20000, max: 50000, rate: 0.0175 },
      { min: 50000, max: 70000, rate: 0.0245 },
      { min: 70000, max: 80000, rate: 0.035 },
      { min: 80000, max: 150000, rate: 0.0553 },
      { min: 150000, max: 500000, rate: 0.0637 },
      { min: 500000, max: 1000000, rate: 0.0897 },
      { min: 1000000, max: Infinity, rate: 0.1075 },
    ],
  },
} as const;

// State tax information (simplified estimates for states without brackets)
export const statesTaxInfo = {
  Alabama: { rate: 0.05, hasStateTax: true },
  Alaska: { rate: 0, hasStateTax: false },
  Arizona: { rate: 0.045, hasStateTax: true },
  Arkansas: { rate: 0.055, hasStateTax: true },
  California: { rate: 0.093, hasStateTax: true, hasBrackets: true },
  Colorado: { rate: 0.0455, hasStateTax: true },
  Connecticut: { rate: 0.07, hasStateTax: true },
  Delaware: { rate: 0.066, hasStateTax: true },
  Florida: { rate: 0, hasStateTax: false },
  Georgia: { rate: 0.0575, hasStateTax: true },
  Hawaii: { rate: 0.08, hasStateTax: true, hasBrackets: true },
  Idaho: { rate: 0.058, hasStateTax: true },
  Illinois: { rate: 0.0495, hasStateTax: true },
  Indiana: { rate: 0.032, hasStateTax: true },
  Iowa: { rate: 0.06, hasStateTax: true },
  Kansas: { rate: 0.057, hasStateTax: true },
  Kentucky: { rate: 0.045, hasStateTax: true },
  Louisiana: { rate: 0.04, hasStateTax: true },
  Maine: { rate: 0.075, hasStateTax: true, hasBrackets: true },
  Maryland: { rate: 0.0575, hasStateTax: true },
  Massachusetts: { rate: 0.05, hasStateTax: true, hasBrackets: true },
  Michigan: { rate: 0.0425, hasStateTax: true },
  Minnesota: { rate: 0.0985, hasStateTax: true, hasBrackets: true },
  Mississippi: { rate: 0.05, hasStateTax: true },
  Missouri: { rate: 0.054, hasStateTax: true },
  Montana: { rate: 0.0675, hasStateTax: true },
  Nebraska: { rate: 0.0684, hasStateTax: true },
  Nevada: { rate: 0, hasStateTax: false },
  "New Hampshire": { rate: 0, hasStateTax: false },
  "New Jersey": { rate: 0.1075, hasStateTax: true, hasBrackets: true },
  "New Mexico": { rate: 0.049, hasStateTax: true },
  "New York": { rate: 0.109, hasStateTax: true, hasBrackets: true },
  "North Carolina": { rate: 0.0475, hasStateTax: true },
  "North Dakota": { rate: 0.029, hasStateTax: true },
  Ohio: { rate: 0.0385, hasStateTax: true },
  Oklahoma: { rate: 0.05, hasStateTax: true },
  Oregon: { rate: 0.099, hasStateTax: true, hasBrackets: true },
  Pennsylvania: { rate: 0.0307, hasStateTax: true },
  "Rhode Island": { rate: 0.0599, hasStateTax: true },
  "South Carolina": { rate: 0.065, hasStateTax: true },
  "South Dakota": { rate: 0, hasStateTax: false },
  Tennessee: { rate: 0, hasStateTax: false },
  Texas: { rate: 0, hasStateTax: false },
  Utah: { rate: 0.0485, hasStateTax: true },
  Vermont: { rate: 0.086, hasStateTax: true, hasBrackets: true },
  Virginia: { rate: 0.0575, hasStateTax: true },
  Washington: { rate: 0, hasStateTax: false },
  "West Virginia": { rate: 0.065, hasStateTax: true },
  Wisconsin: { rate: 0.0765, hasStateTax: true },
  Wyoming: { rate: 0, hasStateTax: false },
} as const;

export const filingStatuses = [
  { value: "single", label: "Single" },
  { value: "marriedJointly", label: "Married Filing Jointly" },
  { value: "marriedSeparately", label: "Married Filing Separately" },
  { value: "headOfHousehold", label: "Head of Household" },
] as const;

export type FilingStatus = keyof typeof federalTaxBrackets;
export type StateName = keyof typeof statesTaxInfo;

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface StateInfo {
  rate: number;
  hasStateTax: boolean;
  hasBrackets?: boolean;
}

export interface SaltScenarioData {
  scenario: string;
  totalTax: number;
  saltDeduction: number;
  taxSavings: number;
}
