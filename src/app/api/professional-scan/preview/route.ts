import { NextResponse, after } from "next/server";
import { redisKv } from "@/lib/audit/durable-kv";
import { runPreview } from "@/lib/audit/professional-preview";
import { kickWorker } from "@/lib/audit/professional-kick";
import { parseSocialProfile } from "@/lib/audit/social-profile";

export const runtime = "nodejs";
export const maxDuration = 90;

/**
 * The caller's address for the per-address limit. Vercel sets x-real-ip and
 * x-vercel-forwarded-for itself. The first entry of X-Forwarded-For is written
 * by the client and would give every request a fresh limit, so the last entry,
 * added by the nearest proxy, is the fallback.
 */
function clientAddress(headers: Headers): string {
  const platform = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim();
  if (platform) return platform;
  const chain = headers.get("x-forwarded-for")?.split(",").map((part) => part.trim()).filter(Boolean) ?? [];
  return chain[chain.length - 1] ?? "unknown";
}

/** The free step: one profile link in, who the AI thinks it is out. */
export async function POST(request: Request) {
  let body: { profile?: unknown };
  try {
    body = (await request.json()) as { profile?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Send the profile link as JSON." }, { status: 400 });
  }
  const parsed = parseSocialProfile(typeof body.profile === "string" ? body.profile : "");
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 422 });

  const ip = clientAddress(request.headers);
  const result = await runPreview(redisKv, parsed.profile, ip, process.env.PERPLEXITY_API_KEY?.trim());
  // A page visit is also a chance to move any paid order that is waiting.
  after(kickWorker);

  if (result.ok) return NextResponse.json({ ok: true, previewId: result.preview.id });
  const message =
    result.reason === "rate_limited"
      ? "You have used today's free checks. Please come back tomorrow."
      : "The check is not available right now. Please try again in a few minutes.";
  return NextResponse.json({ ok: false, error: message }, { status: result.reason === "rate_limited" ? 429 : 503 });
}
