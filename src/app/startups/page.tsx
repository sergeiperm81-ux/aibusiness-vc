import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import { SectionArticleGrid } from "@/components/SectionPage";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export const metadata: Metadata = {
  title: "AI Startups — Funding, Launches, and Innovations (2026)",
  description:
    "AI startup news, funding rounds, product launches, and the companies shaping the future of AI.",
};

export default function StartupsPage() {
  const articles = getArticlesBySection("startups");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-purple-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            AI Startups
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            The Companies <span className="text-accent">Building the Future</span> of AI
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Funding rounds, product launches, and the startups to watch.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TrackedLink
              href="/materials/roi-calculator"
              eventName="click_section_cta"
              eventParams={{ section: "startups", cta: "roi_calculator" }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 hover:border-emerald-300 transition-colors"
            >
              Validate unit economics with ROI &rarr;
            </TrackedLink>
            <TrackedLink
              href="/materials/tool-selector"
              eventName="click_section_cta"
              eventParams={{ section: "startups", cta: "tool_selector" }}
              className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900 hover:border-cyan-300 transition-colors"
            >
              Select your MVP tool stack &rarr;
            </TrackedLink>
            <TrackedLink
              href="/materials/playbook-templates"
              eventName="click_section_cta"
              eventParams={{ section: "startups", cta: "playbook_templates" }}
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 hover:border-amber-300 transition-colors"
            >
              Grab GTM and delivery templates &rarr;
            </TrackedLink>
          </div>
        </div>
      </section>

      <SectionArticleGrid articles={articles} section="startups" totalLabel="articles" />
    </>
  );
}
