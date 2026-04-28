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

      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">What This Is</p>
              <p className="text-sm text-gray-800">
                A quick financial model that estimates if an AI project makes money or burns budget.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Who It Is For</p>
              <p className="text-sm text-gray-800">Founders, operators, agencies, and investors validating AI economics.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">When To Use</p>
              <p className="text-sm text-gray-800">
                Before building, before hiring, or before pitching a budget to see payback and ROI.
              </p>
            </div>
          </div>
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
