/**
 * Moves paid orders through their states, one durable step at a time.
 *
 * Nothing here holds state between calls. Any run, from the webhook, the daily
 * cron or a page visit, picks up whatever orders are due and continues each
 * from the last state it saved. A run that dies loses at most the step it was
 * in, and the lease on the order expires so the next run can take it.
 *
 * Everything that touches the outside world comes in through ScanDeps, so the
 * whole machine is tested without a network or a payment.
 */

import { randomUUID } from "node:crypto";
import type { AnswerCheck, FactQuestion } from "./answer-check";
import type { AnswerProvider, ProviderAnswer } from "./answer-attempt";
import { buildScanQuestions, toScanSubject } from "./company-check";
import type { DurableKv } from "./durable-kv";
import type { CallUsage } from "./usage";
import type { PersonSubject } from "./person-check";
import type { PersonSynthesis, SynthesisResult } from "./person-synthesis";
import {
  ORDER_TTL_SECONDS,
  answerKey,
  dueOrders,
  spendKey,
  finish,
  nextDueAt,
  loadOrder,
  releaseLease,
  saveOrder,
  scheduleAt,
  synthesisKey,
  takeLease,
  type ProfessionalOrder,
} from "./professional-order";
import { downProviders, isAccountProblem, markProviderDown } from "./provider-health";

/** Enough for the slowest answer: two attempts of 90 seconds and the pause between them. */
export const ANSWER_JOB_MAX_MS = 190_000;
export const ANSWER_CONCURRENCY = 5;
/** Rounds of asking for missing answers within one run, before the order waits for the next run. */
export const ROUNDS_PER_RUN = 3;
export const ROUND_PAUSE_MS = 30_000;
/**
 * The report promises five models. A report with four goes out only when one
 * model has stayed silent this long after payment, with a note on the cover,
 * a free check, and the page saying so in advance. Before that, the order waits.
 */
export const DEGRADED_AFTER_MS = 60 * 60 * 1000;
/** At most one provider may be missing from a report that is sent. */
export const MAX_MISSING_PROVIDERS = 1;
/** After this long without a complete enough report, the order is handed to the owner. */
export const GIVE_UP_AFTER_MS = 24 * 3600 * 1000;
/** How often the owner is reminded of a refund that has not been confirmed. */
export const REFUND_REMINDER_MS = 24 * 3600 * 1000;

/** How soon a waiting order is tried again, by the next scheduled run. */
export const RETRY_LATER_MS = 10 * 60 * 1000;
/** After this long, a waiting order (two or more models silent, buyer already told) is tried hourly. */
export const SLOW_RETRY_AFTER_MS = 3 * 3600 * 1000;
export const SLOW_RETRY_MS = 60 * 60 * 1000;
const LEASED_ELSEWHERE_PAUSE_MS = 30_000;

/**
 * The hard stop on one order's spend, in dollars. Every call reserves its
 * worst case against it before it is sent, and the reservation is corrected
 * to the measured cost when it returns, so parallel calls cannot overrun it
 * together. A normal order costs about $0.40; the full planned worst case,
 * every answer retried at every bound, is about $1.39.
 */
export const ORDER_SPEND_CAP_USD = 1.5;
/** Answer rounds for one order, in total: three in the first run, then one per scheduled run. */
export const MAX_ANSWER_ROUNDS = 9;
const FIRST_RUN_ROUNDS = 3;

const micro = (usd: number): number => Math.ceil(usd * 1_000_000);

/** Reserves a call's worst case. False, and nothing reserved, when it would pass the cap. */
async function reserve(deps: ScanDeps, order: ProfessionalOrder, usd: number): Promise<boolean> {
  const total = await deps.kv.incrby(spendKey(order.key), micro(usd), ORDER_TTL_SECONDS);
  if (total <= micro(ORDER_SPEND_CAP_USD)) return true;
  await deps.kv.incrby(spendKey(order.key), -micro(usd), ORDER_TTL_SECONDS);
  return false;
}

/** Replaces a reservation with what the call was measured to cost. */
async function settleSpend(deps: ScanDeps, order: ProfessionalOrder, reservedUsd: number, usage: readonly CallUsage[]): Promise<void> {
  const spent = usage.reduce((total, row) => total + row.conservativeEstimateUsd, 0);
  await deps.kv.incrby(spendKey(order.key), micro(spent) - micro(reservedUsd), ORDER_TTL_SECONDS);
}
const MAX_STEP_ATTEMPTS = 5;

