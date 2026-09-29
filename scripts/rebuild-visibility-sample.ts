/**
 * Rebuilds the public sample PDF from a saved visibility run, without paying
 * for the five models again. Only the free technical check of the homepage is
 * run afresh.
 *
 *   npx tsx scripts/rebuild-visibility-sample.ts runs/visibility-super.tennis-2026-09-29
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getLiveQuickAudit } from "../src/lib/audit/live";
import { encodeDomainAsId } from "../src/lib/audit/mock";
import { buildAuditReportPdf } from "../src/lib/audit/report-pdf";
import type { SiteVisibility } from "../src/lib/audit/site-visibility";

const SAMPLE_PATH = "public/audit-kit/Sample-AI-Website-Visibility-Report.pdf";

async function main(): Promise<void> {
  const runDir = process.argv[2];
  if (!runDir) throw new Error("usage: rebuild-visibility-sample.ts <run folder with visibility.json>");
  const visibility = JSON.parse(await readFile(resolve(runDir, "visibility.json"), "utf8")) as SiteVisibility;
  const audit = await getLiveQuickAudit(encodeDomainAsId(visibility.domain));
  if (audit.failure) throw new Error(`check failed: ${audit.failure}`);
  const { bytes, filename } = await buildAuditReportPdf({ audit, visibility });
  await writeFile(resolve(SAMPLE_PATH), bytes);
  await writeFile(resolve(runDir, filename), bytes);
  console.log(`sample rebuilt from ${visibility.domain}: ${filename}, score ${audit.overallScore}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
