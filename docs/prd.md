# Product Requirements Document: Sitreps.com Redesign

**Version:** 1.0
**Date:** January 19, 2026
**Author:** Product Team
**Status:** Draft for Review

---

## 1. Executive Summary

Sitreps.com will become **THE hub for veterans in business** by providing self-service tools that help veterans make informed decisions about their careers, finances, and transitions. Rather than generic advice, Sitreps will deliver personalized, actionable intelligence through calculators, AI-powered translation tools, and market data that address the specific challenges veterans face when moving from military to civilian life. The platform will launch with Financial Reality Tools (tax impact, VA loan decisions, compensation comparison), expand to Career Translation Tools (AI resume builder, military-to-corporate translator), and build toward Market Intelligence features that leverage Sitreps' unique placement data.

**Key Objectives:**
- Establish Sitreps as the definitive resource for veteran career and financial decisions
- Deliver immediate value through free, high-quality self-service tools
- Generate qualified leads for Sitreps programs and services through email capture
- Build a data asset (placements, user patterns) that compounds over time
- Create tools so useful that veterans share them within their networks

**Target Launch Scope:** Phase 1 (Financial Reality Tools) + Phase 2 (Career Translation Tools) within 6 months

---

## 2. Problem Statement

### What problems are veterans facing?

Veterans transitioning to civilian careers face a unique set of challenges that existing resources fail to address:

**Financial Shock**
> *"Tax calculator (BAS/BAH + no state tax to full taxation shock)"* - Eric D. McKinney

Veterans receive non-taxable allowances (BAH, BAS) and often serve in states without income tax. When they transition, they experience a "pay cut illusion" - a $100K civilian salary may actually represent less take-home than an $80K military package. No existing calculator addresses this military-specific comparison.

**Translation Gap**
> *"Defense to corporate translator (military staff functions to business functions)"* - Madeleine Bursaw
> *"Skills identification tool (org/leadership/technical) to tailor resume to specific market"* - Jaime Padilla

Military experience doesn't map cleanly to corporate roles. Veterans struggle to articulate their value in civilian terms. The result: they undersell themselves ("your experience isn't executive level" reality) or target the wrong roles.

**Decision Paralysis**
> *"Opportunity cost calculator (staying at role vs other offers)"* - Daniel Morales De La Cruz
> *"Guard/Reserves decision tool (factors: service time, healthcare, pay, pension)"* - Alan Van Saun

Major career and financial decisions (MBA vs. work, rent vs. buy, federal vs. commercial, Guard/Reserves vs. full separation) have veteran-specific variables that generic tools ignore.

**Information Asymmetry**
> *"Cyber job map, certs vs degrees vs experience reality check"* - Nicholis Garcia
> *"Which certs actually move the needle"* - Hunter Richardson

Veterans don't know what they don't know. They over-invest in credentials that don't pay off, or under-appreciate the value of what they already have.

### Why existing solutions fall short

1. **Generic Tools:** Civilian calculators don't account for military-specific factors (BAH, VA loans, GI Bill, pension)
2. **Fragmented Information:** Veterans cobble together advice from Reddit, LinkedIn, and word-of-mouth
3. **Outdated Guidance:** TAP (Transition Assistance Program) provides broad guidance, not personalized intelligence
4. **Self-Serving Sources:** Many resources exist to sell services, not to genuinely help

### The Opportunity for Sitreps

Sitreps has a unique position:
- **Community Trust:** 20,489 LinkedIn followers engaging actively with the brand
- **Placement Data:** Real outcomes from veteran placements create proprietary intelligence
- **Credibility:** Founded by veterans, for veterans - understands the translation challenge firsthand
- **Network Effects:** Each tool user can become a Sitreps advocate and pipeline source

---

## 3. Target Users & Personas

### Primary Persona: The Transitioning Veteran

**Name:** SGM Marcus Thompson
**Background:** 22 years Army, retiring E-9, Operations background
**Timeline:** 12 months from transition
**Education:** Bachelor's degree, considering MBA

**Journey:**
1. **Awareness (18 months out):** Starts thinking about "what's next"
2. **Research (12 months):** Attends TAP, browses LinkedIn, feels overwhelmed
3. **Active Planning (6 months):** Needs to make concrete decisions (where to live, what jobs to target)
4. **Execution (3 months):** Resume building, applications, interviews
5. **Transition (0-6 months post):** First civilian role, steep learning curve

