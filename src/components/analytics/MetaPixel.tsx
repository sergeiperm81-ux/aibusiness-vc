"use client";

import { useEffect } from "react";
import { loadMetaPixel, metaTrack, metaTrackCustom, type MetaCustomEvent, type MetaStandardEvent } from "@/lib/meta-pixel";

/**
 * Mounted once in the layout. Loads the pixel when it is allowed, and again
 * the moment a visitor accepts cookies, so an accept on the first page is not
 * lost until the next one.
 */
export function MetaPixel() {
  useEffect(() => {
    loadMetaPixel();
    const onConsent = (event: Event): void => {
      if ((event as CustomEvent<boolean>).detail) loadMetaPixel();
    };
    window.addEventListener("cookie-consent", onConsent);
    return () => window.removeEventListener("cookie-consent", onConsent);
  }, []);
  return null;
}

interface MetaEventProps {
  readonly standard?: MetaStandardEvent;
  readonly custom?: MetaCustomEvent;
  readonly params?: Record<string, string | number>;
  /** Shared with the server copy of the same event, so Meta counts it once. */
  readonly eventId?: string;
}

/** Fires an event once when the page it sits on has rendered. */
export function MetaEvent({ standard, custom, params = {}, eventId }: MetaEventProps) {
  useEffect(() => {
    if (custom) metaTrackCustom(custom, params);
    if (standard) metaTrack(standard, params, eventId);
    // Once per mount on purpose: a re-render is not a second conversion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
