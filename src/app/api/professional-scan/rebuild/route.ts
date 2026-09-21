import { NextResponse } from "next/server";
import { redisKv } from "@/lib/audit/durable-kv";
import { loadPreview } from "@/lib/audit/professional-preview";
import { rebuildReport } from "@/lib/audit/professional-rebuild";
import { productionDeps } from "@/lib/audit/professional-runtime";
import { loadOrder } from "@/lib/audit/professional-order";
import { synthesisePersonCheck } from "@/lib/audit/person-synthesis";
import { workerAuthorised } from "@/lib/audit/worker-auth";

export const runtime = "nodejs";
export const maxDuration = 300;

/** The most one rebuild may cost. One summary call, no search, no retry. */
const REBUILD_CEILING_USD = 0.01;
/** Agreed with the owner: never more than this many output tokens for a rebuild. */
const REBUILD_OUTPUT_CAP = 2_500;

/**
 * Rebuilds a delivered report once from its stored answers and emails it
 * again. Owner only: it takes the worker secret, and POST only, so a link
 * that is opened by accident spends nothing.
 */
export async function POST(request: Request) {
  if (!workerAuthorised(request.headers.get("authorization"), process.env.PROFESSIONAL_SCAN_WORKER_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = new URL(request.url).searchParams.get("order") ?? "";
  if (!/^\d{1,20}:\d{1,20}$/.test(key)) return NextResponse.json({ error: "order must look like 123:456" }, { status: 400 });
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return NextResponse.json({ error: "the summary model is not configured" }, { status: 503 });

  try {
    // Orders taken before the city was stored get it from their preview, while it is kept.
    const order = await loadOrder(redisKv, key);
    const preview = order && !order.subject.location ? await loadPreview(redisKv, order.previewId) : null;
    const outcome = await rebuildReport(productionDeps(), key, {
      ceilingUsd: REBUILD_CEILING_USD,
      outputCap: REBUILD_OUTPUT_CAP,
      subjectExtras: preview?.location ? { location: preview.location } : {},
      synthesise: (check, maxOutputTokens) => synthesisePersonCheck({ check, apiKey, maxOutputTokens }),
    });
    if (!outcome.ok) return NextResponse.json({ ok: false, reason: outcome.reason, spentUsd: outcome.spentUsd }, { status: 409 });
    const answers = outcome.check.results.flatMap((row) => row.answers);
    return NextResponse.json({
      ok: true,
      spentUsd: outcome.spentUsd,
      ceilingUsd: outcome.ceilingUsd,
      maxOutputTokens: outcome.maxOutputTokens,
      sourcesKept: answers.reduce((n, a) => n + a.citations.length, 0),
      sourcesHeld: answers.reduce((n, a) => n + (a.heldCitations ?? 0), 0),
    });
  } catch (error) {
    console.error("[professional-scan/rebuild]", error);
    return NextResponse.json({ ok: false, error: "rebuild failed" }, { status: 500 });
  }
}
