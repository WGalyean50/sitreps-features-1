import { ToolCard } from "@/components/tool-card";

const allTools = [
  {
    title: "Military Pay Converter",
    description: "Compare your military compensation to civilian offers. See what salary you need to match your tax-free BAH, BAS, and benefits.",
    href: "/tools/tax-calculator",
    iconName: "Calculator",
  },
  {
    title: "Veteran Placements Heatmap",
    description: "Explore where veterans are getting placed and current job openings. See industry breakdown and salaries by location.",
    href: "/tools/placements",
    iconName: "MapPin",
  },
  {
    title: "Offer Comparison Tool",
    description: "Compare total compensation across multiple job offers including base salary, bonus, equity, and benefits.",
    href: "/tools/comp-comparison",
    iconName: "DollarSign",
  },
  {
    title: "Resume Builder",
    description: "Transform your military experience into a civilian resume. AI-powered translation of military jargon to corporate language.",
    href: "/tools/resume-builder",
    iconName: "FileText",
  },
  {
    title: "Defense to Corporate Translator",
    description: "Understand how your military staff function translates to corporate departments and job titles.",
    href: "/tools/translator",
    iconName: "ArrowRightLeft",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-display tracking-tight text-foreground sm:text-display-lg">
              Demo Features for Sitreps.com
            </h1>
            <p className="mt-6 text-body-lg text-muted-foreground">
              Based on feature requests on{" "}
              <a
                href="https://www.linkedin.com/posts/sitreps-2-steercos_we-are-continuing-to-overhaul-sitreps-dot-activity-7419082631029420032-TKM3?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAnmLtQBnrR5yznpuGDDfIbujQycKwMHQWI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn
              </a>
              , as of 2026-01-19
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Built by{" "}
              <a
                href="https://www.linkedin.com/in/wgalyean/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Wilson Galyean
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allTools.map((tool) => (
              <ToolCard
                key={tool.href}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                iconName={tool.iconName}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
