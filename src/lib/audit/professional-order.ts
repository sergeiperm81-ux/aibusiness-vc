/**
 * A paid AI Professional Scan order, and the states it moves through.
 *
 *   queued → answering → answered → synthesised → discounted → emailed → done
 *                  ↘ needs_attention (retried later, then handed to the owner)
 *
 * Every state is written to durable storage before the next step starts, and
 * every step can run again after a crash without paying twice or sending
 * twice:
 * - answers are stored one by one as they arrive, and only missing ones are
 *   asked again;
 * - the discount code is derived from the order, so creating it twice
 *   creates the same code;
 * - "emailed" is written before "done", and a step that finds its own result
 *   already stored skips the work.
 *
 * The discount comes before the email, not after, because the code goes in
 * that email. A buyer who gets the report and then a second letter with a
 * code is a worse experience than one letter.
 *
 * One order is one Lemon Squeezy order and variant. Lemon Squeezy can send
 * order_created and order_paid for the same order, so the event id is not the
 * key: the order is.
 */

import type { DurableKv } from "./durable-kv";
import type { PersonSubject } from "./person-check";

export type OrderState =
  | "queued"
  | "answering"
  | "answered"
  | "synthesised"
  | "discounted"
  | "emailed"
  | "done"
  | "needs_attention"
  /** Could not be made: the buyer is told a refund follows, the owner is reminded until they confirm it. */
  | "refund_pending"
  | "refunded"
  /** The report went out, but a code Lemon Squeezy refused is still owed: retried, then sent in its own letter. */
  | "codes_pending";

export interface ProfessionalOrder {
  /** `${orderId}:${variantId}`. */
  readonly key: string;
  readonly orderId: string;
  readonly variantId: string;
  readonly email: string;
  readonly previewId: string;
  readonly subject: PersonSubject;
  /** True when the order used no discount: only these buyers receive a code for 7 more checks. */
  readonly fullPrice: boolean;
  readonly state: OrderState;
  readonly createdAt: string;
  readonly updatedAt: string;
  /** Answer rounds run so far, across invocations. */
  readonly answerRounds: number;
  /** Providers that still had no answer when the report was allowed to go out without them. */
  readonly missingProviders: readonly string[];
  readonly discountCode: string | null;
  /** A one-off free check, only when a provider was missing from the report. */
  readonly apologyCode: string | null;
  readonly delayNoticeSent: boolean;
  readonly attentionReason: string | null;
  readonly attempts: number;
  /** Set once the order's spend cap or round cap is reached: no model is asked again for it. */
  readonly askingStopped: boolean;
  /** True while a bonus or apology code the buyer is owed has not been created yet. Absent on old orders. */
  readonly codesPending?: boolean;
}

/** Paid data is kept this long, then Redis deletes it on its own. */
export const ORDER_TTL_SECONDS = 30 * 24 * 3600;
export const DUE_SET = "pscan:due";
/** A worker holds an order this long. Longer than one function run, so two never overlap. */
export const LEASE_SECONDS = 330;

export const orderKey = (orderId: string, variantId: string): string => `${orderId}:${variantId}`;
const recordKey = (key: string): string => `pscan:order:${key}`;
const leaseKey = (key: string): string => `pscan:lease:${key}`;
export const answerKey = (key: string, questionId: string, providerId: string): string =>
  `pscan:order:${key}:answer:${questionId}:${providerId}`;
export const synthesisKey = (key: string): string => `pscan:order:${key}:synthesis`;
/** What the order has cost so far, in millionths of a dollar, reserved before each call and corrected after. */
export const spendKey = (key: string): string => `pscan:order:${key}:spend-micro-usd`;

export type CreateResult = { readonly created: true; readonly order: ProfessionalOrder } | { readonly created: false };

export async function createOrder(
  kv: DurableKv,
  input: Pick<ProfessionalOrder, "orderId" | "variantId" | "email" | "previewId" | "subject" | "fullPrice">,
  now: Date = new Date()
): Promise<CreateResult> {
  const key = orderKey(input.orderId, input.variantId);
  const order: ProfessionalOrder = {
    ...input,
    key,
    state: "queued",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    answerRounds: 0,
    missingProviders: [],
    discountCode: null,
    apologyCode: null,
    delayNoticeSent: false,
    attentionReason: null,
    attempts: 0,
    askingStopped: false,
  };
  // Written only if absent: the second event for the same order changes nothing.
  const created = await kv.set(recordKey(key), JSON.stringify(order), ORDER_TTL_SECONDS, true);
  if (!created) return { created: false };
  await kv.zadd(DUE_SET, now.getTime(), key);
  return { created: true, order };
}

export async function loadOrder(kv: DurableKv, key: string): Promise<ProfessionalOrder | null> {
  const raw = await kv.get(recordKey(key));
  return raw ? (JSON.parse(raw) as ProfessionalOrder) : null;
}

export async function saveOrder(
  kv: DurableKv,
  order: ProfessionalOrder,
  changes: Partial<Omit<ProfessionalOrder, "key" | "orderId" | "variantId" | "createdAt">>,
  now: Date = new Date()
): Promise<ProfessionalOrder> {
  const next: ProfessionalOrder = { ...order, ...changes, updatedAt: now.toISOString() };
  await kv.set(recordKey(order.key), JSON.stringify(next), ORDER_TTL_SECONDS);
  return next;
}

/** Puts the order back on the queue for a later run. */
export async function scheduleAt(kv: DurableKv, key: string, at: Date): Promise<void> {
  await kv.zadd(DUE_SET, at.getTime(), key);
}

export async function finish(kv: DurableKv, key: string): Promise<void> {
  await kv.zrem(DUE_SET, key);
}

export async function dueOrders(kv: DurableKv, now: Date, limit: number): Promise<readonly string[]> {
  return kv.zdue(DUE_SET, now.getTime(), limit);
}

/** When the next order is due, in milliseconds, or null when nothing waits. */
export async function nextDueAt(kv: DurableKv): Promise<number | null> {
  return kv.zmin(DUE_SET);
}

/** One worker per order at a time. */
export async function takeLease(kv: DurableKv, key: string, holder: string): Promise<boolean> {
  return kv.set(leaseKey(key), holder, LEASE_SECONDS, true);
}

export async function releaseLease(kv: DurableKv, key: string, holder: string): Promise<void> {
  if ((await kv.get(leaseKey(key))) === holder) await kv.del(leaseKey(key));
}

/** Everything stored for an order, for an early deletion on request. */
export async function deleteOrderData(
  kv: DurableKv,
  key: string,
  questionIds: readonly string[],
  providerIds: readonly string[]
): Promise<void> {
  const order = await loadOrder(kv, key);
  const keys = [
    recordKey(key),
    synthesisKey(key),
    leaseKey(key),
    ...questionIds.flatMap((q) => providerIds.map((p) => answerKey(key, q, p))),
    ...(order ? [`pscan:preview:${order.previewId}`] : []),
  ];
  for (const item of keys) await kv.del(item);
  await kv.zrem(DUE_SET, key);
}
