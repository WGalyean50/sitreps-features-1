"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CurrencyInputProps {
  id: string;
  label?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  placeholder = "0",
  min = 0,
  max,
  className,
  error,
  helperText,
  disabled = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>("");

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US");
  };

  // Parse formatted string back to number
  const parseNumber = (str: string): number | undefined => {
    const cleaned = str.replace(/[^0-9]/g, "");
    if (cleaned === "") return undefined;
    const num = parseInt(cleaned, 10);
    if (isNaN(num)) return undefined;
    return num;
  };

  // Sync display value with prop value
  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numValue = parseNumber(inputValue);

    // Validate against min/max
    if (numValue !== undefined) {
      if (min !== undefined && numValue < min) return;
      if (max !== undefined && numValue > max) return;
    }

    setDisplayValue(numValue !== undefined ? formatNumber(numValue) : "");
    onChange(numValue);
  };

  return (
    <div className={cn(label && "space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <span className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
          disabled && "opacity-50"
        )}>
          $
        </span>
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn("pl-7", error && "border-destructive")}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          disabled={disabled}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
}