/** Time a step needs left in the run before it starts. Less than that, and the order waits for the next run. */
const STEP_NEEDS_MS: Readonly<Partial<Record<ProfessionalOrder["state"], number>>> = {
  queued: ANSWER_JOB_MAX_MS,
  answering: ANSWER_JOB_MAX_MS,
  needs_attention: ANSWER_JOB_MAX_MS,
  answered: 140_000,
  synthesised: 30_000,
  discounted: 40_000,
  emailed: 5_000,
};

export interface DiscountSpec {
  readonly code: string;
  readonly name: string;
  readonly percent: number;
  readonly maxRedemptions: number;
}

export interface ReportEmail {
  readonly order: ProfessionalOrder;
  readonly check: AnswerCheck;
  readonly synthesis: PersonSynthesis;
}

export interface ScanDeps {
  readonly kv: DurableKv;
  /** Providers for the given ids that have a key. A missing key means a missing column. */
  readonly providers: (ids: readonly string[]) => readonly AnswerProvider[];
  readonly providerIds: readonly string[];
  /** Cleans the cited addresses and keeps only pages about the person, before the summary sees them. */
  readonly cleanCitations: (check: AnswerCheck, subject: PersonSubject) => Promise<AnswerCheck>;
  readonly synthesise: (check: AnswerCheck) => Promise<SynthesisResult>;
  /** Must succeed when a discount with this code already exists. */
  readonly createDiscount: (spec: DiscountSpec) => Promise<void>;
  readonly sendReport: (email: ReportEmail) => Promise<void>;
  readonly sendDelayNotice: (order: ProfessionalOrder) => Promise<void>;
  /** Sent once when the report could not be made within GIVE_UP_AFTER_MS: the buyer is told a refund follows. */
  readonly sendGiveUpNotice: (order: ProfessionalOrder) => Promise<void>;
  readonly notifyOwner: (subject: string, text: string) => Promise<void>;
  /** Derives a stable code from a seed, so a retry creates the same code. */
  readonly codeFor: (seed: string) => string;
  readonly now: () => Date;
  readonly sleep: (ms: number) => Promise<void>;
  /** A link the owner opens to confirm that the refund was made in Lemon Squeezy. */
  readonly refundConfirmLink: (key: string) => string;
  /** The most one ask can cost, both attempts at their bounds, by provider. Reserved before the ask is sent. */
  readonly askCeilingUsd: (providerId: string, question: string) => number;
  /** The most the synthesis call can cost. */
  readonly synthesisCeilingUsd: number;
}

/* --------------------------------------------------------------- answers */

interface Job {
  readonly question: FactQuestion;
  readonly providerId: string;
}

async function missingJobs(deps: ScanDeps, order: ProfessionalOrder, questions: readonly FactQuestion[]): Promise<readonly Job[]> {
  const jobs = questions.flatMap((question) => deps.providerIds.map((providerId) => ({ question, providerId })));
  const stored = await deps.kv.mget(jobs.map((job) => answerKey(order.key, job.question.id, job.providerId)));
  return jobs.filter((_, index) => stored[index] === null);
}

/** Asks for every missing answer that can still finish before the deadline, storing each as it arrives. */
/** Returns true when the spend cap stopped the round before every missing answer was asked. */
async function answerRound(deps: ScanDeps, order: ProfessionalOrder, questions: readonly FactQuestion[], deadline: number): Promise<boolean> {
  const jobs = await missingJobs(deps, order, questions);
  const providers = new Map(deps.providers(deps.providerIds).map((p) => [p.id, p]));
  let next = 0;
  let capped = false;
  const worker = async (): Promise<void> => {
    for (;;) {
      if (capped || deadline - deps.now().getTime() < ANSWER_JOB_MAX_MS) return;
      const job = jobs[next];
      next += 1;
      if (!job) return;
      const provider = providers.get(job.providerId as ProviderAnswer["providerId"]);
      if (!provider) continue;
      const ceiling = deps.askCeilingUsd(job.providerId, job.question.question);
      if (!(await reserve(deps, order, ceiling))) {
        capped = true;
        return;
      }
      const answer = await provider.ask(job.question.question, job.question.id);
      await settleSpend(deps, order, ceiling, answer.usage);
      if (answer.ok) {
        await deps.kv.set(answerKey(order.key, job.question.id, job.providerId), JSON.stringify(answer), ORDER_TTL_SECONDS);
      } else if (answer.error && isAccountProblem(answer.error)) {
        // One letter per outage, not one per failed question.
        const alreadyDown = (await downProviders(deps.kv, [job.providerId])).length > 0;
        await markProviderDown(deps.kv, job.providerId, answer.error);
        if (alreadyDown) continue;
        await deps.notifyOwner(
          `AI Person Scan: ${provider.label} refused a request`,
          `Order ${order.key}. ${provider.label} answered: ${answer.error}\nThe checkout is closed until it clears. Check the balance and the key.`
        );
      }
    }
  };
  await Promise.all(Array.from({ length: ANSWER_CONCURRENCY }, () => worker()));
  return capped;
}

