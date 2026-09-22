import type { Metadata } from "next";
import Link from "next/link";
import { CompanySiteForm } from "@/components/company/CompanySiteForm";
import { ModelLogos } from "@/components/professional/ModelLogos";

/**
 * AI Company Scan: what AI tells people about a company before they deal with
 * it. Same layout and rules as AI Person Scan: black, white and yellow, one
 * field, a free preview first, every promise one the report keeps.
 */

const TITLE = "What does AI say about this company?";

export const metadata: Metadata = {
  title: "AI Company Scan: What Does AI Say About a Company? 5 AI Models, €14.97",
  description:
    "Enter a company's website. Five AI models with live web search answer three questions about it: who is behind it, what it does, and whether there are red flags. Free preview, full PDF report €14.97.",
  alternates: { canonical: "/company-scan" },
  openGraph: {
    type: "website",
    url: "https://aibusiness.vc/company-scan",
    siteName: "AI Business",
    title: TITLE,
    description: "Before you sign, people ask ChatGPT about the company. See what five AI models tell them.",
  },
};

const INCLUDED: readonly { title: string; body: string }[] = [
  { title: "Five AI models", body: "OpenAI, Anthropic, Gemini, Perplexity and Grok answer about the company, each searching the web live." },
  { title: "Who is behind it", body: "Legal name, founding year, owners and leaders, where it is based and how to reach it, as AI tells it." },
  { title: "What it does", body: "What it sells, at what prices where they are public, who its customers are, and its latest dated news." },
  { title: "Red flags, checked", body: "Reviews, complaints, lawsuits, regulators and scam warnings: what each model found, and where." },
  { title: "Where the answers disagree", body: "Two owners, two founding years, an offer only one model names: every point the models do not agree on." },
  { title: "Recommendations", body: "3 to 5 steps, most important first, each saying exactly what to publish and where." },
];

const WHO_FOR: readonly string[] = [
  "Anyone about to pay a supplier, an agency or a contractor they found online",
  "Founders checking a partner, a distributor or an investor's company",
  "Companies checking what AI tells their own customers about them",
  "Buyers comparing two vendors before a contract",
];

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "What do I need to give?",
    a: "Only the company's website. The free preview shows which company an AI model finds behind it, so you pay only when it found the right one.",
  },
  {
    q: "Is this a background or credit check?",
    a: "No. It shows what AI models say about the company, with their sources. It is not a registry extract, a credit report or legal advice, and it can be wrong. We scan the organisation represented by the website, which may be a company, a publication, a product or a personal brand, not its legal ownership or company registration.",
  },
  {
    q: "What if another company has the same name?",
    a: "The report says so and keeps them apart. Pages and trouble that belong to another company are left out, and the report then draws no conclusion about reputation.",
  },
  {
    q: "How long does it take?",
    a: "Most reports arrive by email in about five minutes. Processing starts immediately after payment. If an AI provider is slow, we email you and retry automatically. You do not need to refresh.",
  },
  {
    q: "What is the bonus?",
    a: "Every full-price purchase includes a code for 50% off up to 7 additional AI Person or AI Company Scans. Use it yourself or give it away. An order paid with a code does not create a new code.",
  },
  {
    q: "What if the report does not arrive?",
    a: "If it does not reach you, or it is about a different company, write to us and you get a full refund. If a model is slow, we keep retrying for up to an hour.",
  },
];

export default function CompanyScanPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="mb-4 text-base font-bold uppercase tracking-wider text-accent">AI Company Scan</p>
          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            {TITLE}
          </h1>
          <p className="mb-8 max-w-2xl text-xl leading-relaxed text-white/80">
            Before a purchase, a contract or a partnership, people ask ChatGPT about the company. See what five AI models tell them.
          </p>
          <CompanySiteForm />
          <p className="mt-6 text-lg font-bold text-white">
            Preview <span className="text-accent">free</span> · Full report <span className="text-accent">&euro;14.97</span> once
          </p>
          <p className="mt-2 text-lg font-bold text-white/85">
            Bonus: <span className="text-accent">50% off</span> up to 7 more AI Person or AI Company Scans with every full-price purchase.
          </p>
          <p className="mt-3 max-w-2xl text-base text-white/60">
            We scan the organisation represented by this website, not legal ownership or company registration.
          </p>
          <a
            href="/samples/ai-company-scan-sample-report.pdf"
            target="_blank"
            rel="noopener"
            className="mt-3 inline-block text-lg font-bold text-white underline decoration-accent decoration-4 underline-offset-4 hover:text-accent"
          >
            See a sample report (PDF)
          </a>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <p className="mb-5 text-2xl font-bold text-white">
            Five AI models check the company, <span className="text-accent">each searching the web live</span>
          </p>
          <ModelLogos />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-black sm:text-5xl">What&rsquo;s in the report</h2>
          <p className="mb-10 max-w-2xl text-xl leading-relaxed text-black/65">One PDF by email. Most reports arrive in about five minutes; processing starts immediately after payment.</p>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <li key={item.title} className="rounded-3xl bg-black p-7">
                <p className="text-xl font-bold text-accent">{item.title}</p>
                <p className="mt-2 text-lg leading-relaxed text-white/80">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-4xl font-bold tracking-tight text-black sm:text-5xl">How it works</h2>
          <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              ["1", "Enter the website", "The company's own site. Nothing else to fill in."],
              ["2", "See which company AI finds", "Free, in about 20 seconds: the name, what it does and where it is based."],
              ["3", "Get the full report", "€14.97 once. Most reports arrive by email in about five minutes; if a model is slow, we email you and retry."],
            ].map(([n, title, body]) => (
              <li key={n} className="rounded-3xl bg-black p-7">
                <p className="text-4xl font-bold text-accent">{n}</p>
                <p className="mt-3 text-xl font-bold text-white">{title}</p>
                <p className="mt-2 text-lg leading-relaxed text-white/80">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">Who it is for</h2>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {WHO_FOR.map((who) => (
              <li key={who} className="rounded-2xl border-2 border-white/15 px-6 py-5 text-lg text-white/85">
                {who}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-black sm:text-4xl">Questions</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {FAQS.map((item) => (
              <div key={item.q} className="rounded-2xl bg-black px-6 py-5">
                <p className="text-xl font-bold text-accent">{item.q}</p>
                <p className="mt-2 text-lg leading-relaxed text-white/80">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-lg text-black/70">
            Checking a person instead?{" "}
            <Link href="/professional-scan" className="font-bold text-black underline decoration-accent decoration-4 underline-offset-4">
              AI Person Scan
            </Link>
            . All tools:{" "}
            <Link href="/ai-tools" className="font-bold text-black underline decoration-accent decoration-4 underline-offset-4">
              AI Tools
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-black sm:text-4xl">Check a company before you sign</h2>
          <CompanySiteForm tone="yellow" />
        </div>
      </section>
    </>
  );
}
