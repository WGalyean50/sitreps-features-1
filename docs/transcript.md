# Sitreps.com Redesign - Feature Analysis

> Based on LinkedIn community feedback from Sitreps 2 Steercos post (20,489 followers)

## Vision

Transform sitreps.com into **THE hub for veterans in business** through self-service tools that help veterans make informed decisions about their careers, finances, and transitions.

## Raw Feedback Summary

### Original Post Mentions
- MBA decision calculator
- Career mapping survey
- AI resume builder
- VA loan rent vs buy calculator
- Personal AI advisor bot (JD Modrak style)

### Community Feature Requests

| Contributor | Feature Request |
|-------------|-----------------|
| Wilson Galyean | Map of US with pins for Sitreps placements + current openings (hot markets) |
| Daniel Morales De La Cruz | Opportunity cost calculator (staying at role vs other offers) |
| Alan Van Saun | Guard/Reserves decision tool (factors: service time, healthcare, pay, pension) |
| J. Austin Tortorici | Comp calculator for direct comparisons, load multiple jobs, vetted professional referrals by location |
| Matthew Wilber | Industry/role viability forecasting (AI displacement), Federal vs commercial decisioning, Degree/cert ROI calculators with break-even timelines |
| Jaime Padilla | Skills identification tool (org/leadership/technical) to tailor resume to specific market |
| Chris Morton | Network matching - find people in your situation (retired 20+, B2B SaaS, PNW, MBA) |
| Quintin Bonner | Enlisted awareness of top MBA opportunities |
| Edward Houser | Success/failure stories podcast - what jobs were awesome vs sucked |
| Nicholis Garcia | Cyber job map, certs vs degrees vs experience reality check, "your experience isn't executive level" reality tool |
| Martin Betley Jr. | Career Field Finder (beyond PM roles), Testimonials/Success Stories, Compensation Negotiation Tool |
| Hannah Brachfeld | Where to live tool (COL, job market, veteran benefits by state) |
| Madeleine Bursaw | Defense to corporate translator (military staff functions → business functions) |
| Hunter Richardson | Health insurance explainer, TSP guidance, which certs actually move the needle |
| Eric D. McKinney | Tax calculator (BAS/BAH + no state tax → full taxation shock) |
| Travis DeFreest | Resume formatting and tailoring |
| Kevin Miguel | Pre-MBA programs guidance ("got into b-school, now what?") |
| Tom Dugan | Plug-and-play comp modeling, equity education for venture-backed (Carta, Shareworks baseline) |

---

## Feature Ranking by Feasibility

*Note: Mentor-related features omitted per request*

### TIER 1 - MOST FEASIBLE
**Static data + simple calculators - can ship fast**

| Priority | Feature | Description | Why Feasible |
|----------|---------|-------------|--------------|
| 1.1 | **Tax Impact Calculator** | Military pay (BAS/BAH/base) vs civilian salary + state, show real take-home | Simple math, high impact, clear pain point |
| 1.2 | **VA Loan Rent vs Buy** | Standard mortgage math with VA loan specifics | Existing formulas, well-defined inputs |
| 1.3 | **Cost of Living / Where to Live** | Aggregate COL, job market, VA benefits by state | Public datasets exist, compilation value |
| 1.4 | **Degree/Cert ROI Calculator** | Program cost vs salary bump, break-even timeline | Clear inputs/outputs, immediate value |
| 1.5 | **MBA Decision Calculator** | Compare costs, opportunity cost, expected outcomes | Builds on existing Sitreps MBA data |

### TIER 2 - MODERATELY FEASIBLE
**AI-powered tools, well-scoped problems**

| Priority | Feature | Description | Why Moderate |
|----------|---------|-------------|--------------|
| 2.1 | **AI Resume Builder/Tailoring** | Military-to-civilian translation, skills mapping | LLM integration, needs good prompting |
| 2.2 | **Defense to Corporate Translator** | Map military billets → business functions | Requires curated mapping data |
| 2.3 | **Compensation Comparison Tool** | Input multiple offers, compare total comp | Needs equity/benefits complexity handling |
| 2.4 | **Military Experience Reality Check** | Honest assessment of military → civilian level translation | Sensitive messaging, needs careful UX |
| 2.5 | **Skills Identification Tool** | Parse military experience into org/leadership/technical | AI + structured output |

### TIER 3 - MODERATE COMPLEXITY
**Requires data collection/curation**

| Priority | Feature | Description | Complexity Factor |
|----------|---------|-------------|-------------------|
| 3.1 | **Career Field Finder** | Roles beyond PM, mapped to military backgrounds | Needs job data aggregation |
| 3.2 | **Job Market Heat Map** | Sitreps placements + openings by geography | Requires placement tracking |
| 3.3 | **Guard/Reserves Decision Tool** | Service time, benefits, pension calculations | Complex benefit rules |
| 3.4 | **Federal vs Commercial Decisioning** | Clearance, risk tolerance, lifestyle factors | Multi-factor decision tree |
| 3.5 | **Industry/Role Viability Forecasting** | What's growing, stable, AI-displaced | Needs labor market data |

### TIER 4 - HIGHER COMPLEXITY
**Community/content features**

| Priority | Feature | Description | Complexity Factor |
|----------|---------|-------------|-------------------|
| 4.1 | **Success/Failure Stories** | Curated testimonials and career paths | Content creation pipeline |
| 4.2 | **Veteran Network Matching** | Connect by situation (rank, industry, location, education) | Full social feature |
| 4.3 | **Professional Referrals Directory** | Vetted RE, insurance, financial planning by location | Vetting process needed |
| 4.4 | **Pre-MBA Preparation Guide** | What to do after acceptance | Content curation |
| 4.5 | **TSP/Health Insurance Education** | Benefits transition guidance | Compliance/accuracy concerns |
| 4.6 | **Equity Education (Venture)** | Stock options, RSUs, vesting explained | Technical + legal nuance |

---

## Recommended MVP Scope

Based on feasibility and impact, recommended first phase:

### Phase 1: Financial Reality Tools
1. **Tax Impact Calculator** - Immediate pain point, high engagement
2. **VA Loan Rent vs Buy** - Already mentioned in post, clear value
3. **Compensation Comparison Tool** - Direct job decision support

### Phase 2: Career Translation Tools
4. **AI Resume Builder** - High demand, AI makes it feasible
5. **Defense to Corporate Translator** - Unique value prop
6. **Degree/Cert ROI Calculator** - Supports education decisions

### Phase 3: Market Intelligence
7. **Where to Live Tool** - Geographic decision support
8. **Career Field Finder** - Expand beyond PM awareness
9. **Job Market Heat Map** - Leverage Sitreps placement data

---

## Success Metrics

- Tool usage (sessions, completions)
- Time on site increase
- Return visitor rate
- Lead generation (email capture for results)
- Conversion to Sitreps programs/services

## User Flows

### Primary User: Transitioning Veteran
1. Land on sitreps.com → See tools dashboard
2. Select relevant tool (tax calc, resume builder, etc.)
3. Input situation-specific data
4. Receive personalized output
5. Option to save/share results (email capture)
6. Recommended next steps / related tools

### Secondary User: Veteran in Career
1. Return for career decision tools
2. Compare job offers
3. Evaluate education ROI
4. Access network/referrals (future)