export async function loadCheck(deps: ScanDeps, order: ProfessionalOrder, questions: readonly FactQuestion[]): Promise<AnswerCheck> {
  const providers = deps.providers(deps.providerIds);
  const stored = await deps.kv.mget(
    questions.flatMap((q) => deps.providerIds.map((p) => answerKey(order.key, q.id, p)))
  );
  const labels = new Map(providers.map((p) => [p.id as string, p]));
  const results = questions.map((fact, qi) => ({
    fact,
    answers: deps.providerIds.map((providerId, pi) => {
      const raw = stored[qi * deps.providerIds.length + pi];
      if (raw) return JSON.parse(raw) as ProviderAnswer;
      const provider = labels.get(providerId);
      return {
        providerId: providerId as ProviderAnswer["providerId"],
        providerLabel: provider?.label ?? providerId,
        model: provider?.model ?? "",
        askedAt: deps.now().toISOString(),
        ok: false,
        text: "",
        citations: [],
        error: "this model was unavailable when the report was made",
        usage: [],
      };
    }),
  }));
  return {
    subject: toScanSubject(order.subject),
    checkedAt: order.createdAt,
    providers: deps.providerIds.map((id) => {
      const provider = labels.get(id);
      return { id, label: provider?.label ?? id, model: provider?.model ?? "" };
    }),
    results,
  };
}

function providersMissingIn(jobs: readonly Job[]): readonly string[] {
  return [...new Set(jobs.map((job) => job.providerId))];
}

async function stepAnswers(deps: ScanDeps, order: ProfessionalOrder, deadline: number): Promise<ProfessionalOrder> {
  const questions = buildScanQuestions(order.subject);
  let current = await saveOrder(deps.kv, order, { state: "answering" }, deps.now());
  let roundsThisRun = 0;
  const roundsAllowedThisRun = current.answerRounds < FIRST_RUN_ROUNDS ? ROUNDS_PER_RUN : 1;
  for (;;) {
    if (!current.askingStopped) {
      roundsThisRun += 1;
      const capped = await answerRound(deps, current, questions, deadline);
      current = await saveOrder(deps.kv, current, { answerRounds: current.answerRounds + 1 }, deps.now());
      if (capped || current.answerRounds >= MAX_ANSWER_ROUNDS) {
        current = await saveOrder(deps.kv, current, { askingStopped: true }, deps.now());
        await deps.notifyOwner(
          "AI Person Scan: stopped asking",
          `Order ${current.key}: ${capped ? `the $${ORDER_SPEND_CAP_USD} spend cap` : `${MAX_ANSWER_ROUNDS} answer rounds`} reached. No model is asked again for this order.`
        );
      }
    }
    const missing = await missingJobs(deps, current, questions);
    if (missing.length === 0) return saveOrder(deps.kv, current, { state: "answered", missingProviders: [] }, deps.now());

    const missingProviders = providersMissingIn(missing);
    const waited = deps.now().getTime() - Date.parse(current.createdAt);
    // Asking has stopped: the answers there are, are all there will be.
    const mayGoWithout = waited >= DEGRADED_AFTER_MS || current.askingStopped;
    if (mayGoWithout && missingProviders.length <= MAX_MISSING_PROVIDERS) {
      return saveOrder(deps.kv, current, { state: "answered", missingProviders }, deps.now());
    }
    const timeLeft = deadline - deps.now().getTime();
    if (!current.askingStopped && roundsThisRun < roundsAllowedThisRun && timeLeft > ANSWER_JOB_MAX_MS + ROUND_PAUSE_MS) {
      await deps.sleep(ROUND_PAUSE_MS);
      continue;
    }
    // Not enough to send, and no time left in this run: tell the buyer once, try again later.
    if (!current.delayNoticeSent) {
      const waiting = current;
      await sendOnce(deps, waiting, "delay", () => deps.sendDelayNotice(waiting));
      await deps.notifyOwner(
        "AI Person Scan: order delayed",
        `Order ${current.key}: no answer yet from ${missingProviders.join(", ")} after ${current.answerRounds} rounds.`
      );
      current = await saveOrder(deps.kv, current, { delayNoticeSent: true }, deps.now());
    }
    return saveOrder(
      deps.kv,
      current,
      { state: "needs_attention", attentionReason: `missing answers from ${missingProviders.join(", ")}` },
      deps.now()
    );
  }
}

