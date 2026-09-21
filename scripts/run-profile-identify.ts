/**
 * One question to chosen providers: whose profile is this address?
 *
 * Two uses. It is the cheapest possible live test of a provider adapter, and
 * it is the question the free preview will ask. Paid, so it carries the same
 * gate as every other run: --plan is free, anything else needs both
 * --approved-max-usd and --approval-id, and refuses when the conservative
 * ceiling with retries is above the approved figure.
 *
 *   npx tsx scripts/run-profile-identify.ts --plan --profile=URL [--providers=google,perplexity,xai]
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ANSWER_ATTEMPTS,
  PERSON_PROVIDER_IDS,
  PROVIDER_MODELS,
  answerBounds,
  availableProviders,
} from "../src/lib/audit/answer-providers";
import { newRunId, openJournal } from "../src/lib/audit/journal-file";
import { IDENTIFY_FACT_ID, buildIdentifyQuestion } from "../src/lib/audit/person-identify";
import { parseSocialProfile } from "../src/lib/audit/social-profile";
import {
  planCost,
  summariseUsage,
  usageFromJournal,
  type JournalEvent,
  type JournalSink,
  type PlannedCall,
  type UsageProvider,
} from "../src/lib/audit/usage";

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

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const parsed = parseSocialProfile(flag(args, "profile") ?? "");
  if (!parsed.ok) {
    console.error(parsed.error);
    process.exit(1);
  }
  const ids = chosenProviders(flag(args, "providers"));
  const question = buildIdentifyQuestion(parsed.profile);
  const calls = ids.map(
    (provider): PlannedCall => ({
      provider,
      model: PROVIDER_MODELS[provider],
      purpose: "answer",
      label: `answer/${provider}/${IDENTIFY_FACT_ID}`,
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

  loadEnv(".env.local");
  const runId = newRunId();
  const journalPath = resolve(flag(args, "journal-dir") ?? ".", `profile-identify.${runId}.usage.jsonl`);
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

  const answers = await Promise.all(providers.map((provider) => provider.ask(question, IDENTIFY_FACT_ID)));
  for (const answer of answers) {
    console.log("");
    console.log(`=== ${answer.providerLabel} (${answer.model}) ${answer.ok ? "OK" : "FAILED"}`);
    console.log(answer.ok ? answer.text : `error: ${answer.error ?? "unknown"}`);
    if (answer.citations.length > 0) console.log(`sources: ${answer.citations.slice(0, 6).join(" , ")}`);
  }

  const events = readFileSync(journalPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as JournalEvent);
  const rows = usageFromJournal(events);
  const summary = summariseUsage(rows);
  console.log("");
  for (const row of rows) {
    console.log(
      `${row.provider} attempt ${row.attemptNumber}: ${row.outcome}, http ${row.httpStatus ?? "-"}, ` +
        `in ${row.inputTokens}, out ${row.outputTokens}, searches ${row.webSearches}, ` +
        `reported ${usd(row.providerReportedEstimateUsd)}, conservative ${usd(row.conservativeEstimateUsd)}`
    );
  }
  console.log(`Total: reported ${usd(summary.providerReportedEstimateUsd)}, conservative ${usd(summary.conservativeEstimateUsd)}. The provider dashboards are the authority.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
