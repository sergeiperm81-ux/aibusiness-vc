import Link from "next/link";

const mainNav = [
  { name: "News", href: "/news" },
  { name: "Solo", href: "/solo" },
  { name: "Startups", href: "/startups" },
  { name: "B2B", href: "/b2b" },
  { name: "Tools", href: "/tools/directory" },
  { name: "Models", href: "/models" },
  { name: "Learn", href: "/learn" },
  { name: "Materials", href: "/materials" },
];

export function Header() {
  return (
    <header className="border-b border-card-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-accent font-bold text-xl tracking-tight">
              AI
            </span>
            <span className="font-semibold text-lg text-white">Business</span>
            <span className="text-[10px] text-muted font-mono">.vc</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {mainNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-1.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-card-bg"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <Link
              href="/news"
              className="px-3 py-1.5 text-sm text-muted hover:text-white"
            >
              Menu
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
