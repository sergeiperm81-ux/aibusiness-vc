import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getMockFullReport,
  severityBadge,
  type AuditFinding,
} from "@/lib/audit/mock";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CopyPromptButton } from "@/components/audit/CopyPromptButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const report = getMockFullReport(id);
  return {
    title: `Full AI Audit Report — ${report.domain}`,
    description: `Detailed AI visibility report with paste-ready fix prompts for ${report.domain}.`,
    robots: { index: false, follow: false },
  };
}

export default async function FullReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();
  const report = getMockFullReport(id);

  const grouped = groupByCategory(report.findings);
  const sentimentColor = (s: string) => {
    if (s === "positive") return "text-emerald-400";
    if (s === "neutral") return "text-yellow-400";
    if (s === "negative") return "text-red-400";
    return "text-white/40";
  };

  return (
    <>
      {/* HEADER */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs
            items={[
              { label: "Audit", href: "/audit" },
              { label: report.domain, href: `/audit/r/${id}` },
              { label: "Full report", href: `/audit/r/${id}/full` },
            ]}
          />
          <div className="mt-2">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              Demo preview
            </span>
            <p className="text-accent font-mono text-xs font-medium mb-1 tracking-wider uppercase">
              Full AI Visibility Report
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {report.domain}
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Generated {new Date(report.generatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* COMPETITORS */}
      <section className="bg-background border-t border-card-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-bold text-white mb-6">
            How you compare
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-xl bg-card-bg border-2 border-accent p-4">
              <p className="text-[10px] font-mono text-accent uppercase tracking-wider mb-1">
                You
              </p>
              <p className="text-sm font-bold text-white truncate">
                {report.domain}
              </p>
              <p className="text-2xl font-bold text-accent mt-2">
                {report.overallScore}
              </p>
            </div>
            {report.competitors.map((c) => (
              <div
                key={c.domain}
                className="rounded-xl bg-card-bg border border-card-border p-4"
              >
                <p className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1">
                  Competitor
                </p>
                <p className="text-sm font-bold text-white truncate">{c.domain}</p>
                <p className="text-2xl font-bold text-white mt-2">{c.score}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/50 mt-3">
            Competitor average:{" "}
            <span className="text-white/80 font-semibold">
              {report.competitorAverage} / 100
            </span>
          </p>
        </div>
      </section>

      {/* BRAND TESTS */}
      <section className="bg-background border-t border-card-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-bold text-white mb-2">
            How AI engines describe you
          </h2>
          <p className="text-sm text-white/60 mb-6 max-w-2xl">
            Live test results: we asked ChatGPT, Perplexity, Claude, and Google AI
            Overviews about {report.domain}. Here&rsquo;s what they returned.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.brandTests.map((t) => (
              <div
                key={t.platform}
                className="rounded-xl bg-card-bg border border-card-border p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white">
                    {t.platform}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${sentimentColor(
                      t.sentiment
                    )} bg-white/5 border border-white/10`}
                  >
                    {t.sentiment}
                  </span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {t.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINDINGS */}
      <section className="bg-white border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-black mb-2">
            Findings &amp; fix prompts
          </h2>
          <p className="text-sm text-black/60 mb-8 max-w-2xl">
            Each finding ships in two formats: a short summary for you, and a
            paste-ready prompt for your AI assistant.
          </p>

          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-black mb-4">
                  {category}{" "}
                  <span className="text-black/40 font-normal text-sm">
                    ({items.length})
                  </span>
                </h3>
                <div className="space-y-4">
                  {items.map((f) => (
                    <FindingCard key={f.key} finding={f} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GENERATED FILES */}
      <section className="bg-background border-t border-card-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-bold text-white mb-2">
            Files generated for you
          </h2>
          <p className="text-sm text-white/60 mb-6 max-w-2xl">
            Drop these straight into your repository. Re-run them through your AI
            assistant if you want to tweak before merging.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.generatedFiles.map((f) => (
              <div
                key={f.name}
                className="rounded-xl bg-card-bg border border-card-border p-5 flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="font-mono text-sm font-bold text-accent mb-1">
                    {f.name}
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {f.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 px-3 py-1.5 bg-card-border text-white text-xs font-semibold rounded-md hover:bg-white/10 transition-colors"
                  disabled
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI BUILDER PACK CTA */}
      <section className="bg-background border-t border-card-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl border-2 border-accent bg-gradient-to-br from-amber-500/10 to-amber-500/0 p-8">
            <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
              AI Builder Pack
            </p>
            <h2 className="text-2xl font-bold text-white mb-2">
              All {report.findings.length}+ prompts in one zip
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-5 max-w-2xl">
              Bundled markdown files organized by category. Open any one in Claude
              Code, Cursor, or ChatGPT and apply directly. Includes a top-level
              README with the recommended fix order.
            </p>
            <div className="inline-block cursor-not-allowed rounded-lg border border-card-border bg-white/5 px-5 py-2.5 text-sm font-bold text-white/70">
              Coming soon
            </div>
          </div>
        </div>
      </section>

      {/* RE-SCAN */}
      <section className="bg-white border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-black mb-2">
            Re-scan in 30 days
          </h2>
          <p className="text-sm text-black/70 max-w-2xl">
            We&rsquo;ll re-run the audit on day 30 and email a side-by-side comparison
            so you can see exactly what improved. Included with every paid report.
          </p>
        </div>
      </section>
    </>
  );
}

function groupByCategory(findings: AuditFinding[]): Record<string, AuditFinding[]> {
  const sorted = [...findings].sort((a, b) => severityRank(a) - severityRank(b));
  const map: Record<string, AuditFinding[]> = {};
  for (const f of sorted) {
    if (!map[f.category]) map[f.category] = [];
    map[f.category].push(f);
  }
  return map;
}

function severityRank(f: AuditFinding): number {
  switch (f.severity) {
    case "critical":
      return 0;
    case "warning":
      return 1;
    case "ok":
      return 2;
    case "good":
      return 3;
  }
}

function FindingCard({ finding }: { finding: AuditFinding }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
      <div className="p-5 border-b border-black/5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${severityBadge(
                finding.severity
              )}`}
            >
              {finding.severity}
            </span>
            <h4 className="text-base font-bold text-black mt-2">
              {finding.title}
            </h4>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs font-mono font-bold text-black/50 uppercase tracking-wider mb-1.5">
            For you
          </p>
          <p className="text-sm text-black/80 leading-relaxed">
            {finding.human}
          </p>
        </div>
      </div>

      <div className="p-5 bg-zinc-950">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
            For your AI &mdash; paste into Claude Code / Cursor / ChatGPT
          </p>
          <CopyPromptButton text={finding.aiPrompt} />
        </div>
        <pre className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto">
          {finding.aiPrompt}
        </pre>
      </div>
    </div>
  );
}
