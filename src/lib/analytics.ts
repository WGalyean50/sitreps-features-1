/**
 * Analytics abstraction layer
 *
 * In development: logs events to console
 * In production: replace with PostHog, Mixpanel, or Segment
 *
 * Event types for north star metric (40% Tool Completion Rate with Email):
 * - page_view: User lands on a page
 * - tool_started: User begins using a tool
 * - tool_step_completed: User completes a step in multi-step tool
 * - tool_completed: User finishes tool and sees results
 * - email_captured: User submits email to save results
 */

type EventProperties = Record<string, string | number | boolean | undefined>;

interface AnalyticsEvent {
  name: string;
  properties?: EventProperties;
  timestamp: string;
}

// Standard event names
export const EVENTS = {
  PAGE_VIEW: "page_view",
  TOOL_STARTED: "tool_started",
  TOOL_STEP_COMPLETED: "tool_step_completed",
  TOOL_COMPLETED: "tool_completed",
  EMAIL_CAPTURED: "email_captured",
  EMAIL_MODAL_OPENED: "email_modal_opened",
  EMAIL_MODAL_CLOSED: "email_modal_closed",
  NAV_CLICK: "nav_click",
  CTA_CLICK: "cta_click",
} as const;

// Check if we're in production
const isProduction = process.env.NODE_ENV === "production";

// Development logger
function logEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  console.log(
    `%c[Analytics] ${event.name}`,
    "color: #6366f1; font-weight: bold;",
    event.properties || {},
    `@ ${event.timestamp}`
  );
}

/**
 * Track a custom event
 */
export function track(name: string, properties?: EventProperties): void {
  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  if (isProduction) {
    // Production: send to analytics provider
    // PostHog: posthog.capture(name, properties)
    // Mixpanel: mixpanel.track(name, properties)
    // Segment: analytics.track(name, properties)

    // For now, still log in production for debugging
    logEvent(event);
  } else {
    // Development: log to console
    logEvent(event);
  }
}

/**
 * Track page view
 */
export function pageView(path: string, properties?: EventProperties): void {
  track(EVENTS.PAGE_VIEW, {
    path,
    referrer: typeof document !== "undefined" ? document.referrer : undefined,
    ...properties,
  });
}

/**
 * Track tool started
 */
export function toolStarted(
  toolName: string,
  properties?: EventProperties
): void {
  track(EVENTS.TOOL_STARTED, {
    tool_name: toolName,
    ...properties,
  });
}

/**
 * Track tool step completed
 */
export function toolStepCompleted(
  toolName: string,
  step: number,
  totalSteps: number,
  properties?: EventProperties
): void {
  track(EVENTS.TOOL_STEP_COMPLETED, {
    tool_name: toolName,
    step,
    total_steps: totalSteps,
    progress_percent: Math.round((step / totalSteps) * 100),
    ...properties,
  });
}

/**
 * Track tool completed
 */
export function toolCompleted(
  toolName: string,
  properties?: EventProperties
): void {
  track(EVENTS.TOOL_COMPLETED, {
    tool_name: toolName,
    ...properties,
  });
}

/**
 * Track email captured
 */
export function emailCaptured(
  toolName: string,
  properties?: EventProperties
): void {
  track(EVENTS.EMAIL_CAPTURED, {
    tool_name: toolName,
    ...properties,
  });
}

/**
 * Identify user (for when we have user accounts)
 */
export function identify(userId: string, traits?: EventProperties): void {
  if (isProduction) {
    // PostHog: posthog.identify(userId, traits)
    // Mixpanel: mixpanel.identify(userId); mixpanel.people.set(traits)
    // Segment: analytics.identify(userId, traits)
  }

  console.log(
    `%c[Analytics] Identify`,
    "color: #6366f1; font-weight: bold;",
    userId,
    traits
  );
}

/**
 * Reset analytics (for logout)
 */
export function reset(): void {
  if (isProduction) {
    // PostHog: posthog.reset()
    // Mixpanel: mixpanel.reset()
    // Segment: analytics.reset()
  }

  console.log(`%c[Analytics] Reset`, "color: #6366f1; font-weight: bold;");
}
