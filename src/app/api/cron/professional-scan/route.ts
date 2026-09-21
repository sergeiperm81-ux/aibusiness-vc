import { NextResponse } from "next/server";
import { productionDeps, WORKER_BUDGET_MS } from "@/lib/audit/professional-runtime";
import { drainQueue } from "@/lib/audit/professional-worker";
import { qstashSignatureValid } from "@/lib/audit/qstash-signature";
import { workerAuthorised } from "@/lib/audit/worker-auth";

export const runtime = "nodejs";
export const maxDuration = 300;

/** The address QStash is told to call; the signature must name it. */
const WORKER_URL = "https://aibusiness.vc/api/cron/professional-scan";

/**
 * Moves every paid order that is due. Called every five minutes by Upstash
 * QStash, which signs each call (qstash-signature.ts), and by page visits and
 * the payment webhook. The owner and the GitHub workflow may also call it
 * with PROFESSIONAL_SCAN_WORKER_SECRET, which opens this route and nothing
 * else. The daily Vercel backstop uses its own route.
 */
async function handle(request: Request): Promise<NextResponse> {
  const body = request.method === "POST" ? await request.text() : "";
  const byQstash = qstashSignatureValid({
    token: request.headers.get("upstash-signature"),
    keys: [process.env.QSTASH_CURRENT_SIGNING_KEY, process.env.QSTASH_NEXT_SIGNING_KEY],
    url: WORKER_URL,
    body,
  });
  if (!byQstash && !workerAuthorised(request.headers.get("authorization"), process.env.PROFESSIONAL_SCAN_WORKER_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const advanced = await drainQueue(productionDeps(), WORKER_BUDGET_MS);
    return NextResponse.json({ ok: true, advanced });
  } catch (error) {
    console.error("[cron/professional-scan]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
