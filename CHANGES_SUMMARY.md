# Data Structure Updates: English Names to Machine Keys

## Summary
Updated internal data structures to use short machine keys instead of English strings for better persistence and maintainability. This change affects state names and filing statuses throughout the application.

## Changes Made

### 1. State Names (tax-data.ts)
**Before:** Used full state names as keys
- `"California"`, `"New York"`, `"New Jersey"`, etc.

**After:** Use 2-letter state abbreviations as keys
- `"CA"`, `"NY"`, `"NJ"`, etc.

### 2. Filing Status (tax-data.ts)
**Before:** Used verbose strings as keys
- `"single"`, `"marriedJointly"`, `"marriedSeparately"`, `"headOfHousehold"`

**After:** Use short machine keys
- `"S"`, `"MJ"`, `"MS"`, `"HH"`

### 3. Lookup Objects Added
Created lookup objects to map machine keys back to human-readable names:

```typescript
export const stateLookup = {
  AL: "Alabama",
  AK: "Alaska",
  CA: "California",
  // ... all 50 states
} as const;

export const filingStatusLookup = {
  S: "Single",
  MJ: "Married Filing Jointly", 
  MS: "Married Filing Separately",
  HH: "Head of Household",
} as const;
```

## Files Modified

### 1. `src/util/tax-data.ts`
- **federalTaxBrackets**: Updated keys from English to machine keys
- **stateTaxBrackets**: Updated state names and filing status keys
- **statesTaxInfo**: Updated all state names to 2-letter codes
- **filingStatuses**: Updated values to use machine keys
- **Helper functions**: Updated to use new keys (e.g., `isMarriedSeparately`)
- **Added lookup objects**: `stateLookup` and `filingStatusLookup`

### 2. `src/util/tax-calculations.ts`
- **calculateStateTaxWithBrackets**: Updated to use `"S"` and `"MJ"` keys
- **estimateStateTax**: Updated default parameter to use `"S"`
- **generateSaltComparisonData**: Updated default parameter to use `"S"`

### 3. `src/components/salt-calculator.tsx`
- **State initialization**: Updated default filing status to `"S"`
- **State selection**: Updated to use `stateLookup` for display names
- **Summary text**: Updated to use `stateLookup` for readable state names
- **Tax estimate warnings**: Updated to use `stateLookup` for display

## Benefits

1. **Persistence-Ready**: Machine keys are stable and won't change if display names are updated
2. **Shorter Keys**: Reduced storage space and network payload
3. **Consistency**: Standard 2-letter state codes align with postal standards
4. **Maintainability**: Centralized lookup objects make it easy to update display names
5. **Type Safety**: TypeScript ensures correct key usage throughout the application

## User Experience
- **No Change**: Users still see full state names and filing status labels
- **Improved**: State dropdown now shows states in a consistent format
- **Maintained**: All existing functionality preserved

## Technical Notes
- All data structures maintain backward compatibility through the lookup objects
- TypeScript types are properly updated to reflect the new key structure
- Build passes successfully with no compilation errors
- All existing calculations and logic remain unchanged