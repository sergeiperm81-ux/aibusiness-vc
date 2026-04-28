import type { Metadata } from "next";
import RoiCalculator from "@/components/materials/RoiCalculator";
import { TrackEventOnView } from "@/components/analytics/TrackEventOnView";

export const metadata: Metadata = {
  title: "AI ROI Calculator - Revenue and Savings Model (2026)",
  description:
    "Estimate AI business impact with a practical ROI calculator: time savings, revenue lift, payback period, and annual net value.",
};

export default function RoiCalculatorPage() {
  return (
    <>
      <TrackEventOnView eventName="view_tool" params={{ tool: "roi_calculator", section: "materials" }} />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-pink-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">Materials</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI ROI <span className="text-accent">Calculator</span>
          </h1>
          <p className="text-sm text-muted max-w-3xl">
            Model your AI economics in minutes. Plug in your revenue, costs, time savings, and implementation effort to
            see monthly impact, annual net, and payback period.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <RoiCalculator />
        </div>
      </section>
    </>
  );
}
