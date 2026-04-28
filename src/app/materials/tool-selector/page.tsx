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

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <ToolSelector tools={tools} />
        </div>
      </section>
    </>
  );
}
