"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { appendLocalLead } from "@/lib/leads-local";

interface RoiInputs {
  monthlyRevenue: number;
  monthlyOperatingCost: number;
  aiToolsMonthlyCost: number;
  implementationHours: number;
  hourlyValue: number;
  hoursSavedPerWeek: number;
  revenueLiftPercent: number;
}

const initialInputs: RoiInputs = {
  monthlyRevenue: 15000,
  monthlyOperatingCost: 7000,
  aiToolsMonthlyCost: 250,
  implementationHours: 30,
  hourlyValue: 80,
  hoursSavedPerWeek: 12,
  revenueLiftPercent: 8,
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatUsd(value: number): string {
  return usd.format(Math.round(value));
}

function NumberField({
  label,
  value,
  min = 0,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}

export default function RoiCalculator() {
  const [inputs, setInputs] = useState<RoiInputs>(initialInputs);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSending, setLeadSending] = useState(false);
  const [leadMessage, setLeadMessage] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  function updateInput<K extends keyof RoiInputs>(field: K, value: RoiInputs[K]) {
    setInputs((prev) => ({ ...prev, [field]: value }));

    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent("start_input", {
        tool: "roi_calculator",
        field,
      });
    }
  }

  const results = useMemo(() => {
    const monthlyTimeSavingsValue = inputs.hoursSavedPerWeek * 4.33 * inputs.hourlyValue;
    const monthlyRevenueLiftValue = inputs.monthlyRevenue * (inputs.revenueLiftPercent / 100);
    const grossMonthlyBenefit = monthlyTimeSavingsValue + monthlyRevenueLiftValue;
    const netMonthlyBenefit = grossMonthlyBenefit - inputs.aiToolsMonthlyCost;

    const oneTimeImplementationCost = inputs.implementationHours * inputs.hourlyValue;
    const annualBenefit = grossMonthlyBenefit * 12;
    const annualCost = inputs.aiToolsMonthlyCost * 12 + oneTimeImplementationCost;
    const annualNet = annualBenefit - annualCost;

    const roiPercent = annualCost > 0 ? (annualNet / annualCost) * 100 : 0;
    const paybackMonths = netMonthlyBenefit > 0 ? oneTimeImplementationCost / netMonthlyBenefit : null;

    const monthlyProfitBeforeAI = inputs.monthlyRevenue - inputs.monthlyOperatingCost;
    const monthlyProfitAfterAI = monthlyProfitBeforeAI + netMonthlyBenefit;
    const profitDeltaPercent =
      monthlyProfitBeforeAI > 0
        ? ((monthlyProfitAfterAI - monthlyProfitBeforeAI) / monthlyProfitBeforeAI) * 100
        : 0;

    return {
      monthlyTimeSavingsValue,
      monthlyRevenueLiftValue,
      grossMonthlyBenefit,
      netMonthlyBenefit,
      oneTimeImplementationCost,
      annualBenefit,
      annualCost,
      annualNet,
      roiPercent,
      paybackMonths,
      monthlyProfitBeforeAI,
      monthlyProfitAfterAI,
      profitDeltaPercent,
    };
  }, [inputs]);

  useEffect(() => {
    if (!hasStartedRef.current || hasCompletedRef.current) return;

    hasCompletedRef.current = true;
    trackEvent("complete_calc", {
      tool: "roi_calculator",
      net_monthly_gain: Math.round(results.netMonthlyBenefit),
      annual_net: Math.round(results.annualNet),
      roi_percent: Number(results.roiPercent.toFixed(1)),
    });
  }, [results.annualNet, results.netMonthlyBenefit, results.roiPercent]);

  async function submitLead() {
    const email = leadEmail.trim().toLowerCase();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailOk) {
      setLeadError("Enter a valid email.");
      setLeadMessage(null);
      return;
    }

    setLeadSending(true);
    setLeadError(null);
    setLeadMessage(null);

    trackEvent("lead_submit", { source: "roi_calculator" });

    appendLocalLead({
      email,
      source: "roi_calculator",
      payload: {
        netMonthlyGain: Math.round(results.netMonthlyBenefit),
        annualNet: Math.round(results.annualNet),
        roiPercent: Number(results.roiPercent.toFixed(1)),
        paybackMonths: results.paybackMonths ? Number(results.paybackMonths.toFixed(1)) : null,
      },
    });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "roi_calculator",
          payload: {
            netMonthlyGain: Math.round(results.netMonthlyBenefit),
            annualNet: Math.round(results.annualNet),
            roiPercent: Number(results.roiPercent.toFixed(1)),
            paybackMonths: results.paybackMonths ? Number(results.paybackMonths.toFixed(1)) : null,
          },
        }),
      });

      const data = (await response.json()) as { ok?: boolean; saved?: boolean; message?: string; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setLeadMessage("Lead saved. You can export leads from /materials/leads.");
      trackEvent("lead_submit_success", { source: "roi_calculator", saved: true });
    } catch {
      setLeadError("Lead saved locally, but API save failed. Try again later.");
      trackEvent("lead_submit_error", { source: "roi_calculator" });
    } finally {
      setLeadSending(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Inputs</h2>
        <div className="space-y-3">
          <NumberField
            label="Monthly Revenue ($)"
            value={inputs.monthlyRevenue}
            onChange={(value) => updateInput("monthlyRevenue", Math.max(0, value))}
          />
          <NumberField
            label="Monthly Operating Cost ($)"
            value={inputs.monthlyOperatingCost}
            onChange={(value) => updateInput("monthlyOperatingCost", Math.max(0, value))}
          />
          <NumberField
            label="AI Tools Cost Per Month ($)"
            value={inputs.aiToolsMonthlyCost}
            onChange={(value) => updateInput("aiToolsMonthlyCost", Math.max(0, value))}
          />
          <NumberField
            label="One-Time Implementation Hours"
            value={inputs.implementationHours}
            onChange={(value) => updateInput("implementationHours", Math.max(0, value))}
          />
          <NumberField
            label="Internal Hourly Value ($/h)"
            value={inputs.hourlyValue}
            onChange={(value) => updateInput("hourlyValue", Math.max(0, value))}
          />
          <NumberField
            label="Hours Saved Per Week"
            value={inputs.hoursSavedPerWeek}
            onChange={(value) => updateInput("hoursSavedPerWeek", Math.max(0, value))}
            step={0.5}
          />
          <NumberField
            label="Revenue Lift From AI (%)"
            value={inputs.revenueLiftPercent}
            min={0}
            max={100}
            onChange={(value) => updateInput("revenueLiftPercent", Math.min(100, Math.max(0, value)))}
            step={0.5}
          />
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-background rounded-xl p-5">
            <p className="text-xs text-muted mb-1">Net Monthly Gain</p>
            <p className={`text-2xl font-bold ${results.netMonthlyBenefit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {formatUsd(results.netMonthlyBenefit)}
            </p>
            <p className="text-xs text-muted mt-1">After AI software costs</p>
          </div>
          <div className="bg-background rounded-xl p-5">
            <p className="text-xs text-muted mb-1">Annual Net Impact</p>
            <p className={`text-2xl font-bold ${results.annualNet >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {formatUsd(results.annualNet)}
            </p>
            <p className="text-xs text-muted mt-1">Benefits minus all AI costs</p>
          </div>
          <div className="bg-background rounded-xl p-5">
            <p className="text-xs text-muted mb-1">Year 1 ROI</p>
            <p className={`text-2xl font-bold ${results.roiPercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {results.roiPercent.toFixed(0)}%
            </p>
            <p className="text-xs text-muted mt-1">((Benefit - Cost) / Cost)</p>
          </div>
          <div className="bg-background rounded-xl p-5">
            <p className="text-xs text-muted mb-1">Payback Period</p>
            <p className="text-2xl font-bold text-white">
              {results.paybackMonths ? `${results.paybackMonths.toFixed(1)} months` : "No payback yet"}
            </p>
            <p className="text-xs text-muted mt-1">Based on implementation effort</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Monthly value from time saved</span>
              <span className="font-semibold text-gray-900">{formatUsd(results.monthlyTimeSavingsValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Monthly value from revenue lift</span>
              <span className="font-semibold text-gray-900">{formatUsd(results.monthlyRevenueLiftValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Gross monthly AI benefit</span>
              <span className="font-semibold text-gray-900">{formatUsd(results.grossMonthlyBenefit)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">AI software monthly cost</span>
              <span className="font-semibold text-gray-900">-{formatUsd(inputs.aiToolsMonthlyCost)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between">
              <span className="text-gray-900 font-semibold">Net monthly impact</span>
              <span className={`font-bold ${results.netMonthlyBenefit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {formatUsd(results.netMonthlyBenefit)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs text-amber-900">
            Profit before AI: <strong>{formatUsd(results.monthlyProfitBeforeAI)}</strong> per month. Profit after AI:{" "}
            <strong>{formatUsd(results.monthlyProfitAfterAI)}</strong> per month (
            <strong>{results.profitDeltaPercent.toFixed(0)}%</strong> change).
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Save This Lead</h3>
          <p className="text-xs text-gray-600 mb-3">
            Save this ROI scenario with contact email. Export later from the leads page.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button
              type="button"
              onClick={submitLead}
              disabled={leadSending}
              className="px-4 py-2 rounded-lg bg-accent text-black text-sm font-bold hover:bg-accent-hover transition-colors disabled:opacity-60"
            >
              {leadSending ? "Saving..." : "Save Lead"}
            </button>
          </div>
          {leadMessage && <p className="mt-2 text-xs text-emerald-700">{leadMessage}</p>}
          {leadError && <p className="mt-2 text-xs text-rose-600">{leadError}</p>}
        </div>
      </div>
    </div>
  );
}
