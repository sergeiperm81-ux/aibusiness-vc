import { NextResponse } from "next/server";

export const runtime = "nodejs";

function parseOrderId(input: string | null): string | null {
  if (!input) return null;
  const normalized = input.trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(normalized)) return null;
  return normalized;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = parseOrderId(url.searchParams.get("order_id"));
  if (!orderId) {
    return NextResponse.json({ ok: false, error: "Missing order_id." }, { status: 400 });
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      verified: true,
      mode: "unverified_fallback",
      note: "LEMONSQUEEZY_API_KEY is not set. Skipping payment verification.",
    });
  }

  try {
    const response = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { ok: false, verified: false, error: `Lemon API ${response.status}: ${text}` },
        { status: 502 }
      );
    }

    const payload = (await response.json()) as {
      data?: { attributes?: Record<string, unknown> };
    };

    const attrs = payload.data?.attributes ?? {};
    const status = String(attrs.status ?? "").toLowerCase();
    const refunded = Boolean(attrs.refunded);
    const paid = (status === "paid" || status === "succeeded") && !refunded;

    return NextResponse.json({
      ok: true,
      verified: paid,
      status,
      refunded,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        verified: false,
        error: error instanceof Error ? error.message : "Verification failed.",
      },
      { status: 500 }
    );
  }
}
