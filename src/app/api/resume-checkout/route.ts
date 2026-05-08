import { NextResponse } from "next/server";
import { getResumeCheckoutUrl } from "@/lib/resume/checkout";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const url = getResumeCheckoutUrl({ email: body.email });

    if (!url) {
      return NextResponse.json(
        { ok: false, error: "Checkout is not configured yet." },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, url });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to create checkout URL." }, { status: 500 });
  }
}
