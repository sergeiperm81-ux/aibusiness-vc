import type { Metadata } from "next";
import PlaybookTemplates from "@/components/materials/PlaybookTemplates";
import { TrackEventOnView } from "@/components/analytics/TrackEventOnView";

export const metadata: Metadata = {
  title: "Business Prompt Library (2026) - Research, Marketing, Sales, Operations",
  description:
    "Execution-grade business prompts with strong structure, constraints, and output formats for real team workflows.",
};

export default function PlaybookTemplatesPage() {
  return (
    <>
      <TrackEventOnView eventName="view_tool" params={{ tool: "playbook_templates", section: "materials" }} />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-pink-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">Materials</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Business <span className="text-accent">Prompt Library</span>
          </h1>
          <p className="text-sm text-muted max-w-3xl">
            Practical prompts built for execution: clear inputs, strict constraints, and predictable outputs that
            founders and teams can use immediately.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">What This Is</p>
              <p className="text-sm text-gray-800">
                A copy-paste prompt library with variables to replace using your own data.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Who It Is For</p>
              <p className="text-sm text-gray-800">
                Founders, operators, marketers, analysts, and teams who want immediate practical outputs.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">When To Use</p>
              <p className="text-sm text-gray-800">
                Before strategy sessions, vendor decisions, campaigns, sales calls, and operational planning.
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
