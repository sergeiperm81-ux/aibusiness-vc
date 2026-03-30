import { models, type AIModel } from "./models";

export interface ModelComparison {
  slug: string;
  modelA: AIModel;
  modelB: AIModel;
}

// Generate the most searched comparison pairs
const comparisonPairs = [
  ["gpt-4o", "claude-3-5-sonnet"],
  ["gpt-4o", "gemini-1-5-pro"],
  ["claude-3-5-sonnet", "gemini-1-5-pro"],
  ["gpt-4o", "deepseek-v3"],
  ["claude-opus-4", "gpt-4o"],
  ["gpt-4o-mini", "claude-3-5-haiku"],
  ["gpt-4o", "llama-3-1-405b"],
  ["deepseek-v3", "claude-3-5-sonnet"],
  ["deepseek-r1", "o1"],
  ["o3", "claude-opus-4"],
  ["gemini-2-0-flash", "gpt-4o-mini"],
  ["claude-opus-4", "claude-3-5-sonnet"],
  ["gpt-4o", "gpt-4-turbo"],
  ["mistral-large-2", "gpt-4o"],
  ["llama-3-1-405b", "deepseek-v3"],
  ["grok-2", "gpt-4o"],
  ["qwen-2-5-72b", "llama-3-1-70b"],
  ["command-r-plus", "gpt-4o"],
  ["gemini-1-5-pro", "deepseek-v3"],
  ["o1", "o3"],
];

export function getAllComparisons(): ModelComparison[] {
  return comparisonPairs
    .map(([idA, idB]) => {
      const modelA = models.find((m) => m.id === idA);
      const modelB = models.find((m) => m.id === idB);
      if (!modelA || !modelB) return null;
      return {
        slug: `${idA}-vs-${idB}`,
        modelA,
        modelB,
      };
    })
    .filter((c): c is ModelComparison => c !== null);
}

export function getComparisonBySlug(slug: string): ModelComparison | null {
  return getAllComparisons().find((c) => c.slug === slug) ?? null;
}
