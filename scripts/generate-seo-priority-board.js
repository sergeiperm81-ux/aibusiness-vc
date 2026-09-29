/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const ROOT = process.cwd();
const BASE_URL = "https://aibusiness.vc";
const CONTENT_DIR = path.join(ROOT, "src", "content");
const OUT_CSV = path.join(ROOT, "docs", "seo-priority-board.csv");
const OUT_MD = path.join(ROOT, "docs", "seo-priority-summary.md");

const SECTION_ORDER = [
  "solo",
  "startups",
  "b2b",
  "vc",
  "government",
  "learn",
  "materials",
];

const CORE_PAGES = [
  { url: `${BASE_URL}/`, section: "core", pageType: "hub", title: "Homepage" },
  { url: `${BASE_URL}/news`, section: "news", pageType: "hub", title: "Latest News" },
  { url: `${BASE_URL}/tools`, section: "tools", pageType: "hub", title: "Tools" },
  { url: `${BASE_URL}/tools/directory`, section: "tools", pageType: "hub", title: "Tools Directory" },
  { url: `${BASE_URL}/models`, section: "models", pageType: "hub", title: "Models" },
  { url: `${BASE_URL}/audit`, section: "core", pageType: "money", title: "AI Visibility Audit" },
  { url: `${BASE_URL}/materials/roi-calculator`, section: "materials", pageType: "money", title: "ROI Calculator" },
  { url: `${BASE_URL}/materials/tool-selector`, section: "materials", pageType: "money", title: "Tool Selector" },
  { url: `${BASE_URL}/materials/playbook-templates`, section: "materials", pageType: "money", title: "Playbook Templates" },
  ...SECTION_ORDER.map((section) => ({
    url: `${BASE_URL}/${section}`,
    section,
    pageType: "hub",
    title: `${section} hub`,
  })),
];

const METRIC_FIELDS = [
  "clicks_before_7d",
  "impressions_before_7d",
  "ctr_before",
  "position_before",
  "clicks_after_7d",
  "impressions_after_7d",
  "ctr_after",
  "position_after",
  "delta_clicks_pct",
  "delta_ctr_pct",
];

const MUTABLE_FIELDS = ["status", "notes", ...METRIC_FIELDS];

function safeDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

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

function readExistingBoardRows() {
  if (!fs.existsSync(OUT_CSV)) return new Map();

  const raw = fs.readFileSync(OUT_CSV, "utf-8").trim();
  if (!raw) return new Map();

  const lines = raw.split(/\r?\n/);
  if (lines.length < 2) return new Map();

  const header = parseCsvLine(lines[0]);
  const byUrl = new Map();

  lines.slice(1).forEach((line) => {
    if (!line.trim()) return;
    const cols = parseCsvLine(line);
    const row = {};

    header.forEach((key, index) => {
      row[key] = cols[index] ?? "";
    });

    if (row.url) {
      byUrl.set(row.url, row);
    }
  });

  return byUrl;
}

function withExistingMutableFields(defaultRow, existingRow) {
  if (!existingRow) return defaultRow;

  const merged = { ...defaultRow };
  for (const key of MUTABLE_FIELDS) {
    if (typeof existingRow[key] !== "undefined") {
      merged[key] = existingRow[key];
    }
  }

  return merged;
}

function getArticles() {
  const rows = [];

  for (const section of SECTION_ORDER) {
    const dir = path.join(CONTENT_DIR, section);
    if (!fs.existsSync(dir)) continue;

    const files = fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const fullPath = path.join(dir, file);
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data } = matter(raw);
        return {
          section,
          slug: file.replace(/\.md$/, ""),
          title: data.title ?? file.replace(/\.md$/, ""),
          description: data.description ?? "",
          date: safeDate(data.date),
          category: data.category ?? section,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    rows.push(...files);
  }

  return rows;
}

