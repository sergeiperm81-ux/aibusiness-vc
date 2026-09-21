import type { Metadata } from "next";
import Link from "next/link";

/**
 * The three scans on one page: a person, a company, a website. Each card says
 * what it checks, what it costs and where to start. AI Company Scan is not
 * open yet, so its card says so and collects nothing.
 */

export const metadata: Metadata = {
  title: "AI Scan: What AI Tells People About a Person, a Company or a Website",
  description:
    "Three scans that show what AI assistants say. AI Person Scan from a social profile, AI Website Scan from a domain, AI Company Scan soon. Free previews.",
  alternates: { canonical: "/ai-scan" },
  openGraph: {
    type: "website",
    url: "https://aibusiness.vc/ai-scan",
    siteName: "AI Business",
    title: "AI Scan: a person, a company, a website",
    description: "People ask AI before they meet, buy or sign. See what it tells them.",
  },
};

interface Scan {
  readonly name: string;
  readonly what: string;
  readonly input: string;
  readonly gets: readonly string[];
  readonly price: string;
  readonly href: string | null;
  readonly cta: string;
}

const SCANS: readonly Scan[] = [
  {
    name: "AI Person Scan",
    what: "What AI says about a person: who they are, what they do, and whether it raises any red flag.",
    input: "One LinkedIn, X, Instagram or Facebook link",
    gets: ["Five AI models, each searching the web live", "A PDF report by email in about five minutes", "3 to 5 recommendations, most important first"],
    price: "Preview free · Report €14.97",
    href: "/professional-scan",
    cta: "Check a person",
  },
  {
    name: "AI Company Scan",
    what: "What AI says about a company before you sign with it: who runs it, what it does, and what people report.",
    input: "One company name and site",
    gets: ["The same five AI models", "A PDF report by email", "Built for checking a new partner or supplier"],
    price: "In development",
    href: null,
    cta: "Opening soon",
  },
  {
    name: "AI Website Scan",
    what: "Whether ChatGPT and Claude can read your site, and what they say about your company from memory.",
    input: "One domain",
    gets: ["8 signals measured live in 30 seconds", "Your two weakest signals free", "AI Fix Kit with every fix in order"],
    price: "Scan free · AI Fix Kit €49",
    href: "/audit",
    cta: "Scan a website",
  },
];

export default function AiScanPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="mb-4 text-base font-bold uppercase tracking-wider text-accent">AI Scan</p>
          <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            What AI tells people about <span className="text-accent">a person, a company or a website.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/80">
            Before a meeting, a purchase or a contract, people now ask an AI assistant first. Each scan shows what it tells
            them, with the sources, and what to fix.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {SCANS.map((scan) => (
              <li key={scan.name} className="flex flex-col rounded-3xl bg-black p-8">
                <p className="text-3xl font-bold tracking-tight text-accent">{scan.name}</p>
                <p className="mt-4 text-lg leading-relaxed text-white/85">{scan.what}</p>
                <p className="mt-5 text-base font-bold uppercase tracking-wider text-white/60">You give</p>
                <p className="mt-1 text-lg font-semibold text-white">{scan.input}</p>
                <p className="mt-5 text-base font-bold uppercase tracking-wider text-white/60">You get</p>
                <ul className="mt-1 space-y-1.5">
                  {scan.gets.map((item) => (
                    <li key={item} className="text-lg text-white/85">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xl font-bold text-white">{scan.price}</p>
                <div className="mt-auto pt-8">
                  {scan.href ? (
                    <Link
                      href={scan.href}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-xl font-bold text-black transition hover:bg-accent-hover"
                    >
                      {scan.cta} &rarr;
                    </Link>
                  ) : (
                    <p className="rounded-2xl border-2 border-white/30 px-6 py-4 text-center text-xl font-bold text-white/70">
                      {scan.cta}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="max-w-4xl text-2xl font-bold leading-snug text-black sm:text-3xl">
            Every scan asks real AI models through their APIs with web search on, and every report shows what each model
            said, word for word. Nothing is invented, and nothing is sold before you see a free preview.
          </p>
        </div>
      </section>
    </>
  );
}
