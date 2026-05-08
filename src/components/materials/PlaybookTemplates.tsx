"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { appendLocalLead } from "@/lib/leads-local";

type PromptType =
  | "research"
  | "marketing"
  | "sales"
  | "operations"
  | "finance"
  | "hr";

interface PromptTemplate {
  id: string;
  title: string;
  type: PromptType;
  useCase: string;
  whyItWorks: string;
  content: string;
}

const prompts: PromptTemplate[] = [
  {
    id: "geo-revenue-audit-master",
    title: "GEO Revenue Audit Master Prompt",
    type: "marketing",
    useCase:
      "Run a serious AI visibility + revenue-impact audit for one domain, with an actionable fix backlog.",
    whyItWorks:
      "Strong input contract + scoring logic + implementation backlog with owners and effort estimates.",
    content: `# GEO Revenue Audit Master Prompt (Copy-Paste)

You are a senior GEO consultant (Generative Engine Optimization) and growth operator.
Your job is to produce an audit that a CEO can approve and an execution team can implement.

## INPUT
- Domain: [INSERT DOMAIN]
- Business model: [SaaS / Agency / Ecommerce / Media / Local Service]
- Primary conversion event: [DEMO / CHECKOUT / LEAD / SUBSCRIPTION]
- Target geos: [INSERT]
- Top 3 competitors: [INSERT]
- Key pages to prioritize: [INSERT URLS]
- Constraints: [TEAM SIZE, BUDGET, DEADLINE]

## TASK
1) Evaluate domain readiness for AI citations and answer-engine discovery.
2) Identify the top issues hurting discoverability, trust, and conversion.
3) Prioritize fixes by revenue impact and implementation effort.

## REQUIRED OUTPUT (STRICT)
1. Executive summary (max 220 words)
2. Scorecard (0-100) with sub-scores:
   - Crawlability
   - Structured data quality
   - Content answerability
   - Trust and authority signals
   - Conversion path clarity
3. Issue table:
   issue_id | issue | severity (critical/high/medium/low) | evidence | business impact | fix
4. 30-day execution plan:
   week | deliverable | owner role | effort (S/M/L) | expected impact
5. "What to ship first in 72 hours" list (max 7 items)
6. KPI dashboard:
   leading metrics + lagging revenue metrics + weekly targets

## QUALITY GATE
- Never invent facts; mark unknowns as "data missing".
- Every recommendation must be testable.
- Use plain language; avoid vague advice like "improve content".
- Include at least 3 concrete examples of rewritten content or markup patterns.`,
  },
  {
    id: "market-opportunity-with-kill-criteria",
    title: "Market Opportunity Memo with Kill Criteria",
    type: "research",
    useCase:
      "Decide GO / NO-GO quickly with explicit assumptions, validation tests, and kill criteria.",
    whyItWorks:
      "Prevents wishful thinking by forcing downside analysis and hard stop conditions.",
    content: `# Market Opportunity Memo with Kill Criteria (Copy-Paste)

Act as a principal strategy analyst writing an investment memo.

## INPUT
- Product concept: [INSERT]
- Buyer segment: [INSERT]
- Pricing hypothesis: [INSERT]
- Distribution channels: [INSERT]
- Geography: [INSERT]
- Known competitors: [INSERT]
- Team strengths/weaknesses: [INSERT]

## TASK
Assess whether this opportunity deserves the next 90 days of focused execution.

## OUTPUT FORMAT
1. One-page memo:
   - Why now
   - Why this segment
   - Why we can win
2. Assumption map:
   assumption | confidence (0-100) | evidence | risk if wrong
3. Validation plan (14 days):
   test | metric | pass threshold | fail threshold | owner
4. Economics sanity check:
   target CAC | target payback | gross margin realism | break-even logic
5. Recommendation:
   GO / CONDITIONAL GO / NO-GO
6. Kill criteria:
   3-5 objective conditions that should stop the project immediately

## CONSTRAINTS
- No motivational fluff.
- Call out contradictions explicitly.
- Prioritize speed of learning over perfection.`,
  },
  {
    id: "competitor-battlecard-system",
    title: "Competitor Battlecard and Win Plan",
    type: "research",
    useCase:
      "Create battlecards sales can use tomorrow and a positioning wedge product can build around.",
    whyItWorks:
      "Combines positioning and execution: clear wedge, objections, and proof strategy.",
    content: `# Competitor Battlecard and Win Plan (Copy-Paste)

You are a GTM strategist and competitive intelligence lead.

## INPUT
- Our company and offer: [INSERT]
- ICP: [INSERT]
- Deal size range: [INSERT]
- Competitors (3-8): [INSERT]
- Notes, links, screenshots: [PASTE]

## OUTPUT (STRICT STRUCTURE)
1. Competitor matrix:
   competitor | ICP focus | pricing model | onboarding friction | strength | weakness
2. Battlecards (one per competitor):
   - Where they win
   - Where they are vulnerable
   - Questions to expose gap on a sales call
   - Objection response script
3. Wedge strategy (single best wedge):
   target segment | promise | proof required | risk
4. Message house:
   headline | subheadline | 3 proof statements | 2 anti-claims (what we should NOT promise)
5. 30-day win plan:
   action | owner role | impact | effort

## RULES
- Be evidence-driven; mark speculative points.
- Avoid generic phrases like "better UX" without specifics.
- Use language a sales rep can read live on calls.`,
  },
  {
    id: "voc-to-messaging-and-roadmap",
    title: "Voice of Customer to Messaging and Roadmap",
    type: "marketing",
    useCase:
      "Convert raw customer language into conversion copy and product priorities with evidence.",
    whyItWorks:
      "Ties every messaging claim to customer quotes and business impact.",
    content: `# Voice of Customer to Messaging and Roadmap (Copy-Paste)

Act as a product marketing lead.

## INPUT DATA
- Reviews, support tickets, sales-call notes, churn reasons:
[PASTE RAW DATA]

## TASK
Extract what customers actually care about and convert it into messaging + roadmap actions.

## OUTPUT
1. Insight summary (top 5 insights by business impact)
2. Theme table:
   theme | frequency | severity | likely revenue impact | confidence
3. Quote bank:
   exact phrase | context | suggested usage (homepage, ad, sales deck, email)
4. Messaging rewrite pack:
   - 5 homepage headline options
   - 5 value-proposition options
   - 5 objection-handling responses
5. Product action plan:
   30-day fixes | 90-day improvements | owner role | expected KPI movement

## QUALITY RULES
- Use exact customer wording where possible.
- Distinguish symptom vs root cause.
- No claim without evidence snippet.`,
  },
  {
    id: "sales-call-operating-system",
    title: "Sales Call Operating System",
    type: "sales",
    useCase:
      "Prepare, run, and follow up discovery calls with one integrated prompt workflow.",
    whyItWorks:
      "Gives pre-call plan + live call structure + post-call decision memo in one flow.",
    content: `# Sales Call Operating System (Copy-Paste)

You are an enterprise sales manager coaching an AE.

## INPUT
- Prospect company: [INSERT]
- Prospect role: [INSERT]
- Our offer: [INSERT]
- Typical deal size: [INSERT]
- Known context / notes: [PASTE]
- Meeting goal: [INSERT]

## OUTPUT IN 3 PHASES

### Phase 1: Pre-call Prep
1) 10 high-signal discovery questions (ordered)
2) 5 value hypotheses we should validate
3) likely objections + best responses
4) red flags to detect fast

### Phase 2: Live Call Structure (30 min)
- minute-by-minute agenda
- transition phrases
- decision checkpoints

### Phase 3: Post-call Package
1) qualification score (0-100 with rationale)
2) next-step recommendation (advance / nurture / disqualify)
3) follow-up email draft with clear commitment ask
4) CRM note template (copy-paste ready)

## RULES
- Consultative tone, no hype.
- Questions must be decision-relevant.
- If info is missing, list what to ask next.`,
  },
  {
    id: "pricing-architecture-stress-test",
    title: "Pricing Architecture Stress Test",
    type: "finance",
    useCase:
      "Design and stress-test pricing models before rollout to reduce margin and conversion risk.",
    whyItWorks:
      "Forces explicit trade-offs: conversion, margin, sales friction, and expansion logic.",
    content: `# Pricing Architecture Stress Test (Copy-Paste)

Act as a pricing strategist with SaaS and services experience.

## INPUT
- Product or service: [INSERT]
- Current pricing: [INSERT]
- Cost structure: [INSERT]
- Gross margin target: [INSERT]
- Buyer segments: [INSERT]
- Competitor pricing references: [INSERT]

## TASK
Design and evaluate 3 pricing architectures:
1) tiered
2) usage-based
3) hybrid

## REQUIRED OUTPUT
1. Model comparison table:
   model | who it fits | conversion risk | margin risk | sales complexity | expansion potential
2. Price-point recommendation by segment
3. Sensitivity check:
   what happens at -10%, base, +10% pricing
4. 30-day experiment plan:
   test | segment | success metric | stop condition
5. Final recommendation + rollback criteria

## CONSTRAINTS
- No abstract advice.
- Every model must include realistic upgrade path.
- Explicitly call out failure modes.`,
  },
  {
    id: "unit-economics-war-room",
    title: "Unit Economics War Room",
    type: "finance",
    useCase:
      "Build realistic base/upside/downside scenarios and decide where to intervene first.",
    whyItWorks:
      "Connects metrics to actions instead of producing passive analysis.",
    content: `# Unit Economics War Room (Copy-Paste)

Act as an operator-CFO.

## INPUT
- Revenue (MRR/ARR): [INSERT]
- Gross margin: [INSERT]
- CAC: [INSERT]
- Payback: [INSERT]
- Churn: [INSERT]
- Opex and headcount: [INSERT]

## OUTPUT
1. Scenario table:
   base | upside | downside
   with revenue, margin, cash runway, key risks
2. Top 3 break points (what kills this model fastest)
3. Action map:
   action | expected impact | confidence | time-to-impact
4. 6-week intervention plan (weekly cadence)
5. Weekly dashboard template for leadership

## QUALITY GATE
- State assumptions clearly.
- Flag any metric inconsistency.
- Include "if this metric worsens, do X immediately" rules.`,
  },
  {
    id: "ops-sop-to-agent-ready-workflow",
    title: "Ops SOP to Agent-Ready Workflow",
    type: "operations",
    useCase:
      "Convert manual workflows into clear SOPs and AI-agent task contracts with QA controls.",
    whyItWorks:
      "Bridges human SOP and AI execution so teams can automate safely.",
    content: `# Ops SOP to Agent-Ready Workflow (Copy-Paste)

Act as an operations architect.

## INPUT
- Process name: [INSERT]
- Current workflow: [INSERT]
- Roles involved: [INSERT]
- Failure cases seen: [INSERT]
- KPI target: [INSERT]

## DELIVERABLE
1. Human SOP v1:
   step | owner | definition of done | handoff condition
2. Agent-ready task contract:
   input schema | output schema | constraints | error handling
3. QA checklist:
   pass/fail criteria per step
4. Escalation policy:
   when to stop automation and escalate to human
5. Weekly improvement loop:
   what to review, what to log, how to version SOP

## RULES
- Steps must be atomic.
- No ambiguous verbs ("improve", "optimize") without metric definition.
- Include at least 5 edge cases and handling rules.`,
  },
  {
    id: "hiring-scorecard-decision-engine",
    title: "Hiring Scorecard Decision Engine",
    type: "hr",
    useCase:
      "Create a hiring system that reduces bias, false positives, and random final decisions.",
    whyItWorks:
      "Structured competency scoring + evidence-based decision memo.",
    content: `# Hiring Scorecard Decision Engine (Copy-Paste)

Act as a hiring manager with bar-raiser standards.

## INPUT
- Role: [INSERT]
- Seniority: [INSERT]
- Team context: [INSERT]
- Expected 90-day outcomes: [INSERT]

## OUTPUT
1. Role scorecard:
   competency | must-have/nice-to-have | observable signals
2. Interview plan:
   stage | objective | interviewer profile | pass criteria
3. Question bank:
   question | strong answer signal | weak signal | red flag
4. Practical assignment:
   brief | rubric | weighting
5. Final decision memo template:
   evidence summary | risks | hire/no-hire recommendation

## QUALITY RULES
- Every judgment must point to evidence.
- Separate skill gaps from coachable gaps.
- Include false-positive risk checklist.`,
  },
  {
    id: "churn-root-cause-and-save-playbook",
    title: "Churn Root Cause and Save Playbook",
    type: "marketing",
    useCase:
      "Diagnose churn by segment and produce interventions with measurable expected impact.",
    whyItWorks:
      "Separates churn types and maps each type to targeted save motions and KPIs.",
    content: `# Churn Root Cause and Save Playbook (Copy-Paste)

Act as a retention strategist.

## INPUT
- Churn by cohort/segment: [INSERT]
- Cancellation reasons: [INSERT]
- Product usage patterns: [INSERT]
- Pricing and contract data: [INSERT]

## OUTPUT
1. Churn decomposition:
   onboarding churn | value-gap churn | pricing churn | service churn
2. Driver table:
   driver | impact | confidence | affected segment
3. Intervention playbook:
   intervention | segment | owner | effort | expected impact
4. Save scripts for CS:
   scenario | script | concession policy | escalation trigger
5. KPI board:
   weekly leading indicators + target movement in 30/60/90 days

## RULES
- Prioritize interventions by impact/effort.
- No generic "improve onboarding" statements; specify exact actions.
- Include risk notes for each intervention.`,
  },
];