**Pain Points:**
- *"I've led 500 soldiers, but I don't know how to say that on a resume"*
- *"My buddy says I should get PMP certified, another says MBA, another says just go federal"*
- *"How do I know if this $150K offer is actually better than my military pay?"*
- *"Everyone says Austin is great, but can I afford it?"*

**Quote from feedback:**
> *"Success/failure stories podcast - what jobs were awesome vs sucked"* - Edward Houser

Marcus wants to learn from others who made the same transition.

**Goals:**
- Maximize financial outcome of transition
- Land a role that leverages his leadership experience
- Avoid common mistakes other veterans have made
- Make data-driven decisions about location, education, and career path

### Secondary Persona: The Veteran in Career

**Name:** CPT (Ret.) Sarah Chen
**Background:** 8 years Army, separated as O-3, now 3 years into tech PM career
**Current Role:** Product Manager at mid-stage startup
**Timeline:** Evaluating next move

**Situation:**
- Received competing offers (large company vs. startup)
- Considering MBA to accelerate to senior leadership
- Maintaining Guard/Reserve affiliation for benefits and service

**Pain Points:**
- *"I have two offers with wildly different comp structures - how do I compare them?"*
- *"Is an MBA worth $200K and 2 years of opportunity cost at this stage?"*
- *"Should I keep my Reserve commitment or focus entirely on civilian career?"*

**Quote from feedback:**
> *"Plug-and-play comp modeling, equity education for venture-backed"* - Tom Dugan
> *"Guard/Reserves decision tool (factors: service time, healthcare, pay, pension)"* - Alan Van Saun

Sarah needs decision-support tools for mid-career choices, not just transition resources.

**Goals:**
- Maximize total compensation across complex offer structures
- Make informed decision about continued military service
- Connect with other veterans in similar situations
- Evaluate education investments quantitatively

---

## 4. Product Vision & Goals

### North Star Metric

**Tool Completion Rate with Email Capture**

This metric captures both engagement (veterans are using the tools) and conversion (they value the output enough to save it). It directly ties to lead generation and indicates genuine utility.

*Target: 40% of tool starts result in completion with email capture*

### 6-Month Goals

| Goal | Metric | Target |
|------|--------|--------|
| Launch Phase 1+2 Tools | Tools shipped | 6 tools live |
| Drive Engagement | Monthly tool sessions | 10,000 |
| Generate Leads | Email captures | 2,500 |
| Prove Conversion | Tool users → Sitreps programs | 50 conversions |
| Build Reputation | Social shares of tool results | 500 |

### 12-Month Goals

| Goal | Metric | Target |
|------|--------|--------|
| Establish Leadership | Monthly tool sessions | 50,000 |
| Scale Lead Gen | Email captures | 15,000 |
| Launch Phase 3 | Market Intelligence tools | 3 additional tools |
| Demonstrate ROI | Attributed revenue from tool users | $500K |
| Community Growth | Return visitor rate | 40% |

---

## 5. Core Features (MVP)

### Phase 1: Financial Reality Tools

#### Feature 1.1: Tax Impact Calculator

**Problem it solves:**
> *"Tax calculator (BAS/BAH + no state tax to full taxation shock)"* - Eric D. McKinney

Veterans don't understand their true current compensation when it includes tax-free allowances. They compare gross civilian salaries to military base pay, making poor decisions.

**User Story:**
*As a transitioning veteran, I want to compare my current military compensation to civilian offers in real take-home terms so that I understand my true financial position when evaluating opportunities.*

**Key Functionality:**
- Input current military rank, location, and dependents
- Auto-calculate BAH, BAS, base pay from military pay tables
- Input prospective civilian salary and location (state)
- Calculate federal and state tax impact
- Show side-by-side net take-home comparison
- Display "hidden compensation" breakdown (TSP match, healthcare value, etc.)

