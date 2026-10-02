"use client";

import type { ReactNode } from "react";
import { metaTrack } from "@/lib/meta-pixel";
import { trackEvent } from "@/lib/analytics";

interface CheckoutLinkProps {
  readonly href: string;
  readonly value: number;
  readonly currency: string;
  readonly className: string;
  readonly children: ReactNode;
}

/** The buy button: records the click for Meta and GA4, then goes to the checkout. */
export function CheckoutLink({ href, value, currency, className, children }: CheckoutLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        metaTrack("InitiateCheckout", { value, currency, content_name: "AI Fix Kit" });
        trackEvent("begin_checkout", { product: "ai_fix_kit", value, currency });
      }}
    >
      {children}
    </a>
  );
}
