# Sitreps Tools

A collection of interactive tools built with Next.js for military-to-civilian career transition.

## Tools Included

- **Military Pay Converter** - Compare military compensation to civilian salary equivalents with tax analysis
- **Compensation Comparison** - Side-by-side comparison of two job offers
- **VA Loan Calculator** - Calculate VA loan eligibility and monthly payments
- **ROI Calculator** - Analyze return on investment for education/training programs
- **Resume Builder** - AI-powered resume generator (requires Anthropic API key)
- **MOS Translator** - Translate military job codes to civilian equivalents
- **Placements Map** - Interactive map of veteran job placements by location and industry

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/WGalyean50/sitreps-features-1.git
cd sitreps-features-1

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | For Resume Builder | API key from [Anthropic Console](https://console.anthropic.com/) |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Maps**: Leaflet / React-Leaflet
- **Forms**: React Hook Form + Zod validation

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   └── tools/        # Tool pages
├── components/       # Reusable components
├── data/            # Static data (tax brackets, military pay tables, etc.)
└── lib/             # Utility functions
```

## Deployment

This project is configured for Vercel deployment. Connect your GitHub repo to Vercel and it will auto-deploy on push to main.

Remember to add `ANTHROPIC_API_KEY` to your Vercel environment variables if using the Resume Builder.

## License

MIT
