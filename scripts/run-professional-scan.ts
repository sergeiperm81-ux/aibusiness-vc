/**
 * AI Professional Scan, end to end: five assistants, three questions, one PDF.
 *
 *   npx tsx scripts/run-professional-scan.ts --plan --profile=URL --name="…" [--role="…"] [--company="…"] [--location="City, Country"]
 *   … --approved-max-usd=1.40 --approval-id=… [--out-dir=../runs]
 *
 * The paid answers are written to disk the moment they arrive, before anything
 * else can fail, so a report is rebuilt from them without asking again:
 *
 *   … --from-answers=path/to/answers.json      only the synthesis call is paid
 *   … --from-answers=… --from-synthesis=…      nothing is paid; the PDF is re-rendered
 *
 * Every paid path needs --approved-max-usd and --approval-id, and refuses when
 * the conservative ceiling with retries is above the approved figure.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runAnswerCheck, type AnswerCheck } from "../src/lib/audit/answer-check";
import { computeAnswerSignals } from "../src/lib/audit/answer-check-report";
import {
  ANSWER_ATTEMPTS,
  PERSON_PROVIDER_IDS,
  PROVIDER_MODELS,
  answerBounds,
  availableProviders,
} from "../src/lib/audit/answer-providers";
import { cleanCitations } from "../src/lib/audit/citation-cleanup";
import { newRunId, openJournal } from "../src/lib/audit/journal-file";
import { buildPersonQuestions, toAnswerSubject, type PersonSubject } from "../src/lib/audit/person-check";
import { buildPersonReportPdf } from "../src/lib/audit/person-report-pdf";
import { anchorsFor, keepSourcesAboutPerson } from "../src/lib/audit/person-source-check";
import { safeFetchText } from "../src/lib/audit/safe-fetch";
import { htmlToText } from "../src/lib/service-check/source-of-truth";
import {
  SYNTHESIS_MODEL,
  synthesisBoundsForPlan,
  synthesisePersonCheck,
  type PersonSynthesis,
} from "../src/lib/audit/person-synthesis";
import { parseSocialProfile } from "../src/lib/audit/social-profile";
import {
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

/** Rounded up, never to nearest: a ceiling shown as $1.36 must not turn out to be $1.364 at the gate. */
function usd(value: number): string {
  return `$${(Math.ceil(value * 100 - 1e-9) / 100).toFixed(2)}`;
}

function flag(args: readonly string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(path), "utf8")) as T;
}

/** A cited page's visible text, or null. The same reader as the paid service (professional-runtime.ts). */
async function readPage(address: string): Promise<string | null> {
  const response = await safeFetchText(address, { timeoutMs: 8_000, maxBytes: 1_500_000 });
  const type = response.headers.get("content-type") ?? "";
  if (!response.ok || !/text\/html|text\/plain|application\/xhtml/i.test(type)) return null;
  return htmlToText(response.text);
}

