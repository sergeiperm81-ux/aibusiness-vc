"use client";

export type AnalyticsValue = string | number | boolean | null | undefined;
export type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function cleanParams(params: AnalyticsParams): Record<string, string | number | boolean> {
  return Object.entries(params).reduce<Record<string, string | number | boolean>>((acc, [key, value]) => {
    if (value === null || value === undefined) return acc;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  const payload = cleanParams(params);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...payload });
  }
}
