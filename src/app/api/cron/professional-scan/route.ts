import { NextResponse } from "next/server";
import { productionDeps, WORKER_BUDGET_MS } from "@/lib/audit/professional-runtime";
import { drainQueue } from "@/lib/audit/professional-worker";
import { workerAuthorised } from "@/lib/audit/worker-auth";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Moves every paid order that is due. Called every few minutes by the GitHub
 * Actions schedule (.github/workflows/professional-scan-worker.yml) and by
 * page visits. It takes only PROFESSIONAL_SCAN_WORKER_SECRET, which exists
 * for this route alone, so the secret kept in GitHub opens nothing else. The
 * daily Vercel backstop uses its own route, /api/cron/professional-scan-daily.
 */
export async function GET(request: Request) {
  if (!workerAuthorised(request.headers.get("authorization"), process.env.PROFESSIONAL_SCAN_WORKER_SECRET)) {
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
