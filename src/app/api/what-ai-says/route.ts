import { NextResponse } from "next/server";
import { sendBrevoEmail, upsertBrevoContact, isValidEmail, escapeHtml } from "@/lib/email/brevo";

export const runtime = "nodejs";
export const maxDuration = 15;

/**
 * Requests for the AI answer diagnostic.
 *
 * The form is deliberately not a URL box. Half the questions are about a product and a
 * category, and a domain alone cannot supply either: a site that sells three things
 * gives the models nothing to disambiguate, and the answers come back as mush. What
 * arrives here is a target, not a page.
 */
interface DiagnosticRequest {
  website?: string;
  company?: string;
  name?: string;
  leader?: string;
  product?: string;
  category?: string;
  market?: string;
  email?: string;
  notes?: string;
  consent?: boolean;
}

/**
 * Longest value accepted per field.
 *
 * A backstop against a pasted document, not an editorial rule. The form enforces the
 * real limits, shows a running count and refuses to send anything longer, so nothing a
 * person actually typed reaches this line. Over-limit is refused with a message; it is
 * never silently cut.
 */
const LIMITS: Record<string, number> = {
  website: 500,
  company: 200,
  name: 200,
  leader: 200,
  product: 300,
  category: 300,
  market: 200,
  email: 300,
  notes: 2000,
};

const REQUIRED = ["website", "company", "name", "product", "category", "market"] as const;

/** Only real web links: no javascript:, data: or mailto: smuggled into a request. */
function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DiagnosticRequest;
    const email = (body.email ?? "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }
    if (body.consent !== true) {
      return NextResponse.json(
        { ok: false, error: "Please confirm you want the result sent to you." },
        { status: 400 }
      );
    }
    for (const field of REQUIRED) {
      if (!String(body[field] ?? "").trim()) {
        return NextResponse.json(
          { ok: false, error: `Please fill in the ${field} field.` },
          { status: 400 }
        );
      }
    }
    for (const [field, max] of Object.entries(LIMITS)) {
      const value = String(body[field as keyof DiagnosticRequest] ?? "");
      if (value.length > max) {
        return NextResponse.json(
          { ok: false, error: `The ${field} field is too long.` },
          { status: 400 }
        );
      }
    }

    // Accepted with or without a scheme, because that is how people type a domain.
    const rawSite = String(body.website ?? "").trim();
    const website = /^https?:\/\//i.test(rawSite) ? rawSite : `https://${rawSite}`;
    if (!isHttpUrl(website)) {
      return NextResponse.json(
        { ok: false, error: "That does not look like a website address." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    // Logged in full before anything can fail, so a request stays recoverable from the
    // runtime log even if the notification never goes out.
    console.log(
      "[ai_diagnostic_request]",
      JSON.stringify({
        timestamp,
        email,
        website,
        company: body.company,
        name: body.name,
        leader: body.leader,
        product: body.product,
        category: body.category,
        market: body.market,
        notes: body.notes,
      })
    );

    {
      const contact = await upsertBrevoContact({
        email,
        attributes: {
          SIGNUP_SOURCE: "ai_diagnostic",
          FIRSTNAME: (body.name ?? "").split(" ")[0] ?? "",
          // Not CONSENT. The box on the form says these details are used for
          // this check and nothing else, so recording marketing consent here
          // would be claiming permission the person never gave. This flag
          // records what they did agree to: one reply, to this request.
          SERVICE_REQUEST: true,
          CONSENT: false,
        },
      });
      if (contact.error) console.error("[ai_diagnostic_contact]", contact.error);
    }

    const row = (label: string, value?: string) => {
      const text = (value ?? "").trim();
      if (!text) return "";
      return `<p style="margin:0 0 8px"><strong>${escapeHtml(label)}:</strong><br/>${escapeHtml(
        text
      ).replace(/\n/g, "<br/>")}</p>`;
    };

    const ownerTo = (process.env.EXPERTS_TO_EMAIL?.trim() || "info@aibusiness.vc").toLowerCase();

    const sent = await sendBrevoEmail({
      to: ownerTo,
      replyTo: email,
      subject: `[DIAGNOSTIC] ${body.company} — ${body.market}`,
      html: [
        `<p><strong>New diagnostic request</strong></p>`,
        row("Company", body.company),
        row("Website", website),
        row("Requested by", body.name),
        row("Email", email),
        row("Leader to verify", body.leader),
        row("Main product", body.product),
        row("Wants to be found for", body.category),
        row("Market and language", body.market),
        row("Notes", body.notes),
        `<p style="margin-top:12px;color:#666">Submitted ${escapeHtml(timestamp)}</p>`,
      ].join(""),
      text: `New diagnostic request\n${body.company} (${website})\n${body.name} <${email}>\nProduct: ${body.product}\nCategory: ${body.category}\nMarket: ${body.market}`,
    });

    if (!sent.ok) {
      // Never tell someone their request arrived when it did not.
      console.error("[ai_diagnostic_mail_failed]", sent.error);
      return NextResponse.json(
        {
          ok: false,
          error:
            "The request could not be sent. Please email info@aibusiness.vc directly and it will be picked up.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("[ai_diagnostic_error]", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
