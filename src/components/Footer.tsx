import Link from "next/link";

const footerLinks = {
  earn: {
    title: "Solo",
    links: [
      { name: "AI Side Hustles", href: "/solo/ai-side-hustles" },
      { name: "AI Freelancing", href: "/solo/ai-freelancing" },
      { name: "AI Digital Products", href: "/solo/ai-digital-products" },
      { name: "AI Content Creation", href: "/solo/ai-content-creation" },
    ],
  },
  business: {
    title: "For Business",
    links: [
      { name: "AI Startups", href: "/startups" },
      { name: "B2B Implementation", href: "/b2b" },
      { name: "AI Automation Agency", href: "/solo/ai-automation-agency" },
      { name: "AI Tools", href: "/tools" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "News", href: "/" },
      { name: "Learn", href: "/learn" },
      { name: "Materials", href: "/materials" },
      { name: "Newsletter", href: "/newsletter" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-surface mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-1.5 mb-3">
              <span className="text-accent font-bold text-xl">AI</span>
              <span className="font-semibold text-lg text-heading">
                Business
              </span>
              <span className="text-[10px] text-muted font-mono">.vc</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              How to make money with AI. News, tools, strategies, and real
              stories.
            </p>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm text-heading mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-heading transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-card-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} aibusiness.vc
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-heading">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-heading">
              Terms
            </Link>
            <Link href="/affiliate-disclosure" className="hover:text-heading">
              Affiliate Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
