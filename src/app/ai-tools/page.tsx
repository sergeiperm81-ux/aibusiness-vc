import type { Metadata } from "next";
import Link from "next/link";

/**
 * AI Tools: the site's own tools on one screen. A short title, then three
 * compact cards side by side, each with its price and its button in view.
 */

export const metadata: Metadata = {
  title: "AI Tools: What AI Tells People About a Company, a Person or a Website",
  description:
    "Three tools that show what AI assistants say: AI Company Scan from a company's site, AI Person Scan from a social profile, AI Website Visibility from a domain. Free previews.",
  alternates: { canonical: "/ai-tools" },
  openGraph: {
    type: "website",
    url: "https://aibusiness.vc/ai-tools",
    siteName: "AI Business",
    title: "AI Tools: a company, a person, a website",
    description: "People ask AI before they meet, buy or sign. See what it tells them.",
  },
};

interface Tool {
  readonly name: string;
  readonly what: string;
  readonly input: string;
  readonly price: string;
  readonly href: string;
  readonly cta: string;
}

const TOOLS: readonly Tool[] = [
  {
    name: "AI Company Scan",
    what: "Who runs a company, what it sells, and any red flags, before you sign.",
    input: "Enter a website",
    price: "Preview free · Report €14.97",
    href: "/company-scan",
    cta: "Check a company",
  },
  {
    name: "AI Person Scan",
    what: "Who a person is, what they do, and any red flags, before you meet.",
    input: "Paste a social profile link",
    price: "Preview free · Report €14.97",
    href: "/professional-scan",
    cta: "Check a person",
  },
  {
    name: "AI Website Visibility",
    what: "Whether ChatGPT and Claude can read your site, and what they say about you.",
    input: "Enter a domain",
    price: "Scan free · AI Fix Kit €49",
    href: "/audit",
    cta: "Check a website",
  },
];

export default function AiToolsPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-3 text-base font-bold uppercase tracking-wider text-accent">AI Tools</p>
        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          What does AI tell people about <span className="text-accent">a company, a person or a website?</span>
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
          Five AI models answer with live web search. You see a free preview first, and every report shows what each model
          said, with its sources.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <li key={tool.name} className="flex flex-col rounded-2xl bg-white p-6">
              <p className="text-2xl font-bold tracking-tight text-black">{tool.name}</p>
              <p className="mt-2 text-lg leading-snug text-black/75">{tool.what}</p>
              <p className="mt-4 text-base font-semibold text-black/60">{tool.input}</p>
              <p className="mt-1 text-lg font-bold text-black">{tool.price}</p>
              <div className="mt-auto pt-5">
                <Link
                  href={tool.href}
                  className="flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-lg font-bold text-black transition hover:bg-accent-hover"
                >
                  {tool.cta} &rarr;
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
