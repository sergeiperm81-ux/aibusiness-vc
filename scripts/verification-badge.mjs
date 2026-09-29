/**
 * Renders the badge a verified company puts on its own site.
 *
 * A round gold seal with the QR code at its centre: the QR is the whole point,
 * because a badge that leads nowhere is just a picture. Scanning it lands on
 * /tested/<number>, the canonical record. No score is shown — a company at
 * 17 of 20 should still be able to display it, and the detail lives one scan
 * away.
 *
 * Usage:
 *   node scripts/verification-badge.mjs 0001 2026-09-01 out/badge-0001.svg
 *
 * Output is a self-contained SVG (the QR is embedded as vector rectangles, so
 * it stays sharp at any size and needs no external file).
 */

import { writeFileSync, readFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [, , number, dateIso, outPath] = process.argv;
if (!number || !dateIso || !outPath) {
  console.error("usage: node scripts/verification-badge.mjs <number> <YYYY-MM-DD> <out.svg>");
  process.exit(1);
}

const recordUrl = `https://aibusiness.vc/tested/${number}`;
const date = new Date(dateIso).toLocaleDateString("en-US", {
  month: "short",
  year: "numeric",
});

// --- QR matrix from the local Python qrcode package, as plain 0/1 rows -------
const dump = join(tmpdir(), `badge-qr-${number}.txt`);
execFileSync("python", [
  "-c",
  [
    "import qrcode",
    "qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=0, box_size=1)",
    `qr.add_data(${JSON.stringify(recordUrl)})`,
    "qr.make(fit=True)",
    "m = qr.get_matrix()",
    `open(${JSON.stringify(dump)}, 'w').write('\\n'.join(''.join('1' if c else '0' for c in row) for row in m))`,
  ].join("\n"),
]);
const matrix = readFileSync(dump, "utf-8").trim().split("\n");
rmSync(dump, { force: true });

const SIZE = 420;
const C = SIZE / 2;
const qrModules = matrix.length;
const qrBox = 150;               // QR area, centred
const module = qrBox / qrModules;
const qrOrigin = C - qrBox / 2;

let cells = "";
matrix.forEach((row, y) => {
  [...row].forEach((bit, x) => {
    if (bit === "1") {
      cells += `<rect x="${(qrOrigin + x * module).toFixed(2)}" y="${(qrOrigin + y * module).toFixed(2)}" width="${module.toFixed(2)}" height="${module.toFixed(2)}"/>`;
    }
  });
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" role="img" aria-label="Tested by AI Business, verification number ${number}">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f7d774"/>
      <stop offset="35%" stop-color="#e8b027"/>
      <stop offset="65%" stop-color="#c98a10"/>
      <stop offset="100%" stop-color="#f2c94c"/>
    </linearGradient>
    <path id="arcTop" d="M 60 ${C} a ${C - 60} ${C - 60} 0 0 1 ${SIZE - 120} 0" fill="none"/>
    <path id="arcBottom" d="M 74 ${C} a ${C - 74} ${C - 74} 0 0 0 ${SIZE - 148} 0" fill="none"/>
  </defs>

  <!-- seal -->
  <circle cx="${C}" cy="${C}" r="${C - 4}" fill="url(#gold)"/>
  <circle cx="${C}" cy="${C}" r="${C - 4}" fill="none" stroke="#a9740a" stroke-width="2"/>
  <circle cx="${C}" cy="${C}" r="${C - 26}" fill="none" stroke="#8f6208" stroke-width="1.5" opacity="0.7"/>
  <circle cx="${C}" cy="${C}" r="${C - 34}" fill="none" stroke="#8f6208" stroke-width="0.8" opacity="0.45"/>

  <!-- curved lettering -->
  <text font-family="Helvetica, Arial, sans-serif" font-size="27" font-weight="700" fill="#4a3205" letter-spacing="3">
    <textPath href="#arcTop" startOffset="50%" text-anchor="middle">AI TESTED</textPath>
  </text>
  <text font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="700" fill="#4a3205" letter-spacing="2.5">
    <textPath href="#arcBottom" startOffset="50%" text-anchor="middle">AIBUSINESS.VC</textPath>
  </text>

  <!-- small stars flanking the lower text -->
  <circle cx="58" cy="${C + 4}" r="4" fill="#4a3205"/>
  <circle cx="${SIZE - 58}" cy="${C + 4}" r="4" fill="#4a3205"/>

  <!-- white plate holding the QR, so scanners get proper contrast -->
  <rect x="${C - qrBox / 2 - 12}" y="${C - qrBox / 2 - 12}" width="${qrBox + 24}" height="${qrBox + 24}" rx="10" fill="#ffffff"/>
  <g fill="#000000">${cells}</g>

  <!-- verification number and date -->
  <text x="${C}" y="${C + qrBox / 2 + 34}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="700" fill="#4a3205">No. ${number} &#183; ${date}</text>
</svg>
`;

writeFileSync(outPath, svg);
console.log(`written: ${outPath}, QR -> ${recordUrl}`);
