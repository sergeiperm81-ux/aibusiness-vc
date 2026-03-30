import Link from "next/link";

const footerLinks = {
  earn: {
    title: "Earn with AI",
    links: [
      { name: "AI Side Hustles", href: "/earn/ai-side-hustles" },
      { name: "AI Business Ideas", href: "/earn/ai-business-ideas" },
      { name: "AI Freelancing", href: "/earn/ai-freelancing" },
      { name: "AI Automation Agency", href: "/earn/ai-automation-agency" },
      { name: "AI Passive Income", href: "/earn/ai-passive-income" },
    ],
  },
  tools: {
    title: "AI Tools",
    links: [
      { name: "Writing Tools", href: "/tools/category/writing" },
      { name: "Video Tools", href: "/tools/category/video" },
      { name: "Automation Tools", href: "/tools/category/automation" },
      { name: "Marketing Tools", href: "/tools/category/marketing" },
      { name: "Tool Stacks", href: "/tools/stacks" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Case Studies", href: "/case-studies" },
      { name: "AI News", href: "/news" },
      { name: "Courses & Books", href: "/learn" },
      { name: "AI & Society", href: "/impact" },
      { name: "Newsletter", href: "/newsletter" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-card-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
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
            &copy; {new Date().getFullYear()} aibusiness.vc. All rights
            reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/affiliate-disclosure" className="hover:text-foreground">
              Affiliate Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
