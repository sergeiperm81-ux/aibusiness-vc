"use client";

import { useEffect, useState } from "react";

/**
 * Back-to-top button for long pages.
 *
 * The home page and the section pages run for several screens, and the menu
 * lives only at the very top, so returning there meant a long scroll. The
 * button stays out of the way until the reader is well past the first screen.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        const start = window.scrollY;
        setVisible(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Some browsers ignore smooth scrolling entirely; jump instead of doing nothing.
        window.setTimeout(() => {
          if (Math.abs(window.scrollY - start) < 4) window.scrollTo(0, 0);
        }, 150);
      }}
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-black shadow-lg transition hover:bg-accent-hover"
    >
      <span aria-hidden className="text-lg font-bold leading-none">&uarr;</span>
    </button>
  );
}
