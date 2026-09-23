/**
 * Runs one answer check end to end and writes the markdown report.
 *
 * Usage:
 *   tsx scripts/run-answer-check.ts [flags] <domain> <brand> <product> <category> [market] [outFile] [productUrl]
 *
 * Flags:
 *   --plan                  print the models, calls, retry limits and a conservative
 *                           cost range; make no request and read no key
 *   --recommend-as=<noun>   what the blind question asks for: "companies" (default),
 *                           "websites", "apps"
 *
 * Arguments are positional, so pass "" for a market you do not want to set.
 *
 * A real run spends money on two paid APIs and must not be started without
 * stating the plan and getting an explicit yes.
 *
 * Every real run gets its own run id. Its journal is
 * <outFile>.<runId>.usage.jsonl: a "started" line before every paid request
 * leaves and a "finished" line when it ends. The file is created exclusively
 * and never overwritten. A summary is written to
 * <outFile>.<runId>.usage.summary.json at the end. Neither file goes to the client.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  buildQuestions,
  runAnswerCheck,
  type AnswerCheckSubject,
} from "../src/lib/audit/answer-check";
import {
  computeAnswerSignals,
  renderAnswerCheckMarkdown,
} from "../src/lib/audit/answer-check-report";
import {
  ANSWER_ATTEMPTS,
  ANSWER_MAX_OUTPUT_TOKENS,
  ANTHROPIC_ANSWER_MODEL,
  ASSUMED_RESULT_TOKENS_PER_SEARCH,
  OPENAI_ANSWER_MODEL,
  answerBounds,
  availableProviders,
} from "../src/lib/audit/answer-providers";
import {
  JUDGE_ATTEMPTS,
  JUDGE_MODEL,
  analyseQuestion,
  judgeBoundsForPlan,
  type AnalysedAnswer,
} from "../src/lib/audit/answer-analysis";
import { newRunId, openJournal } from "../src/lib/audit/journal-file";
import { fetchSiteFacts } from "../src/lib/audit/site-facts";
import {
  OPENAI_SEARCH_CONTENT_TOKENS,
  PRICES_CHECKED_ON,
  PRICE_SOURCES,
  planCost,
  summariseUsage,
  usageFromJournal,
  type JournalEvent,
  type JournalSink,
  type PlannedCall,
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
  return `$${value.toFixed(2)}`;
}

/** Describes a run without making a single request or reading a key. */
function printPlan(subject: AnswerCheckSubject): void {
  const questions = buildQuestions(subject);
  const named = questions.filter((q) => !q.blind);
  const answerCalls = questions.flatMap((q): PlannedCall[] => [
    {
      provider: "openai",
      model: OPENAI_ANSWER_MODEL,
      purpose: "answer",
      label: `answer/openai/${q.id}`,
      maxAttempts: ANSWER_ATTEMPTS,
      bounds: answerBounds("openai", q.question),
    },
    {
      provider: "anthropic",
      model: ANTHROPIC_ANSWER_MODEL,
      purpose: "answer",
      label: `answer/anthropic/${q.id}`,
      maxAttempts: ANSWER_ATTEMPTS,
      bounds: answerBounds("anthropic", q.question),
    },
  ]);
  const judgeCalls = named.map(
    (q): PlannedCall => ({
      provider: "openai",
      model: JUDGE_MODEL,
      purpose: "judge",
      label: `judge/${q.id}`,
      maxAttempts: JUDGE_ATTEMPTS,
      bounds: judgeBoundsForPlan(q.question, 2, ANSWER_MAX_OUTPUT_TOKENS),
    })
  );
  const plan = planCost([...answerCalls, ...judgeCalls]);

  console.log("PLAN. No request of any kind has been made, and no key has been read.");
  console.log("");
  console.log("Models:");
  console.log(`  answers  OpenAI ${OPENAI_ANSWER_MODEL}, Anthropic ${ANTHROPIC_ANSWER_MODEL}`);
  console.log(`  judge    OpenAI ${JUDGE_MODEL}`);
  console.log("");
  console.log("Questions:");
  for (const q of questions) console.log(`  ${q.blind ? "(blind) " : ""}${q.question}`);
  console.log("");
  console.log("Calls:");
  console.log(`  answers  ${answerCalls.length} (${questions.length} questions x 2 APIs), up to ${ANSWER_ATTEMPTS} attempts each`);
  console.log(`  judge    up to ${judgeCalls.length} (one per named question), ${JUDGE_ATTEMPTS} attempt each, never retried;`);
  console.log("           skipped for a question whose answers all failed to find the client or cited a lookalike domain");
  console.log(`  total    at most ${plan.calls} calls and ${plan.maxAttempts} HTTP attempts`);
  console.log("");
  console.log("Web searches:");
  console.log(`  at most ${plan.maxWebSearchesNoRetry} if nothing is retried`);
  console.log(`  at most ${plan.maxWebSearchesWithRetries} if every answer call is retried`);
  console.log("");
  console.log("Conservative cost:");
  console.log(`  ${usd(plan.conservativeNoRetryUsd)} if nothing is retried`);
  console.log(`  ${usd(plan.conservativeWithRetriesUsd)} if every answer call is retried`);
  if (plan.unpricedModels.length > 0) {
    console.log(`  WARNING: no price for ${plan.unpricedModels.join(", ")}; both figures are too low`);
  }
  console.log("");
  console.log("These are not guarantees. They assume:");
  console.log("  every call produces output at its cap and uses its full search allowance;");
  console.log(`  Anthropic search results of ${ASSUMED_RESULT_TOKENS_PER_SEARCH} tokens per search, which the API does not cap;`);
  console.log(`  OpenAI search content of ${OPENAI_SEARCH_CONTENT_TOKENS} tokens per search, added on top of input, which may count it twice;`);
  console.log("  any failed attempt, including an HTTP error, costs as much as a full one;");
  console.log("  tokens estimated as characters divided by three, which overstates English text.");
  console.log("");
  console.log(`Prices checked ${PRICES_CHECKED_ON}: ${PRICE_SOURCES.join(" , ")}`);
}

