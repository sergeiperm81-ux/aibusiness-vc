"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent-v1";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function applyConsent(granted: boolean) {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }
}

/**
 * Cookie consent banner using Google Consent Mode v2.
 * Analytics defaults to "denied" (set in layout before gtag config); this banner
 * lets the visitor grant or decline. Choice persists in localStorage. Visitors can
 * reopen it via the "Cookie preferences" footer link (custom "open-cookie-settings" event).
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable — fall through and show the banner
    }

    if (stored === "granted") {
      applyConsent(true);
    } else if (stored === "denied") {
      applyConsent(false);
    } else {
      setVisible(true);
    }

    function reopen() {
      setVisible(true);
    }
    window.addEventListener("open-cookie-settings", reopen);
    return () => window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  function choose(granted: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    } catch {
      // ignore persistence failure — consent still applies for this session
    }
    applyConsent(granted);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-card-border bg-background/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs leading-relaxed text-white/70 sm:max-w-2xl">
          We use analytics cookies to understand how this site is used. They load only if you
          accept. See our{" "}
          <a href="/privacy" className="font-medium text-accent underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose(false)}
            className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/5"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-black transition hover:brightness-95"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
