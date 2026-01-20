# Sitreps.com Redesign - Execution Plan

> **Instructions for all agents:**
> - Use `docs/` folder as context for all tasks (especially `docs/prd.md` for acceptance criteria)
> - Check off tasks with `[x]` when complete
> - Add a completion summary beneath each task when done
> - Respect dependency indicators for parallel vs sequential work
> - All components must be mobile-first and WCAG 2.1 AA compliant
> - Use shadcn/ui components where applicable
> - Email capture is the north star - every tool must integrate with it

---

## Phase 0: Foundation

*Establish the project structure, design system, and shared components that all tools will use.*

### Task 0.1: Project Scaffolding
- [ ] **Objective:** Initialize Next.js 14+ project with App Router, Tailwind CSS, and shadcn/ui
- **Agent:** architect
- **Dependency:** None (start immediately)
- **Effort:** S
- **Acceptance Criteria:**
  - [ ] Next.js 14+ project created with App Router structure
  - [ ] Tailwind CSS configured with custom theme extending shadcn defaults
  - [ ] shadcn/ui initialized with required components (button, input, select, card, form, dialog, tabs)
  - [ ] TypeScript configured with strict mode
  - [ ] ESLint and Prettier configured
  - [ ] Folder structure established: `/app`, `/components`, `/lib`, `/data`, `/types`
  - [ ] Environment variables structure defined (.env.example)

**Completion Summary:** _(to be filled when complete)_

---

### Task 0.2: Design System Foundation
- [ ] **Objective:** Define color palette, typography, spacing, and component tokens aligned with Sitreps brand
- **Agent:** designer
- **Dependency:** Parallel with Task 0.1
- **Effort:** S
- **Acceptance Criteria:**
  - [ ] Color palette defined: primary (blues), secondary, accent, semantic colors (success, warning, error)
  - [ ] Typography scale defined: headings (h1-h4), body, captions, using professional sans-serif
  - [ ] Spacing scale documented (following Tailwind conventions)
  - [ ] Border radius and shadow tokens defined
  - [ ] Design tokens exported to Tailwind config format
  - [ ] Visual style is "professional, trustworthy, veteran-focused but not militaristic"

**Completion Summary:** _(to be filled when complete)_

---

### Task 0.3: Shared UI Components Library
- [ ] **Objective:** Build reusable UI components that all tools will share
- **Agent:** frontend-engineer
- **Dependency:** Sequential, after Task 0.1 and Task 0.2
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] `<ToolCard />` - Card component for tools hub with icon, title, description, CTA
  - [ ] `<StepIndicator />` - Progress indicator for multi-step tools (Step X of Y)
  - [ ] `<ResultsCard />` - Card for displaying calculation results with highlight styling
  - [ ] `<ComparisonTable />` - Side-by-side comparison table with winner highlighting
  - [ ] `<CurrencyInput />` - Formatted currency input with validation
  - [ ] `<PercentageInput />` - Percentage input with validation
  - [ ] `<LocationSelect />` - State/zip code selector with autocomplete
  - [ ] `<Disclaimer />` - Standardized disclaimer component
  - [ ] All components are mobile-responsive
  - [ ] All components meet WCAG 2.1 AA accessibility standards

**Completion Summary:** _(to be filled when complete)_

---

### Task 0.4: Layout Components
- [ ] **Objective:** Create site-wide layout including header, footer, and tools hub page
- **Agent:** frontend-engineer
- **Dependency:** Sequential, after Task 0.3
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] `<Header />` - Site header with Sitreps logo, navigation to tools hub, mobile menu
  - [ ] `<Footer />` - Footer with links, disclaimer, copyright
  - [ ] `<ToolLayout />` - Wrapper layout for tool pages with consistent padding, max-width
  - [ ] Tools Hub page (`/tools`) displaying all available tools as cards
  - [ ] Homepage (`/`) with hero section and CTA to tools hub
  - [ ] Clear value prop on homepage: "Make smarter transition decisions"
  - [ ] SEO meta tags configured for all pages

**Completion Summary:** _(to be filled when complete)_

---

