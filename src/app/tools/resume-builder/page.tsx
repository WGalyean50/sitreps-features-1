"use client";

import * as React from "react";
import { ToolLayout, ToolSection } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveResultsButton } from "@/components/save-results-button";
import { AIDisclaimer } from "@/components/disclaimer";
import { StepIndicator } from "@/components/step-indicator";
import * as analytics from "@/lib/analytics";
import {
  FileText,
  Plus,
  X,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Download,
} from "lucide-react";

// Military branches
const BRANCHES = [
  { value: "army", label: "Army" },
  { value: "navy", label: "Navy" },
  { value: "air-force", label: "Air Force" },
  { value: "marines", label: "Marine Corps" },
  { value: "coast-guard", label: "Coast Guard" },
  { value: "space-force", label: "Space Force" },
];

// Target industries
const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "consulting", label: "Consulting" },
  { value: "finance", label: "Finance & Banking" },
  { value: "healthcare", label: "Healthcare" },
  { value: "defense", label: "Defense Contractors" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "logistics", label: "Logistics & Supply Chain" },
  { value: "government", label: "Government (Civilian)" },
  { value: "energy", label: "Energy" },
  { value: "other", label: "Other" },
];

export default function ResumeBuilderPage() {
  // Step state
  const [step, setStep] = React.useState(1);

  // Form state
  const [branch, setBranch] = React.useState("");
  const [rank, setRank] = React.useState("");
  const [mosAfsc, setMosAfsc] = React.useState("");
  const [yearsOfService, setYearsOfService] = React.useState<number>(4);
  const [accomplishments, setAccomplishments] = React.useState<string[]>(["", "", ""]);
  const [targetIndustry, setTargetIndustry] = React.useState("");
  const [targetRole, setTargetRole] = React.useState("");
  const [additionalContext, setAdditionalContext] = React.useState("");

  // Generation state
  const [generating, setGenerating] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Track tool start
  React.useEffect(() => {
    analytics.toolStarted("resume-builder");
  }, []);

  // Add accomplishment
  const addAccomplishment = () => {
    if (accomplishments.length < 6) {
      setAccomplishments([...accomplishments, ""]);
    }
  };

  // Remove accomplishment
  const removeAccomplishment = (index: number) => {
    if (accomplishments.length > 2) {
      setAccomplishments(accomplishments.filter((_, i) => i !== index));
    }
  };

  // Update accomplishment
  const updateAccomplishment = (index: number, value: string) => {
    const updated = [...accomplishments];
    updated[index] = value;
    setAccomplishments(updated);
  };

  // Validate step 1
  const canProceedToStep2 = branch && mosAfsc;

  // Validate step 2
  const filledAccomplishments = accomplishments.filter((a) => a.trim().length > 0);
  const canGenerate = filledAccomplishments.length >= 2 && targetIndustry;

  // Generate resume content
  const generateResume = async () => {
    setGenerating(true);
    setError(null);
    setGeneratedContent("");

    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch,
          rank,
          mosAfsc,
          yearsOfService,
          accomplishments: filledAccomplishments,
          targetIndustry,
          targetRole,
          additionalContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate resume");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                content += data.text;
                setGeneratedContent(content);
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }

      setStep(3);
      analytics.toolCompleted("resume-builder", {
        branch,
        targetIndustry,
        accomplishmentsCount: filledAccomplishments.length,
      });
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate resume");
    } finally {
      setGenerating(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Download as text file
  const downloadAsText = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-content.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="AI Resume Builder"
      description="Transform your military experience into a compelling civilian resume with AI-powered translation"
    >
      <div className="space-y-8">
        <StepIndicator currentStep={step} totalSteps={3} className="mb-8" />

        {/* Step 1: Military Background */}
        {step === 1 && (
          <ToolSection>
            <h2 className="text-h3 font-semibold mb-6">Step 1: Your Military Background</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Branch */}
              <div>
                <Label htmlFor="branch">Branch of Service *</Label>
                <select
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="">Select branch...</option>
                  {BRANCHES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rank */}
              <div>
                <Label htmlFor="rank">Rank at Separation</Label>
                <Input
                  id="rank"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="e.g., Captain, Staff Sergeant, Petty Officer"
                  className="mt-1"
                />
              </div>

              {/* MOS/AFSC */}
              <div>
                <Label htmlFor="mosAfsc">MOS / AFSC / Rating *</Label>
                <Input
                  id="mosAfsc"
                  value={mosAfsc}
                  onChange={(e) => setMosAfsc(e.target.value)}
                  placeholder="e.g., 11B Infantry, 1N0X1 Intel, IT2"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include the code and title if known
                </p>
              </div>

              {/* Years of Service */}
              <div>
                <Label htmlFor="years">Years of Service</Label>
                <Input
                  id="years"
                  type="number"
                  min={1}
                  max={40}
                  value={yearsOfService}
                  onChange={(e) => setYearsOfService(parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!canProceedToStep2} size="lg">
                Continue
              </Button>
            </div>
          </ToolSection>
        )}

        {/* Step 2: Accomplishments & Target */}
        {step === 2 && (
          <ToolSection>
            <h2 className="text-h3 font-semibold mb-2">Step 2: Accomplishments & Target Role</h2>
            <p className="text-muted-foreground mb-6">
              List 2-6 key accomplishments from your military career. Be specific with numbers and results.
            </p>

            {/* Accomplishments */}
            <div className="space-y-4 mb-8">
              <Label>Key Accomplishments *</Label>
              {accomplishments.map((acc, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={acc}
                      onChange={(e) => updateAccomplishment(index, e.target.value)}
                      placeholder={`Accomplishment ${index + 1} (e.g., "Led 15-person team during deployment, achieving 100% mission success rate")`}
                    />
                  </div>
                  {accomplishments.length > 2 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeAccomplishment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {accomplishments.length < 6 && (
                <Button variant="outline" onClick={addAccomplishment} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" /> Add Accomplishment
                </Button>
              )}
            </div>

            {/* Target Industry */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div>
                <Label htmlFor="industry">Target Industry *</Label>
                <select
                  id="industry"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="">Select industry...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.label}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="role">Target Role (Optional)</Label>
                <Input
                  id="role"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Program Manager, Operations Director"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Additional Context */}
            <div className="mb-6">
              <Label htmlFor="context">Additional Context (Optional)</Label>
              <textarea
                id="context"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Any additional skills, certifications, education, or context you'd like included..."
                className="mt-1 w-full px-3 py-2 border rounded-lg bg-background min-h-[100px]"
              />
            </div>

            {error && (
              <div className="p-4 mb-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={generateResume}
                disabled={!canGenerate || generating}
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Resume Content
                  </>
                )}
              </Button>
            </div>

            {/* Show streaming content during generation */}
            {generating && generatedContent && (
              <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Generating...</span>
                </div>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {generatedContent}
                </div>
              </div>
            )}
          </ToolSection>
        )}

        {/* Step 3: Results */}
        {step === 3 && generatedContent && (
          <div className="space-y-6">
            <ToolSection>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-h3 font-semibold">Your Generated Resume Content</h2>
                    <p className="text-muted-foreground">
                      Review, edit, and copy to your resume
                    </p>
                  </div>
                </div>
                <SaveResultsButton toolName="resume-builder" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mb-6">
                <Button variant="outline" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" /> Copy to Clipboard
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={downloadAsText}>
                  <Download className="h-4 w-4 mr-2" /> Download as Text
                </Button>
              </div>

              {/* Generated content */}
              <div className="p-6 bg-muted/30 rounded-lg border">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {generatedContent}
                </div>
              </div>
            </ToolSection>

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Edit Inputs
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedContent("");
                  setStep(1);
                }}
              >
                Start Over
              </Button>
            </div>
          </div>
        )}

        {/* AI Disclaimer */}
        <AIDisclaimer />
      </div>
    </ToolLayout>
  );
}
