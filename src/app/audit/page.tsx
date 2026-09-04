import type { Metadata } from "next";
import { UrlAuditForm } from "@/components/audit/UrlAuditForm";
import { TestAgentsCallout } from "@/components/TestAgentsCallout";

export const metadata: Metadata = {
  title: "AI Visibility Audit - GEO Check: How AI Search Sees Your Site",
  description:
    "AI search visibility scan (GEO audit): see what ChatGPT knows, what AI crawlers can read, and 8 measured signals from llms.txt to schema markup.",
  alternates: { canonical: "/audit" },
  openGraph: {
    type: "website",
    url: "https://aibusiness.vc/audit",
    siteName: "AI Business",
    title: "AI Visibility Audit: How AI Search Sees Your Site",
    description:
      "Enter your domain and see what ChatGPT already knows about your business, and what its crawlers can actually read. Eight measured GEO signals in about 30 seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Visibility Audit",
    description:
      "Your customers now ask AI first. See what it knows about you, free, in 30 seconds.",
  },
};

/** Each signal with a one-line account of how it is actually measured. */
const SCAN_METRICS: readonly { name: string; how: string }[] = [
  {
    name: "llms.txt presence",
    how: "We request yourdomain.com/llms.txt and inspect its title, sections, and described link entries.",
  },
  {
    name: "Schema markup",
    how: "We parse every JSON-LD block on your homepage and count blocks that declare a schema type.",
  },
  {
    name: "AI crawler access",
    how: "We read your robots.txt and check whether GPTBot, ClaudeBot, PerplexityBot and other AI crawlers are allowed, blocked, or unaddressed.",
  },
  {
    name: "Citation readiness",
    how: "We look for what generative engines quote: direct answers under headings, concrete facts, Q&A blocks.",
  },
  {
    name: "Page speed snapshot",
    how: "We time the server response the way a crawler experiences it.",
  },
  {
    name: "What an AI actually sees",
    how: "We read your page without running JavaScript, exactly as most AI crawlers do, and count the words that survive.",
  },
  {
    name: "HTTPS and security headers",
    how: "We check the certificate and the standard security headers on a live request.",
  },
  {
    name: "Content structure",
    how: "We map your heading hierarchy and section sizes against what AI extraction handles well.",
  },
];

const FULL_REPORT_INCLUDES = [
  "Full score breakdown across all 8 signals",
  "Your fixes in priority order, measured on your domain",
  "A step by step implementation guide for your team",
  "Ready prompts for AI coding assistants",
  "Schema patches and an llms.txt draft to adapt",
  "Your Agent Card: a machine readable company card drafted from your own site",
  "A QA checklist and a simple re-scan plan",
];

const FAQS = [
  {
    q: "What do I get from the scan?",
    a: "Your overall AI visibility score, what ChatGPT says about your business from memory, and your two weakest signals explained in plain language.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. Enter a domain and the scan runs. No account, no email required to see your result.",
  },
  {
    q: "What is GEO and how is it different from SEO?",
    a: "GEO (Generative Engine Optimization) is making your site readable, quotable and citable for AI answer engines such as ChatGPT, Perplexity and Google's AI Overviews. Classic SEO optimises for ranked links; GEO optimises for being the source an AI quotes. This audit measures the GEO side: crawler access, llms.txt, schema markup and citation-ready structure.",
  },
  {
    q: "What's in the full report?",
    a: "Your complete score breakdown across all 8 signals, prioritized fixes measured on your domain, an implementation guide, AI coding prompts, llms.txt and schema materials, plus an Agent Card drafted from your own site.",
  },
  {
    q: "What is an Agent Card?",
    a: "It is a compact, machine-readable description of your company: what you offer, who it is for, pricing signals and how to reach a human. You receive a Markdown file and matching JSON-LD drafted only from facts found on your site, with missing information clearly marked for review.",
  },
  {
    q: "Are the recommendations personalised?",
    a: "Yes, and verifiably: every score in the report is measured live on your domain at purchase time, each fix carries your measured number next to it, and the task backlog is built only from the signals that actually failed on your site. If our scanner cannot reach your site, we say so and run the measurement by hand instead of sending template numbers.",
  },
  {
    q: "Who is this for?",
    a: "Teams and operators who want their site to be cited and understood by AI answer engines, not just classic search.",
  },
];

const SITE_URL = "https://aibusiness.vc";

