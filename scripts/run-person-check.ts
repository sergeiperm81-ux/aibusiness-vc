/**
 * Runs one person check end to end and writes the markdown report.
 *
 * Usage:
 *   tsx scripts/run-person-check.ts [--plan] --name="…" --role="…" --company="…" \
 *     --linkedin=https://www.linkedin.com/in/… --category="…" \
 *     [--market="…"] [--domain=example.com] [--about="one line in their words"] \
 *     [--recommend-as=consultants] [--out=path.md] \
 *     --approved-max-usd=0.75 --approval-id=fresh-approval-id
 *
 * --plan prints the models, calls, retry limits and a conservative cost range,
 * makes no request and reads no key.
 *
 * A real run spends money on two paid APIs and must not be started without
 * stating the plan and getting an explicit yes. It is journalled exactly like
 * the company check: a "started" line before every paid request leaves and a
 * "finished" line when it ends, in a fresh <out>.<runId>.usage.jsonl.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { runAnswerCheck } from "../src/lib/audit/answer-check";
import { computeAnswerSignals } from "../src/lib/audit/answer-check-report";
import {
  ANSWER_ATTEMPTS,
  ANSWER_MAX_OUTPUT_TOKENS,
  ASSUMED_RESULT_TOKENS_PER_SEARCH,
  GOOGLE_ASSUMED_QUERIES_PER_REQUEST,
  PERSON_PROVIDER_IDS,
  PROVIDER_MODELS,
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
import { buildPersonQuestions, toAnswerSubject, type PersonSubject } from "../src/lib/audit/person-check";
import { blindAnswerTexts, renderPersonCheckMarkdown } from "../src/lib/audit/person-check-report";
import { fetchPersonFacts } from "../src/lib/audit/person-facts";
import { WRITER_MODEL, draftWhatToPublish, writerBoundsForPlan } from "../src/lib/audit/person-rewrite";
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

function flag(args: readonly string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function plannedRun(person: PersonSubject): {
  readonly questions: ReturnType<typeof buildPersonQuestions>;
  readonly answerCalls: readonly PlannedCall[];
  readonly judgeCalls: readonly PlannedCall[];
  readonly writerCall: PlannedCall;
  readonly plan: ReturnType<typeof planCost>;
} {
  const questions = buildPersonQuestions(person);
  const named = questions.filter((q) => !q.blind);
  // Planned for all five, whether or not a key is present: a missing key only lowers the bill.
  const answerCalls = questions.flatMap((q) =>
    PERSON_PROVIDER_IDS.map(
      (provider): PlannedCall => ({
        provider,
        model: PROVIDER_MODELS[provider],
        purpose: "answer",
        label: `answer/${provider}/${q.id}`,
        maxAttempts: ANSWER_ATTEMPTS,
        bounds: answerBounds(provider, q.question),
      })
    )
  );
  const judgeCalls = named.map(
    (q): PlannedCall => ({
      provider: "openai",
      model: JUDGE_MODEL,
      purpose: "judge",
      label: `judge/${q.id}`,
      maxAttempts: JUDGE_ATTEMPTS,
      bounds: judgeBoundsForPlan(q.question, PERSON_PROVIDER_IDS.length, ANSWER_MAX_OUTPUT_TOKENS),
    })
  );
  const writerCall: PlannedCall = {
    provider: "openai",
    model: WRITER_MODEL,
    purpose: "writer",
    label: "writer/publish",
    maxAttempts: 1,
    bounds: writerBoundsForPlan(),
  };
  const plan = planCost([...answerCalls, ...judgeCalls, writerCall]);
  return { questions, answerCalls, judgeCalls, writerCall, plan };
}

function printPlan(person: PersonSubject): void {
  const { questions, answerCalls, judgeCalls, plan } = plannedRun(person);

  console.log("PLAN. No request of any kind has been made, and no key has been read.");
  console.log("");
  console.log("Models:");
  console.log(`  answers  ${PERSON_PROVIDER_IDS.map((id) => `${id} ${PROVIDER_MODELS[id]}`).join(", ")}`);
  console.log(`  judge    OpenAI ${JUDGE_MODEL}`);
  console.log(`  writer   OpenAI ${WRITER_MODEL}`);
  console.log("");
  console.log("Questions:");
  for (const q of questions) console.log(`  ${q.blind ? "(blind) " : ""}${q.question}`);
  console.log("");
  console.log("Calls:");
  console.log(`  answers  ${answerCalls.length} (${questions.length} questions x ${PERSON_PROVIDER_IDS.length} APIs), up to ${ANSWER_ATTEMPTS} attempts each`);
  console.log(`  judge    up to ${judgeCalls.length} (one per named question), ${JUDGE_ATTEMPTS} attempt each, never retried`);
  console.log("  writer   1, never retried");
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
  console.log(`  Anthropic, Google and xAI search results of ${ASSUMED_RESULT_TOKENS_PER_SEARCH} tokens per search, which no API caps;`);
  console.log(`  Google running ${GOOGLE_ASSUMED_QUERIES_PER_REQUEST} search queries per question, which its API gives no field to limit;`);
  console.log(`  OpenAI search content of ${OPENAI_SEARCH_CONTENT_TOKENS} tokens per search, added on top of input, which may count it twice;`);
  console.log("  any failed attempt, including an HTTP error, costs as much as a full one.");
  console.log("");
  console.log(`Prices checked ${PRICES_CHECKED_ON}: ${PRICE_SOURCES.join(" , ")}`);
}

function readJournal(path: string): JournalEvent[] {
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as JournalEvent);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const planOnly = args.includes("--plan");
  const name = flag(args, "name");
  const role = flag(args, "role") ?? "";
  const company = flag(args, "company") ?? "";
  const linkedin = flag(args, "linkedin");
  const category = flag(args, "category");
  if (!name || !linkedin) {
    console.error(
      'Usage: tsx scripts/run-person-check.ts [--plan] --name="…" --role="…" --company="…" --linkedin=URL --category="…" [--market=…] [--domain=…] [--about=…] [--recommend-as=…] [--out=file.md] [--approved-max-usd=… --approval-id=…]'
    );
    process.exit(1);
  }
  const person: PersonSubject = {
    name,
    role,
    company,
    profileUrl: linkedin,
    category,
    market: flag(args, "market"),
    companyDomain: flag(args, "domain"),
    oneLiner: flag(args, "about"),
    recommendAs: flag(args, "recommend-as"),
  };

  if (planOnly) {
    printPlan(person);
    return;
  }

  const approvedMaxUsd = Number(flag(args, "approved-max-usd"));
  const approvalId = flag(args, "approval-id")?.trim();
  const { plan } = plannedRun(person);
  if (!Number.isFinite(approvedMaxUsd) || approvedMaxUsd <= 0 || !approvalId) {
    console.error(
      "Refusing a paid run. After the owner approves the displayed --plan, pass both " +
        "--approved-max-usd=<approved ceiling> and --approval-id=<fresh approval identifier>."
    );
    process.exit(1);
  }
  if (plan.unpricedModels.length > 0 || plan.conservativeWithRetriesUsd > approvedMaxUsd) {
    console.error(
      `Refusing a paid run. Planned conservative ceiling ${usd(plan.conservativeWithRetriesUsd)} ` +
        `exceeds the approved ${usd(approvedMaxUsd)}, or a model is unpriced.`
    );
    process.exit(1);
  }

  loadEnv(".env.local");
  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey) {
    console.error("OPENAI_API_KEY is required: it runs the comparison and the writer as well as one of the answers");
    process.exit(1);
  }

  const target = flag(args, "out") ?? `person-check-${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`;
  mkdirSync(dirname(resolve(target)), { recursive: true });

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

  console.error("Reading the reference: form, public profile, company site ...");
  const facts = await fetchPersonFacts(person);
  console.error(`  profile: ${facts.profile.note}`);
  console.error(`  company site: ${facts.companySiteRead ? "read" : "not read"}`);

  console.error("Asking the APIs ...");
  const subject = toAnswerSubject(person);
  const check = await runAnswerCheck(subject, availableProviders(journal, PERSON_PROVIDER_IDS), buildPersonQuestions(person));
  const failures = check.results.flatMap((r) => r.answers.filter((a) => !a.ok));
  for (const failure of failures) {
    console.error(`  ${failure.providerLabel} failed: ${failure.error ?? "unknown"}`);
  }

  const signals = computeAnswerSignals(check);
  const skip = new Set(
    signals
      .filter((s) => s.nonAnswer.notFound || (s.entity.lookalikeDomains.length > 0 && !s.entity.ownDomainPresent))
      .map((s) => `${s.factId}/${s.providerId}`)
  );
  for (const key of skip) console.error(`  not judged, did not identify the person: ${key}`);

  console.error("Comparing the answers against what the person states, one call per question ...");
  const named = check.results.filter((r) => !r.fact.blind);
  const analyses: AnalysedAnswer[] = [];
  for (const row of named) {
    const result = await analyseQuestion({
      factId: row.fact.id,
      question: row.fact.question,
      answers: row.answers.map((a) => ({
        providerId: a.providerId,
        text: a.ok && !skip.has(`${row.fact.id}/${a.providerId}`) ? a.text : "",
      })),
      reference: facts.reference,
      apiKey: openAiKey,
      onJournal: journal,
      subjectKind: "person",
    });
    for (const verdict of result.analyses) {
      if (!verdict.ok && !skip.has(`${verdict.factId}/${verdict.providerId}`)) {
        console.error(`  ${verdict.factId}/${verdict.providerId}: ${verdict.error}`);
      }
    }
    analyses.push(...result.analyses);
  }

  console.error("Drafting what to publish, one call ...");
  const drafted = await draftWhatToPublish({
    person,
    reference: facts.reference,
    analyses,
    blindAnswers: blindAnswerTexts(check),
    apiKey: openAiKey,
    onJournal: journal,
  });
  if (!drafted.draft) console.error(`  writer failed: ${drafted.error}`);

  writeFileSync(
    resolve(target),
    renderPersonCheckMarkdown(check, facts, analyses, signals, drafted.draft, drafted.error),
    "utf8"
  );

  const calls = usageFromJournal(readJournal(journalPath));
  const summary = summariseUsage(calls);
  writeFileSync(
    resolve(`${target}.${runId}.usage.summary.json`),
    JSON.stringify({ runId, checkedAt: check.checkedAt, person: name, pricesCheckedOn: PRICES_CHECKED_ON, summary }, null, 2),
    { encoding: "utf8", flag: "wx" }
  );

  const contradictionCount = analyses.flatMap((a) => a.claims).filter((c) => c.status === "contradicted").length;
  console.error(
    `Wrote ${target}: ${check.results.length} questions x ${check.providers.length} APIs, ` +
      `${failures.length} answers failed, ${skip.size} did not identify the person, ` +
      `${analyses.filter((a) => a.ok).length} answers analysed, ${contradictionCount} quoted contradictions`
  );
  console.error(
    `Usage: ${summary.attempts} attempts, ${summary.webSearches} searches, ${summary.inputTokens} in / ${summary.outputTokens} out tokens`
  );
  console.error(
    `Cost: provider-reported estimate ${usd(summary.providerReportedEstimateUsd)}, ` +
      `conservative estimate ${usd(summary.conservativeEstimateUsd)}. The providers' billing is the authority.`
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
