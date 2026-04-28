"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AITool } from "@/data/tools";
import { trackEvent } from "@/lib/analytics";

interface ToolsDirectoryClientProps {
  tools: AITool[];
  categories: string[];
}

type PricingFilter = "all" | "free" | "freemium" | "paid" | "usage";
type AffiliateFilter = "all" | "yes" | "no" | "unknown";

function slugifyCategory(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getPricingType(pricing: string): Exclude<PricingFilter, "all"> {
  const normalized = pricing.toLowerCase();
  const hasDollar = /\$\d/.test(normalized);
  const isUsageBased = /(\/|\bper\b)\s*(hour|hr|token|request|minute)\b/.test(normalized);

  if (normalized.includes("freemium")) return "freemium";
  if (normalized.includes("free") && !hasDollar) return "free";
  if (normalized.includes("free") && hasDollar) return "freemium";
  if (isUsageBased) return "usage";
  return "paid";
}

export default function ToolsDirectoryClient({ tools, categories }: ToolsDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pricing, setPricing] = useState<PricingFilter>("all");
  const [affiliate, setAffiliate] = useState<AffiliateFilter>("all");

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tools
      .filter((tool) => {
        if (category !== "all" && tool.category !== category) return false;
        if (pricing !== "all" && getPricingType(tool.pricing) !== pricing) return false;

        if (affiliate === "yes" && tool.hasAffiliate !== true) return false;
        if (affiliate === "no" && tool.hasAffiliate !== false) return false;
        if (affiliate === "unknown" && tool.hasAffiliate !== null) return false;

        if (!q) return true;
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.targetUser.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [affiliate, category, pricing, search, tools]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label htmlFor="tool-search" className="block text-xs font-medium text-gray-600 mb-1">
              Search
            </label>
            <input
              id="tool-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tool name, use case, audience..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div>
            <label htmlFor="tool-category" className="block text-xs font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              id="tool-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tool-pricing" className="block text-xs font-medium text-gray-600 mb-1">
              Pricing Type
            </label>
            <select
              id="tool-pricing"
              value={pricing}
              onChange={(e) => setPricing(e.target.value as PricingFilter)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="all">Any pricing</option>
              <option value="free">Free</option>
              <option value="freemium">Freemium</option>
              <option value="paid">Paid</option>
              <option value="usage">Usage-based</option>
            </select>
          </div>

          <div>
            <label htmlFor="tool-affiliate" className="block text-xs font-medium text-gray-600 mb-1">
              Affiliate Program
            </label>
            <select
              id="tool-affiliate"
              value={affiliate}
              onChange={(e) => setAffiliate(e.target.value as AffiliateFilter)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="all">Any</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredTools.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{tools.length}</span> tools
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setPricing("all");
              setAffiliate("all");
            }}
            className="text-xs font-medium text-accent hover:underline"
          >
            Reset filters
          </button>
        </div>
      </div>

      {filteredTools.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <h2 className="text-base font-semibold text-gray-900">No tools match your filters</h2>
          <p className="text-sm text-gray-600 mt-1">
            Try a broader category or clear one of the filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/directory/${tool.id}`}
              onClick={() =>
                trackEvent("click_to_tool_review", {
                  source: "tools_directory",
                  tool_id: tool.id,
                  tool_name: tool.name,
                  tool_category: tool.category,
                })
              }
              className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                  {tool.name[0]}
                </div>
                <div>
                  <h2 className="font-semibold text-white text-sm group-hover:text-accent transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-[11px] text-muted">{tool.pricing}</p>
                </div>
              </div>
              <p className="text-xs text-muted leading-relaxed">{tool.description}</p>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-card-border">
                <span className="text-[10px] text-muted">For: {tool.targetUser}</span>
                <span className="text-[11px] font-medium text-accent">Review &rarr;</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                <Link href={`/tools/category/${slugifyCategory(tool.category)}`} className="hover:text-accent">
                  {tool.category}
                </Link>
                <span>
                  Affiliate:{" "}
                  {tool.hasAffiliate === true ? "Yes" : tool.hasAffiliate === false ? "No" : "Unknown"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
