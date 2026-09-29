import { NextResponse } from "next/server";
import { productionDeps, WORKER_BUDGET_MS } from "@/lib/audit/professional-runtime";
import { drainQueue } from "@/lib/audit/professional-worker";
import { workerAuthorised } from "@/lib/audit/worker-auth";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * The once-a-day backstop, called by Vercel Cron, which can only send
 * CRON_SECRET. Same work as /api/cron/professional-scan; a separate route so
 * that each secret opens exactly one door.
 */
export async function GET(request: Request) {
  if (!workerAuthorised(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const advanced = await drainQueue(productionDeps(), WORKER_BUDGET_MS);
    return NextResponse.json({ ok: true, advanced });
  } catch (error) {
    console.error("[cron/professional-scan-daily]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
