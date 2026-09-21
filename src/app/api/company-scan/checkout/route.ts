import { NextResponse } from "next/server";
import { PERSON_PROVIDER_IDS } from "@/lib/audit/answer-providers";
import { redisKv } from "@/lib/audit/durable-kv";
import { loadPreview } from "@/lib/audit/professional-preview";
import { providerConfigured } from "@/lib/audit/professional-runtime";
import { checkoutAvailability } from "@/lib/audit/provider-health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The only way to the payment page. It opens only when the preview found a
 * person and every paid part can run now, so nobody pays for a report that
 * cannot be made. Only the preview id travels to the checkout; who the
 * report is about is read back from our storage, not from the checkout.
 */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("preview") ?? "";
  const back = (reason: string) =>
    NextResponse.redirect(new URL(`/company-scan/r/${encodeURIComponent(id)}?unavailable=${reason}`, request.url), 303);

  let preview;
  try {
    preview = await loadPreview(redisKv, id);
  } catch {
    return back("storage_unavailable");
  }
  if (!preview || !preview.found || preview.kind !== "company") return NextResponse.redirect(new URL("/company-scan", request.url), 303);

  const gate = await checkoutAvailability(redisKv, PERSON_PROVIDER_IDS, providerConfigured);
  if (!gate.open) return back(gate.reason);

  const base = process.env.LEMONSQUEEZY_COMPANY_SCAN_CHECKOUT_URL?.trim();
  if (!base) return back("not_configured");
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return back("not_configured");
  }
  url.searchParams.set("checkout[custom][preview_id]", preview.id);
  return NextResponse.redirect(url, 303);
}
