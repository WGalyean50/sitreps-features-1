import * as React from "react";
import Link from "next/link";

const tools = [
  { name: "Military Pay Converter", href: "/tools/tax-calculator" },
  { name: "Veteran Placements Heatmap", href: "/tools/placements" },
  { name: "Offer Comparison Tool", href: "/tools/comp-comparison" },
  { name: "Resume Builder", href: "/tools/resume-builder" },
  { name: "Defense to Corporate Translator", href: "/tools/translator" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold text-primary">
              Sitreps
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Demo features for Sitreps.com
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Tools</h3>
            <ul role="list" className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
              {tools.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Sitreps. Demo site.
          </p>
        </div>
      </div>
    </footer>
  );
}