function buildBoardRows(articles, existingRowsByUrl) {
  const rows = [];

  for (const page of CORE_PAGES) {
    const baseRow = {
      priority_tier: "P0",
      section: page.section,
      page_type: page.pageType,
      title: page.title,
      url: page.url,
      date: "",
      target_intent: "commercial + informational",
      action: "Monitor rankings + improve CTR titles/meta monthly",
      owner: "SEO",
      status: "todo",
      notes: "Core page",
    };
    rows.push(withExistingMutableFields(baseRow, existingRowsByUrl.get(baseRow.url)));
  }

  const bySection = new Map();
  for (const article of articles) {
    if (!bySection.has(article.section)) bySection.set(article.section, []);
    bySection.get(article.section).push(article);
  }

  for (const section of SECTION_ORDER) {
    const sectionArticles = bySection.get(section) ?? [];
    sectionArticles.slice(0, 20).forEach((article, index) => {
      const isHot = index < 5;
      const baseRow = {
        priority_tier: isHot ? "P1" : "P2",
        section,
        page_type: "article",
        title: article.title,
        url: `${BASE_URL}/${section}/${article.slug}`,
        date: article.date,
        target_intent: "how-to + ROI + benchmark",
        action: isHot
          ? "Improve CTR + add 3 internal links + refresh facts"
          : "Refresh intro/metadata and add internal links",
        owner: "Editorial + SEO",
        status: "todo",
        notes: isHot ? "Top recency candidate" : "Section support page",
      };
      rows.push(withExistingMutableFields(baseRow, existingRowsByUrl.get(baseRow.url)));
    });
  }

  return rows;
}

function writeCsv(rows) {
  const header = [
    "priority_tier",
    "section",
    "page_type",
    "title",
    "url",
    "date",
    "target_intent",
    "action",
    "owner",
    "status",
    "notes",
    ...METRIC_FIELDS,
  ];

  const lines = [
    header.join(","),
    ...rows.map((row) =>
      header.map((key) => csvEscape(row[key] ?? "")).join(",")
    ),
  ];

  fs.writeFileSync(OUT_CSV, `${lines.join("\n")}\n`, "utf-8");
}

function writeSummary(rows, articles) {
  const sectionCounts = SECTION_ORDER.map((section) => {
    const total = articles.filter((a) => a.section === section).length;
    const tracked = rows.filter((r) => r.section === section && r.page_type === "article").length;
    return { section, total, tracked };
  });

  const summaryLines = [
    "# SEO Priority Summary",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## What this is",
    "- `seo-priority-board.csv` is the working URL backlog for weekly GSC operations.",
    "- P0: core hubs and money pages.",
    "- P1: freshest 5 pages in each section.",
    "- P2: additional recent support pages.",
    "",
    "## Section coverage",
    "",
    "| Section | Total articles | Tracked in board |",
    "|---|---:|---:|",
    ...sectionCounts.map((item) => `| ${item.section} | ${item.total} | ${item.tracked} |`),
    "",
    "## Weekly usage",
    "1. Open `seo-priority-board.csv` and sort by `priority_tier` then `status`.",
    "2. Fill `clicks_before_7d`, `impressions_before_7d`, `ctr_before`, `position_before` before edits.",
    "3. After 7 days, fill `clicks_after_7d`, `impressions_after_7d`, `ctr_after`, `position_after`, deltas.",
    "4. Update `status` and `notes` based on shipped changes and observed movement.",
    "5. Re-run this generator after major publishing waves.",
    "",
  ];

  fs.writeFileSync(OUT_MD, `${summaryLines.join("\n")}\n`, "utf-8");
}

function main() {
  if (!fs.existsSync(path.join(ROOT, "docs"))) {
    fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
  }

  const articles = getArticles();
  const existingRowsByUrl = readExistingBoardRows();
  const boardRows = buildBoardRows(articles, existingRowsByUrl);

  writeCsv(boardRows);
  writeSummary(boardRows, articles);

  console.log(`Generated ${path.relative(ROOT, OUT_CSV)} with ${boardRows.length} rows.`);
  console.log(`Generated ${path.relative(ROOT, OUT_MD)}.`);
}

main();
