"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV } from "@/lib/navigation";

export function Header() {
  const pathname = usePathname();

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
              href="/submit-your-story"
              className={`px-3 py-1.5 text-[13px] font-bold rounded-md transition-colors ${
                isActive("/submit-your-story")
                  ? "bg-accent-hover text-black"
                  : "bg-accent text-black hover:bg-accent-hover"
              }`}
            >
              Submit Story
            </Link>
            <Link
              href="/audit"
              className={`px-3 py-1.5 text-[13px] font-bold rounded-md transition-colors ${
                isActive("/audit")
                  ? "bg-accent-hover text-black"
                  : "bg-accent text-black hover:bg-accent-hover"
              }`}
            >
              AI Audit
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/submit-your-story"
              className="px-2.5 py-1 text-[12px] font-bold bg-accent text-black rounded-md"
            >
              Story
            </Link>
            <Link
              href="/audit"
              className="px-2.5 py-1 text-[12px] font-bold bg-accent text-black rounded-md"
            >
              Audit
            </Link>
            <Link
              href="/news"
              className="px-2.5 py-1.5 text-[13px] text-white hover:text-accent"
            >
              Menu
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
