"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV } from "@/lib/navigation";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Any navigation closes the panel — otherwise it stays open over the new page.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="border-b border-card-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-accent font-bold text-xl tracking-tight">
              AI
            </span>
            <span className="font-semibold text-lg text-white">Business</span>
            <span className="text-[10px] text-white/60 font-mono">.vc</span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-2.5 py-1.5 text-[13px] font-semibold transition-colors rounded-md ${
                  isActive(item.href)
                    ? "text-accent"
                    : "text-white hover:text-accent hover:bg-card-bg"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-2 pl-2 border-l border-card-border">
            <Link
              href="/experts"
              className={`px-3 py-1.5 text-[13px] font-bold rounded-md transition-colors ${
                isActive("/experts")
                  ? "bg-accent-hover text-black"
                  : "bg-accent text-black hover:bg-accent-hover"
              }`}
            >
              AI Experts
            </Link>
            <Link
              href="/submit-your-story"
              className={`px-3 py-1.5 text-[13px] font-bold rounded-md transition-colors ${
                isActive("/submit-your-story")
                  ? "bg-accent-hover text-black"
                  : "bg-accent text-black hover:bg-accent-hover"
              }`}
            >
              Submit Story
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/experts"
              className="px-2.5 py-1 text-[12px] font-bold bg-accent text-black rounded-md"
            >
              Experts
            </Link>
            <Link
              href="/submit-your-story"
              className="px-2.5 py-1 text-[12px] font-bold bg-accent text-black rounded-md"
            >
              Story
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              className="px-2.5 py-1.5 text-[13px] text-white hover:text-accent"
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-nav" className="lg:hidden border-t border-card-border py-3">
            <div className="grid grid-cols-2 gap-1">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-semibold rounded-md ${
                    isActive(item.href)
                      ? "text-accent bg-card-bg"
                      : "text-white hover:text-accent hover:bg-card-bg"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/service-check"
                className="px-3 py-2 text-sm font-semibold rounded-md text-white hover:text-accent hover:bg-card-bg"
              >
                AI Test Purchase
              </Link>
              <Link
                href="/audit"
                className="px-3 py-2 text-sm font-semibold rounded-md text-white hover:text-accent hover:bg-card-bg"
              >
                AI Visibility Audit
              </Link>

            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