const typeLabels: Record<PromptType, string> = {
  research: "Research",
  marketing: "Marketing",
  sales: "Sales",
  operations: "Operations",
  finance: "Finance",
  hr: "Hiring",
};

export default function PlaybookTemplates() {
  const [typeFilter, setTypeFilter] = useState<"all" | PromptType>("all");
  const [activeId, setActiveId] = useState(prompts[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSending, setLeadSending] = useState(false);
  const [leadMessage, setLeadMessage] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);

  const visiblePrompts = useMemo(
    () => prompts.filter((prompt) => typeFilter === "all" || prompt.type === typeFilter),
    [typeFilter]
  );

  const activePrompt =
    prompts.find((prompt) => prompt.id === activeId) ?? visiblePrompts[0] ?? prompts[0];

  async function copyPrompt(prompt: PromptTemplate) {
    try {
      await navigator.clipboard.writeText(prompt.content);
      trackEvent("copy_template", {
        tool: "playbook_templates",
        template_id: prompt.id,
        template_type: prompt.type,
      });
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId((prev) => (prev === prompt.id ? null : prev)), 1500);
    } catch {
      setCopiedId(null);
    }
  }

  async function saveContact(prompt: PromptTemplate) {
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
    trackEvent("lead_submit", { source: "playbook_templates", template_id: prompt.id });

    appendLocalLead({
      email,
      source: "playbook_templates",
      payload: {
        templateId: prompt.id,
        templateTitle: prompt.title,
        templateType: prompt.type,
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
            templateId: prompt.id,
            templateTitle: prompt.title,
            templateType: prompt.type,
            templateContent: prompt.content,
          },
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        saved?: boolean;
        message?: string;
        error?: string;
      };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setLeadMessage(data.message ?? "Contact saved.");
      trackEvent("lead_submit_success", {
        source: "playbook_templates",
        saved: true,
        template_id: prompt.id,
      });
    } catch {
      setLeadError("Lead saved locally, but API save failed. Try again later.");
      trackEvent("lead_submit_error", { source: "playbook_templates", template_id: prompt.id });
    } finally {
      setLeadSending(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">Prompt Library</h2>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | PromptType)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="all">All</option>
            <option value="research">Research</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="operations">Operations</option>
            <option value="finance">Finance</option>
            <option value="hr">Hiring</option>
          </select>
        </div>

        <div className="space-y-2">
          {visiblePrompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => setActiveId(prompt.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                activePrompt.id === prompt.id
                  ? "border-accent bg-amber-50"
                  : "border-gray-200 bg-white hover:border-accent/40"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">{prompt.title}</p>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                  {typeLabels[prompt.type]}
                </span>
              </div>
              <p className="text-xs text-gray-600">{prompt.useCase}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-3">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">{activePrompt.title}</h3>
            <p className="mt-1 text-xs text-gray-600">{activePrompt.useCase}</p>
          </div>
          <button
            type="button"
            onClick={() => copyPrompt(activePrompt)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            {copiedId === activePrompt.id ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800">
            Why This Prompt Works
          </p>
          <p className="mt-1 text-xs text-amber-900">{activePrompt.whyItWorks}</p>
        </div>

        <textarea
          readOnly
          value={activePrompt.content}
          className="min-h-[620px] w-full rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-800"
        />

        <div className="mt-4 border-t border-gray-200 pt-4">
          <h4 className="mb-2 text-sm font-bold text-gray-900">Save Contact</h4>
          <p className="mb-3 text-xs text-gray-600">
            Save email + selected prompt interest to your private owner dashboard.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button
              type="button"
              onClick={() => saveContact(activePrompt)}
              disabled={leadSending}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {leadSending ? "Saving..." : "Save Contact"}
            </button>
          </div>
          {leadMessage && <p className="mt-2 text-xs text-emerald-700">{leadMessage}</p>}
          {leadError && <p className="mt-2 text-xs text-rose-600">{leadError}</p>}
        </div>
      </div>
    </div>
  );
}