/* ------------------------------------------------------------- the rest */

const SEND_CLAIM_SECONDS = 15 * 60;

/**
 * Sends a letter at most once per order, even if the run dies between the
 * send and the state write.
 *
 * A short claim is taken before the send and turned into a permanent "sent"
 * mark after it. A retry that finds the mark skips the send. A retry that
 * finds only the claim waits: the earlier run may still be sending, and if it
 * died, the claim expires and the letter goes out then. A send that fails
 * releases the claim so the retry can try again.
 */
async function sendOnce(deps: ScanDeps, order: ProfessionalOrder, letter: string, send: () => Promise<void>): Promise<void> {
  const mark = `pscan:order:${order.key}:sent:${letter}`;
  if ((await deps.kv.get(mark)) === "sent") return;
  if (!(await deps.kv.set(mark, "sending", SEND_CLAIM_SECONDS, true))) {
    throw new Error(`${letter} letter is being sent by another run`);
  }
  try {
    await send();
  } catch (error) {
    await deps.kv.del(mark);
    throw error;
  }
  await deps.kv.set(mark, "sent", ORDER_TTL_SECONDS);
}

async function stepSynthesis(deps: ScanDeps, order: ProfessionalOrder): Promise<ProfessionalOrder> {
  const existing = await deps.kv.get(synthesisKey(order.key));
  if (existing) return saveOrder(deps.kv, order, { state: "synthesised" }, deps.now());
  const check = await deps.cleanCitations(await loadCheck(deps, order, buildScanQuestions(order.subject)), order.subject);
  if (!(await reserve(deps, order, deps.synthesisCeilingUsd))) {
    throw new Error(`the $${ORDER_SPEND_CAP_USD} spend cap leaves no room for the summary`);
  }
  const result = await deps.synthesise(check);
  await settleSpend(deps, order, deps.synthesisCeilingUsd, result.usage ? [result.usage] : []);
  if (!result.synthesis) throw new Error(`synthesis failed: ${result.error ?? "unknown"}`);
  await deps.kv.set(synthesisKey(order.key), JSON.stringify({ check, synthesis: result.synthesis }), ORDER_TTL_SECONDS);
  return saveOrder(deps.kv, order, { state: "synthesised" }, deps.now());
}

async function stepDiscount(deps: ScanDeps, order: ProfessionalOrder): Promise<ProfessionalOrder> {
  let discountCode = order.discountCode;
  let apologyCode = order.apologyCode;
  try {
    if (order.fullPrice && !discountCode) {
      const code = deps.codeFor(`seven:${order.key}`);
      await deps.createDiscount({ code, name: `Pro Scan x7 for order ${order.orderId}`, percent: 50, maxRedemptions: 7 });
      discountCode = code;
    }
    if (order.missingProviders.length > 0 && !apologyCode) {
      const code = deps.codeFor(`apology:${order.key}`);
      await deps.createDiscount({ code, name: `Pro Scan free check, order ${order.orderId}`, percent: 100, maxRedemptions: 1 });
      apologyCode = code;
    }
  } catch (error) {
    // The report matters more than the code: send without it and tell the owner.
    await deps.notifyOwner(
      "AI Person Scan: discount code not created",
      `Order ${order.key}: ${error instanceof Error ? error.message : String(error)}. The report goes out without the code; send one by hand.`
    );
  }
  return saveOrder(deps.kv, order, { state: "discounted", discountCode, apologyCode }, deps.now());
}

async function stepEmail(deps: ScanDeps, order: ProfessionalOrder): Promise<ProfessionalOrder> {
  const raw = await deps.kv.get(synthesisKey(order.key));
  if (!raw) return saveOrder(deps.kv, order, { state: "answered" }, deps.now());
  const { check, synthesis } = JSON.parse(raw) as { check: AnswerCheck; synthesis: PersonSynthesis };
  await sendOnce(deps, order, "report", () => deps.sendReport({ order, check, synthesis }));
  return saveOrder(deps.kv, order, { state: "emailed" }, deps.now());
}

