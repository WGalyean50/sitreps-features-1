import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60 seconds for generation

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ResumeGenerateRequest {
  branch: string;
  rank: string;
  mosAfsc: string;
  yearsOfService: number;
  accomplishments: string[];
  targetIndustry: string;
  targetRole?: string;
  additionalContext?: string;
}

/**
 * POST /api/resume/generate
 *
 * Generates civilian resume content from military experience using Claude
 * Returns a streaming response for real-time updates
 */
export async function POST(request: NextRequest) {
  try {
    const body: ResumeGenerateRequest = await request.json();

    // Validate required fields
    if (!body.branch || !body.mosAfsc || !body.accomplishments?.length) {
      return new Response(
        JSON.stringify({ error: "Branch, MOS/AFSC, and accomplishments are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (body.accomplishments.length < 2 || body.accomplishments.length > 6) {
      return new Response(
        JSON.stringify({ error: "Please provide 2-6 accomplishments" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build the prompt
    const prompt = buildPrompt(body);

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      system: `You are an expert military-to-civilian career translator with deep knowledge of both military operations and corporate hiring practices. Your task is to translate military experience into compelling civilian resume content that:

1. Eliminates military jargon and acronyms
2. Quantifies achievements with specific numbers and percentages
3. Highlights transferable leadership, technical, and soft skills
4. Uses action verbs that resonate with civilian recruiters
5. Aligns experience with the target industry/role

Be specific, professional, and focus on impact and results. Format your response clearly with sections for Summary, Skills, and Experience bullets.`,
    });

    // Convert the Anthropic stream to a web-standard ReadableStream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const chunk = event.delta.text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[Resume Generate Error]", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate resume content" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function buildPrompt(data: ResumeGenerateRequest): string {
  const accomplishmentsList = data.accomplishments
    .map((a, i) => `${i + 1}. ${a}`)
    .join("\n");

  return `Please translate the following military experience into civilian resume content for the ${data.targetIndustry} industry${data.targetRole ? ` (targeting ${data.targetRole} roles)` : ""}.

## Military Background
- **Branch:** ${data.branch}
- **Rank:** ${data.rank || "Not specified"}
- **MOS/AFSC/Rating:** ${data.mosAfsc}
- **Years of Service:** ${data.yearsOfService || "Not specified"}

## Key Accomplishments (translate these into civilian terms)
${accomplishmentsList}

${data.additionalContext ? `## Additional Context\n${data.additionalContext}` : ""}

## Please Provide

### 1. Professional Summary (2-3 sentences)
A compelling summary that positions this veteran for civilian roles, highlighting leadership, technical skills, and quantifiable impact.

### 2. Core Competencies / Skills Section
List 8-12 transferable skills that are relevant to the target industry. Group them logically (e.g., Leadership, Technical, Operations).

### 3. Translated Experience Bullets
For each accomplishment provided, create 1-2 professional resume bullets that:
- Start with a strong action verb
- Eliminate all military jargon
- Include specific metrics where possible (numbers, percentages, dollar amounts)
- Connect to civilian business outcomes

### 4. Additional Resume Tips
2-3 specific recommendations for this candidate's resume, tailored to their target industry.`;
}
