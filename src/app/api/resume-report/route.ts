import { NextResponse } from "next/server";
import { buildResumeReportPdf } from "@/lib/resume-report";
import { incrWithTtl } from "@/lib/redis";

export const runtime = "nodejs";
export const maxDuration = 30;

interface ResumeReportRequest {
  orderId: string;
  targetRole: string;
  resumeText: string;
  email?: string;
}

function cleanOrderId(value: string): string | null {
  const v = value.trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(v)) return null;
  return v;
}

/**
 * How many reports a single paid order may generate.
 *
 * An order that is never spent is an unlimited licence: the identifier travels
 * in a URL, so anyone who sees one could regenerate reports forever. Buyers do
 * legitimately retry after a failed download, so a small allowance is kept.
 */
const MAX_REPORTS_PER_ORDER = 3;

/** How long an order's usage counter lives. Far beyond any legitimate retry. */
const ORDER_USAGE_TTL_SECONDS = 90 * 24 * 3600;

/** Per-instance fallback ledger for when Redis is unreachable. */
const orderUsage = new Map<string, { count: number; email: string | null }>();

/**
 * Counts one use of the order and reports whether the limit is exceeded.
 * Shared via Redis; falls back to the in-memory ledger without it.
 */
async function orderUseExceeded(orderId: string, buyerEmail: string | null): Promise<boolean> {
  const shared = await incrWithTtl(`order:use:${orderId}`, ORDER_USAGE_TTL_SECONDS);
  if (shared !== null) {
    return shared > MAX_REPORTS_PER_ORDER;
  }

  const used = orderUsage.get(orderId);
  if (used && used.count >= MAX_REPORTS_PER_ORDER) return true;
  orderUsage.set(orderId, {
    count: (used?.count ?? 0) + 1,
    email: buyerEmail ?? used?.email ?? null,
  });
  return false;
}

interface OrderCheck {
  readonly paid: boolean;
  readonly buyerEmail: string | null;
  readonly variantId: string | null;
  readonly productId: string | null;
  readonly reason?: string;
}

/**
 * Variants this endpoint will fulfil, from
 * `LEMONSQUEEZY_RESUME_VARIANT_IDS` (comma separated).
 *
 * Without it, any paid order in the whole Lemon Squeezy account unlocks a
 * resume report — a €5 purchase of a different product would do.
 */
function allowedVariantIds(): string[] {
  return (process.env.LEMONSQUEEZY_RESUME_VARIANT_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

async function verifyOrder(orderId: string): Promise<OrderCheck> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY?.trim();
  // Fail closed: without the key we cannot confirm the order was ever paid.
  if (!apiKey) {
    console.error("[resume-report] LEMONSQUEEZY_API_KEY is not set; refusing to fulfil order");
    return {
      paid: false,
      buyerEmail: null,
      variantId: null,
      productId: null,
      reason: "Payment verification is unavailable.",
    };
  }

  const response = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return { paid: false, buyerEmail: null, variantId: null, productId: null };

  const payload = (await response.json()) as {
    data?: { attributes?: Record<string, unknown> };
  };
  const attrs = payload.data?.attributes ?? {};
  const status = String(attrs.status ?? "").toLowerCase();
  const refunded = Boolean(attrs.refunded);
  const buyerEmail = String(attrs.user_email ?? "").trim().toLowerCase() || null;

  const firstItem = (attrs.first_order_item ?? {}) as Record<string, unknown>;
  const variantId = firstItem.variant_id != null ? String(firstItem.variant_id) : null;
  const productId = firstItem.product_id != null ? String(firstItem.product_id) : null;

  return {
    paid: (status === "paid" || status === "succeeded") && !refunded,
    buyerEmail,
    variantId,
    productId,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResumeReportRequest;
    const orderId = cleanOrderId(body.orderId ?? "");
    const targetRole = (body.targetRole ?? "").trim();
    const resumeText = (body.resumeText ?? "").trim();
    const email = (body.email ?? "").trim();

    if (!orderId) {
      return NextResponse.json({ ok: false, error: "Invalid order ID." }, { status: 400 });
    }
    if (!targetRole) {
      return NextResponse.json({ ok: false, error: "Missing target role." }, { status: 400 });
    }
    if (resumeText.length < 120) {
      return NextResponse.json({ ok: false, error: "Resume text is too short." }, { status: 400 });
    }

    const check = await verifyOrder(orderId);
    if (!check.paid) {
      return NextResponse.json(
        { ok: false, error: check.reason ?? "Payment verification failed." },
        { status: check.reason ? 503 : 402 }
      );
    }

    // The order must be for this product. Otherwise any paid order in the
    // account — of any product, at any price — unlocks a resume report.
    const allowed = allowedVariantIds();
    if (allowed.length === 0) {
      console.error(
        "[resume-report] LEMONSQUEEZY_RESUME_VARIANT_IDS is not set; refusing to fulfil"
      );
      return NextResponse.json(
        { ok: false, error: "Fulfilment is not configured." },
        { status: 503 }
      );
    }
    const matchesProduct =
      (check.variantId != null && allowed.includes(check.variantId)) ||
      (check.productId != null && allowed.includes(check.productId));
    if (!matchesProduct) {
      return NextResponse.json(
        { ok: false, error: "This order is not for the resume report." },
        { status: 403 }
      );
    }

    // Bind the order to the buyer Lemon Squeezy recorded. Both sides must be
    // present and equal: an absent address used to skip the check entirely,
    // which meant an order identifier alone was enough for anybody holding it.
    const requestEmail = email.toLowerCase();
    if (!requestEmail || !check.buyerEmail || requestEmail !== check.buyerEmail) {
      return NextResponse.json(
        {
          ok: false,
          error: "Enter the email address you used at checkout.",
        },
        { status: 403 }
      );
    }

    if (await orderUseExceeded(orderId, check.buyerEmail)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "This order has already been used. Reply to your receipt if you need the report again.",
        },
        { status: 429 }
      );
    }

    const report = await buildResumeReportPdf({
      orderId,
      targetRole,
      resumeText,
      email: email || undefined,
    });

    return new NextResponse(Buffer.from(report.bytes), {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${report.filename}"`,
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("resume_report_error", error);
    return NextResponse.json({ ok: false, error: "Failed to generate report." }, { status: 500 });
  }
}
