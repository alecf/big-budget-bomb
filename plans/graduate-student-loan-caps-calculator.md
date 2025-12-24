# feat: Graduate Student Loan Caps Calculator

## Overview

Build an interactive calculator showing how the Big Beautiful Bill's new student loan limits (Section 81001) affect graduate and professional students. Users input their program type, costs, and current borrowing to see their remaining borrowing capacity and funding gaps compared to the old unlimited Grad PLUS system.

**Bill Reference:** `big-beautiful-bill/title-viii-education.md` (Section 81001, lines 60-241)

## Problem Statement

The Big Beautiful Bill introduces strict new limits on federal student loans for graduate students, effective July 1, 2026:

| Student Type | Annual Limit | Aggregate Limit |
|--------------|--------------|-----------------|
| Graduate (non-professional) | $20,500 | $100,000 |
| Professional (MD, JD, etc.) | $50,000 | $200,000 |
| Parent PLUS | $20,000/student | $65,000/student |
| **Lifetime Maximum** | - | **$257,500** |

**Old System:** Unlimited Grad PLUS borrowing up to cost of attendance.

Many students don't realize these limits exist or how they'll create funding gaps for expensive programs (medical school: ~$300k, law school: ~$180k). This calculator makes the impact personal and concrete.

## Proposed Solution

A single-page calculator following the SALT calculator pattern:

1. **Inputs:** Student type, program length, annual cost, existing loans, enrollment date, enrollment status
2. **Outputs:** Borrowing capacity, funding gap visualization, year-by-year breakdown, comparison to old system
3. **Visualization:** Stacked bar chart showing loan capacity vs. program cost with gap highlighted

## Technical Approach

### Architecture

Follow existing SALT calculator pattern with separation of concerns:

```
src/
├── app/
│   └── student-loans/
│       └── page.tsx              # New route: /student-loans
├── components/
│   └── student-loan-calculator.tsx  # Main calculator component
└── util/
    ├── loan-data.ts              # Constants, types, program definitions
    └── loan-calculations.ts      # Pure calculation functions
```

### Data Structure

**`src/util/loan-data.ts`:**
```typescript
export const LOAN_CAP_CONSTANTS = {
  GRADUATE_ANNUAL: 20500,
  GRADUATE_AGGREGATE: 100000,
  PROFESSIONAL_ANNUAL: 50000,
  PROFESSIONAL_AGGREGATE: 200000,
  PARENT_ANNUAL: 20000,
  PARENT_AGGREGATE: 65000,
  LIFETIME_MAX: 257500,
  EFFECTIVE_DATE: '2026-07-01',
  INTERIM_EXCEPTION_YEARS: 3,
} as const;

export const studentTypes = [
  { value: 'graduate', label: 'Graduate (Masters, PhD)' },
  { value: 'professional', label: 'Professional (MD, JD, DDS, PharmD, etc.)' },
] as const;

export const programPresets = {
  mastersDegree: { years: 2, annualCost: 40000 },
  phdProgram: { years: 5, annualCost: 35000 },
  lawSchool: { years: 3, annualCost: 60000 },
  medicalSchool: { years: 4, annualCost: 75000 },
} as const;

export type StudentType = 'graduate' | 'professional';

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
```

### Core Calculations