### Task 0.5: Email Capture System
- [ ] **Objective:** Implement email capture flow that all tools will use for saving results
- **Agent:** backend-engineer
- **Dependency:** Parallel with Task 0.3 and Task 0.4
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Email capture modal/dialog component with form validation (Zod)
  - [ ] API route `/api/email/capture` to store emails
  - [ ] Integration with email service (Resend or SendGrid) for confirmation
  - [ ] Email stored with tool context (which tool, timestamp)
  - [ ] "Save your results" CTA component for tool results pages
  - [ ] "Get PDF + alerts for new tools" value exchange messaging
  - [ ] Rate limiting to prevent abuse
  - [ ] Privacy-compliant (clear opt-in, link to privacy policy)

**Completion Summary:** _(to be filled when complete)_

---

### Task 0.6: Analytics Integration
- [ ] **Objective:** Set up analytics to track tool usage, completion rates, and email captures
- **Agent:** backend-engineer
- **Dependency:** Parallel with Task 0.5
- **Effort:** S
- **Acceptance Criteria:**
  - [ ] PostHog or Mixpanel integrated
  - [ ] Page view tracking on all pages
  - [ ] Custom events defined: `tool_started`, `tool_completed`, `email_captured`, `results_shared`
  - [ ] Funnel tracking: tool start -> step completion -> results -> email capture
  - [ ] Analytics dashboard access configured
  - [ ] Event schema documented for consistent tracking

**Completion Summary:** _(to be filled when complete)_

---

## Phase 1: Financial Reality Tools

*Build the three financial calculators that help veterans understand their true financial position.*

### Task 1.1: Military Pay Data Layer
- [ ] **Objective:** Create data layer for military pay tables, BAH rates, and BAS rates
- **Agent:** backend-engineer
- **Dependency:** Sequential, after Phase 0 complete
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Military pay tables data structure (E-1 to O-10, W-1 to W-5)
  - [ ] BAH rates by zip code and dependent status (JSON or API)
  - [ ] BAS rates (enlisted vs officer)
  - [ ] API route `/api/military/pay` returning pay for rank/years
  - [ ] API route `/api/military/bah` returning BAH for zip/rank/dependents
  - [ ] Data sourced from DFAS with "last updated" timestamp
  - [ ] Utility functions for calculating total military compensation

**Completion Summary:** _(to be filled when complete)_

---

### Task 1.2: Tax Calculation Engine
- [ ] **Objective:** Build tax calculation logic for federal and all 50 state taxes
- **Agent:** backend-engineer
- **Dependency:** Parallel with Task 1.1
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Federal tax brackets for current year implemented
  - [ ] State tax rates for all 50 states (including 0% states)
  - [ ] Standard deduction handling
  - [ ] Filing status support (single, married filing jointly)
  - [ ] API route `/api/tax/calculate` accepting income and state
  - [ ] Returns breakdown: gross, federal tax, state tax, net take-home
  - [ ] Sources cited for tax data (IRS, state revenue departments)

**Completion Summary:** _(to be filled when complete)_

---

### Task 1.3: Tax Impact Calculator UI
- [ ] **Objective:** Build the Tax Impact Calculator user interface
- **Agent:** frontend-engineer
- **Dependency:** Parallel with Task 1.1 and Task 1.2 (mock data initially)
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Step 1: Military compensation input (rank dropdown, zip code, dependents Y/N)
  - [ ] Auto-populated BAH/BAS/base pay displayed after Step 1
  - [ ] Step 2: Civilian offer input (salary, state) with "Add another offer" (up to 3)
  - [ ] Step 3: Results page with side-by-side comparison
  - [ ] Monthly and annual net take-home displayed for military and each civilian scenario
  - [ ] "You need $X civilian to match your current military pay" headline
  - [ ] "Hidden compensation" breakdown (TSP match, healthcare value)
  - [ ] Progress indicator showing Step X of 3
  - [ ] Disclaimer about estimate nature
  - [ ] Mobile responsive design
  - [ ] Email capture integration for saving results

**Completion Summary:** _(to be filled when complete)_

---

