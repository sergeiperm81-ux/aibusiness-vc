/**
 * A best-effort extra wake-up from a page visit: one call from a page to the
 * cron route, never a function calling itself. The scheduler does not depend
 * on it.
 *
 * A lock in Redis lets one kick through every two minutes; the rest are
 * dropped. A kick that fails changes nothing: the order stays due, and the
 * next kick or the daily cron picks it up.
 */

import { claimOnce } from "@/lib/redis";

const KICK_LOCK_SECONDS = 120;

function siteOrigin(): string | null {
  const explicit = process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  return vercel ? `https://${vercel}` : null;
}

export async function kickWorker(): Promise<void> {
  const secret = process.env.PROFESSIONAL_SCAN_WORKER_SECRET;
  const origin = siteOrigin();
  if (!secret || !origin) return;
  if ((await claimOnce("pscan:kick-lock", KICK_LOCK_SECONDS)) !== "claimed") return;
  try {
    // Only the start of the run is awaited; the run itself lives in its own function.
    await fetch(`${origin}/api/cron/professional-scan`, {
      headers: { authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(3_000),
    });
  } catch {
    // Expected: the request is cut off after 3 seconds while the run goes on.
  }
}
