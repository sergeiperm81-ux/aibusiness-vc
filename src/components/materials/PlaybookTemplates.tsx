"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { appendLocalLead } from "@/lib/leads-local";

type TemplateType = "offer" | "sales" | "delivery" | "finance";

interface Template {
  id: string;
  title: string;
  type: TemplateType;
  useCase: string;
  content: string;
}

const templates: Template[] = [
  {
    id: "ai-audit-offer",
    title: "AI Audit Offer Template",
    type: "offer",
    useCase: "Sell a paid AI assessment to SMB or mid-market clients.",
    content: `# AI Audit Offer (2-week engagement)

## Outcome
- Identify top 3 automation opportunities worth implementing in 90 days
- Estimate ROI by team and workflow
- Deliver prioritized execution roadmap

## Scope
1. Stakeholder interviews (3-5)
2. Workflow mapping (current state)
3. Tool stack assessment
4. ROI model and recommended stack
5. Implementation backlog

## Deliverables
- 1x executive summary deck
- 1x workflow and savings model
- 1x 90-day AI rollout plan

## Timeline
- Week 1: discovery + diagnostics
- Week 2: analysis + recommendations

## Pricing
- Fixed fee: $3,500 - $9,000
- Optional implementation retainer: $2,000 - $8,000/month`,
  },
  {
    id: "discovery-call-script",
    title: "Discovery Call Script",
    type: "sales",
    useCase: "Qualify leads and close AI services without over-scoping.",
    content: `# Discovery Call Script (30 min)

## 1) Context (5 min)
- What are the top 2-3 goals this quarter?
- Where are you losing the most time or money right now?

## 2) Current workflow (10 min)
- Walk me through the process step by step.
- What tools are involved today?
- Where do delays or handoffs happen?

## 3) Economics (10 min)
- How many hours per week does this consume?
- What is the blended hourly cost of the team?
- What is the business impact of faster turnaround?

## 4) Close (5 min)
- I will send a scoped plan with expected ROI.
- If approved, we can start with a 2-week pilot next week.
- Decision checkpoint: budget, owner, timeline.`,
  },
  {
    id: "ai-agent-sop",
    title: "AI Agent Delivery SOP",
    type: "delivery",
    useCase: "Run implementation consistently across projects.",
    content: `# AI Agent Delivery SOP

## Phase 1: Define
- Problem statement and success metric
- Data sources and access
- Human-in-the-loop rules

## Phase 2: Build
- Prompt/system design
- Tool integrations
- Guardrails and fallback paths

## Phase 3: Validate
- Test set (50+ real cases)
- Accuracy and hallucination checks
- Failure log with fixes

## Phase 4: Launch
- Limited rollout (single team)
- Weekly KPI review
- Escalation process

## Phase 5: Optimize
- Prompt iteration cadence
- Automation expansion list
- Monthly ROI report`,
  },
  {
    id: "ai-retainer-pricing",
    title: "AI Retainer Pricing Sheet",
    type: "finance",
    useCase: "Price recurring AI work around value instead of pure hourly billing.",
    content: `# AI Retainer Pricing Model

## Inputs
- Current manual hours/month:
- Team blended hourly cost:
- Estimated automation coverage (%):
- Monthly software/tool cost:
- Risk buffer (%):

## Calculations
- Gross monthly savings = hours * hourly cost * coverage
- Net monthly savings = gross savings - software cost
- Suggested retainer = 25% to 45% of net monthly savings

## Package Bands
- Starter: $1,500 - $3,000/month
- Growth: $3,000 - $7,500/month
- Scale: $7,500 - $20,000/month

## Commercial Terms
- Minimum term: 3 months
- Setup fee: 0.5x to 1x monthly retainer
- KPI review cadence: every 30 days`,
  },
];

export default function PlaybookTemplates() {
  const [typeFilter, setTypeFilter] = useState<"all" | TemplateType>("all");
  const [activeId, setActiveId] = useState(templates[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSending, setLeadSending] = useState(false);
  const [leadMessage, setLeadMessage] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);

  const visibleTemplates = useMemo(
    () => templates.filter((template) => typeFilter === "all" || template.type === typeFilter),
    [typeFilter]
  );

  const activeTemplate =
    templates.find((template) => template.id === activeId) ?? visibleTemplates[0] ?? templates[0];

  async function copyTemplate(template: Template) {
    try {
      await navigator.clipboard.writeText(template.content);
      trackEvent("copy_template", {
        tool: "playbook_templates",
        template_id: template.id,
        template_type: template.type,
      });
      setCopiedId(template.id);
      setTimeout(() => setCopiedId((prev) => (prev === template.id ? null : prev)), 1500);
    } catch {
      setCopiedId(null);
    }
  }

  async function emailTemplate(template: Template) {
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
    trackEvent("lead_submit", { source: "playbook_templates", template_id: template.id });

    appendLocalLead({
      email,
      source: "playbook_templates",
      payload: {
        templateId: template.id,
        templateTitle: template.title,
        templateType: template.type,
      },
    });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "playbook_templates",
          payload: {
            templateId: template.id,
            templateTitle: template.title,
            templateType: template.type,
            templateContent: template.content,
          },
        }),
      });

      const data = (await response.json()) as { ok?: boolean; saved?: boolean; message?: string; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setLeadMessage("Lead saved. You can export leads from /materials/leads.");
      trackEvent("lead_submit_success", { source: "playbook_templates", saved: true, template_id: template.id });
    } catch {
      setLeadError("Lead saved locally, but API save failed. Try again later.");
      trackEvent("lead_submit_error", { source: "playbook_templates", template_id: template.id });
    } finally {
      setLeadSending(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900">Templates</h2>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | TemplateType)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="all">All</option>
            <option value="offer">Offer</option>
            <option value="sales">Sales</option>
            <option value="delivery">Delivery</option>
            <option value="finance">Finance</option>
          </select>
        </div>

        <div className="space-y-2">
          {visibleTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setActiveId(template.id)}
              className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                activeTemplate.id === template.id
                  ? "border-accent bg-amber-50"
                  : "border-gray-200 bg-white hover:border-accent/40"
              }`}
            >
              <p className="text-sm font-semibold text-gray-900">{template.title}</p>
              <p className="text-xs text-gray-600 mt-1">{template.useCase}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">{activeTemplate.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{activeTemplate.useCase}</p>
          </div>
          <button
            type="button"
            onClick={() => copyTemplate(activeTemplate)}
            className="text-xs font-semibold rounded-lg border border-gray-300 px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
          >
            {copiedId === activeTemplate.id ? "Copied" : "Copy"}
          </button>
        </div>

        <textarea
          readOnly
          value={activeTemplate.content}
          className="w-full min-h-[480px] rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-800 leading-relaxed font-mono"
        />

        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-bold text-gray-900 mb-2">Save This Lead</h4>
          <p className="text-xs text-gray-600 mb-3">
            Save contact email and selected template intent. Export from leads page anytime.
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
              onClick={() => emailTemplate(activeTemplate)}
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