/** Runs one order as far as it can go in the time left. */
export async function advanceOrder(deps: ScanDeps, key: string, deadline: number): Promise<ProfessionalOrder | null> {
  const holder = randomUUID();
  if (!(await takeLease(deps.kv, key, holder))) return null;
  try {
    let order = await loadOrder(deps.kv, key);
    if (!order) {
      await finish(deps.kv, key);
      return null;
    }
    if (order.state === "refunded" || order.state === "done") {
      await finish(deps.kv, key);
      return order;
    }
    if (order.state === "needs_attention" && deps.now().getTime() - Date.parse(order.createdAt) > GIVE_UP_AFTER_MS) {
      const stuck = order;
      await sendOnce(deps, stuck, "give-up", () => deps.sendGiveUpNotice(stuck));
      order = await saveOrder(deps.kv, stuck, { state: "refund_pending" }, deps.now());
    }
    if (order.state === "refund_pending") {
      // Kept on the queue and repeated until the owner confirms: a promised refund must not be forgotten.
      await deps.notifyOwner(
        "AI Person Scan: refund this order",
        `Order ${order.orderId} (${order.email}) could not be completed: ${order.attentionReason ?? "stuck"}. ` +
          `The buyer has been told a full refund follows.\n\n1. Refund it in Lemon Squeezy.\n2. Then confirm here: ${deps.refundConfirmLink(key)}\n\n` +
          "You will be reminded every day until you confirm."
      );
      await scheduleAt(deps.kv, key, new Date(deps.now().getTime() + REFUND_REMINDER_MS));
      return order;
    }
    try {
      for (;;) {
        const needs = STEP_NEEDS_MS[order.state] ?? 0;
        if (deadline - deps.now().getTime() < needs) {
          await scheduleAt(deps.kv, key, deps.now());
          return order;
        }
        switch (order.state) {
          case "queued":
          case "answering":
          case "needs_attention":
            order = await stepAnswers(deps, order, deadline);
            if (order.state === "needs_attention") {
              const age = deps.now().getTime() - Date.parse(order.createdAt);
              const delay = age > SLOW_RETRY_AFTER_MS ? SLOW_RETRY_MS : RETRY_LATER_MS;
              await scheduleAt(deps.kv, key, new Date(deps.now().getTime() + delay));
              return order;
            }
            break;
          case "answered":
            order = await stepSynthesis(deps, order);
            break;
          case "synthesised":
            order = await stepDiscount(deps, order);
            break;
          case "discounted":
            order = await stepEmail(deps, order);
            break;
          case "emailed":
            order = await saveOrder(deps.kv, order, { state: "done" }, deps.now());
            break;
          case "done":
            await finish(deps.kv, key);
            return order;
        }
      }
    } catch (error) {
      const attempts = order.attempts + 1;
      const message = error instanceof Error ? error.message : String(error);
      order = await saveOrder(deps.kv, order, { attempts }, deps.now());
      if (attempts >= MAX_STEP_ATTEMPTS) {
        await deps.notifyOwner("AI Person Scan: order failed", `Order ${key} failed in state ${order.state}: ${message}`);
        order = await saveOrder(deps.kv, order, { state: "needs_attention", attentionReason: message }, deps.now());
      }
      await scheduleAt(deps.kv, key, new Date(deps.now().getTime() + 10 * 60 * 1000));
      return order;
    }
  } finally {
    await releaseLease(deps.kv, key, holder);
  }
}

/**
 * Works the queue for one function run: what is due now, and what falls due
 * before the run ends (an order waiting ten minutes for a silent model). It
 * never starts another run of itself: Vercel blocks functions that call
 * themselves in a loop, so the next run comes from outside, from the
 * scheduler that calls the cron route every few minutes.
 */
export async function drainQueue(deps: ScanDeps, budgetMs: number): Promise<number> {
  const deadline = deps.now().getTime() + budgetMs;
  let advanced = 0;
  for (;;) {
    const moved = await runDueOrders(deps, deadline - deps.now().getTime());
    advanced += moved;
    const next = await nextDueAt(deps.kv);
    const now = deps.now().getTime();
    if (next === null) return advanced;
    // Due now but not taken: another run holds it. Due later than this run can wait: the scheduler's.
    const wakeAt = next <= now ? now + LEASED_ELSEWHERE_PAUSE_MS : next;
    if (wakeAt + ANSWER_JOB_MAX_MS >= deadline) return advanced;
    await deps.sleep(wakeAt - now);
  }
}

/** Works through due orders until the time budget is spent. */
export async function runDueOrders(deps: ScanDeps, budgetMs: number): Promise<number> {
  const deadline = deps.now().getTime() + budgetMs;
  const keys = await dueOrders(deps.kv, deps.now(), 5);
  let advanced = 0;
  for (const key of keys) {
    if (deadline - deps.now().getTime() < 20_000) break;
    if (await advanceOrder(deps, key, deadline)) advanced += 1;
  }
  return advanced;
}
