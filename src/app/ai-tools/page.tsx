import type { Metadata } from "next";
import Link from "next/link";

/**
 * AI Tools: the site's own tools on one screen. A short title on black, then
 * the tools as black cards on white, each with its button in view.
 */

export const metadata: Metadata = {
  title: "AI Tools: What AI Tells People About a Person or a Company",
  description:
    "AI Person Scan and AI Company Scan show what five AI models say about a person or a company, free preview first. AI Website Visibility is for site owners: can AI read your site, and what to fix.",
  alternates: { canonical: "/ai-tools" },
  openGraph: {
    type: "website",
    url: "https://aibusiness.vc/ai-tools",
    siteName: "AI Business",
    title: "AI Tools: a person, a company",
    description: "People ask AI before they meet, buy or sign. See what it tells them.",
  },
};

interface Tool {
  readonly name: string;
  readonly what: string;
  readonly input: string;
  readonly href: string;
  readonly cta: string;
}

/* The two scans: what AI says about someone. AI Website Visibility sits apart below. */
const TOOLS: readonly Tool[] = [
  {
    name: "AI Person Scan",
    what: "Who a person is, what they do, and any red flags, before you meet.",
    input: "Paste a social profile link",
    href: "/professional-scan",
    cta: "Check a person",
  },
  {
    name: "AI Company Scan",
    what: "Who runs a company, what it sells, and any red flags, before you sign.",
    input: "Enter the company's website",
    href: "/company-scan",
    cta: "Check a company",
  },
];

export default function AiToolsPage() {
  return (
    <>
      {/* The title on a black band, like the scan pages. */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-3 text-base font-bold uppercase tracking-wider text-accent">AI Tools</p>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            What does AI tell people about <span className="text-accent">a person or a company?</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            Five AI models answer with live web search. You see a free preview first, and every report shows what each model
            said, with its sources.
          </p>
        </div>
      </section>

      {/* The tools on white: black cards, one yellow button each. The scans carry no price here; each scan's own page shows it. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {TOOLS.map((tool) => (
              <li key={tool.name} className="flex flex-col rounded-2xl bg-black p-7">
                <p className="text-3xl font-bold tracking-tight text-accent">{tool.name}</p>
                <p className="mt-3 text-xl leading-snug text-white/85">{tool.what}</p>
                <p className="mt-4 text-lg font-semibold text-white/60">{tool.input}</p>
                <div className="mt-auto pt-6">
                  <Link
                    href={tool.href}
                    className="flex items-center justify-center rounded-xl bg-accent px-5 py-4 text-xl font-bold text-black transition hover:bg-accent-hover"
                  >
                    {tool.cta} &rarr;
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* A different job for a different buyer: the site owner who can change the site. Its own yellow band, the same black card. */}
      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-5 text-2xl font-bold text-black">For site owners and developers</p>
          <div className="flex flex-col rounded-2xl bg-black p-7 md:flex-row md:items-end md:gap-10">
            <div className="flex-1">
              <p className="text-3xl font-bold tracking-tight text-accent">AI Website Visibility</p>
              <p className="mt-3 text-xl leading-snug text-white/85">
                Can five AI models read a site? A site they cannot read loses in their answers. Free check, then the fixes.
              </p>
              <p className="mt-4 text-lg font-semibold text-white/60">Enter a website address</p>
            </div>
            <div className="pt-6 md:w-80 md:pt-0">
              <Link
                href="/audit"
                className="flex items-center justify-center rounded-xl bg-accent px-5 py-4 text-xl font-bold text-black transition hover:bg-accent-hover"
              >
                Check a site &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
