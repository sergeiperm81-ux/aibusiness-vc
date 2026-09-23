/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BOARD_PATH = path.join(ROOT, "docs", "seo-priority-board.csv");
const OUT_PATH = path.join(ROOT, "docs", "week4-content-queue.md");

const SECTION_ORDER = [
  "solo",
  "startups",
  "b2b",
  "vc",
  "government",
  "learn",
  "materials",
];

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

function readBoardRows() {
  if (!fs.existsSync(BOARD_PATH)) {
    throw new Error(`Missing board: ${BOARD_PATH}`);
  }

  const raw = fs.readFileSync(BOARD_PATH, "utf-8").trim();
  const lines = raw.split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0]);

  return lines.slice(1).filter(Boolean).map((line) => {
    const cols = parseCsvLine(line);
    const row = {};
    header.forEach((key, idx) => {
      row[key] = cols[idx] ?? "";
    });
    return row;
  });
}

function rowRank(row) {
  if (row.priority_tier === "P1") return 1;
  if (row.priority_tier === "P2") return 2;
  return 9;
}

function main() {
  const rows = readBoardRows();

  const candidates = rows
    .filter((row) => row.page_type === "article")
    .filter((row) => row.status !== "done")
    .filter((row) => row.priority_tier === "P1" || row.priority_tier === "P2");

  const lines = [
    "# Week 4 Content Quality Queue",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Use this queue for content quality sprint work (depth, internal links, evidence, monetization clarity).",
    "",
  ];

  SECTION_ORDER.forEach((section) => {
    const sectionRows = candidates
      .filter((row) => row.section === section)
      .sort((a, b) => rowRank(a) - rowRank(b));

    const picked = sectionRows.slice(0, 2);
    if (!picked.length) return;

    lines.push(`## ${section}`);
    lines.push("");
    lines.push("| Priority | URL | Focus this sprint |");
    lines.push("|---|---|---|");

    picked.forEach((row) => {
      lines.push(
        `| ${row.priority_tier} | ${row.url} | Rewrite intro for stronger hook, add 3 internal links, tighten monetization clarity with concrete numbers. |`
      );
    });

    lines.push("");
  });

  lines.push("## Editing standard");
  lines.push("- Human prose first: mostly paragraphs, bullets only when they add clarity.");
  lines.push("- Add at least 2 concrete numbers/sources to each updated article.");
  lines.push("- Add links to 2 sibling articles + 1 section hub.");
  lines.push("- Ensure title and meta match actual intent and promise.");
  lines.push("");

  fs.writeFileSync(OUT_PATH, `${lines.join("\n")}\n`, "utf-8");
  console.log(`Generated ${path.relative(ROOT, OUT_PATH)}.`);
}

main();