**Acceptance Criteria:**
- [ ] User can select current military rank from dropdown (E-1 to O-10, W-1 to W-5)
- [ ] BAH auto-populates based on rank, location (zip code), and dependent status
- [ ] BAS auto-populates based on rank (enlisted vs. officer)
- [ ] User can input up to 3 civilian salary scenarios
- [ ] State tax is calculated for all 50 states (including 0% states)
- [ ] Federal tax uses current year tax brackets
- [ ] Output displays monthly and annual net take-home for military and each civilian scenario
- [ ] Output includes disclaimer about estimate nature and recommendation to consult tax professional
- [ ] Results can be saved via email capture
- [ ] Mobile responsive design

**Success Metrics:**
- Completion rate: 60%
- Email capture rate: 35%
- Return usage (compare new scenarios): 25%

---

#### Feature 1.2: VA Loan Rent vs. Buy Calculator

**Problem it solves:**

Veterans have access to VA loans (0% down, no PMI) but don't know how to factor this advantage into rent vs. buy decisions for their specific situation.

**User Story:**
*As a veteran considering where to live, I want to compare renting vs. buying with my VA loan benefit so that I can make an informed housing decision that optimizes my financial position.*

**Key Functionality:**
- Input monthly rent for comparison
- Input home price, property tax rate, insurance estimate
- VA loan specifics: 0% down, no PMI, current VA loan rates
- Calculate total cost of ownership vs. renting over 1, 3, 5, 10 year horizons
- Factor in opportunity cost of down payment (invested vs. equity)
- Show break-even point for buying vs. renting

**Acceptance Criteria:**
- [ ] User can input current/proposed rent amount
- [ ] User can input target home price
- [ ] VA funding fee is calculated based on first-time vs. subsequent use, down payment amount, and service type (regular vs. Reserves/Guard)
- [ ] User can select loan term (15 or 30 year)
- [ ] Interest rate defaults to current VA loan average with option to override
- [ ] Property tax and insurance can be estimated from zip code or manually input
- [ ] Output shows total cost comparison at 1, 3, 5, and 10 year marks
- [ ] Output shows monthly cash flow comparison
- [ ] Break-even year is clearly displayed
- [ ] Graph visualizes cumulative cost over time
- [ ] Results can be saved/shared via email capture

**Success Metrics:**
- Completion rate: 55%
- Email capture rate: 40%
- Referral traffic (shared links): 15% of sessions

---

#### Feature 1.3: Compensation Comparison Tool

**Problem it solves:**
> *"Comp calculator for direct comparisons, load multiple jobs"* - J. Austin Tortorici
> *"Plug-and-play comp modeling, equity education for venture-backed"* - Tom Dugan

Job offers have complex compensation structures (base, bonus, equity, benefits). Veterans struggle to compare total compensation across different offer types.

**User Story:**
*As a veteran evaluating job offers, I want to input and compare total compensation across multiple offers so that I can make an apples-to-apples decision about which opportunity provides the best financial outcome.*

**Key Functionality:**
- Input multiple offers (2-4)
- Break down each offer: base salary, signing bonus, annual bonus (target %), equity/stock
- Equity calculator: options, RSUs, grant value, vesting schedule, strike price
- Benefits value estimator: healthcare, 401k match, PTO days
- Location-adjusted comparison (cost of living)
- Total compensation over 1, 2, 4 year horizons (vesting schedules vary)

**Acceptance Criteria:**
- [ ] User can input 2-4 job offers for comparison
- [ ] Each offer captures: base salary, signing bonus, annual bonus target %, bonus likelihood (guaranteed vs. variable)
- [ ] Equity section handles: stock options (grant size, strike price, current/expected value), RSUs (grant value), vesting schedule (1-4 year with cliff)
- [ ] 401k match can be input as match % and cap
- [ ] Healthcare is valued using national average benchmarks (single, family)
- [ ] PTO is valued as days x daily rate
- [ ] Remote vs. in-office flag affects comparison
- [ ] Output shows total comp over Year 1, Year 2, Year 4
- [ ] Output shows monthly "paycheck equivalent" after benefits
- [ ] Equity disclaimer explains risk and liquidity considerations
- [ ] Side-by-side comparison table with clear winner highlighted per timeframe

**Success Metrics:**
- Completion rate: 45%
- Email capture rate: 50% (highest - active decision-makers)
- Average offers compared: 2.5

---

### Phase 2: Career Translation Tools

#### Feature 2.1: AI Resume Builder

**Problem it solves:**
> *"Resume formatting and tailoring"* - Travis DeFreest
> *"Skills identification tool (org/leadership/technical) to tailor resume to specific market"* - Jaime Padilla

