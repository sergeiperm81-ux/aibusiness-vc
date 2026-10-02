"use client";

/**
 * The Meta pixel, client side. Loads only when a pixel id is configured and
 * the visitor has not declined cookies, and fires the funnel events the ads
 * campaign is optimised on. No personal data is ever passed from here: the
 * pixel sees the page and the event name, nothing about the domain checked.
 */

const CONSENT_KEY = "cookie-consent-v1";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: unknown };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/** The same rule as the analytics: everything unless the visitor said no. */
export function pixelAllowed(): boolean {
  if (!PIXEL_ID) return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) !== "denied";
  } catch {
    return true;
  }
}

/** Installs Meta's loader once and sends the first PageView. Safe to call more than once. */
export function loadMetaPixel(): void {
  if (typeof window === "undefined" || !pixelAllowed() || window.fbq) return;
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) (fbq.callMethod as (...a: unknown[]) => void).apply(fbq, args);
    else (fbq.queue ??= []).push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

export type MetaStandardEvent = "Lead" | "InitiateCheckout" | "Purchase" | "ViewContent";
export type MetaCustomEvent = "ScanStarted" | "ScanCompleted";

/**
 * A standard event. The eventID lets the server-side copy of the same event
 * (Conversions API) be deduplicated by Meta instead of counted twice.
 */
export function metaTrack(event: MetaStandardEvent, params: Record<string, string | number> = {}, eventId?: string): void {
  if (typeof window === "undefined" || !pixelAllowed()) return;
  loadMetaPixel();
  window.fbq?.("track", event, params, eventId ? { eventID: eventId } : undefined);
}

export function metaTrackCustom(event: MetaCustomEvent, params: Record<string, string | number> = {}): void {
  if (typeof window === "undefined" || !pixelAllowed()) return;
  loadMetaPixel();
  window.fbq?.("trackCustom", event, params);
}
