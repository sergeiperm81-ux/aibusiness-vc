"use client";

import { trackEvent } from "./analytics";

export type ScanKind = "person" | "company";
/**
 * preview_failed is the server or the network not answering. An input the form
 * refused is preview_rejected_<reason>: the reason sits in the event name, so
 * it shows in reports without a custom dimension. The typed text is never sent.
 */
export type ScanEvent =
  | "preview_started"
  | "preview_completed"
  | "preview_failed"
  | "checkout_started"
  | `preview_rejected_${string}`;

const CONSENT_KEY = "cookie-consent-v1";

/**
 * True unless the visitor has declined analytics cookies. Before a choice is
 * made, Google Consent Mode sends events cookieless; after a decline they are
 * not sent at all.
 */
function analyticsAllowed(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_KEY) !== "denied";
  } catch {
    return true;
  }
}

/** A funnel event for the scans, with the scan kind and no personal data: no link, no name, no email. */
export function trackScan(event: ScanEvent, kind: ScanKind, extra: { reason?: string } = {}): void {
  if (typeof window === "undefined" || !analyticsAllowed()) return;
  trackEvent(event, { scan_kind: kind, ...(extra.reason ? { reason: extra.reason } : {}) });
}
