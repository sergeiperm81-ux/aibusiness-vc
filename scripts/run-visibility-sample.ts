/**
 * One approved live run of the paid AI Website Visibility report, without a
 * purchase: the site check, the five assistants, the PDF and the archive,
 * written to a local folder. Used to produce the public sample report.
 *
 * Paid API calls. Run only with the owner's approval and a ceiling:
 *   npx tsx --env-file=.env.local scripts/run-visibility-sample.ts super.tennis --approved-max-usd 0.90
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildAuditPackageAttachments } from "../src/lib/audit/fulfillment";
import { runSiteVisibility, productionVisibilityDeps } from "../src/lib/audit/site-visibility";

async function main(): Promise<void> {
  const [domain, flag, ceiling] = process.argv.slice(2);
  if (!domain || flag !== "--approved-max-usd" || !ceiling) {
    throw new Error("usage: run-visibility-sample.ts <domain> --approved-max-usd <usd>");
  }
  const maxUsd = Number(ceiling);
  const outDir = resolve("runs", `visibility-${domain.replace(/[^a-z0-9.]+/gi, "-")}-${new Date().toISOString().slice(0, 10)}`);
  await mkdir(outDir, { recursive: true });

  const started = Date.now();
  // The five assistants first, on their own, so the run's cost is known before the package is built.
  const visibility = await runSiteVisibility(domain, productionVisibilityDeps());
  const visibilityMs = Date.now() - started;
  await writeFile(resolve(outDir, "visibility.json"), JSON.stringify(visibility, null, 2));
  console.log(`visibility: ${visibility.providers.length} models in ${(visibilityMs / 1000).toFixed(0)}s, ~$${visibility.usd.toFixed(3)}`);
  for (const p of visibility.providers) {
    console.log(`  ${p.providerLabel}: ${p.reach}, own ${p.ownPages.length}, other ${p.otherSources.length}`);
  }
  if (visibility.usd > maxUsd) throw new Error(`cost ${visibility.usd.toFixed(3)} is over the approved ${maxUsd}; package not built`);

  // The full package, exactly as a buyer receives it, built on the run above so nothing is paid for twice.
  const packageStart = Date.now();
  const attachments = await buildAuditPackageAttachments({ domain, orderId: "sample-run", visibility });
  const packageMs = Date.now() - packageStart;
  for (const file of attachments) {
    await writeFile(resolve(outDir, file.name), Buffer.from(file.content, "base64"));
    console.log(`wrote ${file.name}`);
  }
  console.log(`package built in ${(packageMs / 1000).toFixed(0)}s; folder: ${outDir}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
