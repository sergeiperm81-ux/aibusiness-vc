import { NextResponse } from "next/server";
import type { AnswerCheck } from "@/lib/audit/answer-check";
import { redisKv } from "@/lib/audit/durable-kv";
import type { PersonSynthesis } from "@/lib/audit/person-synthesis";
import { loadOrder, synthesisKey } from "@/lib/audit/professional-order";
import { productionDeps } from "@/lib/audit/professional-runtime";
import { workerAuthorised } from "@/lib/audit/worker-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

/** One resend per order per this many seconds, so a double click sends one letter. */
const RESEND_GAP_SECONDS = 600;

/**
 * Renders a delivered report again from its stored answers and summary and
 * emails it. No model is called, so it costs nothing: it is how a fix to the
 * PDF reaches a buyer who already has the report. Owner only, POST only.
 */
export async function POST(request: Request) {
  if (!workerAuthorised(request.headers.get("authorization"), process.env.PROFESSIONAL_SCAN_WORKER_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = new URL(request.url).searchParams.get("order") ?? "";
  if (!/^\d{1,20}:\d{1,20}$/.test(key)) return NextResponse.json({ error: "order must look like 123:456" }, { status: 400 });
  try {
    const order = await loadOrder(redisKv, key);
    const stored = await redisKv.get(synthesisKey(key));
    if (!order || !stored) return NextResponse.json({ error: "no delivered report for this order" }, { status: 404 });
    const fresh = await redisKv.set(`pscan:order:${key}:resent`, new Date().toISOString(), RESEND_GAP_SECONDS, true);
    if (!fresh) return NextResponse.json({ error: "sent a moment ago; wait ten minutes" }, { status: 429 });
    const { check, synthesis } = JSON.parse(stored) as { check: AnswerCheck; synthesis: PersonSynthesis };
    await productionDeps().sendReport({ order, check, synthesis });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[professional-scan/resend]", error);
    return NextResponse.json({ ok: false, error: "resend failed" }, { status: 500 });
  }
}
