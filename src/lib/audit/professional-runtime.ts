/**
 * The production wiring of AI Professional Scan: real providers, Redis, Lemon
 * Squeezy and Brevo, read from the environment. Kept apart from the machine so
 * the machine never reads an environment variable itself.
 */

import {
  ANSWER_ATTEMPTS,
  PERSON_PROVIDER_IDS,
  PROVIDER_ENV_KEYS,
  PROVIDER_MODELS,
  answerBounds,
  availableProviders,
} from "./answer-providers";
import { SYNTHESIS_MODEL, synthesisBoundsForPlan } from "./person-synthesis";
import { planCost } from "./usage";
import type { AnswerCheck } from "./answer-check";
import { cleanCitations } from "./citation-cleanup";
import { htmlToText } from "../service-check/source-of-truth";
import type { PersonSubject } from "./person-check";
import { anchorsFor, keepSourcesAboutPerson } from "./person-source-check";
import { safeFetchText } from "./safe-fetch";
import { redisKv } from "./durable-kv";
import { synthesisePersonCheck } from "./person-synthesis";
import {
  codeFor,
  createLemonDiscount,
  sendDelayEmail,
  sendGiveUpEmail,
  sendOwnerAlert,
  sendReportEmail,
} from "./professional-delivery";
import type { ScanDeps } from "./professional-worker";
import { refundSignature } from "./refund-confirm";
import type { UsageProvider } from "./usage";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function proScanVariantId(): string {
  return env("LEMONSQUEEZY_PRO_SCAN_VARIANT_ID");
}

export function companyScanVariantId(): string {
  return env("LEMONSQUEEZY_COMPANY_SCAN_VARIANT_ID");
}

/** Both scans: the half-price code works on either. */
export function scanVariantIds(): readonly string[] {
  return [proScanVariantId(), companyScanVariantId()].filter(Boolean);
}

export function providerConfigured(id: string): boolean {
  return env(PROVIDER_ENV_KEYS[id as UsageProvider] ?? "").length > 0;
}

function mailConfig(): { apiKey: string; from: string; owner: string | null } {
  const apiKey = env("BREVO_API_KEY");
  const from = (env("AUDIT_FROM_EMAIL") || env("LEADS_FROM_EMAIL")).toLowerCase();
  const owner = (env("AUDIT_OWNER_EMAIL") || env("LEADS_TO_EMAIL")).toLowerCase();
  if (!apiKey || !EMAIL.test(from)) throw new Error("Mail is not configured: BREVO_API_KEY and a sender address are required");
  return { apiKey, from, owner: EMAIL.test(owner) ? owner : null };
}

/** The secret codes are derived from. A new secret would issue new codes for old orders, so it must not change. */
function codeSecret(): string {
  const secret = env("LEMONSQUEEZY_WEBHOOK_SECRET");
  if (!secret) throw new Error("LEMONSQUEEZY_WEBHOOK_SECRET is required to derive discount codes");
  return secret;
}

/** Per cited page. At most 80 pages, 8 at a time: under 90 seconds at worst, inside one worker run. */
const PAGE_TIMEOUT_MS = 8_000;
const PAGE_MAX_BYTES = 1_500_000;

/** A cited page's visible text, or null when it cannot be read as a page. */
async function readPage(address: string): Promise<string | null> {
  const response = await safeFetchText(address, { timeoutMs: PAGE_TIMEOUT_MS, maxBytes: PAGE_MAX_BYTES });
  const type = response.headers.get("content-type") ?? "";
  if (!response.ok || !/text\/html|text\/plain|application\/xhtml/i.test(type)) return null;
  return htmlToText(response.text);
}

async function withCleanCitations(check: AnswerCheck, subject: PersonSubject): Promise<AnswerCheck> {
  const results = await Promise.all(
    check.results.map(async (row) => ({
      ...row,
      answers: await Promise.all(row.answers.map(async (a) => ({ ...a, citations: await cleanCitations(a.citations) }))),
    }))
  );
  return keepSourcesAboutPerson({ ...check, results }, anchorsFor(subject), readPage);
}

export function productionDeps(): ScanDeps {
  return {
    kv: redisKv,
    providerIds: PERSON_PROVIDER_IDS,
    providers: (ids) => availableProviders(undefined, ids as readonly UsageProvider[]),
    cleanCitations: withCleanCitations,
    synthesise: async (check) => {
      const apiKey = env("OPENAI_API_KEY");
      if (!apiKey) throw new Error("OPENAI_API_KEY is required for the synthesis");
      return synthesisePersonCheck({ check, apiKey });
    },
    createDiscount: async (spec) => {
      const apiKey = env("LEMONSQUEEZY_API_KEY");
      const storeId = env("LEMONSQUEEZY_STORE_ID");
      const variantIds = scanVariantIds();
      if (!apiKey || !storeId || variantIds.length === 0) throw new Error("Lemon Squeezy is not configured for discount codes");
      await createLemonDiscount(spec, { apiKey, storeId, variantIds });
    },
    sendReport: (email) => sendReportEmail(email, mailConfig()),
    sendDelayNotice: (order) => sendDelayEmail(order, mailConfig()),
    sendGiveUpNotice: (order) => sendGiveUpEmail(order, mailConfig()),
    notifyOwner: async (subject, text) => {
      try {
        await sendOwnerAlert(subject, text, mailConfig());
      } catch (error) {
        // An alert that cannot be sent must not stop an order.
        console.error(`[pscan/owner] ${subject}: ${text}`, error);
      }
    },
    codeFor: (seed) => codeFor(seed, codeSecret()),
    askCeilingUsd: askCeilingUsd,
    synthesisCeilingUsd: planCost([
      { provider: "openai", model: SYNTHESIS_MODEL, purpose: "writer", label: "synthesis", maxAttempts: 1, bounds: synthesisBoundsForPlan(3, PERSON_PROVIDER_IDS.length) },
    ]).conservativeWithRetriesUsd,
    now: () => new Date(),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    refundConfirmLink: (key) => {
      const secret = env("PROFESSIONAL_SCAN_WORKER_SECRET");
      return `https://aibusiness.vc/api/professional-scan/refund?order=${encodeURIComponent(key)}&sig=${refundSignature(key, secret)}`;
    },
  };
}

/** Both attempts of one ask at every bound, priced. An unpriced model reserves $1, so it hits the cap fast. */
export function askCeilingUsd(providerId: string, question: string): number {
  const provider = providerId as UsageProvider;
  const plan = planCost([
    { provider, model: PROVIDER_MODELS[provider], purpose: "answer", label: "ask", maxAttempts: ANSWER_ATTEMPTS, bounds: answerBounds(provider, question) },
  ]);
  return plan.unpricedModels.length > 0 ? 1 : plan.conservativeWithRetriesUsd;
}

/** Seconds of work one function run may do, below Vercel's 300 so the run can save before it is stopped. */
export const WORKER_BUDGET_MS = 270_000;
