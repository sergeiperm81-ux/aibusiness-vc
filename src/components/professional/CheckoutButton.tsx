"use client";

import { trackScan, type ScanKind } from "@/lib/scan-analytics";

/** The one yellow button on a preview page. Records the click, then goes to the checkout. */
export function CheckoutButton({ href, kind, children }: { href: string; kind: ScanKind; children: React.ReactNode }) {
  return (
    <a
      href={href}
      onClick={() => trackScan("checkout_started", kind)}
      className="flex items-center justify-center gap-3 rounded-2xl bg-accent px-10 py-6 text-3xl font-bold text-black transition hover:bg-accent-hover"
    >
      {children}
      <svg viewBox="0 0 24 24" aria-hidden className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}
