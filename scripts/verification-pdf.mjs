/**
 * Renders a Verified Test Purchase PDF from a registry-entry JSON file.
 *
 * This is the methodologist's tool, not a site route: a certificate is
 * produced once per published check, by hand, after the client says
 * "publish". It reuses the project's pdf-lib (no new dependencies); the QR
 * code is produced by the local Python `qrcode` package into a temporary PNG
 * that gets embedded.
 *
 * Usage:
 *   node scripts/verification-pdf.mjs path/to/entry.json out/VTP-0042.pdf
 *
 * The JSON matches a TestedEntry from src/data/tested-registry.ts, plus an
 * optional `"specimen": true` that stamps the document as a non-issued
 * sample. The QR resolves to https://aibusiness.vc/tested/<number> — the
 * canonical record; a badge or PDF pointing anywhere else is not ours.
 */

import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const [, , entryPath, outPath] = process.argv;
if (!entryPath || !outPath) {
  console.error("usage: node scripts/verification-pdf.mjs entry.json out.pdf");
  process.exit(1);
}

const entry = JSON.parse(readFileSync(entryPath, "utf-8"));
for (const field of ["number", "company", "service", "url", "checkDate", "items"]) {
  if (!entry[field]) throw new Error(`entry.${field} is missing`);
}
if (entry.items.length < 1 || entry.items.length > 20) {
  throw new Error(`a Verified Test Purchase carries between 1 and 20 items, got ${entry.items.length}`);
}

const recordUrl = `https://aibusiness.vc/tested/${entry.number}`;
const score = entry.items.filter((i) => i.status === "confirmed").length;

const checkDate = new Date(entry.checkDate);
const activeUntil = new Date(checkDate);
activeUntil.setDate(activeUntil.getDate() + 183);
const fmt = (d) =>
  d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

// ---------------------------------------------------------------- QR via Python
const qrPng = join(tmpdir(), `vtp-qr-${entry.number}.png`);
execFileSync("python", [
  "-c",
  [
    "import qrcode, sys",
    "qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=2, box_size=10)",
    `qr.add_data(${JSON.stringify(recordUrl)})`,
    "qr.make(fit=True)",
    `qr.make_image(fill_color='black', back_color='white').save(${JSON.stringify(qrPng)})`,
  ].join("\n"),
]);

// ---------------------------------------------------------------- layout
const A4 = [595, 842];
const MARGIN = 56;
const INK = rgb(0.09, 0.09, 0.11);
const MUTED = rgb(0.42, 0.42, 0.47);
const ACCENT = rgb(0.96, 0.62, 0.04);
const HAIRLINE = rgb(0.88, 0.88, 0.9);

const doc = await PDFDocument.create();
const page = doc.addPage(A4);
const regular = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);
const W = A4[0];
let y = A4[1] - MARGIN;

const text = (str, { x = MARGIN, size = 10, font = regular, color = INK } = {}) => {
  page.drawText(str, { x, y, size, font, color });
};
const wrap = (str, font, size, maxWidth) => {
  const words = str.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const c = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(c, size) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = c;
  }
  if (line) lines.push(line);
  return lines;
};

// Top band
page.drawRectangle({ x: 0, y: A4[1] - 8, width: W, height: 8, color: ACCENT });

y -= 8;
text("AI BUSINESS  ·  aibusiness.vc", { size: 9, font: bold, color: MUTED });
const rightLabel = entry.specimen ? "SPECIMEN — NOT ISSUED" : `Verification No. ${entry.number}`;
page.drawText(rightLabel, {
  x: W - MARGIN - bold.widthOfTextAtSize(rightLabel, 9),
  y,
  size: 9,
  font: bold,
  color: entry.specimen ? rgb(0.86, 0.15, 0.15) : MUTED,
});

y -= 44;
text("Verified Test Purchase", { size: 28, font: bold });
y -= 20;
text("An independent check of the service's own public promises", {
  size: 11,
  color: MUTED,
});

y -= 36;
text(entry.company, { size: 18, font: bold });
y -= 16;
for (const line of wrap(entry.service, regular, 11, W - MARGIN * 2 - 150)) {
  text(line, { size: 11, color: MUTED });
  y -= 14;
}
text(entry.url, { size: 10, color: MUTED });

