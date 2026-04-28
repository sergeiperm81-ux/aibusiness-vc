import type { Metadata } from "next";
import PlaybookTemplates from "@/components/materials/PlaybookTemplates";
import { TrackEventOnView } from "@/components/analytics/TrackEventOnView";

export const metadata: Metadata = {
  title: "AI Playbook Templates - Offers, Sales, SOPs (2026)",
  description:
    "Ready-to-use AI business playbook templates for offers, sales calls, delivery SOPs, and pricing models.",
};

export default function PlaybookTemplatesPage() {
  return (
    <>
      <TrackEventOnView eventName="view_tool" params={{ tool: "playbook_templates", section: "materials" }} />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-pink-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">Materials</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Playbook <span className="text-accent">Templates</span>
          </h1>
          <p className="text-sm text-muted max-w-3xl">
            Reuse the same execution frameworks that work: offer templates, discovery scripts, delivery SOPs, and
            value-based pricing structures.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">What This Is</p>
              <p className="text-sm text-gray-800">
                Ready-to-use business templates for selling and delivering AI services, not generic prompts.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Who It Is For</p>
              <p className="text-sm text-gray-800">
                Agencies, consultants, founders, and operators working with client AI projects.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">When To Use</p>
              <p className="text-sm text-gray-800">
                Before sales calls, offer creation, onboarding, and delivery so you reuse proven structure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <PlaybookTemplates />
        </div>
      </section>
    </>
  );
}