### Task 1.4: Tax Calculator Integration
- [ ] **Objective:** Connect Tax Calculator UI to data layer and test end-to-end
- **Agent:** frontend-engineer
- **Dependency:** Sequential, after Task 1.1, 1.2, and 1.3
- **Effort:** S
- **Acceptance Criteria:**
  - [ ] UI connected to `/api/military/pay` and `/api/military/bah`
  - [ ] UI connected to `/api/tax/calculate`
  - [ ] Form state managed with React Hook Form
  - [ ] Loading states during API calls
  - [ ] Error handling for API failures
  - [ ] Results correctly calculate from live data
  - [ ] Guard/Reserve BAH option available
  - [ ] "Add additional pay" option for special pays

**Completion Summary:** _(to be filled when complete)_

---

### Task 1.5: VA Loan Calculator Data Layer
- [ ] **Objective:** Create data layer for VA loan calculations
- **Agent:** backend-engineer
- **Dependency:** Parallel with Task 1.3 and Task 1.4
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] VA funding fee calculation (first-time vs subsequent, down payment, service type)
  - [ ] Current VA loan rate data (defaulted, with override option)
  - [ ] Property tax estimation by zip code (or manual input)
  - [ ] Insurance estimation logic
  - [ ] Mortgage amortization calculation (15 and 30 year)
  - [ ] Rent vs buy comparison logic (1, 3, 5, 10 year horizons)
  - [ ] Opportunity cost calculation (down payment invested vs equity)
  - [ ] API route `/api/housing/compare` returning comparison data

**Completion Summary:** _(to be filled when complete)_

---

### Task 1.6: VA Loan Rent vs Buy Calculator UI
- [ ] **Objective:** Build the VA Loan Rent vs Buy Calculator user interface
- **Agent:** frontend-engineer
- **Dependency:** Parallel with Task 1.5 (mock data initially)
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Rent input section (current/proposed monthly rent)
  - [ ] Home purchase input (price, zip code)
  - [ ] VA loan options (first-time vs subsequent, loan term 15/30, down payment)
  - [ ] Interest rate default with override option
  - [ ] Property tax and insurance inputs (auto-estimate or manual)
  - [ ] Results: total cost comparison at 1, 3, 5, 10 year marks
  - [ ] Results: monthly cash flow comparison
  - [ ] Results: break-even year clearly displayed
  - [ ] Graph visualization of cumulative cost over time (Recharts)
  - [ ] Mobile responsive design
  - [ ] Email capture integration

**Completion Summary:** _(to be filled when complete)_

---

### Task 1.7: VA Loan Calculator Integration
- [ ] **Objective:** Connect VA Loan Calculator UI to data layer and test end-to-end
- **Agent:** frontend-engineer
- **Dependency:** Sequential, after Task 1.5 and Task 1.6
- **Effort:** S
- **Acceptance Criteria:**
  - [ ] UI connected to `/api/housing/compare`
  - [ ] All inputs properly validated
  - [ ] Graph renders correctly with live data
  - [ ] Break-even calculation accurate
  - [ ] Loading and error states handled
  - [ ] Results saveable via email capture

**Completion Summary:** _(to be filled when complete)_

---

### Task 1.8: Compensation Comparison Data Layer
- [ ] **Objective:** Create data layer for job offer compensation comparisons
- **Agent:** backend-engineer
- **Dependency:** Parallel with Task 1.6 and Task 1.7
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Offer data structure: base, signing bonus, annual bonus %, equity, benefits
  - [ ] Equity valuation logic (options with strike price, RSUs, vesting schedules)
  - [ ] Benefits valuation (401k match, healthcare tier benchmarks, PTO)
  - [ ] Cost of living adjustment by location
  - [ ] Total compensation calculation over 1, 2, 4 year horizons
  - [ ] Monthly "paycheck equivalent" after benefits calculation
  - [ ] API route `/api/compensation/compare` accepting 2-4 offers

**Completion Summary:** _(to be filled when complete)_

---

### Task 1.9: Compensation Comparison Tool UI
- [ ] **Objective:** Build the Compensation Comparison Tool user interface
- **Agent:** frontend-engineer
- **Dependency:** Parallel with Task 1.8 (mock data initially)
- **Effort:** L
- **Acceptance Criteria:**
  - [ ] Offer input form with all fields: base, signing, bonus %, equity details
  - [ ] Equity section handles: options (grant, strike, expected value), RSUs, vesting (1-4 year with cliff)
  - [ ] 401k match input (match % and cap)
  - [ ] Healthcare tier selection (single/family) with benchmark values
  - [ ] PTO days input with daily rate calculation
  - [ ] Remote vs in-office flag
  - [ ] Location input for COL adjustment
  - [ ] "Add another offer" up to 4 offers
  - [ ] Results: Year 1, Year 2, Year 4 total comp comparison
  - [ ] Results: Monthly paycheck equivalent
  - [ ] Results: Side-by-side table with winner highlighted per timeframe
  - [ ] Equity disclaimer about risk and liquidity
  - [ ] Mobile responsive
  - [ ] Email capture integration

