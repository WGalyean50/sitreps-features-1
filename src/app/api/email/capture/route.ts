import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count++;
  return false;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, toolName, timestamp } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // In development, log the capture
    // In production, this would integrate with an email service
    // like SendGrid, Mailchimp, ConvertKit, or a database
    console.log("[Email Capture]", {
      email,
      toolName: toolName || "unknown",
      timestamp: timestamp || new Date().toISOString(),
      ip,
    });

    // TODO: Production implementation options:
    // 1. Store in database (Prisma, Drizzle, etc.)
    // 2. Send to email marketing service (ConvertKit, Mailchimp)
    // 3. Add to CRM (HubSpot, Salesforce)
    // 4. Send confirmation email via SendGrid/Resend

    return NextResponse.json(
      { message: "Email captured successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Email Capture Error]", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