**`src/util/loan-calculations.ts`:**
```typescript
export const getAnnualLimit = (
  studentType: StudentType,
  enrollmentPercentage: number = 100
): number => {
  const baseLimit = studentType === 'professional'
    ? LOAN_CAP_CONSTANTS.PROFESSIONAL_ANNUAL
    : LOAN_CAP_CONSTANTS.GRADUATE_ANNUAL;
  return Math.round(baseLimit * (enrollmentPercentage / 100));
};

export const getAggregateLimit = (
  studentType: StudentType,
  existingLoans: number = 0
): number => {
  const baseLimit = studentType === 'professional'
    ? LOAN_CAP_CONSTANTS.PROFESSIONAL_AGGREGATE
    : LOAN_CAP_CONSTANTS.GRADUATE_AGGREGATE;

  // Also check lifetime limit
  const lifetimeRemaining = LOAN_CAP_CONSTANTS.LIFETIME_MAX - existingLoans;
  return Math.max(0, Math.min(baseLimit, lifetimeRemaining));
};

export const isInterimExceptionEligible = (
  enrollmentDate: Date
): boolean => {
  const effectiveDate = new Date(LOAN_CAP_CONSTANTS.EFFECTIVE_DATE);
  return enrollmentDate < effectiveDate;
};

export const calculateInterimExceptionEndDate = (
  enrollmentDate: Date,
  programLengthYears: number
): Date => {
  const effectiveDate = new Date(LOAN_CAP_CONSTANTS.EFFECTIVE_DATE);
  const remainingYears = programLengthYears; // Simplified
  const exceptionYears = Math.min(remainingYears, LOAN_CAP_CONSTANTS.INTERIM_EXCEPTION_YEARS);

  const endDate = new Date(effectiveDate);
  endDate.setFullYear(endDate.getFullYear() + exceptionYears);
  return endDate;
};

export const generateYearByYearBreakdown = (
  studentType: StudentType,
  programLengthYears: number,
  annualCost: number,
  existingLoans: number,
  enrollmentPercentage: number
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

export const generateComparisonData = (
  studentType: StudentType,
  programLengthYears: number,
  annualCost: number,
  existingLoans: number
): LoanScenarioData[] => {
  const totalCost = programLengthYears * annualCost;
  const newLimitCapacity = getAggregateLimit(studentType, existingLoans);

  return [
    {
      scenario: 'New BBB Limits',
      loanCapacity: Math.min(newLimitCapacity, totalCost),
      programCost: totalCost,
      fundingGap: Math.max(0, totalCost - newLimitCapacity),
    },
    {
      scenario: 'Old System (Unlimited)',
      loanCapacity: totalCost, // Could borrow full cost via Grad PLUS
      programCost: totalCost,
      fundingGap: 0,
    },
  ];
};
```

### Component Structure

**`src/components/student-loan-calculator.tsx`:**
```typescript
"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Key features:
// 1. Form inputs: studentType, programLength, annualCost, existingLoans, enrollmentDate
// 2. Calculate button triggers computation
// 3. Results section with:
//    - Summary statistics (total capacity, funding gap)
//    - Stacked bar chart (capacity vs gap)
//    - Year-by-year breakdown table
//    - Comparison to old system
// 4. Color coding: green = covered, red = gap
```

### Routing

**`src/app/student-loans/page.tsx`:**
```typescript
import StudentLoanCalculator from "@/components/student-loan-calculator";

export default function StudentLoansPage() {
  return <StudentLoanCalculator />;
}
```

### Visualization Design

**Stacked Bar Chart** showing for each scenario:
- Bottom segment (green): Loan capacity / covered amount
- Top segment (red): Funding gap

**Year-by-Year Table** with columns:
| Year | Annual Cost | Max Borrowing | Cumulative | Remaining Capacity | Gap |
|------|-------------|---------------|------------|-------------------|-----|

## Acceptance Criteria

### Functional Requirements

- [ ] **Input Form**: Collects student type, program length (1-10 years), annual cost, existing loans, enrollment semester
- [ ] **Student Type Selection**: Dropdown with "Graduate (Masters, PhD)" and "Professional (MD, JD, etc.)" options
- [ ] **Calculation**: Correctly applies annual limits, aggregate limits, and lifetime maximum
- [ ] **Part-Time Support**: Pro-rates annual limits based on enrollment percentage (25%, 50%, 75%, 100%)
- [ ] **Interim Exception**: Detects pre-July 2026 enrollment and shows different messaging
- [ ] **Year-by-Year Breakdown**: Shows borrowing capacity and gaps for each program year
- [ ] **Comparison View**: Shows old system (unlimited) vs new BBB limits side-by-side
- [ ] **Summary Text**: Dynamic explanation of results (similar to SALT calculator pattern)
- [ ] **Editable Estimates**: Users can override calculated values for accuracy

### Non-Functional Requirements

- [ ] **Accessibility**: Keyboard navigable, screen reader compatible, color-blind friendly visualization
- [ ] **Responsive**: Works on mobile, tablet, desktop
- [ ] **Performance**: Calculations update in <100ms
- [ ] **Static Export**: Works with `output: "export"` configuration