Veterans can't articulate military experience in civilian terms. They either undersell (too modest) or confuse (too much jargon).

**User Story:**
*As a transitioning veteran, I want to input my military experience and target role so that I receive a professionally translated resume that positions my experience effectively for civilian employers.*

**Key Functionality:**
- Input: military branch, rank, MOS/AFSC/rating, years of service, key accomplishments
- Input: target role or industry (PM, operations, leadership, tech, sales)
- AI translation: convert military jargon to civilian language
- Bullet generation: transform military accomplishments into impact-driven bullets
- Skills extraction: parse experience into organizational, leadership, and technical skills
- Output: formatted resume content (not just suggestions)
- Multiple formats: chronological, functional, hybrid

**Acceptance Criteria:**
- [ ] User can select branch (Army, Navy, Air Force, Marines, Coast Guard, Space Force)
- [ ] User can input MOS/AFSC/rating code or select from searchable list
- [ ] User can input rank and years at each rank
- [ ] User can input 3-5 key accomplishments with military terminology
- [ ] User can select target industry/role from curated list
- [ ] AI generates translated job descriptions for each role
- [ ] AI generates 3-5 quantified bullet points per role
- [ ] AI extracts and categorizes skills (org, leadership, technical)
- [ ] Output includes ATS-optimized formatting
- [ ] User can iterate/refine output with follow-up prompts
- [ ] Download available in PDF and Word formats (email capture required)
- [ ] Processing time < 30 seconds

**Success Metrics:**
- Completion rate: 50%
- Email capture rate: 60% (download requires)
- Resume downloads: 70% of completions
- Return to iterate: 30%

---

#### Feature 2.2: Defense to Corporate Translator

**Problem it solves:**
> *"Defense to corporate translator (military staff functions to business functions)"* - Madeleine Bursaw

Veterans don't know that their military staff functions (G1/G2/G3/G4/G6/G8) map directly to corporate functions (HR, intelligence/strategy, operations, supply chain, IT, finance). They search for "veteran jobs" instead of targeting the right functional area.

**User Story:**
*As a veteran with staff experience, I want to understand how my military function translates to corporate departments so that I can target the right roles and speak the right language.*

**Key Functionality:**
- Input: military staff section or functional area
- Output: corporate equivalent with explanation
- Role mapping: specific job titles that align
- Skill translation: military skills to corporate competencies
- Example transitions: real examples of veterans who made similar moves

**Acceptance Criteria:**
- [ ] Comprehensive mapping of military staff functions (G/J/A/N/S staff for each branch)
- [ ] Each mapping includes: corporate equivalent, typical job titles, key skills that transfer, common industries
- [ ] Mapping covers: G1/HR, G2/Strategy & Intelligence, G3/Operations, G4/Supply Chain & Logistics, G5/Planning & Partnerships, G6/IT & Technology, G8/Finance & FP&A
- [ ] MOS/AFSC to function mapping (e.g., 11B Infantry to operations, security, project management)
- [ ] Interactive exploration: click on corporate function to see required skills and how to position
- [ ] "My Path" generator: input military role, get recommended corporate targets
- [ ] Content includes 2-3 example career paths per function (anonymized)
- [ ] Output shareable/saveable via email

**Success Metrics:**
- Engagement rate: 70% (educational, low friction)
- Path generator completions: 40%
- Email capture rate: 25%
- Time on page: > 3 minutes

---

#### Feature 2.3: Degree/Cert ROI Calculator

**Problem it solves:**
> *"Degree/cert ROI calculators with break-even timelines"* - Matthew Wilber
> *"Which certs actually move the needle"* - Hunter Richardson

Veterans over-invest in credentials without understanding ROI. They pursue degrees or certifications that don't pay off in their target market.

**User Story:**
*As a veteran considering education investments, I want to calculate the ROI of degrees and certifications so that I invest in credentials that will actually advance my career.*

**Key Functionality:**
- Input: current salary and role
- Input: target credential (degree type, certification, or bootcamp)
- Input: program cost (or auto-populate for common programs)
- Calculate: opportunity cost (lost wages during program)
- Input: expected salary increase or target role salary
- Output: break-even timeline, NPV of investment, risk factors

