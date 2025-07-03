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

// State tax information (simplified estimates)
export const statesTaxInfo = {
  Alabama: { rate: 0.05, hasStateTax: true },
  Alaska: { rate: 0, hasStateTax: false },
  Arizona: { rate: 0.045, hasStateTax: true },
  Arkansas: { rate: 0.055, hasStateTax: true },
  California: { rate: 0.093, hasStateTax: true },
  Colorado: { rate: 0.0455, hasStateTax: true },
  Connecticut: { rate: 0.07, hasStateTax: true },
  Delaware: { rate: 0.066, hasStateTax: true },
  Florida: { rate: 0, hasStateTax: false },
  Georgia: { rate: 0.0575, hasStateTax: true },
  Hawaii: { rate: 0.08, hasStateTax: true },
  Idaho: { rate: 0.058, hasStateTax: true },
  Illinois: { rate: 0.0495, hasStateTax: true },
  Indiana: { rate: 0.032, hasStateTax: true },
  Iowa: { rate: 0.06, hasStateTax: true },
  Kansas: { rate: 0.057, hasStateTax: true },
  Kentucky: { rate: 0.045, hasStateTax: true },
  Louisiana: { rate: 0.04, hasStateTax: true },
  Maine: { rate: 0.075, hasStateTax: true },
  Maryland: { rate: 0.0575, hasStateTax: true },
  Massachusetts: { rate: 0.05, hasStateTax: true },
  Michigan: { rate: 0.0425, hasStateTax: true },
  Minnesota: { rate: 0.0985, hasStateTax: true },
  Mississippi: { rate: 0.05, hasStateTax: true },
  Missouri: { rate: 0.054, hasStateTax: true },
  Montana: { rate: 0.0675, hasStateTax: true },
  Nebraska: { rate: 0.0684, hasStateTax: true },
  Nevada: { rate: 0, hasStateTax: false },
  "New Hampshire": { rate: 0, hasStateTax: false },
  "New Jersey": { rate: 0.1075, hasStateTax: true },
  "New Mexico": { rate: 0.049, hasStateTax: true },
  "New York": { rate: 0.109, hasStateTax: true },
  "North Carolina": { rate: 0.0475, hasStateTax: true },
  "North Dakota": { rate: 0.029, hasStateTax: true },
  Ohio: { rate: 0.0385, hasStateTax: true },
  Oklahoma: { rate: 0.05, hasStateTax: true },
  Oregon: { rate: 0.099, hasStateTax: true },
  Pennsylvania: { rate: 0.0307, hasStateTax: true },
  "Rhode Island": { rate: 0.0599, hasStateTax: true },
  "South Carolina": { rate: 0.065, hasStateTax: true },
  "South Dakota": { rate: 0, hasStateTax: false },
  Tennessee: { rate: 0, hasStateTax: false },
  Texas: { rate: 0, hasStateTax: false },
  Utah: { rate: 0.0485, hasStateTax: true },
  Vermont: { rate: 0.086, hasStateTax: true },
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
}

export interface SaltScenarioData {
  scenario: string;
  totalTax: number;
  saltDeduction: number;
  taxSavings: number;
}