**Completion Summary:** _(to be filled when complete)_

---

### Task 1.10: Compensation Tool Integration
- [ ] **Objective:** Connect Compensation Tool UI to data layer and test end-to-end
- **Agent:** frontend-engineer
- **Dependency:** Sequential, after Task 1.8 and Task 1.9
- **Effort:** S
- **Acceptance Criteria:**
  - [ ] UI connected to `/api/compensation/compare`
  - [ ] Form validation with Zod
  - [ ] Comparison table populates correctly
  - [ ] Winner highlighting logic works
  - [ ] COL adjustments apply correctly
  - [ ] All edge cases handled (missing equity, no bonus, etc.)

**Completion Summary:** _(to be filled when complete)_

---

## Phase 2: Career Translation Tools

*Build the AI-powered tools that help veterans translate and position their experience.*

### Task 2.1: AI Integration Setup
- [ ] **Objective:** Set up AI/LLM integration for resume builder and translator
- **Agent:** backend-engineer
- **Dependency:** Sequential, after Phase 1 substantially complete
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] OpenAI or Anthropic API client configured
  - [ ] Environment variables for API keys
  - [ ] Rate limiting per user session implemented
  - [ ] Streaming response support for perceived performance
  - [ ] Error handling for API failures/rate limits
  - [ ] Caching layer for common translations (reduce API costs)
  - [ ] API route `/api/ai/generate` as base endpoint

**Completion Summary:** _(to be filled when complete)_

---

### Task 2.2: Military Data for AI Context
- [ ] **Objective:** Create structured data for MOS/AFSC codes and military-to-civilian mappings
- **Agent:** backend-engineer
- **Dependency:** Parallel with Task 2.1
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] MOS codes (Army/Marines) with descriptions
  - [ ] AFSC codes (Air Force) with descriptions
  - [ ] Navy ratings with descriptions
  - [ ] Military staff functions mapping (G/J/A/N/S staff to corporate)
  - [ ] Common military terms to civilian translations
  - [ ] Searchable API endpoint `/api/military/codes`
  - [ ] Data structured for use in AI prompts

**Completion Summary:** _(to be filled when complete)_

---

### Task 2.3: AI Resume Builder Backend
- [ ] **Objective:** Create API endpoints for AI-powered resume generation
- **Agent:** backend-engineer
- **Dependency:** Sequential, after Task 2.1 and Task 2.2
- **Effort:** L
- **Acceptance Criteria:**
  - [ ] API route `/api/resume/generate` accepting military experience + target role
  - [ ] AI prompt engineering for jargon translation
  - [ ] Bullet point generation with quantified achievements
  - [ ] Skills extraction (organizational, leadership, technical)
  - [ ] Multiple format support (chronological, functional, hybrid)
  - [ ] Streaming response for generation progress
  - [ ] Processing time < 30 seconds
  - [ ] Iteration support (follow-up prompts to refine)
  - [ ] Output structured as JSON for flexible rendering

**Completion Summary:** _(to be filled when complete)_

---

### Task 2.4: AI Resume Builder UI
- [ ] **Objective:** Build the AI Resume Builder user interface
- **Agent:** frontend-engineer
- **Dependency:** Parallel with Task 2.3 (mock responses initially)
- **Effort:** L
- **Acceptance Criteria:**
  - [ ] Branch selection (Army, Navy, Air Force, Marines, Coast Guard, Space Force)
  - [ ] MOS/AFSC/rating input (searchable list or code entry)
  - [ ] Rank and years at each rank input
  - [ ] 3-5 key accomplishments input with military terminology
  - [ ] Target industry/role selection from curated list
  - [ ] Generation progress indicator (streaming)
  - [ ] Results: translated job descriptions
  - [ ] Results: 3-5 quantified bullet points per role
  - [ ] Results: categorized skills display
  - [ ] ATS-optimized formatting preview
  - [ ] Iteration interface (follow-up prompts)
  - [ ] Download buttons for PDF and Word (email capture required)
  - [ ] Mobile responsive