/** FAQPage + Service structured data, mirroring only content visible on this page. */
const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Visibility Audit (GEO Audit)",
    serviceType: "Generative Engine Optimization audit",
    url: `${SITE_URL}/audit`,
    provider: {
      "@type": "Organization",
      name: "AI Business",
      url: SITE_URL,
    },
    description:
      "AI search visibility scan measuring 8 signals live on your domain: llms.txt, schema markup, AI crawler access, citation readiness, page speed, JavaScript dependency, HTTPS and content structure, plus an AI brand recall test.",
    areaServed: "Worldwide",
  },
];

export default function AuditLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <section className="bg-background">
        <div
          className="border-b border-white/5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 76% 42%, rgba(245, 158, 11, 0.12), transparent 28%), radial-gradient(circle at 18% 0%, rgba(255,255,255,0.035), transparent 24%)",
          }}
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-8 lg:py-20">
            <div>
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                AI Visibility Audit / 30-second scan
              </p>
              <h1 className="mb-5 max-w-xl text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Can AI understand your business?
              </h1>
              <p className="mb-7 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
                See what ChatGPT knows, what AI crawlers can read, and the gaps
                keeping your site out of AI answers.
              </p>

              <UrlAuditForm />

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/50">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  8 live checks
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  No signup
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Any public domain
                </span>
              </div>
            </div>

            <ScorePreview />
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
            From scan to action
          </p>
          <h2 className="mb-8 max-w-2xl text-3xl font-bold tracking-tight text-black">
            One scan. Three useful outputs.
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-6">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-black font-mono text-xs font-bold text-white">
                01
              </div>
              <h3 className="mb-2 text-xl font-bold text-black">Visibility score</h3>
              <p className="text-sm leading-relaxed text-black/70">
                See what an AI can read, whether crawlers are allowed, and the two
                signals costing you the most visibility.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-6">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-black font-mono text-xs font-bold text-white">
                02
              </div>
              <h3 className="mb-2 text-xl font-bold text-black">Fix package</h3>
              <p className="text-sm leading-relaxed text-black/70">
                Get the personal PDF, implementation backlog, schema and llms.txt
                drafts, plus prompts your team can execute.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 shadow-[0_16px_50px_rgba(245,158,11,0.12)]">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 font-mono text-xs font-bold text-black">
                03
              </div>
              <h3 className="mb-2 text-xl font-bold text-black">Agent Card</h3>
              <p className="text-sm leading-relaxed text-black/70">
                Give AI agents one clean, machine-readable source for what your
                company does, sells and supports.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#f4ead8]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
              Included / Agent Card
            </p>
            <h2 className="mb-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl">
              Give AI agents the facts, not a puzzle.
            </h2>
            <p className="mb-6 max-w-xl text-base leading-relaxed text-black/65">
              Company facts are usually scattered across five pages. Your Agent
              Card turns them into one compact source that an assistant can read,
              quote and hand to a customer.
            </p>
            <ul className="grid max-w-xl grid-cols-1 gap-3 text-sm text-black/75 sm:grid-cols-2">
              {[
                "What you offer",
                "Who it is for",
                "Pricing signals",
                "Human contact routes",
                "Markdown + JSON-LD",
                "Missing facts clearly marked",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-black/50">
              Drafted only from facts already published on your site. Nothing is
              invented; anything missing is flagged for your review.
            </p>
          </div>

          <AgentCardPreview />
        </div>
      </section>

      <section className="border-t border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
                Methodology
              </p>
              <h2 className="mb-3 text-2xl font-bold text-white">
                8 signals, each measured live
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/60">
                Nothing is estimated or averaged from other sites. Every number in your
                result comes from requests made to your domain at scan time, the same
                way AI crawlers read it.
              </p>
              <ul className="space-y-3">
                {SCAN_METRICS.map((m) => (
                  <li key={m.name} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>
                      <span className="font-semibold text-white/90">{m.name}.</span>{" "}
                      <span className="text-white/60">{m.how}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
                Full package
              </p>
              <h2 className="mb-3 text-2xl font-bold text-white">Ready to hand off</h2>
              <p className="mb-5 max-w-lg text-sm leading-relaxed text-white/60">
                Read the PDF yourself. Give the implementation files to your team,
                developer or AI coding assistant.
              </p>
              <ul className="space-y-2.5 rounded-2xl border border-card-border bg-card-bg p-6">
                {FULL_REPORT_INCLUDES.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {m}
                  </li>
                ))}
              </ul>
              <a
                href="/audit-kit/Sample-AI-Visibility-Report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-lg border border-card-border bg-card-bg px-4 py-2.5 text-sm font-semibold text-white transition hover:border-accent"
              >
                See a sample report (PDF) &rarr;
              </a>
              <p className="mt-2 text-xs text-white/40">
                A real report generated by the same scanner, so you can judge the
                depth before running anything.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-black">Common questions</h2>
          <div className="grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="mb-2 text-base font-bold text-black">{f.q}</h3>
                <p className="text-sm leading-relaxed text-black/70">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <TestAgentsCallout
            heading="A different question: what does your bot tell customers?"
            body="This audit measures how AI search reads your website. If you also run a chatbot or assistant that talks to customers, that is a separate matter and a separate check: a test purchase of the AI agent, measured against what your company publicly promises."
            anchor="Testing AI agents and chatbots"
          />
        </div>
      </section>

      <section className="border-t border-card-border bg-background" id="top">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="mb-3 text-2xl font-bold text-white">Run your AI audit</h2>
            <p className="mb-6 text-sm text-white/60">
              See what AI understands now, then decide what is worth fixing.
            </p>
            <UrlAuditForm />
          </div>
        </div>
      </section>
    </>
  );
}

function ScorePreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-5 rounded-[2rem] bg-amber-500/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121215] shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400">
              Example output
            </p>
            <p className="mt-1 text-sm font-semibold text-white">example.com</p>
          </div>
          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Live scan
          </span>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-[130px_1fr] sm:p-7">
          <div className="flex flex-col justify-center rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">
              AI visibility
            </p>
            <div className="mt-2 flex items-end justify-center gap-1">
              <span className="text-5xl font-bold tracking-tight text-amber-400">61</span>
              <span className="mb-1 text-sm text-white/35">/100</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-amber-300">Needs work</p>
          </div>

          <div className="space-y-4">
            <PreviewMetric label="AI-readable content" score={90} tone="good" />
            <PreviewMetric label="Crawler access" score={55} tone="warn" />
            <PreviewMetric label="Schema markup" score={30} tone="bad" />
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.025] p-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 font-mono text-sm font-black text-black">
                AI
              </div>
              <div>
                <p className="text-sm font-bold text-white">Agent Card included</p>
                <p className="mt-0.5 text-xs text-white/45">
                  agent-card.md + matching JSON-LD
                </p>
              </div>
            </div>
            <div className="flex gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/45">
              <span className="rounded-md border border-white/10 px-2 py-1">PDF</span>
              <span className="rounded-md border border-white/10 px-2 py-1">Fix kit</span>
              <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-amber-300">
                Agent-ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({
  label,
  score,
  tone,
}: {
  label: string;
  score: number;
  tone: "good" | "warn" | "bad";
}) {
  const color =
    tone === "good"
      ? "bg-emerald-500"
      : tone === "warn"
        ? "bg-amber-500"
        : "bg-red-500";
  const text =
    tone === "good"
      ? "text-emerald-400"
      : tone === "warn"
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-4 text-xs">
        <span className="font-medium text-white/65">{label}</span>
        <span className={`font-mono font-bold ${text}`}>{score}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function AgentCardPreview() {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/15 bg-[#101012] shadow-2xl shadow-amber-900/15">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="font-mono text-[10px] text-white/35">/agent-card.md</span>
      </div>
      <div className="space-y-5 p-6 font-mono text-xs leading-relaxed sm:p-8">
        <div>
          <p className="text-amber-400"># Northstar Analytics - Agent Card</p>
          <p className="mt-2 text-white/70">
            &gt; Revenue intelligence for independent retail teams.
          </p>
        </div>
        <div>
          <p className="text-white/40">## What we offer</p>
          <p className="mt-1 text-white/70">- Weekly revenue forecasts</p>
          <p className="text-white/70">- Inventory risk alerts</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-white/40">## Who it is for</p>
            <p className="mt-1 text-white/70">Retail operators with 2-20 stores</p>
          </div>
          <div>
            <p className="text-white/40">## Human contact</p>
            <p className="mt-1 text-white/70">sales@northstar.example</p>
          </div>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-amber-200/80">
          Facts are drafted from your site. Missing information is marked for
          review, never guessed.
        </div>
      </div>
    </div>
  );
}
