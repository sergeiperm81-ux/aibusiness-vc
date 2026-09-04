import { NextResponse } from "next/server";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";
import { sendBrevoEmail, upsertBrevoContact, isValidEmail, escapeHtml } from "@/lib/email/brevo";
import { getGuide } from "@/app/library/guides";

export const runtime = "nodejs";
export const maxDuration = 15;

interface LibraryRequestBody {
  email?: string;
  consent?: boolean;
  slug?: string;
}

export async function POST(request: Request) {
  try {
    const limit = await checkRateLimit({
      scope: "library",
      key: clientIpFrom(request),
      limit: 8,
      windowSeconds: 3600,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } }
      );
    }

    const body = (await request.json()) as LibraryRequestBody;
    const email = (body.email ?? "").trim().toLowerCase();
    const consent = body.consent === true;
    const slug = (body.slug ?? "").trim();

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json(
        { ok: false, error: "Please tick the box so we can send you the guide." },
        { status: 400 }
      );
    }

    const guide = getGuide(slug);
    if (!guide) {
      return NextResponse.json({ ok: false, error: "Unknown guide." }, { status: 400 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
    const ip = forwardedFor.split(",")[0]?.trim() ?? "";
    const timestamp = new Date().toISOString();
    console.log("[library_lead]", JSON.stringify({ email, slug: guide.slug, timestamp, ip }));

    // Save the contact to Brevo — the same list as other leads, tagged as a library signup.
    const contact = await upsertBrevoContact({
      email,
      attributes: {
        SIGNUP_SOURCE: "library",
        GUIDE: guide.slug,
        CONSENT: true,
      },
    });
    if (contact.error) console.error("[library_contact]", contact.error);

    // Notify the owner.
    const ownerTo = (
      process.env.LEADS_TO_EMAIL?.trim() ||
      process.env.LEADS_DASH_USER?.trim() ||
      ""
    ).toLowerCase();
    if (ownerTo && isValidEmail(ownerTo) && ownerTo !== email) {
      await sendBrevoEmail({
        to: ownerTo,
        replyTo: email,
        subject: `[LIBRARY] ${email} — ${guide.title}`,
        html: `<p><strong>New library download</strong></p>
          <p>Email: ${escapeHtml(email)}<br/>Guide: ${escapeHtml(guide.title)}<br/>Time: ${escapeHtml(
            timestamp
          )}<br/>IP: ${escapeHtml(ip || "-")}</p>`,
        text: `New library download\nEmail: ${email}\nGuide: ${guide.title}\nTime: ${timestamp}\nIP: ${
          ip || "-"
        }`,
      });
    }

    return NextResponse.json({ ok: true, downloadUrl: guide.pdf });
  } catch (error) {
    console.error("[library_lead_error]", error);
    return NextResponse.json({ ok: false, error: "Something went wrong. Try again." }, { status: 500 });
  }
}
