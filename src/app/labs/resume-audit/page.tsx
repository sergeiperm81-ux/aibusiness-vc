import type { Metadata } from "next";
import { ResumeAuditClient } from "@/components/resume/ResumeAuditClient";

export const metadata: Metadata = {
  title: "AI Resume Audit (Private Beta)",
  description:
    "Private beta tool: audit resume quality through AI-recruiter style screening and ATS-style parsing.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ResumeAuditPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
            Private Beta
          </p>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            AI Resume Audit
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">
            See how your CV looks to modern AI-driven hiring filters:
            LinkedIn AI Recruiter patterns, GPT-based ATS parsing, and LLM-first
            screening logic.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">
            Basic scan is instant. Full paid report (EUR 29) unlocks a polished downloadable PDF with precise rewrite guidance.
          </p>
          <div className="mt-5 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
            Hidden route: not linked in main navigation and excluded from search indexing.
          </div>
        </div>
      </section>

      <section className="border-t border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ResumeAuditClient />
        </div>
      </section>
    </>
  );
}
