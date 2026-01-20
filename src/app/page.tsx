import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tool-card";
import {
  Calculator,
  ArrowRightLeft,
  GraduationCap,
} from "lucide-react";

const featuredTools = [
  {
    title: "Tax Impact Calculator",
    description: "Compare your military compensation to civilian offers in real take-home terms.",
    href: "/tools/tax-calculator",
    iconName: "Calculator",
  },
  {
    title: "VA Loan Rent vs Buy",
    description: "Calculate whether renting or buying makes more financial sense with your VA loan benefit.",
    href: "/tools/va-loan",
    iconName: "Home",
  },
  {
    title: "Compensation Comparison",
    description: "Compare total compensation across multiple job offers including equity and benefits.",
    href: "/tools/compensation",
    iconName: "DollarSign",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-display tracking-tight text-foreground sm:text-display-lg">
              Make Smarter Transition Decisions
            </h1>
            <p className="mt-6 text-body-lg text-muted-foreground">
              Self-service tools built by veterans, for veterans. Calculate your true
              compensation, translate your experience, and plan your next move with
              confidence.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/tools">
                <Button size="lg" className="px-8">
                  Explore Tools
                </Button>
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h1 text-foreground">Financial Reality Tools</h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              Understand your true financial position before making major decisions.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard
                key={tool.href}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                iconName={tool.iconName}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/tools">
              <Button variant="outline" size="lg">
                View All Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="border-t bg-muted/40 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h1 text-foreground">Built for Your Transition</h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              Generic tools don&apos;t understand military compensation, benefits, or career paths.
              Ours do.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-h4 text-foreground">Military-Specific</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                BAH, BAS, TSP matching, VA loans — we factor in what generic calculators miss.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ArrowRightLeft className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-h4 text-foreground">Translation Built In</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Convert military experience to civilian language that recruiters understand.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-h4 text-foreground">Data-Driven Decisions</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Real salary data, ROI calculations, and market intelligence — not guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h1 text-foreground">Ready to Get Started?</h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              All tools are free to use. Get personalized results in minutes.
            </p>
            <div className="mt-10">
              <Link href="/tools">
                <Button size="lg" className="px-8">
                  Explore All Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
