import { NextResponse } from "next/server";
import { PERSON_PROVIDER_IDS } from "@/lib/audit/answer-providers";
import { redisKv } from "@/lib/audit/durable-kv";
import { orderStatus } from "@/lib/audit/professional-status";
import { workerAuthorised } from "@/lib/audit/worker-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * An order's recorded state, for the owner: which model answered which
 * question and what the order cost. Takes the worker secret, like the worker
 * route, and returns no email and no answer text.
 */
export async function GET(request: Request) {
  if (!workerAuthorised(request.headers.get("authorization"), process.env.PROFESSIONAL_SCAN_WORKER_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = new URL(request.url).searchParams.get("order") ?? "";
  if (!/^\d{1,20}:\d{1,20}$/.test(key)) return NextResponse.json({ error: "order must look like 123:456" }, { status: 400 });
  try {
    const status = await orderStatus(redisKv, key, PERSON_PROVIDER_IDS);
    return status ? NextResponse.json(status) : NextResponse.json({ error: "no such order" }, { status: 404 });
  } catch (error) {
    console.error("[professional-scan/status]", error);
    return NextResponse.json({ error: "storage unavailable" }, { status: 503 });
  }
}
