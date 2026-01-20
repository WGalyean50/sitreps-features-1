"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { EmailCaptureModal, useEmailCapture } from "@/components/email-capture-modal";
import { Download, Mail, Check } from "lucide-react";

interface SaveResultsButtonProps {
  toolName: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function SaveResultsButton({
  toolName,
  className,
  variant = "default",
  size = "default",
}: SaveResultsButtonProps) {
  const emailCapture = useEmailCapture(toolName);

  return (
    <>
      <Button
        onClick={emailCapture.open}
        variant={variant}
        size={size}
        className={className}
        disabled={emailCapture.hasCaptured}
      >
        {emailCapture.hasCaptured ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Saved
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Save Results
          </>
        )}
      </Button>

      <EmailCaptureModal
        isOpen={emailCapture.isOpen}
        onClose={emailCapture.close}
        onSuccess={emailCapture.onSuccess}
        toolName={toolName}
        title="Save Your Results"
        description="Enter your email to save your results and receive updates about new tools."
      />
    </>
  );
}
