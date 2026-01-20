"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Mail, Check, Loader2 } from "lucide-react";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  toolName?: string;
  onSuccess?: (email: string) => void;
}

export function EmailCaptureModal({
  isOpen,
  onClose,
  title = "Save Your Results",
  description = "Enter your email to save your results and get notified about new tools.",
  toolName,
  onSuccess,
}: EmailCaptureModalProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/email/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          toolName,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save email");
      }

      setStatus("success");
      onSuccess?.(email);

      // Auto-close after success
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setEmail("");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidEmail = validateEmail(email);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-50 w-full max-w-md rounded-lg border bg-card p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-capture-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <Check className="h-6 w-6 text-success" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">You&apos;re all set!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Check your email for your saved results.
            </p>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>

            {/* Title */}
            <h3 id="email-capture-title" className="mt-4 text-lg font-semibold">
              {title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  aria-invalid={status === "error"}
                  aria-describedby={status === "error" ? "email-error" : undefined}
                />
                {status === "error" && (
                  <p id="email-error" className="text-sm text-destructive">
                    {errorMessage}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isValidEmail || status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Results"
                )}
              </Button>
            </form>

            {/* Privacy note */}
            <p className="mt-4 text-center text-xs text-muted-foreground">
              We respect your privacy.{" "}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Hook for managing email capture state
export function useEmailCapture(toolName?: string) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasCaptured, setHasCaptured] = React.useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const onSuccess = () => {
    setHasCaptured(true);
  };

  return {
    isOpen,
    open,
    close,
    hasCaptured,
    onSuccess,
    toolName,
  };
}
