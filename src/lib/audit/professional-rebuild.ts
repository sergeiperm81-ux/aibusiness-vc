/**
 * Rebuilds a delivered report once, from the answers already paid for.
 *
 * Nothing is asked again: the fifteen stored answers are reloaded, their
 * sources are checked again by what the pages say, and only the summary is
 * written again, in one call to the cheap model, with no web search and no
 * retry. The answer length is capped so that the call cannot cost more than
 * the ceiling given; when even a short summary would not fit, nothing is
 * sent. Each order can be rebuilt once.
 */

import type { AnswerCheck } from "./answer-check";
import { buildPersonQuestions, type PersonSubject } from "./person-check";
import { SYNTHESIS_MAX_OUTPUT_TOKENS, SYNTHESIS_MODEL, synthesisBoundsForCheck, type SynthesisResult } from "./person-synthesis";
import { loadOrder, ORDER_TTL_SECONDS, spendKey, synthesisKey } from "./professional-order";
import { loadCheck, type ScanDeps } from "./professional-worker";
import { planCost } from "./usage";

/** Below this the summary would be cut off mid-JSON, so the call is not worth making. */
export const MIN_REBUILD_OUTPUT_TOKENS = 2_500;
const STEP = 250;

export type RebuildOutcome =
  | { readonly ok: true; readonly maxOutputTokens: number; readonly ceilingUsd: number; readonly spentUsd: number; readonly check: AnswerCheck }
  | { readonly ok: false; readonly reason: string; readonly spentUsd: number };

/** The largest answer length whose worst case stays within the ceiling, or 0 when none does. */
export function outputTokensWithin(check: AnswerCheck, ceilingUsd: number): number {
  for (let tokens = SYNTHESIS_MAX_OUTPUT_TOKENS; tokens >= MIN_REBUILD_OUTPUT_TOKENS; tokens -= STEP) {
    const plan = planCost([
      { provider: "openai", model: SYNTHESIS_MODEL, purpose: "writer", label: "rebuild", maxAttempts: 1, bounds: synthesisBoundsForCheck(check, tokens) },
    ]);
    if (plan.unpricedModels.length === 0 && plan.conservativeNoRetryUsd <= ceilingUsd) return tokens;
  }
  return 0;
}

export async function rebuildReport(
  deps: ScanDeps,
  key: string,
  options: {
    readonly ceilingUsd: number;
    readonly subjectExtras?: Partial<PersonSubject>;
    readonly synthesise: (check: AnswerCheck, maxOutputTokens: number) => Promise<SynthesisResult>;
  }
): Promise<RebuildOutcome> {
  const order = await loadOrder(deps.kv, key);
  if (!order) return { ok: false, reason: "no such order", spentUsd: 0 };
  if (order.state !== "done" && order.state !== "emailed") {
    return { ok: false, reason: `the order is ${order.state}, not delivered`, spentUsd: 0 };
  }
  // Once per order, claimed before anything is spent.
  const claimed = await deps.kv.set(`pscan:order:${key}:rebuilt`, deps.now().toISOString(), ORDER_TTL_SECONDS, true);
  if (!claimed) return { ok: false, reason: "this order was already rebuilt once", spentUsd: 0 };

  const subject: PersonSubject = { ...order.subject, ...options.subjectExtras };
  const check = await deps.cleanCitations(await loadCheck(deps, order, buildPersonQuestions(subject)), subject);
  const maxOutputTokens = outputTokensWithin(check, options.ceilingUsd);
  if (maxOutputTokens === 0) {
    return { ok: false, reason: `even a ${MIN_REBUILD_OUTPUT_TOKENS}-token summary could exceed $${options.ceilingUsd}`, spentUsd: 0 };
  }

  const result = await options.synthesise(check, maxOutputTokens);
  const spentUsd = result.usage?.conservativeEstimateUsd ?? 0;
  await deps.kv.incrby(spendKey(key), Math.round(spentUsd * 1_000_000), ORDER_TTL_SECONDS);
  if (!result.synthesis) return { ok: false, reason: `summary failed: ${result.error ?? "unknown"}`, spentUsd };

  await deps.kv.set(synthesisKey(key), JSON.stringify({ check, synthesis: result.synthesis }), ORDER_TTL_SECONDS);
  await deps.sendReport({ order, check, synthesis: result.synthesis });
  return { ok: true, maxOutputTokens, ceilingUsd: options.ceilingUsd, spentUsd, check };
}
