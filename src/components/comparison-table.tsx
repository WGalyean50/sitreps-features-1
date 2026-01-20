"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Trophy } from "lucide-react";

interface ComparisonColumn {
  id: string;
  header: string;
  isWinner?: boolean;
}

interface ComparisonRow {
  label: string;
  values: Record<string, string | number>;
  format?: "currency" | "percentage" | "number" | "text";
  highlight?: boolean;
}

interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  className?: string;
  showWinnerBadge?: boolean;
}

export function ComparisonTable({
  columns,
  rows,
  className,
  showWinnerBadge = true,
}: ComparisonTableProps) {
  const formatValue = (value: string | number, format?: ComparisonRow["format"]): string => {
    if (typeof value === "string") return value;

    switch (format) {
      case "currency":
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        });
      case "percentage":
        return `${value}%`;
      case "number":
        return value.toLocaleString("en-US");
      default:
        return String(value);
    }
  };

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground border-b">
              {/* Empty cell for row labels */}
            </th>
            {columns.map((col) => (
              <th
                key={col.id}
                className={cn(
                  "text-center p-4 text-sm font-semibold border-b min-w-[120px]",
                  col.isWinner && "bg-success/5"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  {col.isWinner && showWinnerBadge && (
                    <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                      <Trophy className="h-3 w-3" />
                      Winner
                    </span>
                  )}
                  <span>{col.header}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={cn(
                "border-b last:border-b-0",
                row.highlight && "bg-muted/50"
              )}
            >
              <td className="p-4 text-sm text-foreground font-medium">
                {row.label}
              </td>
              {columns.map((col) => {
                const value = row.values[col.id];
                const isWinnerCell = col.isWinner && row.highlight;

                return (
                  <td
                    key={col.id}
                    className={cn(
                      "p-4 text-center text-sm",
                      col.isWinner && "bg-success/5",
                      isWinnerCell && "font-semibold text-success"
                    )}
                  >
                    {formatValue(value, row.format)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Simpler comparison for two values
interface SimpleComparisonProps {
  label: string;
  leftValue: string | number;
  leftLabel: string;
  rightValue: string | number;
  rightLabel: string;
  format?: "currency" | "percentage" | "number";
  winner?: "left" | "right" | "tie";
  className?: string;
}

export function SimpleComparison({
  label,
  leftValue,
  leftLabel,
  rightValue,
  rightLabel,
  format = "currency",
  winner,
  className,
}: SimpleComparisonProps) {
  const formatValue = (value: string | number): string => {
    if (typeof value === "string") return value;

    switch (format) {
      case "currency":
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        });
      case "percentage":
        return `${value}%`;
      case "number":
        return value.toLocaleString("en-US");
      default:
        return String(value);
    }
  };

  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      <div className="text-sm font-medium text-muted-foreground mb-3">{label}</div>
      <div className="grid grid-cols-2 gap-4">
        <div
          className={cn(
            "text-center p-3 rounded-md",
            winner === "left" ? "bg-success/10 ring-2 ring-success/30" : "bg-muted"
          )}
        >
          <div className="text-xs text-muted-foreground mb-1">{leftLabel}</div>
          <div className={cn(
            "text-xl font-bold",
            winner === "left" && "text-success"
          )}>
            {formatValue(leftValue)}
          </div>
          {winner === "left" && (
            <Check className="h-4 w-4 text-success mx-auto mt-1" />
          )}
        </div>
        <div
          className={cn(
            "text-center p-3 rounded-md",
            winner === "right" ? "bg-success/10 ring-2 ring-success/30" : "bg-muted"
          )}
        >
          <div className="text-xs text-muted-foreground mb-1">{rightLabel}</div>
          <div className={cn(
            "text-xl font-bold",
            winner === "right" && "text-success"
          )}>
            {formatValue(rightValue)}
          </div>
          {winner === "right" && (
            <Check className="h-4 w-4 text-success mx-auto mt-1" />
          )}
        </div>
      </div>
    </div>
  );
}
