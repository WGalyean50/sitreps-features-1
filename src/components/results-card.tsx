"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ResultsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  highlight?: boolean;
  variant?: "default" | "success" | "warning" | "info";
  className?: string;
  children?: React.ReactNode;
}

export function ResultsCard({
  title,
  value,
  subtitle,
  highlight = false,
  variant = "default",
  className,
  children,
}: ResultsCardProps) {
  const variantStyles = {
    default: "bg-card",
    success: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
    info: "bg-info/10 border-info/20",
  };

  const valueStyles = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    info: "text-info",
  };

  return (
    <Card
      className={cn(
        "transition-all",
        variantStyles[variant],
        highlight && "ring-2 ring-primary ring-offset-2",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", valueStyles[variant])}>
          {typeof value === "number" ? value.toLocaleString("en-US") : value}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
}

// Compound component for displaying a list of result items
interface ResultsListProps {
  children: React.ReactNode;
  className?: string;
}

export function ResultsList({ children, className }: ResultsListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}

interface ResultsListItemProps {
  label: string;
  value: string | number;
  variant?: "default" | "muted";
}

export function ResultsListItem({ label, value, variant = "default" }: ResultsListItemProps) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className={cn(
        "text-sm",
        variant === "muted" ? "text-muted-foreground" : "text-foreground"
      )}>
        {label}
      </span>
      <span className={cn(
        "text-sm font-medium",
        variant === "muted" ? "text-muted-foreground" : "text-foreground"
      )}>
        {typeof value === "number"
          ? value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
          : value
        }
      </span>
    </div>
  );
}
