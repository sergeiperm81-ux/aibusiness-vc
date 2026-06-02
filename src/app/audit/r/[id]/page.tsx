import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  decodeDomainFromId,
  severityBadge,
  severityColor,
  type AuditMetric,
  type ScoreSeverity,
} from "@/lib/audit/mock";
import { getLiveQuickAudit } from "@/lib/audit/live";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AuditEmailGate } from "@/components/audit/AuditEmailGate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const domain = decodeDomainFromId(id);

  return {
    title: `AI Visibility Score - ${domain}`,
    description: `Live AI visibility scan for ${domain}: 8 metrics scored with actionable fixes.`,
    robots: { index: false, follow: false },
  };
}

export default async function AuditResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const audit = await getLiveQuickAudit(id);

  const sortedMetrics = [...audit.metrics].sort(
    (a, b) => severityRank(a.severity) - severityRank(b.severity)
  );
  const critical = sortedMetrics.filter((m) => m.severity === "critical");
  const warnings = sortedMetrics.filter((m) => m.severity === "warning");
  const oks = sortedMetrics.filter((m) => m.severity === "ok");
  const goods = sortedMetrics.filter((m) => m.severity === "good");

  // Teaser: reveal only a few metrics; the rest stay locked behind the email gate.
  const byScore = [...audit.metrics].sort((a, b) => a.score - b.score);
  const previewMetrics = byScore.slice(0, 3);
  const lockedMetrics = byScore.slice(3);

  const scoreColor =
    audit.overallScore < 40
      ? "text-red-500"
      : audit.overallScore < 65
        ? "text-amber-500"
        : audit.overallScore < 85
          ? "text-yellow-400"
          : "text-emerald-500";

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Audit", href: "/audit" },
              { label: audit.domain, href: `/audit/r/${id}` },
            ]}
          />
          <div className="mt-2">
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
              AI Visibility Audit
            </p>
            <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">
              {audit.domain}
            </h1>
            <p className="text-sm text-white/60">
              Scanned {new Date(audit.scannedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-card-border bg-card-bg p-6 md:col-span-1">
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-white/50">
                Overall AI Visibility
              </p>
              <div className="mb-3 flex items-baseline gap-2">
                <span className={`text-5xl font-bold ${scoreColor}`}>
                  {audit.overallScore}
                </span>
                <span className="text-2xl text-white/40">/ 100</span>
              </div>
              <p className="text-xs text-white/60">
                Industry average:{" "}
                <span className="font-semibold text-white/80">
                  {audit.industryAverage} / 100
                </span>
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-card-border">
                <div
                  className={`h-full ${
                    audit.overallScore < 40
                      ? "bg-red-500"
                      : audit.overallScore < 65
                        ? "bg-amber-500"
                        : audit.overallScore < 85
                          ? "bg-yellow-400"
                          : "bg-emerald-500"
                  }`}
                  style={{ width: `${audit.overallScore}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-card-border bg-card-bg p-6 md:col-span-2">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-white/50">
                Summary
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/80">
                {audit.domain} scored{" "}
                <span className="font-semibold">{audit.overallScore}/100</span>.
                {critical.length > 0
                  ? ` ${critical.length} critical issue${
                      critical.length > 1 ? "s need" : " needs"
                    } urgent fixes.`
                  : " No critical issues detected."}{" "}
                There are {warnings.length} warnings and {goods.length} healthy
                checks.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Critical" count={critical.length} severity="critical" />
                <Stat label="Warnings" count={warnings.length} severity="warning" />
                <Stat label="Acceptable" count={oks.length} severity="ok" />
                <Stat label="Healthy" count={goods.length} severity="good" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {critical.length > 0 && (
        <section className="border-t border-card-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-2xl border-2 border-red-500/50 bg-red-500/5 p-5 text-center">
              <p className="text-sm font-semibold text-white">
                🔒 {critical.length} critical issue{critical.length > 1 ? "s" : ""} detected on your
                site. Enter your email below to see exactly what they are — and how to fix them.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-black">
                We scored {audit.metrics.length} AI-visibility signals on your site
              </h2>
              <p className="mt-1 text-sm text-black/60">
                Here&apos;s a preview. Enter your email below to unlock all{" "}
                {audit.metrics.length} scores plus your step-by-step fix plan.
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              🔒 {lockedMetrics.length} locked
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {previewMetrics.map((metric) => (
              <MetricRow key={metric.key} metric={metric} />
            ))}
            {lockedMetrics.map((metric) => (
              <LockedMetricRow key={metric.key} label={metric.label} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <AuditEmailGate auditId={id} domain={audit.domain} overallScore={audit.overallScore} />
        </div>
      </section>
    </>
  );
}

function severityRank(severity: ScoreSeverity): number {
  switch (severity) {
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

function Stat({
  label,
  count,
  severity,
}: {
  label: string;
  count: number;
  severity: ScoreSeverity;
}) {
  return (
    <div className={`rounded-lg border px-3 py-2 ${severityBadge(severity)}`}>
      <p className="text-[10px] font-mono uppercase tracking-wider opacity-80">
        {label}
      </p>
      <p className="text-xl font-bold">{count}</p>
    </div>
  );
}

function MetricRow({ metric }: { metric: AuditMetric }) {
  const color = severityColor(metric.severity);
  const dotColor =
    metric.severity === "critical"
      ? "bg-red-500"
      : metric.severity === "warning"
        ? "bg-amber-500"
        : metric.severity === "ok"
          ? "bg-yellow-400"
          : "bg-emerald-500";

  return (
    <div className="rounded-xl border border-black/10 p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-3">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
          <div>
            <h3 className="text-sm font-bold text-black">{metric.label}</h3>
            <p className="mt-0.5 text-xs text-black/60">{metric.shortHuman}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-lg font-bold ${color}`}>{metric.score}</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-black/40">
            / 100
          </p>
        </div>
      </div>
    </div>
  );
}

function LockedMetricRow({ label }: { label: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-black/10 bg-gray-50/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-3">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-black">{label}</h3>
            <div className="mt-2 h-2 w-3/4 rounded bg-gray-200 blur-[2px]" />
            <div className="mt-1.5 h-2 w-1/2 rounded bg-gray-200 blur-[2px]" />
          </div>
        </div>
        <div className="shrink-0 select-none text-right">
          <div className="ml-auto h-6 w-10 rounded bg-gray-200 blur-[3px]" />
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-black/30">
            / 100
          </p>
        </div>
      </div>
      <span className="pointer-events-none absolute right-2.5 top-2.5 text-sm" aria-hidden>
        🔒
      </span>
    </div>
  );
}
