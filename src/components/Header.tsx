import Link from "next/link";

const navigation = [
  { name: "Earn", href: "/earn" },
  { name: "Tools", href: "/tools" },
  { name: "News", href: "/news" },
  { name: "Learn", href: "/learn" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Impact", href: "/impact" },
];

export function Header() {
  return (
    <header className="border-b border-card-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-accent font-bold text-xl tracking-tight">
              AI
            </span>
            <span className="font-semibold text-lg text-foreground">
              Business
            </span>
            <span className="text-xs text-muted font-mono">.vc</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card-bg"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/newsletter"
              className="px-4 py-2 text-sm font-medium bg-accent text-background rounded-lg hover:bg-accent-hover transition-colors"
            >
              Subscribe
            </Link>
          </div>

          <MobileMenuButton />
        </div>
      </nav>
    </header>
  );
}

function MobileMenuButton() {
  return (
    <div className="md:hidden">
      <Link
        href="/earn"
        className="px-3 py-2 text-sm text-muted hover:text-foreground"
      >
        Menu
      </Link>
    </div>
  );
}
