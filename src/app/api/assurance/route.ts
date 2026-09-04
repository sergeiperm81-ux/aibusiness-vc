import { NextResponse } from "next/server";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 10;

/**
 * Intake for Consumer AI Assurance enquiries.
 *
 * Two doors, one mailbox: an owner whose bot is already live sends its link, an
 * owner still building sends the service they are about to automate. Both land
 * as a plain notification — there is no CRM here, and inventing one would only
 * add a place for enquiries to get lost.
 */

type Track = "existing" | "building";

interface AssuranceRequest {
  track?: string;
  name?: string;
  email?: string;
  link?: string;
  details?: string;
  /** Honeypot: a real person never fills this in. */
  company?: string;
}

const TRACK_LABEL: Record<Track, string> = {
  existing: "HAS A LIVE BOT — wants a test purchase",
  building: "STILL BUILDING — wants requirements first",
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function asTrack(value: string | undefined): Track | null {
  return value === "existing" || value === "building" ? value : null;
}

/**
 * Enquiries from this form are prospective clients, not newsletter leads, so
 * they get their own mailbox rather than inheriting the older lead pipeline.
 */
function resolveRecipient(): string | null {
  const candidates = [
    process.env.ASSURANCE_TO_EMAIL,
    process.env.LEADS_TO_EMAIL,
    process.env.AUDIT_OWNER_EMAIL,
  ];

  for (const candidate of candidates) {
    const email = candidate?.trim().toLowerCase();
    if (email && isValidEmail(email)) return email;
  }
  return null;
}

async function notify(payload: {
  track: Track;
  name: string;
  email: string;
  link: string;
  details: string;
  ip: string;
}): Promise<{ delivered: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.LEADS_FROM_EMAIL?.trim().toLowerCase();
  const toEmail = resolveRecipient();

  if (!apiKey || !fromEmail || !toEmail) {
    return { delivered: false, error: "Mail delivery is not configured." };
  }

  const rows: [string, string][] = [
    ["Track", TRACK_LABEL[payload.track]],
    ["Name", payload.name],
    ["Email", payload.email],
    [payload.track === "existing" ? "Bot link" : "Website", payload.link],
    ["Details", payload.details],
  ];

  const htmlContent = `
    <h2>New Consumer AI Assurance enquiry</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="vertical-align:top"><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`
        )
        .join("")}
    </table>
    <p style="color:#888;font-size:12px">Submitted from ${escapeHtml(payload.ip)}</p>
  `;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { email: fromEmail, name: "AI Business" },
      to: [{ email: toEmail }],
      replyTo: { email: payload.email, name: payload.name || payload.email },
      subject: `AI Assurance enquiry — ${payload.track === "existing" ? "live bot" : "building"} — ${payload.name || payload.email}`,
      htmlContent,
      textContent: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    }),
  });

  if (!response.ok) {
    return { delivered: false, error: `Brevo ${response.status}` };
  }
  return { delivered: true };
}

export async function POST(request: Request) {
  try {
    const limit = await checkRateLimit({
      scope: "assurance",
      key: clientIpFrom(request),
      limit: 5,
      windowSeconds: 3600,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } }
      );
    }

    const body = (await request.json()) as AssuranceRequest;

    // Honeypot: silently accept so a bot learns nothing from the response.
    if ((body.company ?? "").trim()) {
      return NextResponse.json({ ok: true });
    }

    const track = asTrack(body.track);
    const name = (body.name ?? "").trim().slice(0, 120);
    const email = (body.email ?? "").trim().toLowerCase().slice(0, 200);
    const link = (body.link ?? "").trim().slice(0, 500);
    const details = (body.details ?? "").trim().slice(0, 4000);

    if (!track) {
      return NextResponse.json({ ok: false, error: "Pick which one applies to you." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
    }
    if (details.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Tell me a little about the service — one or two sentences is enough." },
        { status: 400 }
      );
    }

    const result = await notify({
      track,
      name,
      email,
      link,
      details,
      ip: clientIpFrom(request),
    });

    if (!result.delivered) {
      console.error("[assurance] delivery failed:", result.error);
      return NextResponse.json(
        { ok: false, error: "Could not send that right now. Please try again, or use the address in the site footer." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[assurance] unexpected error:", error);
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
