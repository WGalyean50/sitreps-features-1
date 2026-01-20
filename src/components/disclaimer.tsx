"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";

interface DisclaimerProps {
  variant?: "warning" | "info";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Disclaimer({
  variant = "info",
  title,
  children,
  className,
}: DisclaimerProps) {
  const Icon = variant === "warning" ? AlertTriangle : Info;

  const variantStyles = {
    warning: "bg-warning/10 border-warning/20 text-warning-foreground",
    info: "bg-info/10 border-info/20 text-info-foreground",
  };

  const iconStyles = {
    warning: "text-warning",
    info: "text-info",
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variantStyles[variant],
        className
      )}
      role="note"
    >
      <div className="flex gap-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconStyles[variant])} />
        <div className="flex-1">
          {title && (
            <h4 className="font-medium text-sm mb-1">{title}</h4>
          )}
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Pre-configured disclaimers for common use cases
export function TaxDisclaimer({ className }: { className?: string }) {
  return (
    <Disclaimer variant="info" title="Estimate Only" className={className}>
      This calculator provides estimates for informational purposes only.
      Tax situations vary based on individual circumstances. Please consult
      a qualified tax professional for advice specific to your situation.
    </Disclaimer>
  );
}

export function FinancialDisclaimer({ className }: { className?: string }) {
  return (
    <Disclaimer variant="info" title="Not Financial Advice" className={className}>
      This tool is for educational purposes only and does not constitute
      financial advice. Results are estimates based on the information provided.
      Consult with a qualified financial advisor before making major financial decisions.
    </Disclaimer>
  );
}

export function AIDisclaimer({ className }: { className?: string }) {
  return (
    <Disclaimer variant="info" title="AI-Generated Content" className={className}>
      This content was generated using AI technology. While we strive for accuracy,
      please review and verify all information before use. Results may vary based
      on your specific situation and requirements.
    </Disclaimer>
  );
}
