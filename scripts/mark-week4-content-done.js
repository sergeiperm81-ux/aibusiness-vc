/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BOARD_PATH = path.join(ROOT, "docs", "seo-priority-board.csv");
const NOTE = "Week4 content quality sprint shipped 2026-04-30";

const DONE_URLS = new Set([
  "https://aibusiness.vc/solo/ai-for-teachers-income",
  "https://aibusiness.vc/solo/ai-lead-qualification-service-business",
  "https://aibusiness.vc/startups/ai-wrapper-startups-2026",
  "https://aibusiness.vc/startups/mcp-servers-business-opportunity",
  "https://aibusiness.vc/b2b/ai-lead-response-automation-smb",
  "https://aibusiness.vc/b2b/ai-support-automation-playbook-smb",
  "https://aibusiness.vc/vc/ai-accelerators-ranked",
  "https://aibusiness.vc/vc/ai-angel-investing-guide",
  "https://aibusiness.vc/government/ai-data-centers-global",
  "https://aibusiness.vc/government/ai-in-space-nasa",
  "https://aibusiness.vc/learn/ai-operator-skill-stack-2026",
  "https://aibusiness.vc/learn/highest-paying-ai-jobs-2026",
  "https://aibusiness.vc/materials/50-ai-business-ideas-weekend",
  "https://aibusiness.vc/materials/ai-freelancer-rate-card",
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
