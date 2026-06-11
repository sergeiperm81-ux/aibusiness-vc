import Link from "next/link";
import { MAIN_NAV } from "@/lib/navigation";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";

export function Footer() {
  return (
    <footer className="border-t border-card-border mt-auto bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-accent font-bold text-xl">AI</span>
              <span className="font-semibold text-lg text-white">Business</span>
              <span className="text-xs text-muted font-mono">.vc</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-md">
              Outcome-first analysis of the business of AI: real numbers, practical
              playbooks, and tested tools for operators, founders, and investors.
            </p>
            <div className="mt-4">
              <Link
                href="/audit"
                className="inline-flex items-center rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-black hover:bg-accent-hover transition-colors"
              >
                AI Audit
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted mb-3">Menu</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-white/85 hover:text-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-card-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} aibusiness.vc</p>
          <div className="flex gap-4 text-xs text-muted">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/affiliate-disclosure" className="hover:text-foreground">
              Affiliate Disclosure
            </Link>
            <CookieSettingsLink />
            <Link href="/stats" className="text-muted/50 hover:text-foreground" rel="nofollow">
              Stats
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
