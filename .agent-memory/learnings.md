# Learnings

<!--
Record friction points, failed approaches, and solutions here.
Format: brief, actionable insights (not session logs).
Example: "Auth header requires 'Bearer ' prefix with trailing space"
-->

## Project-Specific Context
- Stack: Next.js 14+ (App Router), Tailwind CSS, shadcn/ui
- North star metric: Tool Completion Rate with Email Capture (40% target)
- This is a veteran-focused site - design must be professional, not militaristic

## Known Constraints
- All components must be mobile-first and WCAG 2.1 AA compliant
- Email capture is required for saving results (lead gen strategy)
- AI resume builder needs streaming responses for perceived performance

## Learnings
- create-next-app fails with existing files in directory; set up manually with package.json, tsconfig, configs
- Ports 3000-3002 often in use; dev server auto-increments to available port
- Cannot pass React components (like LucideIcon) from Server to Client Components; use icon name string and map in client component

