"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface ReadingTrackerProps {
  /** Slug or path, so events can be grouped per article in GA4. */
  readonly contentId: string;
  readonly section?: string;
}

const DEPTHS = [50, 75, 100] as const;

/**
 * Measures whether visitors actually read, not just arrive.
 *
 * Until now the site fired two events in total, so a three-thousand-word
 * article and a bounce looked identical in analytics. Four signals fix that:
 * scroll depth at 50/75/100 per cent, a dwell-based `read_complete`, and clicks
 * on outbound links. Deliberately four and not forty — a hundred half-watched
 * events is worse than a handful anyone actually looks at.
 *
 * Consent is handled upstream by Google's consent mode: when analytics storage
 * is denied these calls are collected without identifiers or dropped entirely,
 * so nothing here needs to know the visitor's choice.
 */
export function ReadingTracker({ contentId, section }: ReadingTrackerProps) {
  const fired = useRef<Set<string>>(new Set());
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    // Mount marker: the component renders nothing, so without this there is no
    // way to tell "not installed" from "installed but not firing".
    document.documentElement.dataset.readingTracker = "on";

    const base = { content_id: contentId, ...(section ? { section } : {}) };

    const fireOnce = (name: string, extra: Record<string, string | number> = {}) => {
      if (fired.current.has(name)) return;
      fired.current.add(name);
      trackEvent(name, { ...base, ...extra });
    };

    // `read_complete` needs both: reaching the end and having spent long enough
    // to plausibly have read it. Either alone is easy to fake by scrolling fast.
    const MIN_READ_SECONDS = 30;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const percent = ((window.scrollY || doc.scrollTop) / scrollable) * 100;

      // Half a percent of tolerance. Sub-pixel scroll positions and browser
      // rounding mean the bottom of a page reads as 99.98%, so a strict
      // `>= 100` test means scroll_100 essentially never fires.
      const TOLERANCE = 0.5;

      for (const depth of DEPTHS) {
        if (percent >= depth - TOLERANCE) fireOnce(`scroll_${depth}`, { depth });
      }

      if (percent >= 90) {
        const seconds = Math.round((Date.now() - startedAt.current) / 1000);
        if (seconds >= MIN_READ_SECONDS) {
          fireOnce("read_complete", { seconds_on_page: seconds });
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href") ?? "";
      if (!href.startsWith("http")) return;

      let host: string;
      try {
        host = new URL(href).hostname;
      } catch {
        return;
      }
      if (host === window.location.hostname) return;

      // Not fireOnce: every outbound click on a page is worth counting.
      trackEvent("outbound_click", { ...base, destination: host });
    };

    // Time-based throttle rather than requestAnimationFrame. rAF is suspended
    // whenever the tab is not compositing, which makes the whole tracker
    // impossible to exercise in an automated browser — and something that can
    // never be tested is something you never find out has broken.
    let lastRun = 0;
    const MIN_GAP_MS = 150;
    const throttled = () => {
      const now = Date.now();
      if (now - lastRun < MIN_GAP_MS) return;
      lastRun = now;
      onScroll();
    };

    window.addEventListener("scroll", throttled, { passive: true });
    document.addEventListener("click", onClick);
    onScroll(); // short pages can already be past 50% on load

    return () => {
      window.removeEventListener("scroll", throttled);
      document.removeEventListener("click", onClick);
    };
  }, [contentId, section]);

  return null;
}
