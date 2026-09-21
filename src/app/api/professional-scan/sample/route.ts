import { NextResponse } from "next/server";
import type { AnswerCheck } from "@/lib/audit/answer-check";
import { redisKv } from "@/lib/audit/durable-kv";
import { reportPdfFor } from "@/lib/audit/professional-delivery";
import { loadOrder, synthesisKey } from "@/lib/audit/professional-order";
import type { PersonSynthesis } from "@/lib/audit/person-synthesis";
import { workerAuthorised } from "@/lib/audit/worker-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * The public sample of a delivered report: the report itself, marked as a
 * sample, without the appendices of raw answers. Rendered from the stored
 * answers and summary, so no model is called. Owner only; the owner decides
 * which of his own orders become the published samples.
 */
export async function GET(request: Request) {
  if (!workerAuthorised(request.headers.get("authorization"), process.env.PROFESSIONAL_SCAN_WORKER_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = new URL(request.url).searchParams.get("order") ?? "";
  if (!/^\d{1,20}:\d{1,20}$/.test(key)) return NextResponse.json({ error: "order must look like 123:456" }, { status: 400 });
  try {
    const order = await loadOrder(redisKv, key);
    const stored = await redisKv.get(synthesisKey(key));
    if (!order || !stored) return NextResponse.json({ error: "no delivered report for this order" }, { status: 404 });
    const { check, synthesis } = JSON.parse(stored) as { check: AnswerCheck; synthesis: PersonSynthesis };
    const pdf = await reportPdfFor({ order, check, synthesis }, true);
    return new NextResponse(Buffer.from(pdf), { headers: { "content-type": "application/pdf", "cache-control": "no-store" } });
  } catch (error) {
    console.error("[professional-scan/sample]", error);
    return NextResponse.json({ error: "sample failed" }, { status: 500 });
  }
}
