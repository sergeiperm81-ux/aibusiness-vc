#!/usr/bin/env node
// Which section has gone longest without a new article?
//
// Reads the `date:` field from every markdown file in src/content/<section>/ and
// prints the sections ordered by staleness, so the daily writer always fills the
// emptiest shelf instead of piling more onto Tools.
//
// Usage:  node scripts/section-balance.mjs          (table for humans)
//         node scripts/section-balance.mjs --pick   (prints one section name)
//         node scripts/section-balance.mjs --json   (machine-readable)

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const CONTENT = "src/content";
// Partner stories land in startups/society on their own schedule, so those two
// sections are allowed to sit longer before the writer is steered back to them.
const SECTIONS = ["b2b", "government", "learn", "notes", "robots", "society", "solo", "startups", "tools", "vc"];

const today = new Date().toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 86400000);

const rows = SECTIONS.map((section) => {
  const dir = join(CONTENT, section);
  let newest = null;
  let count = 0;
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return { section, count: 0, newest: null, daysSince: 9999, error: "no directory" };
  }
  for (const file of files) {
    const path = join(dir, file);
    if (!statSync(path).isFile()) continue;
    const head = readFileSync(path, "utf8").slice(0, 2000);
    const match = head.match(/^date:\s*"?(\d{4}-\d{2}-\d{2})"?/m);
    if (!match) continue;
    count += 1;
    if (!newest || match[1] > newest) newest = match[1];
  }
  return { section, count, newest, daysSince: newest ? daysBetween(today, newest) : 9999 };
});

rows.sort((a, b) => b.daysSince - a.daysSince || a.count - b.count);

if (process.argv.includes("--pick")) {
  process.stdout.write(rows[0].section + "\n");
} else if (process.argv.includes("--json")) {
  process.stdout.write(JSON.stringify({ today, rows }, null, 2) + "\n");
} else {
  process.stdout.write(`Today: ${today}\n\n`);
  process.stdout.write("section      articles  newest        days since\n");
  process.stdout.write("-----------  --------  ------------  ----------\n");
  for (const r of rows) {
    process.stdout.write(
      `${r.section.padEnd(11)}  ${String(r.count).padStart(8)}  ${(r.newest ?? "never").padEnd(12)}  ${String(r.daysSince === 9999 ? "-" : r.daysSince).padStart(10)}\n`,
    );
  }
  process.stdout.write(`\nStalest section: ${rows[0].section}\n`);
}
