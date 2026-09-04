import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Retired endpoint.
 *
 * It used to email the complete report, every metric and every fix, for free.
 * Once the full report became the paid product this became a paywall bypass:
 * anyone who knew the URL could POST an audit id and receive for nothing what
 * the result page sells. The on-screen scan stays free; the full report is
 * delivered by the Lemon Squeezy webhook after purchase.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "The free email report has been discontinued. The full report is available on the scan result page.",
    },
    { status: 410 }
  );
}