**Acceptance Criteria:**
- [ ] Library of common credentials with average costs: MBA (top 20, top 50, part-time), MS degrees, PMP, Six Sigma, AWS/cloud certs, CISSP, etc.
- [ ] GI Bill benefit calculation: remaining months, Yellow Ribbon eligibility
- [ ] Opportunity cost accounts for full-time vs. part-time programs
- [ ] Expected salary increase based on market data (with source citation)
- [ ] Break-even displayed in months and years
- [ ] NPV calculation using reasonable discount rate
- [ ] Risk assessment: saturation of credential, industry trends
- [ ] Comparison mode: evaluate 2 credential options side-by-side
- [ ] Output includes "Questions to ask" before committing
- [ ] Disclaimer about individual results varying

**Success Metrics:**
- Completion rate: 55%
- Email capture rate: 35%
- Credential comparison usage: 40%

---

## 6. Feature Roadmap

### Phase 1: Financial Reality Tools (Months 1-2)
**Theme:** Help veterans understand their true financial position

| Tool | Priority | Effort | Ship Target |
|------|----------|--------|-------------|
| Tax Impact Calculator | 1 | Medium | Month 1 |
| VA Loan Rent vs. Buy | 2 | Medium | Month 1 |
| Compensation Comparison Tool | 3 | High | Month 2 |

**Milestone:** 3 financial tools live, 1,000 email captures

### Phase 2: Career Translation Tools (Months 3-4)
**Theme:** Help veterans articulate and position their experience

| Tool | Priority | Effort | Ship Target |
|------|----------|--------|-------------|
| AI Resume Builder | 1 | High | Month 3 |
| Defense to Corporate Translator | 2 | Medium | Month 3 |
| Degree/Cert ROI Calculator | 3 | Medium | Month 4 |

**Milestone:** 6 tools live, 5,000 email captures

### Phase 3: Market Intelligence (Months 5-8)
**Theme:** Help veterans make informed market decisions

| Tool | Priority | Effort | Ship Target |
|------|----------|--------|-------------|
| Where to Live Tool | 1 | Medium | Month 5 |
| Career Field Finder | 2 | High | Month 6 |
| Job Market Heat Map | 3 | High | Month 7-8 |

**Milestone:** 9 tools live, 15,000 email captures

### Future: Community Features (Months 9+)
**Theme:** Connect veterans with peers and resources

Deprioritized until tools prove engagement, but designed with future integration in mind:
- Success/Failure Stories
- Veteran Network Matching
- Professional Referrals Directory
- Guard/Reserves Decision Tool
- Federal vs. Commercial Decisioning
- Pre-MBA Preparation Guide

---

## 7. User Flows

### Flow 1: New User - Tax Calculator to Email Capture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ENTRY POINTS                              │
│  LinkedIn post | Sitreps.com homepage | Google "military to     │
│  civilian salary calculator" | Peer referral                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LANDING / TOOLS HUB                          │
│  Clear value prop: "Make smarter transition decisions"          │
│  Tool cards with 1-line descriptions                            │
│  CTA: "Start with your financial reality"                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TAX CALCULATOR - STEP 1                      │
│  "Let's start with your current military compensation"          │
│  - Select rank (dropdown)                                        │
│  - Enter zip code (auto-fill BAH)                               │
│  - Dependents Y/N                                                │
│  Progress: Step 1 of 3                                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TAX CALCULATOR - STEP 2                      │
│  Auto-calculated military comp displayed                         │
│  "Now enter your civilian offer(s)"                             │
│  - Salary input                                                  │
│  - State (for tax calculation)                                   │
│  - Add another offer? (+)                                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TAX CALCULATOR - RESULTS                     │
│  Side-by-side comparison: Military vs. Civilian                 │
│  Monthly net take-home highlighted                              │
│  "You need $X civilian to match your current military pay"      │
│  Breakdown: Base, BAH, BAS, Tax impact                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                      ┌─────────┴─────────┐
                      ▼                   ▼
        ┌─────────────────────┐  ┌─────────────────────┐
        │   SAVE RESULTS      │  │   EXPLORE MORE      │
        │   Email capture     │  │   Related tools:    │
        │   "Get PDF + alerts │  │   - Comp comparison │
        │   for new tools"    │  │   - Where to live   │
        │                     │  │   - Resume builder  │
        └─────────────────────┘  └─────────────────────┘
                │                         │
                ▼                         ▼
        ┌─────────────────────┐  ┌─────────────────────┐
        │   NURTURE SEQUENCE  │  │   NEXT TOOL         │
        │   Email 1: PDF      │  │   Continues journey │
        │   Email 2: Comp tool│  │   with more context │
        │   Email 3: Sitreps  │  │                     │
        │   programs          │  │                     │
        └─────────────────────┘  └─────────────────────┘
