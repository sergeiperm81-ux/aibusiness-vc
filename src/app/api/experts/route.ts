import { NextResponse } from "next/server";
import { sendBrevoEmail, upsertBrevoContact, isValidEmail, escapeHtml } from "@/lib/email/brevo";

export const runtime = "nodejs";
export const maxDuration = 15;

interface ExpertApplication {
  name?: string;
  email?: string;
  headline?: string;
  region?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  organisation?: string;
  role?: string;
  about?: string;
  services?: string;
  notes?: string;
  expertise?: string[];
  consent?: boolean;
  photo?: { name?: string; type?: string; data?: string };
}

/** Base64 of a 2 MB file is about 2.7 MB; anything larger is rejected before it reaches email. */
const MAX_PHOTO_BASE64 = 2_800_000;

const REQUIRED: (keyof ExpertApplication)[] = [
  "name",
  "headline",
  "region",
  "location",
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

    const photo = body.photo;
    const photoOk =
      photo &&
      typeof photo.data === "string" &&
      photo.data.length > 0 &&
      photo.data.length <= MAX_PHOTO_BASE64 &&
      typeof photo.type === "string" &&
      photo.type.startsWith("image/");
    if (!photoOk) {
      return NextResponse.json(
        { ok: false, error: "Please add a photo under 2 MB." },
        { status: 400 }
      );
    }
    const ext = (photo.type ?? "image/jpeg").split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
    const safeName = (body.name ?? "expert").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
          row("Location", body.location),
          row("Expertise", body.expertise),
          row("About", body.about),
          row("Services", body.services),
          row("LinkedIn", body.linkedin),
          row("Website", body.website),
          row("Notes", body.notes),
          `<p style="margin:0 0 8px"><strong>Photo:</strong> attached as ${escapeHtml(`${safeName}.${ext}`)}</p>`,
          `<p style="margin-top:12px;color:#666">Submitted ${escapeHtml(timestamp)}</p>`,
        ].join(""),
        text: `New expert application\n${body.name} <${email}>\n${body.headline}\n${body.region} / ${body.location}\nLinkedIn: ${body.linkedin}`,
        attachments: [{ name: `${safeName}.${ext}`, content: photo.data as string }],
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
