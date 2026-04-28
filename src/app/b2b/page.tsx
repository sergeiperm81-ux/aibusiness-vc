import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import SectionArticleExplorer from "@/components/SectionArticleExplorer";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export const metadata: Metadata = {
  title: "B2B - AI Implementation for Businesses (2026)",
  description:
    "How businesses implement AI. Case studies, ROI analysis, implementation guides, and lessons from real AI deployments.",
};

export default function B2BPage() {
  const articles = getArticlesBySection("b2b");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-blue-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            B2B
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI for Business - <span className="text-accent">What Works</span> and What Doesn&apos;t
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Real stories of AI implementation. The wins, the failures, ROI analysis, and lessons learned.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TrackedLink
              href="/materials/roi-calculator"
              eventName="click_section_cta"
              eventParams={{ section: "b2b", cta: "roi_calculator" }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 hover:border-emerald-300 transition-colors"
            >
              Model implementation ROI &rarr;
            </TrackedLink>
            <TrackedLink
              href="/materials/tool-selector"
              eventName="click_section_cta"
              eventParams={{ section: "b2b", cta: "tool_selector" }}
              className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900 hover:border-cyan-300 transition-colors"
            >
              Build the right enterprise stack &rarr;
            </TrackedLink>
            <TrackedLink
              href="/materials/playbook-templates"
              eventName="click_section_cta"
              eventParams={{ section: "b2b", cta: "playbook_templates" }}
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 hover:border-amber-300 transition-colors"
            >
              Use delivery and pricing playbooks &rarr;
            </TrackedLink>
          </div>
        </div>
      </section>

      <SectionArticleExplorer articles={articles} section="b2b" totalLabel="articles" />
    </>
  );
}
