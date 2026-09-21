import { redisKv } from "@/lib/audit/durable-kv";
import { confirmRefund, refundSignatureValid } from "@/lib/audit/refund-confirm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET shows a button; POST confirms. Only the link from the owner's reminder,
 * signed with the worker secret, is accepted.
 */
function page(body: string, status = 200): Response {
  return new Response(
    `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Refund</title>` +
      `<body style="font-family:system-ui;max-width:560px;margin:60px auto;font-size:18px;line-height:1.5">${body}</body>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } }
  );
}

function valid(order: string, sig: string): boolean {
  return /^[0-9]+:[0-9]+$/.test(order) && refundSignatureValid(order, sig, process.env.PROFESSIONAL_SCAN_WORKER_SECRET?.trim() ?? "");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const order = url.searchParams.get("order") ?? "";
  const sig = url.searchParams.get("sig") ?? "";
  if (!valid(order, sig)) return page("<p>This link is not valid.</p>", 403);
  return page(
    `<h1>Order ${order.split(":")[0]}</h1><p>Have you refunded this order in Lemon Squeezy?</p>` +
      `<form method="post"><input type="hidden" name="order" value="${order}"><input type="hidden" name="sig" value="${sig}">` +
      `<button style="font-size:18px;padding:12px 24px;background:#f59e0b;border:0;border-radius:10px;font-weight:700">Yes, it is refunded</button></form>`
  );
}

export async function POST(request: Request) {
  const form = await request.formData();
  const order = String(form.get("order") ?? "");
  const sig = String(form.get("sig") ?? "");
  if (!valid(order, sig)) return page("<p>This link is not valid.</p>", 403);
  try {
    const result = await confirmRefund(redisKv, order);
    const text: Record<string, string> = {
      confirmed: "Recorded. The reminders stop.",
      already: "This refund was already recorded.",
      not_pending: "This order is not waiting for a refund.",
      unknown: "This order is no longer stored.",
    };
    return page(`<p>${text[result]}</p>`);
  } catch {
    return page("<p>Storage is unavailable. Try again in a few minutes.</p>", 503);
  }
}
