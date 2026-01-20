import { ToolCard } from "@/components/tool-card";

const financialTools = [
  {
    title: "Tax Impact Calculator",
    description: "Compare your military compensation to civilian offers in real take-home terms. Includes BAH, BAS, and state tax calculations.",
    href: "/tools/tax-calculator",
    iconName: "Calculator",
  },
  {
    title: "VA Loan Rent vs Buy",
    description: "Calculate whether renting or buying makes more financial sense with your VA loan benefit. Includes break-even analysis.",
    href: "/tools/va-loan",
    iconName: "Home",
  },
  {
    title: "Compensation Comparison",
    description: "Compare total compensation across multiple job offers including base salary, bonus, equity, and benefits.",
    href: "/tools/compensation",
    iconName: "DollarSign",
  },
];

const careerTools = [
  {
    title: "AI Resume Builder",
    description: "Transform your military experience into a civilian resume. AI-powered translation of military jargon to corporate language.",
    href: "/tools/resume",
    iconName: "FileText",
  },
  {
    title: "Defense to Corporate Translator",
    description: "Understand how your military staff function translates to corporate departments and job titles.",
    href: "/tools/translator",
    iconName: "ArrowRightLeft",
  },
  {
    title: "Degree & Cert ROI Calculator",
    description: "Calculate the return on investment for degrees, certifications, and bootcamps. Includes GI Bill benefits.",
    href: "/tools/roi",
    iconName: "GraduationCap",
  },
];

export const metadata = {
  title: "Tools - Sitreps",
  description: "Free self-service tools for veterans. Calculate compensation, build resumes, and make informed career decisions.",
};

export default function ToolsPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-display tracking-tight text-foreground">
            All Tools
          </h1>
          <p className="mt-4 text-body-lg text-muted-foreground">
            Free self-service tools to help you make informed decisions about your
            career, finances, and transition.
          </p>
        </div>

        {/* Financial Tools Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-h2 text-foreground">Financial Reality Tools</h2>
            <p className="mt-2 text-body text-muted-foreground">
              Understand your true financial position before making major decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {financialTools.map((tool) => (
              <ToolCard
                key={tool.href}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                iconName={tool.iconName}
              />
            ))}
          </div>
        </section>

        {/* Career Tools Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-h2 text-foreground">Career Translation Tools</h2>
            <p className="mt-2 text-body text-muted-foreground">
              Translate your military experience and make informed career decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {careerTools.map((tool) => (
              <ToolCard
                key={tool.href}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                iconName={tool.iconName}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
