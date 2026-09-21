/**
 * A small page writer over pdf-lib: headings, paragraphs, bullets, a banner, a
 * table, page numbers. It flows text down A4 pages and starts a new page when
 * the next block would not fit.
 *
 * Text is set in Noto Sans, embedded and subset to the characters used, so a
 * name in Cyrillic, with Polish or Turkish diacritics, or in Greek prints as
 * written. A character the font does not have (an emoji, a Chinese name) is
 * dropped rather than printed as an empty box. If the font files cannot be
 * read, the writer falls back to Helvetica and Latin-1, and says so in the log.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFString, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";

export const PAGE_WIDTH = 595;
export const PAGE_HEIGHT = 842;
export const MARGIN = 56;
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export const INK = rgb(0.09, 0.09, 0.11);
export const MUTED = rgb(0.42, 0.42, 0.47);
export const ACCENT = rgb(0.85, 0.47, 0.02);
export const HAIRLINE = rgb(0.88, 0.88, 0.9);
export const GREEN = rgb(0.02, 0.5, 0.31);
export const GREEN_TINT = rgb(0.91, 0.97, 0.93);
export const AMBER = rgb(0.72, 0.4, 0.02);
export const AMBER_TINT = rgb(0.99, 0.95, 0.87);
export const PANEL = rgb(0.95, 0.95, 0.965);
export const LINK = rgb(0.1, 0.33, 0.7);

/** Lives under public/ because on Vercel only files there are sure to reach the function. */
const FONT_DIR = path.join(process.cwd(), "public", "fonts", "pdf");

let fontFiles: Promise<{ regular: Uint8Array; bold: Uint8Array } | null> | null = null;

/** Read once per function instance. */
function loadFontFiles(): Promise<{ regular: Uint8Array; bold: Uint8Array } | null> {
  fontFiles ??= Promise.all([
    readFile(path.join(FONT_DIR, "NotoSans-Regular.ttf")),
    readFile(path.join(FONT_DIR, "NotoSans-Bold.ttf")),
  ])
    .then(([regular, bold]) => ({ regular, bold }))
    .catch((error: unknown) => {
      console.error("[pdf] Noto Sans could not be read, falling back to Helvetica", error);
      return null;
    });
  return fontFiles;
}

/** Keeps only what the font can draw, after tidying spaces and line breaks. */
export function toFontText(text: string, supported: ReadonlySet<number>): string {
  let out = "";
  for (const char of text.replace(/[\u00A0\u202F\t\r\n]/g, " ")) {
    const code = char.codePointAt(0) ?? 0;
    if (code >= 0x20 && supported.has(code)) out += char;
  }
  // A dropped emoji or ideograph must not leave a double space behind.
  return out.replace(/ {2,}/g, " ");
}

export function toWinAnsi(text: string): string {
  return text
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[  ]/g, " ")
    .replace(/[^\x20-\x7E¡-ÿ]/g, "");
}

/** Breaks a word that alone is wider than the line, which is what a long address is. */
function splitLongWord(word: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const parts: string[] = [];
  let part = "";
  for (const char of word) {
    if (font.widthOfTextAtSize(part + char, size) > maxWidth && part) {
      parts.push(part);
      part = char;
    } else {
      part += char;
    }
  }
  if (part) parts.push(part);
  return parts;
}

export function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => (font.widthOfTextAtSize(word, size) > maxWidth ? splitLongWord(word, font, size, maxWidth) : [word]));
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export interface TextOptions {
  readonly size?: number;
  readonly color?: RGB;
  readonly bold?: boolean;
  readonly indent?: number;
  readonly gapAfter?: number;
}

export class PdfWriter {
  private page: PDFPage;
  private y: number;

