import Link from "next/link";
import { MAIN_NAV } from "@/lib/navigation";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";
import { ContactEmail } from "@/components/ContactEmail";
import { ScrollToTop } from "@/components/ScrollToTop";

/** The author's own side of the site, mirroring the Author's desk on the home page. */
const AUTHOR_DESK = [
  { name: "AI Test Purchase", href: "/service-check" },
  { name: "AI Visibility Audit", href: "/audit" },
  { name: "Author's Library", href: "/library" },
  { name: "Founder's Notes", href: "/notes" },
  { name: "About the author", href: "/sergei-ponomarev" },
];

export function Footer() {
  return (
    <footer className="border-t border-card-border mt-auto bg-background">
      <ScrollToTop />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <span className="text-xl font-bold text-accent">AI</span>
              <span className="text-lg font-semibold text-white">Business</span>
              <span className="font-mono text-xs text-muted">.vc</span>
            </Link>
            <p className="mb-4 max-w-md text-sm leading-relaxed text-muted">
              How AI creates real value for people, and by what rules it works.
            </p>
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-accent">
              Author&apos;s desk
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {AUTHOR_DESK.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
              Sections
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-white/85 transition-colors hover:text-accent"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <p className="mb-3 mt-6 font-mono text-xs uppercase tracking-wider text-muted">
              Take part
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/experts"
                className="inline-flex items-center rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-accent-hover"
              >
                AI Experts
              </Link>
              <Link
                href="/submit-your-story"
                className="inline-flex items-center rounded-md border border-card-border px-3 py-1.5 text-xs font-bold text-white transition-colors hover:border-accent hover:text-accent"
              >
                Submit Story
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-card-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} aibusiness.vc
            <span className="mx-2" aria-hidden>
              &middot;
            </span>
            <ContactEmail className="hover:text-foreground" />
          </p>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
