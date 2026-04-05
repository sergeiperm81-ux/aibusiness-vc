"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { name: "News", href: "/news" },
  { name: "Solo", href: "/solo" },
  { name: "Startups", href: "/startups" },
  { name: "VC", href: "/vc" },
  { name: "B2B", href: "/b2b" },
  { name: "Gov", href: "/government" },
  { name: "Tools", href: "/tools" },
  { name: "Models", href: "/models" },
  { name: "Learn", href: "/learn" },
  { name: "Materials", href: "/materials" },
];

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
            {mainNav.map((item) => (
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

          <div className="lg:hidden">
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