  private constructor(
    private readonly doc: PDFDocument,
    private readonly regular: PDFFont,
    private readonly bold: PDFFont,
    private readonly footer: string,
    private readonly header: { readonly left: string; readonly right: string },
    private readonly clean: (text: string) => string
  ) {
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  static async create(
    footer: string,
    title: string,
    header: { readonly left: string; readonly right: string }
  ): Promise<PdfWriter> {
    const doc = await PDFDocument.create();
    doc.setTitle(title);
    doc.setCreator("aibusiness.vc");
    const files = await loadFontFiles();
    if (files) {
      doc.registerFontkit(fontkit);
      const regular = await doc.embedFont(files.regular, { subset: true });
      const bold = await doc.embedFont(files.bold, { subset: true });
      const boldSet = new Set(bold.getCharacterSet());
      const supported = new Set(regular.getCharacterSet().filter((code) => boldSet.has(code)));
      return new PdfWriter(doc, regular, bold, footer, header, (text) => toFontText(text, supported));
    }
    return new PdfWriter(
      doc,
      await doc.embedFont(StandardFonts.Helvetica),
      await doc.embedFont(StandardFonts.HelveticaBold),
      footer,
      header,
      toWinAnsi
    );
  }

  newPage(): void {
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  private ensure(space: number): void {
    if (this.y - space < MARGIN + 20) this.newPage();
  }

  gap(amount: number): void {
    this.y -= amount;
  }

  text(value: string, options: TextOptions = {}): void {
    const size = options.size ?? 10.5;
    const indent = options.indent ?? 0;
    const font = options.bold ? this.bold : this.regular;
    for (const line of wrap(this.clean(value), font, size, CONTENT_WIDTH - indent)) {
      this.ensure(size + 5);
      this.page.drawText(line, { x: MARGIN + indent, y: this.y - size, size, font, color: options.color ?? INK });
      this.y -= size + 4.5;
    }
    this.y -= options.gapAfter ?? 0;
  }

  /** A clickable line: the reader sees the label, a click opens the address. Only http(s) addresses are linked. */
  link(label: string, address: string, options: TextOptions = {}): void {
    const size = options.size ?? 10.5;
    const indent = options.indent ?? 0;
    const font = options.bold ? this.bold : this.regular;
    const linkable = /^https?:\/\//i.test(address);
    for (const line of wrap(this.clean(label), font, size, CONTENT_WIDTH - indent)) {
      this.ensure(size + 5);
      const x = MARGIN + indent;
      const y = this.y - size;
      this.page.drawText(line, { x, y, size, font, color: options.color ?? LINK });
      if (linkable) {
        const annotation = this.doc.context.obj({
          Type: "Annot",
          Subtype: "Link",
          Rect: [x, y - 2, x + font.widthOfTextAtSize(line, size), y + size],
          Border: [0, 0, 0],
          A: { Type: "Action", S: "URI", URI: PDFString.of(address) },
        });
        this.page.node.addAnnot(this.doc.context.register(annotation));
      }
      this.y -= size + 4.5;
    }
    this.y -= options.gapAfter ?? 0;
  }

  title(value: string): void {
    this.text(value, { size: 24, bold: true, gapAfter: 4 });
  }

  heading(value: string): void {
    this.ensure(60);
    this.gap(10);
    this.text(value, { size: 15, bold: true, gapAfter: 4 });
  }

  kicker(value: string): void {
    this.ensure(40);
    this.text(value.toUpperCase(), { size: 8.5, bold: true, color: ACCENT, gapAfter: 2 });
  }

  muted(value: string, size = 9.5): void {
    this.text(value, { size, color: MUTED });
  }

  bullet(value: string, options: TextOptions = {}): void {
    const size = options.size ?? 10.5;
    this.ensure(size + 5);
    this.page.drawText("-", { x: MARGIN + 2, y: this.y - size, size, font: this.regular, color: options.color ?? MUTED });
    this.text(value, { ...options, indent: 14, gapAfter: options.gapAfter ?? 2 });
  }

  /** A labelled line: bold label, regular value, muted note underneath. */
  fact(label: string, value: string, note: string): void {
    this.ensure(34);
    this.text(label, { size: 9, bold: true, color: MUTED });
    this.text(value, { size: 10.5 });
    if (note) this.text(note, { size: 8.5, color: MUTED });
    this.gap(5);
  }

  rule(): void {
    this.ensure(14);
    this.page.drawLine({
      start: { x: MARGIN, y: this.y - 6 },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y - 6 },
      thickness: 0.6,
      color: HAIRLINE,
    });
    this.y -= 14;
  }

  /** A full-width tinted strip with a bold label on the left and a muted note on the right: the top of a card. */
  strip(label: string, note: string): void {
    this.ensure(70);
    const height = 22;
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: CONTENT_WIDTH, height, color: PANEL });
    this.page.drawText(this.clean(label), { x: MARGIN + 10, y: this.y - 15, size: 10.5, font: this.bold, color: INK });
    const right = this.clean(note);
    this.page.drawText(right, {
      x: PAGE_WIDTH - MARGIN - 10 - this.regular.widthOfTextAtSize(right, 8.5),
      y: this.y - 14.5,
      size: 8.5,
      font: this.regular,
      color: MUTED,
    });
    this.y -= height + 8;
  }

  /** A tinted box with one strong line and an optional line under it. */
  banner(headline: string, detail: string, ink: RGB, tint: RGB): void {
    const detailLines = detail ? wrap(this.clean(detail), this.regular, 10, CONTENT_WIDTH - 32) : [];
    const height = 22 + 20 + detailLines.length * 14.5 + (detailLines.length > 0 ? 4 : 0);
    this.ensure(height + 10);
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: CONTENT_WIDTH, height, color: tint });
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: 4, height, color: ink });
    this.page.drawText(this.clean(headline), { x: MARGIN + 16, y: this.y - 28, size: 15, font: this.bold, color: ink });
    let lineY = this.y - 48;
    for (const line of detailLines) {
      this.page.drawText(line, { x: MARGIN + 16, y: lineY, size: 10, font: this.regular, color: INK });
      lineY -= 14.5;
    }
    this.y -= height + 12;
  }

  /** A simple grid. The first column takes the width the others leave. */
  table(header: readonly string[], rows: readonly (readonly string[])[], firstColumnWidth: number): void {
    const others = header.length - 1;
    const width = others > 0 ? (CONTENT_WIDTH - firstColumnWidth) / others : 0;
    const x = (column: number): number => MARGIN + (column === 0 ? 0 : firstColumnWidth + (column - 1) * width);
    const drawRow = (cells: readonly string[], bold: boolean): void => {
      const size = 9;
      const font = bold ? this.bold : this.regular;
      const wrapped = cells.map((cell, i) => wrap(this.clean(cell), font, size, (i === 0 ? firstColumnWidth : width) - 8));
      const height = Math.max(...wrapped.map((lines) => lines.length)) * 12.5 + 8;
      this.ensure(height + 4);
      wrapped.forEach((lines, column) => {
        lines.forEach((line, i) => {
          this.page.drawText(line, { x: x(column), y: this.y - 12 - i * 12.5, size, font, color: bold ? MUTED : INK });
        });
      });
      this.y -= height;
      this.page.drawLine({
        start: { x: MARGIN, y: this.y },
        end: { x: PAGE_WIDTH - MARGIN, y: this.y },
        thickness: 0.5,
        color: HAIRLINE,
      });
    };
    drawRow(header, true);
    for (const row of rows) drawRow(row, false);
    this.y -= 8;
  }

  async bytes(): Promise<Uint8Array> {
    const pages = this.doc.getPages();
    pages.forEach((page, index) => {
      const top = PAGE_HEIGHT - 32;
      page.drawText(this.clean(this.header.left), { x: MARGIN, y: top, size: 8, font: this.bold, color: MUTED });
      const contact = this.clean(this.header.right);
      page.drawText(contact, {
        x: PAGE_WIDTH - MARGIN - this.regular.widthOfTextAtSize(contact, 8),
        y: top,
        size: 8,
        font: this.regular,
        color: MUTED,
      });
      page.drawText(this.clean(this.footer), { x: MARGIN, y: 30, size: 8, font: this.regular, color: MUTED });
      const label = `${index + 1} / ${pages.length}`;
      page.drawText(label, {
        x: PAGE_WIDTH - MARGIN - this.regular.widthOfTextAtSize(label, 8),
        y: 30,
        size: 8,
        font: this.regular,
        color: MUTED,
      });
    });
    return this.doc.save();
  }
}