### Quality Gates

- [ ] All calculations match bill text (Section 81001)
- [ ] Code follows existing SALT calculator patterns
- [ ] No TypeScript errors
- [ ] Passes ESLint

## Implementation Phases

### Phase 1: Core Calculator (MVP)
**Files to create:**
- `src/util/loan-data.ts`
- `src/util/loan-calculations.ts`
- `src/components/student-loan-calculator.tsx`
- `src/app/student-loans/page.tsx`

**Scope:**
- Student type selection (graduate vs professional)
- Program length and annual cost inputs
- Existing loans input
- Full-time only (no part-time)
- Summary output: total capacity, funding gap
- Simple bar chart comparison

### Phase 2: Enhanced Visualization
- Year-by-year breakdown table
- Stacked bar chart with gap highlighting
- Comparison to old system
- Summary text with dynamic explanations

### Phase 3: Advanced Features
- Part-time enrollment support with pro-rating
- Interim exception handling for pre-July 2026 enrollment
- Program presets (law school, medical school, etc.)
- Editable calculated values

### Phase 4: Polish
- Mobile-optimized layout
- Accessibility audit and fixes
- Help text and tooltips
- Link to bill section

## Key Design Decisions

### 1. Existing Loans Definition
**Decision:** Include only Direct Stafford loans (subsidized + unsubsidized) in "existing loans" input. Exclude Parent PLUS and older loan types.
**Rationale:** Simplifies UX and covers 95%+ of cases. Add help text explaining what to include.

### 2. Part-Time Pro-Rating
**Decision:** Use linear pro-rating (50% enrollment = 50% of annual limit).
**Rationale:** Bill text says "reduced on a pro rata basis" without specifying steps.

### 3. Interim Exception
**Decision:** Calculate as 3 calendar years from July 1, 2026, capped by remaining program length.
**Rationale:** Matches bill text "lesser of 3 years or expected time to credential."

### 4. Professional Degree List
**Decision:** Provide dropdown with: MD, DO, JD, DDS/DMD, PharmD, DVM, OD, DPM, plus "Other Graduate" option.
**Rationale:** Covers common cases; linking to CFR definition in help text for edge cases.

### 5. Funding Gap Scope
**Decision:** Calculate as (program cost - federal loan capacity) only. Don't factor in scholarships or other aid.
**Rationale:** Keeps calculator focused. Add disclaimer about other aid sources.

## References

### Internal
- `src/components/salt-calculator.tsx` - Reference implementation pattern
- `src/util/tax-data.ts` - Constants and types pattern
- `src/util/tax-calculations.ts` - Pure function pattern
- `big-beautiful-bill/title-viii-education.md` - Bill text (Section 81001)

### External
- [Nielsen Norman Group: Calculator UX](https://www.nngroup.com/articles/recommendations-calculator/)
- [Recharts Documentation](https://recharts.org/en-US)
- [StudentAid.gov Loan Simulator](https://studentaid.gov/loan-simulator/) - Reference for presentation

## Open Questions (Non-Blocking)

1. Should we add navigation between SALT calculator and Student Loan calculator?
2. Should program presets be on the main form or in a separate "examples" section?
3. Should Parent PLUS be a separate tab/section or integrated?

## Diagram: User Flow

```
┌─────────────────┐
│  Landing Page   │
│  /student-loans │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Input Form    │
│ - Student type  │
│ - Program info  │
│ - Existing debt │
└────────┬────────┘
         │ Click "Calculate"
         ▼
┌─────────────────┐
│    Results      │
│ - Summary stats │
│ - Bar chart     │
│ - Year breakdown│
│ - Old vs New    │
└─────────────────┘
```

## Diagram: Data Flow

```
User Inputs                    Calculations                     Outputs
───────────                    ────────────                     ───────
studentType         ──┐
programLength       ──┼──► getAggregateLimit()    ──► Total Capacity
annualCost          ──┤    getAnnualLimit()       ──► Annual Limit
existingLoans       ──┤    generateYearBreakdown()──► Year-by-Year Table
enrollmentPct       ──┘    generateComparisonData()──► Chart Data
                                                   ──► Funding Gap
                                                   ──► Summary Text
```