/** Tracking cut, then only the pages that name the person next to a detail from the profile. As on the site. */
async function withCleanCitations(check: AnswerCheck, person: PersonSubject): Promise<AnswerCheck> {
  const results = await Promise.all(
    check.results.map(async (row) => ({
      ...row,
      answers: await Promise.all(row.answers.map(async (a) => ({ ...a, citations: await cleanCitations(a.citations) }))),
    }))
  );
  return keepSourcesAboutPerson({ ...check, results }, anchorsFor(person), readPage);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const name = flag(args, "name")?.trim();
  const parsed = parseSocialProfile(flag(args, "profile") ?? "");
  if (!name || !parsed.ok) {
    console.error(parsed.ok ? 'Pass --name="Full Name" as the free preview identified it.' : parsed.error);
    process.exit(1);
  }
  const location = flag(args, "location")?.trim();
  const person: PersonSubject = {
    name,
    role: flag(args, "role") ?? "",
    company: flag(args, "company") ?? "",
    ...(location ? { location } : {}),
    profileUrl: parsed.profile.url,
  };
  const fromAnswers = flag(args, "from-answers");
  const fromSynthesis = flag(args, "from-synthesis");
  const questions = buildPersonQuestions(person);

  const answerCalls = fromAnswers
    ? []
    : questions.flatMap((q) =>
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
  const synthesisCalls: PlannedCall[] = fromSynthesis
    ? []
    : [
        {
          provider: "openai",
          model: SYNTHESIS_MODEL,
          purpose: "writer",
          label: "writer/synthesis",
          maxAttempts: 1,
          bounds: synthesisBoundsForPlan(questions.length, PERSON_PROVIDER_IDS.length),
        },
      ];
  const plan = planCost([...answerCalls, ...synthesisCalls]);
  const paid = plan.calls > 0;

  console.log(`Subject: ${name} (${parsed.profile.url})`);
  console.log(`Paid calls: ${answerCalls.length} answers, ${synthesisCalls.length} synthesis.`);
  console.log(`Conservative ceiling: ${usd(plan.conservativeNoRetryUsd)} with no retry, ${usd(plan.conservativeWithRetriesUsd)} if every answer call is retried`);
  if (args.includes("--plan")) {
    for (const q of questions) console.log(`  ${q.question}`);
    console.log("PLAN only. No request has been made and no key has been read.");
    return;
  }

  const approvedMaxUsd = Number(flag(args, "approved-max-usd"));
  const approvalId = flag(args, "approval-id")?.trim();
  if (paid && (!Number.isFinite(approvedMaxUsd) || approvedMaxUsd <= 0 || !approvalId)) {
    console.error("Refusing a paid run: pass --approved-max-usd and --approval-id after the owner approves the plan.");
    process.exit(1);
  }
  if (paid && (plan.unpricedModels.length > 0 || plan.conservativeWithRetriesUsd > approvedMaxUsd)) {
    console.error(`Refusing a paid run: ceiling ${usd(plan.conservativeWithRetriesUsd)} is above the approved ${usd(approvedMaxUsd)}, or a model is unpriced.`);
    process.exit(1);
  }

  const outDir = resolve(flag(args, "out-dir") ?? ".");
  mkdirSync(outDir, { recursive: true });
  const slug = name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const runId = newRunId();
  const base = resolve(outDir, `professional-scan-${slug}.${runId}`);

  let journal: JournalSink | undefined;
  const journalPath = `${base}.usage.jsonl`;
  if (paid) {
    loadEnv(".env.local");
    try {
      journal = openJournal(journalPath);
    } catch (error) {
      console.error(`Refusing to start: no fresh journal at ${journalPath} (${error instanceof Error ? error.message : String(error)}).`);
      process.exit(1);
    }
    console.error(`Run ${runId}, approval ${approvalId}. Journal: ${journalPath}`);
  }

  let check: AnswerCheck;
  if (fromAnswers) {
    check = readJson<AnswerCheck>(fromAnswers);
  } else {
    console.error("Asking the five assistants ...");
    const asked = await runAnswerCheck(toAnswerSubject(person), availableProviders(journal, PERSON_PROVIDER_IDS), questions);
    // Written before anything else can fail: these answers were paid for.
    writeFileSync(`${base}.answers.raw.json`, JSON.stringify(asked, null, 2), { encoding: "utf8", flag: "wx" });
    for (const failure of asked.results.flatMap((r) => r.answers.filter((a) => !a.ok))) {
      console.error(`  ${failure.providerLabel} failed: ${failure.error ?? "unknown"}`);
    }
    check = asked;
  }
  console.error("Reading the cited pages ...");
  check = await withCleanCitations(check, person);
  writeFileSync(`${base}.answers.json`, JSON.stringify(check, null, 2), { encoding: "utf8", flag: "wx" });

  let synthesis: PersonSynthesis;
  if (fromSynthesis) {
    synthesis = readJson<PersonSynthesis>(fromSynthesis);
  } else {
    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
      console.error("OPENAI_API_KEY is required for the synthesis. The answers are saved; rerun with --from-answers.");
      process.exit(1);
    }
    console.error("Writing the summary, one call ...");
    const result = await synthesisePersonCheck({ check, apiKey: openAiKey, onJournal: journal });
    if (!result.synthesis) {
      console.error(`The synthesis failed: ${result.error}. The answers are saved at ${base}.answers.json; a rerun needs a new approval.`);
      process.exit(1);
    }
    synthesis = result.synthesis;
    writeFileSync(`${base}.synthesis.json`, JSON.stringify(synthesis, null, 2), { encoding: "utf8", flag: "wx" });
  }

  const notFoundKeys = new Set(
    computeAnswerSignals(check)
      .filter((s) => s.nonAnswer.notFound)
      .map((s) => `${s.factId}/${s.providerId}`)
  );
  const pdf = await buildPersonReportPdf({ name, profileUrl: parsed.profile.url, check, synthesis, notFoundKeys });
  const pdfPath = `${base}.pdf`;
  writeFileSync(pdfPath, pdf, { flag: "wx" });
  console.error(`Wrote ${pdfPath}`);

  if (paid) {
    const events = readFileSync(journalPath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0)
      .map((line) => JSON.parse(line) as JournalEvent);
    const summary = summariseUsage(usageFromJournal(events));
    console.error(
      `Usage: ${summary.attempts} attempts, ${summary.webSearches} searches. ` +
        `Cost: reported ${usd(summary.providerReportedEstimateUsd)}, conservative ${usd(summary.conservativeEstimateUsd)}. The providers' billing is the authority.`
    );
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
