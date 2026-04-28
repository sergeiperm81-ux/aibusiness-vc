import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";

const footerLinks = {
  solo: {
    title: "Solo",
    links: [
      { name: "AI Side Hustles", href: "/solo/ai-side-hustle-ideas-beginners" },
      { name: "AI Freelancing", href: "/solo/ai-freelancing-complete-guide" },
      { name: "AI Digital Products", href: "/solo/ai-digital-product-ideas" },
      { name: "AI Content Agency", href: "/solo/ai-content-agency-guide" },
    ],
  },
  business: {
    title: "For Business",
    links: [
      { name: "AI Startups", href: "/startups" },
      { name: "B2B Implementation", href: "/b2b" },
      { name: "AI Tools", href: "/tools" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "News", href: "/" },
      { name: "Learn", href: "/learn" },
      { name: "Materials", href: "/materials" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-card-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 rounded-xl bg-card-bg border border-card-border p-5">
          <p className="text-xs uppercase tracking-wider text-muted mb-3">Use The Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TrackedLink
              href="/materials/roi-calculator"
              eventName="click_footer_cta"
              eventParams={{ cta: "roi_calculator" }}
              className="text-sm font-semibold text-white hover:text-accent transition-colors"
            >
              AI ROI Calculator &rarr;
            </TrackedLink>
            <TrackedLink
              href="/materials/tool-selector"
              eventName="click_footer_cta"
              eventParams={{ cta: "tool_selector" }}
              className="text-sm font-semibold text-white hover:text-accent transition-colors"
            >
              AI Tool Selector &rarr;
            </TrackedLink>
            <TrackedLink
              href="/materials/playbook-templates"
              eventName="click_footer_cta"
              eventParams={{ cta: "playbook_templates" }}
              className="text-sm font-semibold text-white hover:text-accent transition-colors"
            >
              Playbook Templates &rarr;
            </TrackedLink>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-accent font-bold text-xl">AI</span>
              <span className="font-semibold text-lg">Business</span>
              <span className="text-xs text-muted font-mono">.vc</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              The definitive guide to making money with AI. Real methods, honest
              numbers, proven tools.
            </p>
          </div>
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm text-foreground mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-card-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} aibusiness.vc
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/affiliate-disclosure" className="hover:text-foreground">
              Affiliate Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
