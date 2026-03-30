import Link from "next/link";

const navigation = [
  { name: "News", href: "/" },
  { name: "Solo", href: "/solo" },
  { name: "Startups", href: "/startups" },
  { name: "B2B", href: "/b2b" },
  { name: "Tools", href: "/tools" },
  { name: "Learn", href: "/learn" },
  { name: "Materials", href: "/materials" },
];

export function Header() {
  return (
    <header className="border-b border-card-border bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-accent font-bold text-xl tracking-tight">
              AI
            </span>
            <span className="font-semibold text-lg text-heading">
              Business
            </span>
            <span className="text-[10px] text-muted font-mono">.vc</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-1.5 text-sm text-muted hover:text-heading transition-colors rounded-md hover:bg-surface"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <Link
            href="/newsletter"
            className="hidden md:inline-flex px-4 py-1.5 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
          >
            Subscribe
          </Link>

          <div className="md:hidden">
            <Link
              href="/"
              className="px-3 py-1.5 text-sm text-muted hover:text-heading"
            >
              Menu
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