```

**Decision Points:**
1. **Entry:** Do they find the tools hub or get lost on the site?
2. **Tool selection:** Do they pick a relevant starting tool?
3. **Step 1 completion:** Is the military compensation section too complex?
4. **Add additional offers:** Do they input 1, 2, or 3+ scenarios?
5. **Result comprehension:** Do they understand the output?
6. **Email capture:** Is the value exchange clear enough?
7. **Next action:** Do they explore more tools or leave?

**Edge Cases:**
- User doesn't know their zip code (provide lookup or national average option)
- User is Guard/Reserve (different BAH calculation)
- User has special pays (flight pay, hazardous duty) - "add additional pay" option
- User wants to compare to current civilian job, not military (alternate flow)

### Flow 2: Returning User - Evaluating Job Offers

```
┌─────────────────────────────────────────────────────────────────┐
│                        RETURN VISIT                              │
│  Direct link to Compensation Tool or Tools Hub                  │
│  Recognized if email captured: "Welcome back, Marcus"           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     COMPENSATION TOOL                            │
│  Previous session restored? "Continue where you left off"       │
│  Or: "Start fresh comparison"                                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     INPUT OFFER 1                                │
│  Company name (optional, for your reference)                    │
│  Base salary, bonus %, signing bonus                            │
│  Equity: Type, Value, Vesting                                   │
│  Benefits: 401k match, healthcare tier, PTO                     │
│  Location (for COL adjustment)                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     INPUT OFFER 2                                │
│  Same structure as Offer 1                                      │
│  "Add another offer" option                                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     COMPARISON RESULTS                           │
│  Year 1, Year 2, Year 4 total comp                              │
│  Monthly paycheck equivalent                                     │
│  COL-adjusted comparison                                        │
│  "Winner" highlighted per timeframe                             │
│  Risk factors noted (equity uncertainty)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                      ┌─────────┴─────────┐
                      ▼                   ▼
        ┌─────────────────────┐  ┌─────────────────────┐
        │   NEED HELP?        │  │   SHARE / SAVE      │
        │   Talk to Sitreps   │  │   Download PDF      │
        │   advisor for       │  │   Share link        │
        │   negotiation help  │  │   (expires 30 days) │
        └─────────────────────┘  └─────────────────────┘
