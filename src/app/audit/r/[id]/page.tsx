import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ContactEmail } from "@/components/ContactEmail";
import { decodeDomainFromId, type AuditMetric } from "@/lib/audit/mock";
import { getLiveQuickAudit } from "@/lib/audit/live";
import { getBrandKnowledge, hasAnswer } from "@/lib/audit/brand-knowledge";
import { getAuditCheckoutUrl } from "@/lib/audit/checkout";
import { MetaEvent } from "@/components/analytics/MetaPixel";
import { CheckoutLink } from "@/components/audit/CheckoutLink";

/**
 * The free result of AI Website Visibility, the page where the AI Fix Kit is sold.
 *
 * Same design as the AI Person Scan preview: the finding on a black band, the
 * offer on white, black cards, one yellow button. No red alarm boxes (Wendt:
 * the pain is named in words, not painted), and every score is the one the
 * scan measured.
 */

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const domain = decodeDomainFromId(id);
  return {
    title: `Is ${domain} blocked for AI?`,
    description: `Live AI Website Visibility check for ${domain}: 8 metrics scored with actionable fixes.`,
    robots: { index: false, follow: false },
  };
}

/** What the €49 kit contains. Kept identical to the list on /audit; mirrors fulfillment.ts. */
const KIT: readonly { title: string; body: string }[] = [
  { title: "5 AI models, live search", body: "ChatGPT, Claude, Gemini, Perplexity and Grok look the site up. What each found, and whether it cited your pages or other sites." },
  { title: "Every score, in one PDF", body: "Every technical sign measured on the homepage, with the number we found." },
  { title: "Fixes in order", body: "A task spreadsheet: one row per problem, with priority, owner and hours." },
  { title: "8 ready prompts", body: "For Claude Code, Cursor or ChatGPT, each carrying your measured numbers." },
  { title: "3 schema templates and an Agent Card", body: "Organization, WebSite and FAQ markup, plus your company on one machine-readable page." },
  { title: "Guide, 10 checks, llms.txt draft", body: "A step-by-step guide in Word, a QA checklist with your targets, and an optional llms.txt to try." },
];

