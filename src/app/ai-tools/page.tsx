import type { Metadata } from "next";
import Link from "next/link";

/**
 * AI Tools: the site's own tools on one screen. A short title on black, then
 * the tools as black cards on white, each with its button in view.
 */

export const metadata: Metadata = {
  title: "AI Tools: What AI Tells People About a Person or a Company",
  description:
    "Two tools that show what AI assistants say: AI Person Scan from a social profile, AI Company Scan from a company's website. Free previews.",
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

/* AI Website Visibility is left out until it is named and shaped like these two. */
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
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
            Five AI models answer with live web search. You see a free preview first, and every report shows what each model
            said, with its sources.
          </p>
        </div>
      </section>

      {/* The tools on white: black cards, one yellow button each. No prices here: each tool's own page shows its price. */}
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
    </>
  );
}
