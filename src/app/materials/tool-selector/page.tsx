import type { Metadata } from "next";
import ToolSelector from "@/components/materials/ToolSelector";
import { tools } from "@/data/tools";
import { TrackEventOnView } from "@/components/analytics/TrackEventOnView";

export const metadata: Metadata = {
  title: "AI Tool Selector - Build Your Revenue Stack (2026)",
  description:
    "Select your AI stack by goal, budget, team size, and technical level. Get practical tool recommendations for making money with AI.",
};

export default function ToolSelectorPage() {
  return (
    <>
      <TrackEventOnView eventName="view_tool" params={{ tool: "tool_selector", section: "materials" }} />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-pink-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">Materials</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Tool <span className="text-accent">Selector</span>
          </h1>
          <p className="text-sm text-muted max-w-3xl">
            Build your stack for outcomes, not hype. Choose your goal and constraints, then get a practical set of AI
            tools to test first.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">What This Is</p>
              <p className="text-sm text-gray-800">
                A practical stack picker that recommends first tools to test based on real constraints.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Who It Is For</p>
              <p className="text-sm text-gray-800">Solo builders, teams, consultants, and businesses building AI workflows.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">When To Use</p>
              <p className="text-sm text-gray-800">
                When you have too many tool options and need a fast shortlist by goal, budget, and skill level.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <ToolSelector tools={tools} />
        </div>
      </section>
    </>
  );
}
