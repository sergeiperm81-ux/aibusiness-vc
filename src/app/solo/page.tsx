import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import SectionArticleExplorer from "@/components/SectionArticleExplorer";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export const metadata: Metadata = {
  title: "Solo — Make Money with AI as an Individual (2026)",
  description:
    "How individuals earn money with AI. Freelancing, digital products, content creation, side hustles. Real income data and step-by-step guides.",
};

export default function SoloPage() {
  const articles = getArticlesBySection("solo");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Solo Earners
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Make Money with AI <span className="text-accent">as an Individual</span>
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            No company needed. No employees. Just you and AI. Every method with
            real income numbers, difficulty levels, and time to first dollar.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TrackedLink
              href="/materials/roi-calculator"
              eventName="click_section_cta"
              eventParams={{ section: "solo", cta: "roi_calculator" }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 hover:border-emerald-300 transition-colors"
            >
              Calculate ROI for your AI hustle &rarr;
            </TrackedLink>
            <TrackedLink
              href="/materials/tool-selector"
              eventName="click_section_cta"
              eventParams={{ section: "solo", cta: "tool_selector" }}
              className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900 hover:border-cyan-300 transition-colors"
            >
              Pick your lean AI stack &rarr;
            </TrackedLink>
            <TrackedLink
              href="/materials/playbook-templates"
              eventName="click_section_cta"
              eventParams={{ section: "solo", cta: "playbook_templates" }}
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 hover:border-amber-300 transition-colors"
            >
              Copy solo offer templates &rarr;
            </TrackedLink>
          </div>
        </div>
      </section>

      <SectionArticleExplorer articles={articles} section="solo" totalLabel="articles" />
    </>
  );
}
