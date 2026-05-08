import { NextResponse } from "next/server";
import { buildResumeReportPdf } from "@/lib/resume-report";

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

async function verifyOrder(orderId: string): Promise<boolean> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY?.trim();
  if (!apiKey) return true;

  const response = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return false;

  const payload = (await response.json()) as {
    data?: { attributes?: Record<string, unknown> };
  };
  const attrs = payload.data?.attributes ?? {};
  const status = String(attrs.status ?? "").toLowerCase();
  const refunded = Boolean(attrs.refunded);
  return (status === "paid" || status === "succeeded") && !refunded;
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

    const paid = await verifyOrder(orderId);
    if (!paid) {
      return NextResponse.json({ ok: false, error: "Payment verification failed." }, { status: 402 });
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
