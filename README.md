# SALT Cap Calculator

A web application that helps taxpayers understand how proposed changes to the State And Local Tax (SALT) deduction cap would affect their federal tax liability.

## What is the SALT Cap?

The State And Local Tax (SALT) deduction allows taxpayers to deduct state and local taxes from their federal taxable income. Currently, this deduction is capped at $10,000 per year. Various legislative proposals, including provisions in the Build Back Better Act (BBB), have suggested modifying this cap.

## What This Calculator Does

This calculator compares your tax liability under:

- The current $10,000 SALT cap
- Proposed changes from the Build Back Better Act, which would:
  - Raise the cap to $80,000 for tax years 2021-2030
  - Phase down the higher cap for high-income earners
  - Return to the $10,000 cap after 2030

## Features

- **State-specific calculations**: Supports all 50 states with accurate tax rate data
- **Multiple filing statuses**: Single, Married Filing Jointly, Married Filing Separately, Head of Household
- **Interactive visualizations**: Charts showing tax comparisons across different scenarios
- **Detailed breakdowns**: See federal tax, state tax, and total tax liability
- **Phasedown modeling**: Accurate calculations for high-income earners subject to cap phasedowns

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/salt-cap-calculator.git
cd salt-cap-calculator
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
npm run build
npm start
```

## How to Use

1. **Enter your information**:

   - Adjusted Gross Income (AGI)
   - Filing status
   - State of residence

2. **Click "Calculate"** to see:

   - Your estimated tax liability under current law
   - Your estimated tax liability under proposed BBB changes
   - Visual comparison charts
   - Detailed breakdown of the differences

3. **Review the results**:
   - Green indicates tax savings
   - Red indicates tax increases
   - Charts show multiple scenarios for comparison

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts
- **Build Tool**: Turbopack (Next.js)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── salt-calculator.tsx  # Main calculator component
├── lib/                # Utility libraries
└── util/               # Tax calculation logic and data
    ├── tax-calculations.ts
    └── tax-data.ts
```

## Disclaimer

This calculator provides estimates for educational purposes only. Tax situations can be complex, and actual tax liability may vary based on many factors not captured in this tool. For official tax advice, consult a qualified tax professional.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