**Completion Summary:** _(to be filled when complete)_

---

### Task 2.5: Resume Builder Integration & PDF Export
- [ ] **Objective:** Connect Resume Builder UI to backend and implement PDF/Word export
- **Agent:** frontend-engineer
- **Dependency:** Sequential, after Task 2.3 and Task 2.4
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] UI connected to `/api/resume/generate`
  - [ ] Streaming response renders progressively
  - [ ] PDF generation (server-side or client-side)
  - [ ] Word document generation
  - [ ] Email capture before download
  - [ ] Download tracking in analytics
  - [ ] Error handling for generation failures

**Completion Summary:** _(to be filled when complete)_

---

### Task 2.6: Defense to Corporate Translator Data
- [ ] **Objective:** Create comprehensive mapping data for military-to-corporate translations
- **Agent:** backend-engineer
- **Dependency:** Parallel with Task 2.4 and Task 2.5
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] G1/HR mapping with job titles, skills, industries
  - [ ] G2/Strategy & Intelligence mapping
  - [ ] G3/Operations mapping
  - [ ] G4/Supply Chain & Logistics mapping
  - [ ] G5/Planning & Partnerships mapping
  - [ ] G6/IT & Technology mapping
  - [ ] G8/Finance & FP&A mapping
  - [ ] 2-3 example career paths per function (anonymized)
  - [ ] MOS/AFSC to function mapping
  - [ ] API route `/api/translator/mapping` returning structured data

**Completion Summary:** _(to be filled when complete)_

---

### Task 2.7: Defense to Corporate Translator UI
- [ ] **Objective:** Build the Defense to Corporate Translator user interface
- **Agent:** frontend-engineer
- **Dependency:** Parallel with Task 2.6 (mock data initially)
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Interactive staff function selector (G/J/A/N/S for each branch)
  - [ ] Corporate equivalent display with explanation
  - [ ] Typical job titles list
  - [ ] Key transferable skills display
  - [ ] Common industries list
  - [ ] Example career paths (clickable/expandable)
  - [ ] "My Path" generator: input military role -> get corporate targets
  - [ ] Interactive exploration (click corporate function to drill down)
  - [ ] Shareable/saveable results via email
  - [ ] Time on page tracking (target: > 3 min engagement)
  - [ ] Mobile responsive

**Completion Summary:** _(to be filled when complete)_

---

### Task 2.8: Translator Integration
- [ ] **Objective:** Connect Translator UI to data layer and test end-to-end
- **Agent:** frontend-engineer
- **Dependency:** Sequential, after Task 2.6 and Task 2.7
- **Effort:** S
- **Acceptance Criteria:**
  - [ ] UI connected to `/api/translator/mapping`
  - [ ] All staff functions render correctly
  - [ ] My Path generator produces relevant recommendations
  - [ ] Email capture works for saving paths
  - [ ] Analytics tracking time on page

**Completion Summary:** _(to be filled when complete)_

---

### Task 2.9: Degree/Cert ROI Calculator Data
- [ ] **Objective:** Create data layer for credential ROI calculations
- **Agent:** backend-engineer
- **Dependency:** Parallel with Task 2.7 and Task 2.8
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Credential library: MBA (top 20, top 50, part-time), MS degrees, PMP, Six Sigma, AWS, CISSP, etc.
  - [ ] Average costs per credential type
  - [ ] Expected salary increases based on market data (with sources)
  - [ ] GI Bill benefit calculation (remaining months, Yellow Ribbon)
  - [ ] Opportunity cost calculation (full-time vs part-time)
  - [ ] NPV calculation with discount rate
  - [ ] Break-even timeline calculation
  - [ ] Risk assessment data (credential saturation, trends)
  - [ ] API route `/api/roi/calculate`

**Completion Summary:** _(to be filled when complete)_

---