```

---

## 8. Technical Considerations

### Frontend Approach

**Recommended Stack:**
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS for rapid UI development
- **Components:** shadcn/ui for consistent, accessible components
- **State Management:** React hooks + Context for tool state; consider Zustand if complexity grows
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts or Chart.js for visualizations

**Rationale:**
- Server-side rendering for SEO (tools should be discoverable)
- Static generation for marketing pages
- API routes for calculator logic and AI integrations
- Modern DX for rapid iteration

### Data Requirements

| Data Type | Source | Refresh Frequency |
|-----------|--------|-------------------|
| Military Pay Tables | DFAS | Annual (January) |
| BAH Rates | DFAS by zip code | Annual |
| Federal Tax Brackets | IRS | Annual |
| State Tax Rates | State revenue depts | Annual |
| VA Loan Rates | VA/Freddie Mac | Weekly |
| Cost of Living Index | BLS / Numbeo | Quarterly |
| Certification Salaries | Levels.fyi, Glassdoor API | Quarterly |
| MOS/AFSC Mappings | DOD + manual curation | As needed |

### AI/LLM Integration

| Feature | AI Use | Provider Options |
|---------|--------|------------------|
| Resume Builder | Jargon translation, bullet generation, skills extraction | OpenAI GPT-4 / Claude API |
| Military to Corporate Translator | Role mapping, career path suggestions | Embeddings + RAG for curated knowledge |
| Career Field Finder | Job matching from experience | Vector similarity search |

**Implementation Notes:**
- Use streaming responses for resume generation (perceived performance)
- Implement rate limiting per user session
- Cache common translations/mappings to reduce API costs
- Build evaluation harness to test output quality

### Third-Party Integrations

| Integration | Purpose | Priority |
|-------------|---------|----------|
| Email service (Resend/SendGrid) | Email capture, PDF delivery | P0 |
| Analytics (PostHog/Mixpanel) | Tool usage tracking, funnel analysis | P0 |
| LLM API (OpenAI/Anthropic) | Resume builder, translation | P1 |
| Zillow/Redfin API | Home price estimates by location | P2 |
| Job board APIs | Salary data, role information | P2 |

---

## 9. Design Principles

### Brand Alignment

**Core Attributes:**
- **Veteran-focused:** Design for veterans, by people who understand the transition
- **Professional:** Not gamified or gimmicky; respect the seriousness of career decisions
- **Trustworthy:** Transparent about data sources, limitations, and disclaimers
- **Empowering:** Provide tools and information; let the veteran make the decision

**Visual Language:**
- Clean, structured layouts (not cluttered)
- Data visualizations that clarify, not impress
- Military-adjacent but not militaristic (no camo, dog tags, or flag imagery overload)
- Professional color palette (blues, grays, accents)

### UX Principles

1. **Simplicity First:** Start with minimal inputs; progressive disclosure for advanced options
2. **Immediate Value:** Show output as soon as possible; avoid long forms before any results
3. **Actionable Outputs:** Every result includes "what to do next"
4. **Mobile-First:** Many veterans browse on mobile during transition; full functionality on mobile
5. **Save Progress:** Never lose user input; allow save/resume for complex tools
6. **No Dead Ends:** Every completion suggests a related tool or next step

### Accessibility Requirements

- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all tools
- Screen reader compatible (proper ARIA labels)
- Color contrast ratios meet standards
- No information conveyed by color alone
- Form error messages are clear and specific

---

## 10. Success Metrics & KPIs

### Engagement Metrics

| Metric | Definition | Target (Month 3) | Target (Month 6) |
|--------|------------|------------------|------------------|
| Monthly Tool Sessions | Unique sessions with tool interaction | 5,000 | 15,000 |
| Tool Completion Rate | % of started tools that reach results | 50% | 55% |
| Pages per Session | Average pages viewed | 2.5 | 3.0 |
| Time on Site | Average session duration | 3 min | 4 min |
| Return Visitor Rate | % of visitors returning within 30 days | 20% | 30% |

### Conversion Metrics

| Metric | Definition | Target (Month 3) | Target (Month 6) |
|--------|------------|------------------|------------------|
| Email Capture Rate | % of completions with email | 35% | 40% |
| Total Email Captures | Cumulative email list size | 2,000 | 6,000 |
| Tool User to Program Inquiry | % who contact Sitreps services | 2% | 3% |
| Tool User to Program Enrollment | % who enroll in paid programs | 0.5% | 1% |

### Retention Metrics

| Metric | Definition | Target (Month 3) | Target (Month 6) |
|--------|------------|------------------|------------------|
| Multi-Tool Usage | % using 2+ tools | 25% | 35% |
| 30-Day Return Rate | % returning within 30 days | 20% | 30% |
| Email Open Rate | Nurture sequence opens | 40% | 45% |
| Email Click Rate | Nurture sequence clicks | 10% | 12% |

### Feature-Specific Metrics

| Tool | Primary Metric | Target |
|------|---------------|--------|
| Tax Calculator | Completion with email | 35% |
| VA Loan Calculator | Completion with email | 40% |
| Comp Comparison | Multi-offer usage (2+) | 70% |
| Resume Builder | Download rate | 60% |
| Translator | Time on page | 3+ min |
| Cert ROI | Comparison mode usage | 40% |

---

## 11. Risks & Mitigations

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI outputs are inaccurate or generic | Medium | High | Extensive prompt engineering, human review of samples, feedback loop |
| Calculator data becomes stale | Medium | Medium | Automated data refresh jobs, clear "last updated" timestamps |
| Performance issues under load | Low | Medium | CDN caching, edge computing for calculations, load testing |
| LLM API rate limits or downtime | Medium | High | Fallback to simpler logic, queue system, multiple provider fallback |

### Data Accuracy Concerns

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Tax calculation errors | Medium | High | Partner with tax professional for review, extensive disclaimers, link to IRS |
| BAH/pay table errors | Low | Medium | Automated validation against DFAS source, versioned data |
| ROI projections misleading | Medium | High | Clear assumptions stated, ranges not point estimates, disclaimers |
| Salary data outdated | Medium | Medium | Multiple data sources, show confidence level, date stamps |

**Critical Disclaimers Required:**
- All tools must include clear disclaimers that outputs are estimates
- Tax tools recommend consultation with tax professional
- Financial decisions should involve appropriate advisors
- Past placement data does not guarantee future outcomes

### User Adoption Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Tools don't match user needs | Medium | High | User research before building, beta testing with community |
| Too complex, users abandon | Medium | High | Progressive disclosure, mobile-first design, user testing |
| Privacy concerns about data | Medium | Medium | Clear privacy policy, no data sold, minimal required fields |
| Competition copies tools | Medium | Low | Brand and community moat, continuous improvement, data network effects |

---

## 12. Open Questions

### Decisions Needing Stakeholder Input

1. **Monetization Strategy:** Are tools free forever, or will premium features exist?
   - Implication: Affects UX (aggressive email capture vs. seamless experience)

2. **Data Retention:** How long do we store user-entered data? Can we use it for analytics?
   - Implication: Privacy policy, aggregate insights capabilities

3. **White-Labeling:** Should tools be embeddable by partners (bases, schools)?
   - Implication: Technical architecture, brand exposure vs. control

4. **AI Disclosure:** How prominently do we disclose AI-generated content?
   - Implication: Trust, regulatory considerations

5. **Success Stories Content:** Can we feature real Sitreps placement stories?
   - Implication: Consent process, legal review

### Research Needed Before Building

1. **User Testing:** What's the minimum viable input set for each calculator?
   - Method: Prototype testing with 5-10 transitioning veterans

2. **Data Validation:** Are publicly available salary datasets accurate enough?
   - Method: Compare to Sitreps placement data (ground truth)

3. **Competitive Analysis:** What do existing tools do well/poorly?
   - Method: Audit Military OneSource, TAP materials, competitor tools

4. **Email Capture Value Exchange:** What incentives drive email capture?
   - Method: A/B test different offers (PDF, alerts, community access)

5. **AI Quality Bar:** What's the acceptance threshold for AI-generated resumes?
   - Method: Blind evaluation by recruiters, A/B test with real applications

---

## Appendix A: Feature Request Attribution

All features trace to specific community feedback:

| Feature | Source |
|---------|--------|
| Tax Impact Calculator | Eric D. McKinney |
| VA Loan Rent vs. Buy | Original post mention |
| Compensation Comparison | J. Austin Tortorici, Tom Dugan |
| AI Resume Builder | Travis DeFreest, Jaime Padilla |
| Defense to Corporate Translator | Madeleine Bursaw |
| Degree/Cert ROI | Matthew Wilber, Hunter Richardson |
| Where to Live | Hannah Brachfeld |
| Career Field Finder | Martin Betley Jr. |
| Job Market Heat Map | Wilson Galyean |
| Guard/Reserves Decision | Alan Van Saun |
| Network Matching | Chris Morton |
| Success Stories | Edward Houser |
| Professional Referrals | J. Austin Tortorici |
| Pre-MBA Guide | Kevin Miguel, Quintin Bonner |
| Equity Education | Tom Dugan |
| Reality Check Tool | Nicholis Garcia |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| BAH | Basic Allowance for Housing - tax-free military housing payment based on rank and location |
| BAS | Basic Allowance for Subsistence - tax-free military food payment |
| MOS | Military Occupational Specialty - Army/Marine job code |
| AFSC | Air Force Specialty Code - Air Force job code |
| VA Loan | Veteran Affairs home loan program with 0% down, no PMI |
| TAP | Transition Assistance Program - DoD transition support |
| RSU | Restricted Stock Unit - equity compensation type |
| TSP | Thrift Savings Plan - military 401k equivalent |
| COL | Cost of Living |
| G-Staff | General staff sections (G1-G8) in military organizations |

---

*Document Version History:*
- v1.0 (2026-01-19): Initial PRD based on LinkedIn community feedback
