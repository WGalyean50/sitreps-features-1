import * as React from "react";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function ToolLayout({ children, title, description, className }: ToolLayoutProps) {
  return (
    <div className={cn("min-h-screen", className)}>
      {/* Tool Header */}
      <div className="border-b bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-h1 text-foreground">{title}</h1>
          {description && (
            <p className="mt-2 text-body-lg text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Tool Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

// Wrapper for tool steps/sections
interface ToolSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolSection({ children, className }: ToolSectionProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-card", className)}>
      {children}
    </div>
  );
}

// Tool action bar (for navigation between steps)
interface ToolActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolActions({ children, className }: ToolActionsProps) {
  return (
    <div className={cn("flex items-center justify-between pt-6 border-t mt-6", className)}>
      {children}
    </div>
  );
}
