"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AITool } from "@/data/tools";
import { trackEvent } from "@/lib/analytics";

type Goal =
  | "client-services"
  | "content-growth"
  | "sales-automation"
  | "internal-ops"
  | "product-build"
  | "research-intel";
type Budget = "starter" | "growth" | "scale" | "any";
type TeamSize = "solo" | "small" | "mid" | "large";
type Skill = "no-code" | "hybrid" | "technical";

interface Props {
  tools: AITool[];
}

interface GoalProfile {
  label: string;
  summary: string;
  categories: string[];
}

const goalProfiles: Record<Goal, GoalProfile> = {
  "client-services": {
    label: "Client Services",
    summary: "Build and deliver AI services for paying clients.",
    categories: ["Chatbots & Agents", "Automation & Workflows", "Writing & Content", "Sales & CRM"],
  },
  "content-growth": {
    label: "Content and Audience Growth",
    summary: "Create more content, improve quality, and grow inbound.",
    categories: ["Writing & Content", "Social Media", "Video & Audio", "Marketing & SEO"],
  },
  "sales-automation": {
    label: "Sales and Outreach",
    summary: "Generate leads, run outreach, and close faster.",
    categories: ["Sales & CRM", "Email & Outreach", "Chatbots & Agents", "Automation & Workflows"],
  },
  "internal-ops": {
    label: "Internal Operations",
    summary: "Reduce manual work in support, workflows, and reporting.",
    categories: ["Automation & Workflows", "Productivity & Business", "Customer Support", "Data & Analytics"],
  },
  "product-build": {
    label: "Build Product Fast",
    summary: "Ship MVPs and internal tools quickly with lean teams.",
    categories: ["No-Code & Low-Code", "Coding", "DevOps & Infrastructure", "Chatbots & Agents"],
  },
  "research-intel": {
    label: "Research and Intelligence",
    summary: "Faster market research, competitor tracking, and decision support.",
    categories: ["Education & Research", "Data & Analytics", "Chatbots & Agents", "Productivity & Business"],
  },
};

const budgetLimits: Record<Budget, number> = {
  starter: 50,
  growth: 200,
  scale: 500,
  any: Number.POSITIVE_INFINITY,
};

const blockedForNoCode = new Set(["DevOps & Infrastructure", "Cybersecurity"]);

function detectMonthlyPrice(pricing: string): number | null {
  const normalized = pricing.toLowerCase();
  if (normalized.includes("free") && !/\$\d/.test(normalized)) return 0;

  const match = pricing.match(/\$(\d+(?:\.\d+)?)/);
  if (!match) return null;

  const amount = parseFloat(match[1]);
  if (/(?:\/|\bper\b)\s*(?:year|yr)\b/.test(normalized) || /\bannual\b|\bannually\b/.test(normalized)) {
    return amount / 12;
  }
  if (/(?:\/|\bper\b)\s*(?:hour|hr|minute|min)\b/.test(normalized)) {
    return amount * 10;
  }
  return amount;
}

function categoryScore(teamSize: TeamSize, skill: Skill, category: string): number {
  let score = 0;
  if (skill === "no-code" && category === "No-Code & Low-Code") score += 3;
  if (skill === "technical" && (category === "Coding" || category === "DevOps & Infrastructure")) score += 3;
  if (teamSize === "solo" && (category === "Automation & Workflows" || category === "Writing & Content")) score += 2;
  if (teamSize === "large" && (category === "Customer Support" || category === "Data & Analytics")) score += 2;
  return score;
}

export default function ToolSelector({ tools }: Props) {
  const [goal, setGoal] = useState<Goal>("client-services");
  const [budget, setBudget] = useState<Budget>("growth");
  const [teamSize, setTeamSize] = useState<TeamSize>("solo");
  const [skill, setSkill] = useState<Skill>("hybrid");

  const profile = goalProfiles[goal];

  const recommendations = useMemo(() => {
    const selected = new Map<string, AITool>();
    const maxMonthly = budgetLimits[budget];

    for (const category of profile.categories) {
      const candidates = tools
        .filter((tool) => tool.category === category)
        .filter((tool) => {
          if (skill === "no-code" && blockedForNoCode.has(tool.category)) return false;
          if (skill === "no-code" && tool.category === "Coding") return false;
          return true;
        })
        .filter((tool) => {
          const monthly = detectMonthlyPrice(tool.pricing);
          if (monthly === null) return true;
          return monthly <= maxMonthly;
        })
        .sort((a, b) => {
          const aPrice = detectMonthlyPrice(a.pricing) ?? 9999;
          const bPrice = detectMonthlyPrice(b.pricing) ?? 9999;
          const aScore = categoryScore(teamSize, skill, a.category) + (a.hasAffiliate === true ? 0.2 : 0);
          const bScore = categoryScore(teamSize, skill, b.category) + (b.hasAffiliate === true ? 0.2 : 0);
          if (bScore !== aScore) return bScore - aScore;
          return aPrice - bPrice;
        });

      for (const tool of candidates.slice(0, 2)) {
        if (!selected.has(tool.id)) selected.set(tool.id, tool);
      }
    }

    return Array.from(selected.values()).slice(0, 8);
  }, [budget, profile.categories, skill, teamSize, tools]);

  const estimatedMonthlyStackCost = useMemo(() => {
    return recommendations.reduce((sum, tool) => {
      const monthly = detectMonthlyPrice(tool.pricing);
      if (monthly === null) return sum;
      return sum + monthly;
    }, 0);
  }, [recommendations]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Stack Inputs</h2>
        <p className="text-sm text-gray-600 mb-4">{profile.summary}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1">Goal</span>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              {Object.entries(goalProfiles).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1">Budget / month</span>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as Budget)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="starter">Starter (up to $50)</option>
              <option value="growth">Growth (up to $200)</option>
              <option value="scale">Scale (up to $500)</option>
              <option value="any">No limit</option>
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1">Team size</span>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value as TeamSize)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="solo">Solo</option>
              <option value="small">2-10 people</option>
              <option value="mid">11-50 people</option>
              <option value="large">50+ people</option>
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1">Technical level</span>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value as Skill)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="no-code">No-code</option>
              <option value="hybrid">Hybrid</option>
              <option value="technical">Technical</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-background rounded-xl p-4">
          <p className="text-xs text-muted">Recommended tools</p>
          <p className="text-2xl font-bold text-white mt-1">{recommendations.length}</p>
        </div>
        <div className="bg-background rounded-xl p-4">
          <p className="text-xs text-muted">Estimated stack cost / month</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">${Math.round(estimatedMonthlyStackCost)}</p>
        </div>
        <div className="bg-background rounded-xl p-4">
          <p className="text-xs text-muted">Priority categories</p>
          <p className="text-sm font-semibold text-white mt-2">{profile.categories.slice(0, 2).join(" + ")}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Stack</h3>
        {recommendations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-600">
            No tools matched this setup. Increase budget or switch technical level to broaden results.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/directory/${tool.id}`}
                onClick={() =>
                  trackEvent("click_to_tool_review", {
                    source: "tool_selector",
                    tool_id: tool.id,
                    tool_name: tool.name,
                    tool_category: tool.category,
                    goal,
                  })
                }
                className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white group-hover:text-accent transition-colors">{tool.name}</h4>
                  <span className="text-[11px] text-muted">{tool.pricing}</span>
                </div>
                <p className="text-xs text-muted mb-3">{tool.description}</p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-accent">{tool.category}</span>
                  <span className="text-muted">For: {tool.targetUser}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