export default async function AuditResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();

  const audit = await getLiveQuickAudit(id);

  if (audit.failure) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="mb-4 text-base font-bold uppercase tracking-wider text-black/60">AI Website Visibility</p>
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">We could not reach {audit.domain}</h1>
          <p className="mt-6 text-xl leading-relaxed text-black/75">
            The check did not complete, so there is nothing to score. If the site is behind a login or a firewall, or blocks
            automated requests, AI crawlers hit the same wall, and that is worth knowing too.
          </p>
          <p className="mt-3 text-lg text-black/60">Reason: {audit.failure}</p>
          <Link
            href="/audit"
            className="mt-8 inline-block rounded-2xl bg-accent px-8 py-4 text-xl font-bold text-black transition hover:bg-accent-hover"
          >
            Check another site
          </Link>
        </div>
      </section>
    );
  }

  const requestHeaders = await headers();
  const clientIp =
    requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    requestHeaders.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    "unknown";
  const brands = await getBrandKnowledge(audit.domain, clientIp);

  // The two weakest signals are shown in full; the rest are in the kit.
  // llms.txt is optional and unscored, so it is never one of the "two weakest".
  const optionalLast = (m: AuditMetric): number => (m.key === "llms-txt" ? 1 : 0);
  const byScore = [...audit.metrics].sort((a, b) => optionalLast(a) - optionalLast(b) || a.score - b.score);
  const previewMetrics = byScore.slice(0, 2);
  const lockedMetrics = byScore.slice(2);
  const needWork = audit.metrics.filter((m) => m.key !== "llms-txt" && (m.severity === "critical" || m.severity === "warning")).length;

  const checkoutUrl = getAuditCheckoutUrl({ plan: "standard", auditId: id, domain: audit.domain });

  return (
    <>
      {/* A finished free check is the lead the ads campaign is optimised on. */}
      <MetaEvent custom="ScanCompleted" standard="Lead" params={{ content_name: "AI Website Visibility" }} eventId={`lead-${id}`} />
      {/* The finding, on a black band. */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-3 text-base font-bold uppercase tracking-wider text-accent">Free check · AI Website Visibility</p>
            <h1 className="break-all text-5xl font-bold leading-none tracking-[-0.04em] text-white">{audit.domain}</h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              {needWork > 0
                ? `${needWork} technical sign${needWork === 1 ? "" : "s"} on the homepage need work. They can stop AI crawlers from reading it.`
                : "The technical signs on the homepage are in reasonable shape. The kit shows what is left to tighten."}
            </p>
            <Link
              href="/audit"
              className="mt-5 inline-block rounded-xl border-2 border-white/40 px-4 py-1.5 text-base font-bold text-white hover:border-white"
            >
              Check another site
            </Link>
          </div>
          <div className="rounded-3xl bg-accent p-6">
            <p className="text-base font-bold text-black/70">AI site readiness score</p>
            <p className="mt-1 text-7xl font-bold leading-none tracking-tight text-black">
              {audit.overallScore}
              <span className="text-3xl text-black/50"> / 100</span>
            </p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/15">
              <div className="h-full rounded-full bg-black" style={{ width: `${audit.overallScore}%` }} />
            </div>
            <p className="mt-3 text-base font-semibold text-black/75">Technical signs measured on your homepage. llms.txt is shown, not scored.</p>
          </div>
        </div>
      </section>

      {/* What two models remember, without search. Every model asked keeps its card. */}
      {brands.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              What AI says about {audit.domain} <span className="underline decoration-accent decoration-4 underline-offset-8">from memory</span>
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-black/75">
              Recall from training, without web search. It is not what an assistant with search finds today: in the AI Fix Kit,
              five assistants look up your site live.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {brands.map((brand) => (
                <div key={brand.provider} className="rounded-2xl bg-black px-6 py-5">
                  <p className="text-xl font-bold text-accent">
                    {brand.status === "recognised"
                      ? `${brand.providerLabel}'s model recognises you`
                      : brand.status === "unrecognised"
                        ? `${brand.providerLabel}'s model has no memory of you`
                        : `${brand.providerLabel}'s model did not answer`}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-white/85">
                    {hasAnswer(brand)
                      ? brand.answer
                      : brand.status === "rate-limited"
                        ? "The daily limit for free checks was reached, so this model was not asked. Try again tomorrow."
                        : "The model could not be reached this time. The rest of the check is not affected."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The signals: two in full, the rest in the kit. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">Your two weakest signs</h2>
          <p className="mt-3 text-lg leading-relaxed text-black/75">
            The other {lockedMetrics.length}, with the fixes in order, are in the AI Fix Kit.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {previewMetrics.map((metric) => (
              <MetricCard key={metric.key} metric={metric} />
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {lockedMetrics.map((metric) => (
              <li key={metric.key} className="flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 text-base font-bold text-black">
                <Lock />
                {metric.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The offer. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            The AI Fix Kit for {audit.domain}. <span className="underline decoration-accent decoration-4 underline-offset-8">Measured, not a template.</span>
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {KIT.map((item) => (
              <li key={item.title} className="rounded-2xl bg-black px-6 py-5">
                <p className="text-xl font-bold text-accent">{item.title}</p>
                <p className="mt-1.5 text-base leading-relaxed text-white/85">{item.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            {checkoutUrl ? (
              <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
                <CheckoutLink
                  href={checkoutUrl}
                  value={49}
                  currency="EUR"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-accent px-10 py-6 text-3xl font-bold text-black transition hover:bg-accent-hover"
                >
                  Get the AI Fix Kit, &euro;49
                  <Arrow />
                </CheckoutLink>
                <p className="text-xl font-semibold text-black/75">By email within minutes · one payment · 14-day refund, no questions asked</p>
              </div>
            ) : (
              <p className="text-xl text-black/75">
                Checkout is paused for a moment. Write to <ContactEmail className="font-bold underline" /> and we will send your
                kit by hand.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function MetricCard({ metric }: { metric: AuditMetric }) {
  return (
    <div className="flex items-start justify-between gap-6 rounded-2xl bg-black px-6 py-5">
      <div>
        <p className="text-xl font-bold text-accent">{metric.label}</p>
        <p className="mt-1.5 text-base leading-relaxed text-white/85">{metric.shortHuman}</p>
      </div>
      <p className="shrink-0 text-4xl font-bold text-white">
        {metric.score}
        <span className="text-lg text-white/50">/100</span>
      </p>
    </div>
  );
}

function Lock() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
