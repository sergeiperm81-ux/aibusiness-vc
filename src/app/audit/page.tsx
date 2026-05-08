import type { Metadata } from "next";
import { UrlAuditForm } from "@/components/audit/UrlAuditForm";

export const metadata: Metadata = {
  title: "AI Visibility Audit - Check How AI Search Sees Your Site",
  description:
    "Run an AI visibility scan for your domain and see technical gaps before ordering a full implementation report.",
};

const SCAN_METRICS = [
  "llms.txt presence",
  "Schema markup",
  "AI crawler access",
  "Citation readiness",
  "Page speed snapshot",
  "Mobile readiness",
  "HTTPS and security headers",
  "Content structure signals",
];

const FULL_REPORT_INCLUDES = [
  "30+ prioritized findings",
  "LLM citation tests across major answer engines",
  "Competitor benchmark snapshot",
  "Generated llms.txt and llms-full.txt",
  "Schema patch package",
  "AI Builder Pack prompts for implementation",
  "30-day re-scan plan",
];

const FAQS = [
  {
    q: "What do I get from the scan?",
    a: "You get a fast technical snapshot with scores and plain-language explanations for the biggest visibility signals.",
  },
  {
    q: "When does payment happen?",
    a: "Only after scan results. Purchase is available on the result page, tied to your domain and audit ID.",
  },
  {
    q: "What is in the paid report?",
    a: "A complete delivery package: one executive PDF, one manual DOCX guide, README, and implementation markdown/json/csv/txt files.",
  },
  {
    q: "Who is this for?",
    a: "Teams and operators who want their site to be cited and understood by AI answer engines, not just classic search.",
  },
];

export default function AuditLandingPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
            AI Visibility Audit
          </p>
          <h1 className="mb-4 max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Check how AI search sees your site
          </h1>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-white/70">
            Run a domain scan, review your technical visibility signals, then decide
            whether to unlock the full report.
          </p>

          <UrlAuditForm />

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Fast domain scan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Results in about 30 seconds
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Full report unlock after scan
            </span>
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-2xl font-bold text-black">How it works</h2>
          <p className="mb-8 max-w-2xl text-sm text-black/60">
            Simple flow from scan to action.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-black/10 p-6">
              <div className="mb-2 font-mono text-xs font-bold text-accent">STEP 01</div>
              <h3 className="mb-2 text-lg font-bold text-black">Run scan</h3>
              <p className="text-sm leading-relaxed text-black/70">
                Enter your domain and generate the technical snapshot.
              </p>
            </div>
            <div className="rounded-xl border border-black/10 p-6">
              <div className="mb-2 font-mono text-xs font-bold text-accent">STEP 02</div>
              <h3 className="mb-2 text-lg font-bold text-black">Review gaps</h3>
              <p className="text-sm leading-relaxed text-black/70">
                See scored signals, weak points, and priority areas.
              </p>
            </div>
            <div className="rounded-xl border border-black/10 p-6">
              <div className="mb-2 font-mono text-xs font-bold text-accent">STEP 03</div>
              <h3 className="mb-2 text-lg font-bold text-black">Unlock full report</h3>
              <p className="text-sm leading-relaxed text-black/70">
                Purchase from the result page if you want full implementation detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
                Scan output
              </p>
              <h2 className="mb-3 text-2xl font-bold text-white">8 visibility metrics</h2>
              <ul className="space-y-2">
                {SCAN_METRICS.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
                Full report
              </p>
              <h2 className="mb-3 text-2xl font-bold text-white">Execution package</h2>
              <ul className="space-y-2">
                {FULL_REPORT_INCLUDES.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                    {m}
                  </li>
                ))}
              </ul>
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

      <section className="border-t border-card-border bg-background" id="top">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="mb-3 text-2xl font-bold text-white">Run your AI audit</h2>
            <p className="mb-6 text-sm text-white/60">
              30 seconds. 8 metrics. Plain-language output.
            </p>
            <UrlAuditForm />
          </div>
        </div>
      </section>
    </>
  );
}
