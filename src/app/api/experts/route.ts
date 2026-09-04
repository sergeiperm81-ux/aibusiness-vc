import { NextResponse } from "next/server";
import { sendBrevoEmail, upsertBrevoContact, isValidEmail, escapeHtml } from "@/lib/email/brevo";

export const runtime = "nodejs";
export const maxDuration = 15;

interface ExpertApplication {
  name?: string;
  email?: string;
  headline?: string;
  region?: string;
  country?: string;
  city?: string;
  languages?: string;
  linkedin?: string;
  website?: string;
  organisation?: string;
  role?: string;
  about?: string;
  services?: string;
  proof?: string;
  environment?: string;
  notes?: string;
  expertise?: string[];
  workTypes?: string[];
  consent?: boolean;
}

const REQUIRED: (keyof ExpertApplication)[] = [
  "name",
  "headline",
  "region",
  "country",
  "languages",
  "about",
  "services",
  "linkedin",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExpertApplication;
    const email = (body.email ?? "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }
    if (body.consent !== true) {
      return NextResponse.json(
        { ok: false, error: "Please confirm you agree to be listed." },
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
    if (!Array.isArray(body.expertise) || body.expertise.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Pick at least one area of expertise." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    console.log(
      "[expert_application]",
      JSON.stringify({ email, name: body.name, region: body.region, timestamp })
    );

    // The applicant goes on the same contact list, tagged so the register can be worked through.
    const contact = await upsertBrevoContact({
      email,
      attributes: {
        SIGNUP_SOURCE: "experts_register",
        FIRSTNAME: (body.name ?? "").split(" ")[0] ?? "",
        REGION: body.region ?? "",
        CONSENT: true,
      },
    });
    if (contact.error) console.error("[expert_contact]", contact.error);

    const row = (label: string, value?: string | string[]) => {
      const text = Array.isArray(value) ? value.join(", ") : (value ?? "");
      if (!text.trim()) return "";
      return `<p style="margin:0 0 8px"><strong>${escapeHtml(label)}:</strong><br/>${escapeHtml(
        text
      ).replace(/\n/g, "<br/>")}</p>`;
    };

    const ownerTo = (
      process.env.LEADS_TO_EMAIL?.trim() ||
      process.env.LEADS_DASH_USER?.trim() ||
      ""
    ).toLowerCase();

    if (ownerTo && isValidEmail(ownerTo)) {
      await sendBrevoEmail({
        to: ownerTo,
        replyTo: email,
        subject: `[EXPERTS] ${body.name} — ${body.region}`,
        html: [
          `<p><strong>New expert application</strong></p>`,
          row("Name", body.name),
          row("Email", email),
          row("Headline", body.headline),
          row("Role", body.role),
          row("Organisation", body.organisation),
          row("Region", body.region),
          row("Country", body.country),
          row("City", body.city),
          row("Languages", body.languages),
          row("Work environment", body.environment),
          row("Expertise", body.expertise),
          row("Work types", body.workTypes),
          row("About", body.about),
          row("Services", body.services),
          row("LinkedIn", body.linkedin),
          row("Website", body.website),
          row("Supporting links", body.proof),
          row("Notes", body.notes),
          `<p style="margin-top:12px;color:#666">Submitted ${escapeHtml(timestamp)}</p>`,
        ].join(""),
        text: `New expert application\n${body.name} <${email}>\n${body.headline}\n${body.region} / ${body.country}\nLinkedIn: ${body.linkedin}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[expert_application_error]", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
