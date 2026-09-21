import { NextResponse, after } from "next/server";
import { parseCompanySite } from "@/lib/audit/company-site";
import { redisKv } from "@/lib/audit/durable-kv";
import { kickWorker } from "@/lib/audit/professional-kick";
import { runPreview } from "@/lib/audit/professional-preview";

export const runtime = "nodejs";
export const maxDuration = 90;

/** Same address rule as the person preview: the platform's header first, the nearest proxy's entry as the fallback. */
function clientAddress(headers: Headers): string {
  const platform = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim();
  if (platform) return platform;
  const chain = headers.get("x-forwarded-for")?.split(",").map((part) => part.trim()).filter(Boolean) ?? [];
  return chain[chain.length - 1] ?? "unknown";
}

/** The free step of AI Company Scan: one website in, which company AI thinks runs it out. */
export async function POST(request: Request) {
  let body: { site?: unknown };
  try {
    body = (await request.json()) as { site?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Send the website as JSON." }, { status: 400 });
  }
  const parsed = parseCompanySite(typeof body.site === "string" ? body.site : "");
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 422 });

  const result = await runPreview(
    redisKv,
    parsed.target,
    clientAddress(request.headers),
    process.env.PERPLEXITY_API_KEY?.trim(),
    new Date(),
    "company"
  );
  after(kickWorker);

  if (result.ok) return NextResponse.json({ ok: true, previewId: result.preview.id });
  const message =
    result.reason === "rate_limited"
      ? "You have used today's free checks. Please come back tomorrow."
      : "The check is not available right now. Please try again in a few minutes.";
  return NextResponse.json({ ok: false, error: message }, { status: result.reason === "rate_limited" ? 429 : 503 });
}
