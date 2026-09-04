import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const maxDuration = 10;

/**
 * Daily cron — triggers ISR revalidation for news pages.
 * Vercel Cron runs at 7:00 AM Sofia (4:00 UTC).
 * The actual RSS fetching happens inside getLatestNews() when pages render.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Fail closed: an unset secret used to leave this open to everyone, letting
  // anyone trigger revalidation in a loop.
  if (!cronSecret) {
    console.error("[cron/news] CRON_SECRET is not set; refusing to run");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Revalidate news pages so they re-fetch RSS on next visit
  revalidatePath("/news");
  revalidatePath("/");

  return NextResponse.json({
    message: "News pages revalidated",
    timestamp: new Date().toISOString(),
  });
}
