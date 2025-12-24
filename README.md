# Big Beautiful Bill Explorer

Interactive tools to understand how the Big Beautiful Bill (Public Law 119-21) affects everyday Americans and businesses.

## What is the Big Beautiful Bill?

The Big Beautiful Bill is a budget reconciliation bill passed by the 119th Congress and signed into law on July 4, 2025. It covers major policy areas including:

- **Tax Policy**: Extension of tax cuts, no tax on tips/overtime, SALT deduction changes, business tax reforms
- **Healthcare**: Medicaid work requirements, Medicare changes, health savings account expansions
- **Immigration**: New fees, enforcement funding, border security
- **Energy**: Oil/gas leasing expansion, termination of clean energy credits
- **Education**: Student loan reforms, Pell Grant changes
- **Defense**: Military spending, shipbuilding, nuclear forces
- **Environment**: Rescission of climate programs

## Tools

### SALT Deduction Calculator

Compare your tax liability under the current $10,000 SALT cap vs the new $40,000 cap with high-income phasedown:

- Supports all 50 states with accurate tax rate data
- Multiple filing statuses
- Interactive visualizations
- Phasedown modeling for high-income earners (30% reduction for income over $500k)

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone https://github.com/your-username/big-budget-bomb.git
cd big-budget-bomb
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

```bash
npm run build
```

Static files are exported to the `out/` directory.

## Project Structure

```
big-beautiful-bill/     # Bill text organized by title
├── title-i-agriculture.md
├── title-ii-armed-services.md
├── ...
└── title-vii-finance/  # Largest section, split into subtitles
    ├── subtitle-a-tax.md
    ├── subtitle-b-health.md
    └── ...

src/
├── app/                # Next.js app router pages
├── components/         # React components
│   └── salt-calculator.tsx
└── util/               # Business logic
    ├── tax-calculations.ts
    └── tax-data.ts
```

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Charts**: Recharts

## Disclaimer

These tools provide estimates for educational purposes only. Tax situations and policy impacts can be complex. For official advice, consult qualified professionals.

## Contributing

Contributions welcome! Ideas for new calculators or visualizations covering other bill sections are especially appreciated.

## License

MIT License