// Score block, right-aligned
const scoreStr = `${score} / ${entry.items.length}`;
page.drawText(scoreStr, {
  x: W - MARGIN - bold.widthOfTextAtSize(scoreStr, 34),
  y: y + 30,
  size: 34,
  font: bold,
  color: ACCENT,
});
const sub = "checked public promises confirmed";
page.drawText(sub, {
  x: W - MARGIN - regular.widthOfTextAtSize(sub, 8),
  y: y + 18,
  size: 8,
  font: regular,
  color: MUTED,
});

y -= 18;
page.drawLine({
  start: { x: MARGIN, y },
  end: { x: W - MARGIN, y },
  thickness: 0.8,
  color: HAIRLINE,
});

y -= 22;
text(`Checked on ${fmt(checkDate)}.  Listed in the public registry in active status until ${fmt(activeUntil)}.`, {
  size: 9.5,
  color: MUTED,
});

// Items
y -= 30;
text("THE AGREED REQUIREMENTS", { size: 9, font: bold, color: MUTED });
y -= 18;
for (const item of entry.items) {
  const ok = item.status === "confirmed";
  const tag = ok ? "CONFIRMED" : "NOT CONFIRMED";
  const tagW = bold.widthOfTextAtSize(tag, 7.5) + 10;
  page.drawRectangle({
    x: MARGIN,
    y: y - 3,
    width: tagW,
    height: 13,
    color: ok ? ACCENT : rgb(0.55, 0.55, 0.58),
  });
  page.drawText(tag, { x: MARGIN + 5, y, size: 7.5, font: bold, color: ok ? INK : rgb(1, 1, 1) });
  const lines = wrap(item.subject, regular, 10, W - MARGIN * 2 - 110);
  let firstLine = true;
  for (const line of lines) {
    page.drawText(line, { x: MARGIN + 100, y, size: 10, font: regular, color: INK });
    if (!firstLine || lines.length === 1) {
      // spacing handled below
    }
    if (line !== lines[lines.length - 1]) y -= 13;
    firstLine = false;
  }
  y -= 21;
}

// QR + verification note
const qrBytes = readFileSync(qrPng);
const qrImage = await doc.embedPng(qrBytes);
const qrSize = 108;
const qrX = W - MARGIN - qrSize;
const qrY = 78;
page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });
page.drawText("Scan to verify", {
  x: qrX + (qrSize - regular.widthOfTextAtSize("Scan to verify", 8)) / 2,
  y: qrY - 12,
  size: 8,
  font: regular,
  color: MUTED,
});

const noteTop = qrY + qrSize - 6;
const noteLines = [
  ["This document is genuine only if the QR code resolves to:", regular],
  [recordUrl, bold],
  ["", regular],
  ["The check was announced: the company knew the items in advance and", regular],
  ["had time to prepare; it did not know when the purchase would", regular],
  ["happen, from which account, or by which scenario. Items were frozen", regular],
  ["before the start; findings are never edited. The company paid for the", regular],
  ["check to be carried out, not for its result.", regular],
  ["", regular],
  ["This is a private, independent test purchase. It is not an accredited", regular],
  ["conformity assessment. Scores of different services do not compare.", regular],
  ["", regular],
  ["Methodology: aibusiness.vc/library/ai-agent-test-purchase", regular],
  ["Methodologist: Sergei Ponomarev, PhD", bold],
];
let ny = noteTop;
for (const [line, font] of noteLines) {
  if (line) page.drawText(line, { x: MARGIN, y: ny, size: 8.5, font, color: MUTED });
  ny -= 11.5;
}

// Bottom band
page.drawRectangle({ x: 0, y: 0, width: W, height: 8, color: ACCENT });

const bytes = await doc.save();
writeFileSync(outPath, bytes);
rmSync(qrPng, { force: true });
console.log(`written: ${outPath} (${(bytes.length / 1024).toFixed(0)} KB), score ${score}/${entry.items.length}, QR -> ${recordUrl}`);