### Task 2.10: Degree/Cert ROI Calculator UI
- [ ] **Objective:** Build the Degree/Cert ROI Calculator user interface
- **Agent:** frontend-engineer
- **Dependency:** Parallel with Task 2.9 (mock data initially)
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Current salary and role input
  - [ ] Target credential selection from library (or custom input)
  - [ ] Program cost input (auto-populate for known programs)
  - [ ] GI Bill benefits input (remaining months, Yellow Ribbon eligibility)
  - [ ] Full-time vs part-time toggle
  - [ ] Expected salary increase input (or use market data default)
  - [ ] Results: break-even timeline (months and years)
  - [ ] Results: NPV of investment
  - [ ] Results: risk assessment display
  - [ ] Comparison mode: side-by-side 2 credentials
  - [ ] "Questions to ask" before committing
  - [ ] Disclaimer about individual results varying
  - [ ] Mobile responsive
  - [ ] Email capture integration

**Completion Summary:** _(to be filled when complete)_

---

### Task 2.11: ROI Calculator Integration
- [ ] **Objective:** Connect ROI Calculator UI to data layer and test end-to-end
- **Agent:** frontend-engineer
- **Dependency:** Sequential, after Task 2.9 and Task 2.10
- **Effort:** S
- **Acceptance Criteria:**
  - [ ] UI connected to `/api/roi/calculate`
  - [ ] Comparison mode works correctly
  - [ ] GI Bill calculations accurate
  - [ ] Break-even visualization clear
  - [ ] Email capture functional

**Completion Summary:** _(to be filled when complete)_

---

## Phase 3: Polish & Launch

*Testing, optimization, and deployment preparation.*

