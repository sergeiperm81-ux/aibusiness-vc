/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BOARD_PATH = path.join(ROOT, "docs", "seo-priority-board.csv");
const NOTE = "Week3 CTR metadata update shipped 2026-04-30";

const DONE_URLS = new Set([
  "https://aibusiness.vc/solo/ai-agent-maintenance-retainer-model",
  "https://aibusiness.vc/solo/ai-agent-services-12-offers-2026",
  "https://aibusiness.vc/solo/ai-chatbot-local-business",
  "https://aibusiness.vc/solo/ai-crm-migration-service-playbook-2026",
  "https://aibusiness.vc/solo/ai-first-website-service-48h",
  "https://aibusiness.vc/b2b/ai-cloud-capacity-crunch-enterprise-roi-2026",
  "https://aibusiness.vc/b2b/ai-crm-automation-roi-smb",
  "https://aibusiness.vc/b2b/ai-customer-support-2026",
  "https://aibusiness.vc/b2b/ai-executive-reporting-automation",
  "https://aibusiness.vc/b2b/ai-kills-real-estate-industry",
  "https://aibusiness.vc/vc/ai-rollup-strategy-2026",
  "https://aibusiness.vc/vc/ai-series-a-metrics-2026",
  "https://aibusiness.vc/vc/ai-startup-due-diligence-checklist-2026",
  "https://aibusiness.vc/vc/ai-term-sheet-guide-2026",
  "https://aibusiness.vc/vc/beyond-vc-ai-startup-funding-2026",
  "https://aibusiness.vc/government/ai-tax-benefits-administration-roi",
  "https://aibusiness.vc/government/government-ai-kpi-framework-2026",
  "https://aibusiness.vc/government/government-ai-risk-register-2026",
  "https://aibusiness.vc/government/public-ai-procurement-playbook-2026",
  "https://aibusiness.vc/government/sovereign-ai-national-stacks-2026",
]);

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  cells.push(current);
  return cells;
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function main() {
  if (!fs.existsSync(BOARD_PATH)) {
    throw new Error(`Missing board: ${BOARD_PATH}`);
  }

  const raw = fs.readFileSync(BOARD_PATH, "utf-8").trim();
  const lines = raw.split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error("Board CSV has no data rows.");
  }

  const header = parseCsvLine(lines[0]);
  const statusIdx = header.indexOf("status");
  const notesIdx = header.indexOf("notes");
  const urlIdx = header.indexOf("url");

  if (statusIdx === -1 || notesIdx === -1 || urlIdx === -1) {
    throw new Error("CSV must include url/status/notes columns.");
  }

  let updatedCount = 0;
  const outRows = [header];

  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const row = parseCsvLine(line);
    const url = row[urlIdx] ?? "";

    if (DONE_URLS.has(url)) {
      row[statusIdx] = "done";
      const existing = row[notesIdx] ?? "";
      row[notesIdx] = existing.includes(NOTE) ? existing : `${existing} | ${NOTE}`.replace(/^ \| /, "");
      updatedCount += 1;
    }

    outRows.push(row);
  }

  const serialized = outRows
    .map((row) => row.map((cell) => csvEscape(cell)).join(","))
    .join("\n");

  fs.writeFileSync(BOARD_PATH, `${serialized}\n`, "utf-8");

  console.log(`Marked ${updatedCount} URLs as done in ${path.relative(ROOT, BOARD_PATH)}.`);
}

main();