function readJournal(path: string): JournalEvent[] {
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as JournalEvent);
}

function flagValue(args: readonly string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

async function main(): Promise<void> {
  const rawArgs = process.argv.slice(2);
  const planOnly = rawArgs.includes("--plan");
  const recommendAs = flagValue(rawArgs, "recommend-as");
  const [domain, brand, product, category, market, outFile, productUrl] = rawArgs.filter(
    (arg) => !arg.startsWith("--")
  );
  if (!domain || !brand || !product || !category) {
    console.error(
      "Usage: tsx scripts/run-answer-check.ts [--plan] [--recommend-as=websites] <domain> <brand> <product> <category> [market] [outFile] [productUrl]"
    );
    process.exit(1);
  }
  const subject: AnswerCheckSubject = {
    domain,
    brand,
    product,
    category,
    market: market || undefined,
    recommendAs,
  };

  if (planOnly) {
    printPlan(subject);
    return;
  }

  loadEnv(".env.local");
  const judgeKey = process.env.OPENAI_API_KEY;
  if (!judgeKey) {
    console.error("OPENAI_API_KEY is required: it runs the comparison as well as one of the answers");
    process.exit(1);
  }

  const target = outFile ?? `answer-check-${domain.replace(/[^a-z0-9]+/gi, "-")}.md`;
  mkdirSync(dirname(resolve(target)), { recursive: true });

  // Created before the first paid call, exclusively, under a name no earlier
  // run can have. If it cannot be created, nothing has been spent yet.
  const runId = newRunId();
  const journalPath = resolve(`${target}.${runId}.usage.jsonl`);
  let journal: JournalSink;
  try {
    journal = openJournal(journalPath);
  } catch (error) {
    console.error(
      `Refusing to start: could not create a fresh journal at ${journalPath} ` +
        `(${error instanceof Error ? error.message : String(error)}). No request has been made.`
    );
    process.exit(1);
  }
  console.error(`Run ${runId}. Journal: ${journalPath}`);

  console.error(`Reading ${domain} as the reference ...`);
  const facts = await fetchSiteFacts(domain, [brand, product, category], productUrl ? [productUrl] : []);
  const answered = facts.pages.filter((p) => p.ok).length;
  console.error(`  ${answered} of ${facts.pages.length} reference pages responded`);
  if (!facts.reachable) console.error("  site did not respond: no verdicts will be possible");

  console.error("Asking the APIs ...");
  const check = await runAnswerCheck(subject, availableProviders(journal));
  const failures = check.results.flatMap((r) => r.answers.filter((a) => !a.ok));
  for (const failure of failures) {
    console.error(`  ${failure.providerLabel} failed: ${failure.error ?? "unknown"}`);
  }

  // Fixed rules, before any judge: an answer that could not find the client,
  // or that cites a domain resembling the client's, is not sent to the judge.
  const signals = computeAnswerSignals(check);
  const skip = new Set(
    signals
      .filter((s) => s.nonAnswer.notFound || (s.entity.lookalikeDomains.length > 0 && !s.entity.ownDomainPresent))
      .map((s) => `${s.factId}/${s.providerId}`)
  );
  for (const key of skip) console.error(`  not judged, did not identify the client: ${key}`);

  console.error("Comparing the answers against the site, one call per question ...");
  const named = check.results.filter((r) => !r.fact.blind);
  const analyses: AnalysedAnswer[] = [];
  // Sequential: a burst of long prompts is the fastest way to a rate limit.
  for (const row of named) {
    const result = await analyseQuestion({
      factId: row.fact.id,
      question: row.fact.question,
      answers: row.answers.map((a) => ({
        providerId: a.providerId,
        text: a.ok && !skip.has(`${row.fact.id}/${a.providerId}`) ? a.text : "",
      })),
      reference: facts.reference,
      apiKey: judgeKey,
      onJournal: journal,
    });
    for (const verdict of result.analyses) {
      if (!verdict.ok && !skip.has(`${verdict.factId}/${verdict.providerId}`)) {
        console.error(`  ${verdict.factId}/${verdict.providerId}: ${verdict.error}`);
      }
    }
    analyses.push(...result.analyses);
  }

  writeFileSync(resolve(target), renderAnswerCheckMarkdown(check, facts, analyses, signals), "utf8");

  // Built from what is on disk, so the summary matches the journal exactly,
  // including any attempt that started and never finished.
  const calls = usageFromJournal(readJournal(journalPath));
  const summary = summariseUsage(calls);
  writeFileSync(
    resolve(`${target}.${runId}.usage.summary.json`),
    JSON.stringify(
      { runId, checkedAt: check.checkedAt, domain, pricesCheckedOn: PRICES_CHECKED_ON, summary },
      null,
      2
    ),
    { encoding: "utf8", flag: "wx" }
  );

  const contradictionCount = analyses
    .flatMap((a) => a.claims)
    .filter((c) => c.status === "contradicted").length;
  console.error(
    `Wrote ${target}: ${check.results.length} questions x ${check.providers.length} APIs, ` +
      `${failures.length} answers failed, ${skip.size} did not identify the client, ` +
      `${analyses.filter((a) => a.ok).length} answers analysed, ${contradictionCount} quoted contradictions`
  );
  console.error(
    `Usage: ${summary.attempts} attempts (reported ${summary.byTokenMeasurement.reported}, ` +
      `unknown ${summary.byTokenMeasurement.unknown}, interrupted ${summary.byOutcome.interrupted}), ` +
      `${summary.webSearches} searches, ${summary.inputTokens} in / ${summary.outputTokens} out tokens`
  );
  console.error(
    `Cost: provider-reported estimate ${usd(summary.providerReportedEstimateUsd)}, ` +
      `conservative estimate ${usd(summary.conservativeEstimateUsd)}. ` +
      `The providers' billing is the authority.`
  );
  if (summary.unpricedModels.length > 0) {
    console.error(`  WARNING: no price for ${summary.unpricedModels.join(", ")}; both estimates are too low`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