### Task 3.1: Cross-Tool Testing
- [ ] **Objective:** Comprehensive testing of all tools and user flows
- **Agent:** frontend-engineer
- **Dependency:** Sequential, after all Phase 1 and Phase 2 tasks complete
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] All 6 tools tested end-to-end on desktop and mobile
  - [ ] Email capture tested for all tools
  - [ ] Edge cases tested (missing inputs, API failures, slow connections)
  - [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
  - [ ] Accessibility audit (keyboard navigation, screen reader)
  - [ ] Analytics events firing correctly
  - [ ] Performance testing (Core Web Vitals)

**Completion Summary:** _(to be filled when complete)_

---

### Task 3.2: Content & Copy Review
- [ ] **Objective:** Review all user-facing copy for clarity, accuracy, and brand alignment
- **Agent:** designer
- **Dependency:** Parallel with Task 3.1
- **Effort:** S
- **Acceptance Criteria:**
  - [ ] All tool descriptions reviewed for clarity
  - [ ] Disclaimers reviewed for legal accuracy
  - [ ] Value propositions compelling and consistent
  - [ ] CTAs optimized for email capture conversion
  - [ ] Error messages are helpful and specific
  - [ ] Glossary/help text available for complex terms

**Completion Summary:** _(to be filled when complete)_

---

### Task 3.3: Performance Optimization
- [ ] **Objective:** Optimize site performance for fast loading and smooth interactions
- **Agent:** frontend-engineer
- **Dependency:** Sequential, after Task 3.1
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Lighthouse performance score > 90
  - [ ] LCP < 2.5s, FID < 100ms, CLS < 0.1
  - [ ] Images optimized with Next.js Image component
  - [ ] Code splitting implemented for tool pages
  - [ ] API responses cached where appropriate
  - [ ] Static pages pre-rendered where possible

**Completion Summary:** _(to be filled when complete)_

---

### Task 3.4: Deployment Setup
- [ ] **Objective:** Configure production deployment infrastructure
- **Agent:** backend-engineer
- **Dependency:** Parallel with Task 3.3
- **Effort:** M
- **Acceptance Criteria:**
  - [ ] Vercel (or chosen platform) configured for production
  - [ ] Environment variables set for production
  - [ ] Domain configured and SSL active
  - [ ] CDN caching configured
  - [ ] Error monitoring (Sentry or similar) integrated
  - [ ] Backup/recovery procedures documented
  - [ ] CI/CD pipeline for automated deployments

**Completion Summary:** _(to be filled when complete)_

---

### Task 3.5: Launch Checklist
- [ ] **Objective:** Final pre-launch verification and launch
- **Agent:** architect
- **Dependency:** Sequential, after Task 3.1, 3.2, 3.3, and 3.4
- **Effort:** S
- **Acceptance Criteria:**
  - [ ] All 6 tools functional in production
  - [ ] Email capture working and emails delivering
  - [ ] Analytics tracking confirmed
  - [ ] SEO meta tags verified
  - [ ] Social sharing tested (OG images, links)
  - [ ] Privacy policy and terms of service linked
  - [ ] "Last updated" timestamps accurate on data-dependent tools
  - [ ] Launch announcement prepared

**Completion Summary:** _(to be filled when complete)_

---

## Dependency Summary

```
Phase 0 (Foundation) - All must complete before Phase 1/2
├── Task 0.1 (Scaffolding) ─┬── Parallel
├── Task 0.2 (Design System) ┘
├── Task 0.3 (UI Components) ── After 0.1, 0.2
├── Task 0.4 (Layouts) ──────── After 0.3
├── Task 0.5 (Email Capture) ── Parallel with 0.3, 0.4
└── Task 0.6 (Analytics) ────── Parallel with 0.5

Phase 1 (Financial Tools) - Can parallelize within phase
├── Task 1.1 (Military Pay Data) ─┬── Parallel
├── Task 1.2 (Tax Engine) ────────┤
├── Task 1.3 (Tax UI) ────────────┘
├── Task 1.4 (Tax Integration) ─────── After 1.1, 1.2, 1.3
├── Task 1.5 (VA Loan Data) ──────┬── Parallel
├── Task 1.6 (VA Loan UI) ────────┘
├── Task 1.7 (VA Integration) ──────── After 1.5, 1.6
├── Task 1.8 (Comp Data) ─────────┬── Parallel
├── Task 1.9 (Comp UI) ───────────┘
└── Task 1.10 (Comp Integration) ───── After 1.8, 1.9

Phase 2 (Career Tools) - Can start after Phase 1 substantially done
├── Task 2.1 (AI Setup) ──────────┬── Parallel
├── Task 2.2 (Military AI Data) ──┘
├── Task 2.3 (Resume Backend) ──────── After 2.1, 2.2
├── Task 2.4 (Resume UI) ───────────── Parallel with 2.3
├── Task 2.5 (Resume Integration) ──── After 2.3, 2.4
├── Task 2.6 (Translator Data) ─────── Parallel with 2.4, 2.5
├── Task 2.7 (Translator UI) ───────── Parallel with 2.6
├── Task 2.8 (Translator Integration) ─ After 2.6, 2.7
├── Task 2.9 (ROI Data) ────────────── Parallel with 2.7, 2.8
├── Task 2.10 (ROI UI) ─────────────── Parallel with 2.9
└── Task 2.11 (ROI Integration) ─────── After 2.9, 2.10

Phase 3 (Polish & Launch) - After Phase 1 and 2
├── Task 3.1 (Testing) ───────┬── Parallel
├── Task 3.2 (Content Review) ┤
├── Task 3.3 (Performance) ───┤── After 3.1
├── Task 3.4 (Deployment) ────┘
└── Task 3.5 (Launch) ──────────── After 3.1, 3.2, 3.3, 3.4
```

## Effort Summary

| Effort | Count | Tasks |
|--------|-------|-------|
| S (Small) | 9 | 0.1, 0.2, 0.6, 1.4, 1.7, 1.10, 2.8, 2.11, 3.2, 3.5 |
| M (Medium) | 16 | 0.3, 0.4, 0.5, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.1, 2.2, 2.5, 2.6, 2.7, 2.9, 2.10, 3.1, 3.3, 3.4 |
| L (Large) | 3 | 1.9, 2.3, 2.4 |

**Total: 28 tasks**

## Agent Workload Distribution

| Agent | Tasks |
|-------|-------|
| architect | 0.1, 3.5 |
| designer | 0.2, 3.2 |
| frontend-engineer | 0.3, 0.4, 1.3, 1.4, 1.6, 1.7, 1.9, 1.10, 2.4, 2.5, 2.7, 2.8, 2.10, 2.11, 3.1, 3.3 |
| backend-engineer | 0.5, 0.6, 1.1, 1.2, 1.5, 1.8, 2.1, 2.2, 2.3, 2.6, 2.9, 3.4 |
