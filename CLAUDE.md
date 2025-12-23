# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive tools to help Americans understand how the Big Beautiful Bill (Public Law 119-21, signed July 4, 2025) affects them. Each tool transforms a section of the bill into a calculator, data visualization, or interactive explainer showing impacts on everyday Americans and businesses.

## Commands

```bash
npm run dev      # Start dev server with Turbopack (http://localhost:3000)
npm run build    # Build for production (static export to /out)
npm run lint     # Run ESLint
```

## Bill Content

The bill text is in `big-beautiful-bill/` organized by title:
- `title-i-agriculture.md` through `title-x-judiciary.md`
- `title-vii-finance/` is split into subtitles (tax, health, debt-limit, unemployment)

**Do not access `data/` directly** - use the formatted markdown in `big-beautiful-bill/`.

Bill sections cover: Tax Policy, Healthcare (Medicaid/Medicare), Immigration, Energy, Education, Defense, and Environment.

## Architecture

### Current Implementation: SALT Calculator

Located in `src/` with separation between UI and business logic:

1. **Tax Data** (`src/util/tax-data.ts`): Tax constants, federal/state brackets, type definitions
   - `SALT_CAP_CONSTANTS`: Current cap ($10k), BBB cap ($40k), phasedown rate (30%)
   - `federalTaxBrackets`: 2024 federal brackets by filing status
   - `stateTaxBrackets`: Progressive brackets for states that have them
   - `statesTaxInfo`: Simplified rates for all 50 states

2. **Tax Calculations** (`src/util/tax-calculations.ts`): Pure functions
   - `calculateFederalTax()`: Progressive bracket calculation
   - `estimateStateTax()`: Uses brackets when available, falls back to effective rate
   - `calculateProposedSaltCap()`: BBB phasedown (30% reduction over $500k income)
   - `generateSaltComparisonData()`: Creates scenario comparison data

3. **Calculator UI** (`src/components/salt-calculator.tsx`): Client component with Recharts visualization

### Key SALT Business Logic

BBB SALT cap phases down for high earners:
- Base cap: $40,000
- Phasedown threshold: $500,000 ($250,000 married filing separately)
- Reduction: 30% of income over threshold
- Minimum: $10,000

### Static Export

Configured for static export (`output: "export"`) - all calculation happens client-side.
