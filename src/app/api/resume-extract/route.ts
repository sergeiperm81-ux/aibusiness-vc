import { NextResponse } from "next/server";
import { createRequire } from "module";

export const runtime = "nodejs";
export const maxDuration = 30;
const require = createRequire(import.meta.url);

function normalizeExtractedText(input: string): string {
  return input
    .replace(/\u0000/g, " ")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function getExt(name: string): string {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploaded = formData.get("file");

    if (!(uploaded instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
    }

    if (uploaded.size <= 0) {
      return NextResponse.json({ ok: false, error: "Empty file." }, { status: 400 });
    }

    if (uploaded.size > 12 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "File too large. Max 12MB." }, { status: 400 });
    }

    const filename = uploaded.name || "resume";
    const ext = getExt(filename);

    if (!["pdf", "docx", "txt", "md", "markdown"].includes(ext)) {
      return NextResponse.json(
        { ok: false, error: "Unsupported file. Use PDF, DOCX, TXT, or MD." },
        { status: 400 }
      );
    }

    let extracted = "";

    if (ext === "txt" || ext === "md" || ext === "markdown") {
      extracted = await uploaded.text();
    } else {
      const arrayBuffer = await uploaded.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (ext === "docx") {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        extracted = result.value ?? "";
      } else if (ext === "pdf") {
        // Import direct parser file to avoid pdf-parse debug entrypoint
        // that references test fixtures unavailable in serverless runtime.
        const pdfParseModule = require("pdf-parse/lib/pdf-parse.js") as
          | ((dataBuffer: Buffer) => Promise<{ text?: string }>)
          | { default?: (dataBuffer: Buffer) => Promise<{ text?: string }> };
        const pdfParse =
          typeof pdfParseModule === "function"
            ? pdfParseModule
            : pdfParseModule.default;
        if (!pdfParse) {
          throw new Error("PDF parser module is not available.");
        }
        const result = await pdfParse(buffer);
        extracted = result.text ?? "";
      }
    }

    const cleaned = normalizeExtractedText(extracted);

    if (cleaned.length < 80) {
      return NextResponse.json(
        {
          ok: false,
          error: "Could not extract enough readable text. Try another file or paste text directly.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      ok: true,
      text: cleaned,
      chars: cleaned.length,
    });
  } catch (error) {
    console.error("Resume extract error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to extract text from file." },
      { status: 500 }
    );
  }
}
