/**
 * An order's state as the owner checks it: where it is, which model answered
 * which question, and what it has cost. Read from the same storage the worker
 * writes, so it is the record, not an estimate. No buyer data beyond the
 * state leaves: no email, no answer text.
 */

import type { DurableKv } from "./durable-kv";
import { buildPersonQuestions } from "./person-check";
import { answerKey, loadOrder, spendKey, type OrderState } from "./professional-order";

export type AnswerStatus = "answered" | "failed" | "not asked";

export interface OrderStatus {
  readonly key: string;
  readonly state: OrderState;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly answerRounds: number;
  readonly fullPrice: boolean;
  readonly bonusCodeIssued: boolean;
  readonly missingProviders: readonly string[];
  readonly attentionReason: string | null;
  /** question id → provider id → status. */
  readonly answers: Readonly<Record<string, Readonly<Record<string, AnswerStatus>>>>;
  readonly answered: number;
  readonly expected: number;
  /** What the order has cost, as the worker recorded it: reserved before each call, corrected after. */
  readonly spendUsd: number;
}

function statusOf(raw: string | null): AnswerStatus {
  if (!raw) return "not asked";
  try {
    return (JSON.parse(raw) as { ok?: unknown }).ok === true ? "answered" : "failed";
  } catch {
    return "failed";
  }
}

export async function orderStatus(kv: DurableKv, key: string, providerIds: readonly string[]): Promise<OrderStatus | null> {
  const order = await loadOrder(kv, key);
  if (!order) return null;
  const questions = buildPersonQuestions(order.subject).map((q) => q.id);
  const pairs = questions.flatMap((q) => providerIds.map((p) => ({ q, p })));
  const stored = await kv.mget(pairs.map(({ q, p }) => answerKey(key, q, p)));
  const answers = Object.fromEntries(
    questions.map((q) => [
      q,
      Object.fromEntries(providerIds.map((p) => [p, statusOf(stored[pairs.findIndex((x) => x.q === q && x.p === p)] ?? null)])),
    ])
  );
  const answered = Object.values(answers).flatMap((row) => Object.values(row)).filter((s) => s === "answered").length;
  const micro = Number((await kv.get(spendKey(key))) ?? 0);
  return {
    key,
    state: order.state,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    answerRounds: order.answerRounds,
    fullPrice: order.fullPrice,
    bonusCodeIssued: order.discountCode !== null,
    missingProviders: order.missingProviders,
    attentionReason: order.attentionReason,
    answers,
    answered,
    expected: pairs.length,
    spendUsd: Number.isFinite(micro) ? micro / 1_000_000 : 0,
  };
}
