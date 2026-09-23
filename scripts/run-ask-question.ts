/**
 * Any free-form question to the five assistants with live web search.
 *
 * The same engine and the same cheap models as the person scan, without its
 * fixed questions: the owner asks whatever they could not find through one
 * assistant, and all five search for it. The question is sent as written.
 *
 *   npx tsx scripts/run-ask-question.ts --plan --question-file=path/to/question.txt [--providers=openai,xai]
 *   … --approved-max-usd=0.30 --approval-id=… --out-dir=path/to/folder
 *
 * --question="…" works too; a file is safer for long or Cyrillic text.
 * --plan is free: no request, no key read. Anything else needs both
 * --approved-max-usd and --approval-id, and refuses when the conservative
 * ceiling with retries is above the approved figure.
 *
 * Writes <out-dir>/ask.<runId>.answers.json (every answer with its sources,
 * written before anything else can fail) and ask.<runId>.usage.jsonl.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ANSWER_ATTEMPTS,
  PERSON_PROVIDER_IDS,
  PROVIDER_MODELS,
  answerBounds,
  availableProviders,
} from "../src/lib/audit/answer-providers";
import { newRunId, openJournal } from "../src/lib/audit/journal-file";
import {
  planCost,
  summariseUsage,
  usageFromJournal,
  type JournalEvent,
  type JournalSink,
  type PlannedCall,
  type UsageProvider,
} from "../src/lib/audit/usage";

const FACT_ID = "question";
/** Long enough for a real question, short enough that nobody pastes a document by accident. */
const MAX_QUESTION_CHARS = 4_000;

function loadEnv(file: string): void {
  let raw = "";
  try {
    raw = readFileSync(resolve(file), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const value = match[2].replace(/^"(.*)"$/, "$1");
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}

function usd(value: number): string {
  return `$${value.toFixed(3)}`;
}

function flag(args: readonly string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function chosenProviders(raw: string | undefined): readonly UsageProvider[] {
  if (!raw) return PERSON_PROVIDER_IDS;
  const asked = raw.split(",").map((id) => id.trim());
  const unknown = asked.filter((id) => !PERSON_PROVIDER_IDS.includes(id as UsageProvider));
  if (unknown.length > 0) {
    console.error(`Unknown provider: ${unknown.join(", ")}. Known: ${PERSON_PROVIDER_IDS.join(", ")}`);
    process.exit(1);
  }
  return asked as UsageProvider[];
}

function readQuestion(args: readonly string[]): string {
  const file = flag(args, "question-file");
  let text = flag(args, "question") ?? "";
  if (file) {
    try {
      text = readFileSync(resolve(file), "utf8");
    } catch (error) {
      console.error(`Cannot read ${file}: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
  const question = text.replace(/^﻿/, "").trim();
  if (!question) {
    console.error('Pass --question="…" or --question-file=path.');
    process.exit(1);
  }
  if (question.length > MAX_QUESTION_CHARS) {
    console.error(`The question is ${question.length} characters; the limit is ${MAX_QUESTION_CHARS}.`);
    process.exit(1);
  }
  return question;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const question = readQuestion(args);
  const ids = chosenProviders(flag(args, "providers"));
  const calls = ids.map(
    (provider): PlannedCall => ({
      provider,
      model: PROVIDER_MODELS[provider],
      purpose: "answer",
      label: `answer/${provider}/${FACT_ID}`,
      maxAttempts: ANSWER_ATTEMPTS,
      bounds: answerBounds(provider, question),
    })
  );
  const plan = planCost(calls);

  console.log(`Question: ${question}`);
  console.log(`Providers: ${ids.map((id) => `${id} ${PROVIDER_MODELS[id]}`).join(", ")}`);
  console.log(`Conservative ceiling: ${usd(plan.conservativeNoRetryUsd)} with no retry, ${usd(plan.conservativeWithRetriesUsd)} if every call is retried`);
  if (args.includes("--plan")) {
    console.log("PLAN only. No request has been made and no key has been read.");
    return;
  }

  const approvedMaxUsd = Number(flag(args, "approved-max-usd"));
  const approvalId = flag(args, "approval-id")?.trim();
  if (!Number.isFinite(approvedMaxUsd) || approvedMaxUsd <= 0 || !approvalId) {
    console.error("Refusing a paid run: pass --approved-max-usd and --approval-id after the owner approves the plan.");
    process.exit(1);
  }
  if (plan.unpricedModels.length > 0 || plan.conservativeWithRetriesUsd > approvedMaxUsd) {
    console.error(`Refusing a paid run: ceiling ${usd(plan.conservativeWithRetriesUsd)} is above the approved ${usd(approvedMaxUsd)}, or a model is unpriced.`);
    process.exit(1);
  }

  const outDir = resolve(flag(args, "out-dir") ?? ".");
  mkdirSync(outDir, { recursive: true });
  loadEnv(".env.local");
  const runId = newRunId();
  const journalPath = resolve(outDir, `ask.${runId}.usage.jsonl`);
  let journal: JournalSink;
  try {
    journal = openJournal(journalPath);
  } catch (error) {
    console.error(`Refusing to start: no fresh journal at ${journalPath} (${error instanceof Error ? error.message : String(error)}).`);
    process.exit(1);
  }
  console.log(`Run ${runId}, approval ${approvalId}. Journal: ${journalPath}`);

  const providers = availableProviders(journal, ids);
  const missing = ids.filter((id) => !providers.some((p) => p.id === id));
  if (missing.length > 0) console.log(`No key for: ${missing.join(", ")}`);

  const askedAt = new Date().toISOString();
  const answers = await Promise.all(providers.map((provider) => provider.ask(question, FACT_ID)));
  const answersPath = resolve(outDir, `ask.${runId}.answers.json`);
  writeFileSync(answersPath, JSON.stringify({ question, askedAt, approvalId, answers }, null, 2), "utf8");
  console.log(`Wrote ${answersPath}`);

  for (const answer of answers) {
    console.log("");
    console.log(`=== ${answer.providerLabel} (${answer.model}) ${answer.ok ? "OK" : "FAILED"}`);
    console.log(answer.ok ? answer.text : `error: ${answer.error ?? "unknown"}`);
    if (answer.citations.length > 0) console.log(`sources: ${answer.citations.join(" , ")}`);
  }

  const events = readFileSync(journalPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as JournalEvent);
  const summary = summariseUsage(usageFromJournal(events));
  console.log("");
  console.log(`Total: reported ${usd(summary.providerReportedEstimateUsd)}, conservative ${usd(summary.conservativeEstimateUsd)}. The provider dashboards are the authority.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
