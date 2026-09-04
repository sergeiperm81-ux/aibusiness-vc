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
  phone?: string;
  languages?: string;
  jurisdictions?: string;
  availability?: string;
  practiceAreas?: string[];
  frameworks?: string[];
  industries?: string[];
  workFormats?: string[];
  showEmail?: boolean;
  showPhone?: boolean;
  showLinkedin?: boolean;
  showWebsite?: boolean;
  consent?: boolean;
  newsletter?: boolean;
  photo?: { name?: string; type?: string; data?: string };
}

/** Longest value we accept per field. Anything past this is a paste, not a profile. */
const LIMITS: Record<string, number> = {
  name: 120,
  email: 200,
  headline: 120,
  region: 40,
  location: 120,
  linkedin: 300,
  website: 300,
  organisation: 160,
  role: 160,
  about: 1200,
  services: 1500,
  phone: 40,
  languages: 160,
  jurisdictions: 160,
  availability: 40,
};

const REQUIRED = [
  "name",
  "headline",
  "region",
  "location",
  "about",
  "linkedin",
  "languages",
] as const;

/** Base64 of a 2 MB file is about 2.7 MB. */
const MAX_PHOTO_BASE64 = 2_800_000;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_TAGS = 30;

/** Only real web links: no javascript:, data: or mailto: smuggled into a profile. */
function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function cleanTags(value: unknown, limit = MAX_TAGS): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, limit);
}

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
    for (const [field, max] of Object.entries(LIMITS)) {
      const value = String(body[field as keyof ExpertApplication] ?? "");
      if (value.length > max) {
        return NextResponse.json(
          { ok: false, error: `The ${field} field is too long.` },
          { status: 400 }
        );
      }
    }

    const linkedin = String(body.linkedin ?? "").trim();
    if (!isHttpUrl(linkedin)) {
      return NextResponse.json(
        { ok: false, error: "The LinkedIn address must be a full https link." },
        { status: 400 }
      );
    }
    const website = String(body.website ?? "").trim();
    if (website && !isHttpUrl(website)) {
      return NextResponse.json(
        { ok: false, error: "The website address must be a full https link." },
        { status: 400 }
      );
    }

    const practiceAreas = cleanTags(body.practiceAreas);
    if (practiceAreas.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Pick at least one practice area." },
        { status: 400 }
      );
    }
    const frameworks = cleanTags(body.frameworks);
    const industries = cleanTags(body.industries);
    const workFormats = cleanTags(body.workFormats);

    const photo = body.photo;
    const photoOk =
      photo &&
      typeof photo.data === "string" &&
      photo.data.length > 0 &&
      photo.data.length <= MAX_PHOTO_BASE64 &&
      typeof photo.type === "string" &&
      ALLOWED_IMAGE_TYPES.includes(photo.type);
    if (!photoOk) {
      return NextResponse.json(
        { ok: false, error: "Please add a JPEG, PNG or WebP photo under 2 MB." },
        { status: 400 }
      );
    }
    const ext = (photo.type ?? "image/jpeg").split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
    const safeName =
      String(body.name ?? "expert")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "expert";

    const timestamp = new Date().toISOString();

    // Logged in full before anything can fail, so an application stays recoverable
    // from the runtime log even if the notification never goes out.
    console.log(
      "[expert_application]",
      JSON.stringify({
        timestamp,
        email,
        name: body.name,
        headline: body.headline,
        region: body.region,
        location: body.location,
        role: body.role,
        organisation: body.organisation,
        practiceAreas,
        frameworks,
        industries,
        workFormats,
        languages: body.languages,
        jurisdictions: body.jurisdictions,
        availability: body.availability,
        about: body.about,
        services: body.services,
        linkedin,
        website,
        phone: body.phone,
        showEmail: body.showEmail === true,
        showPhone: body.showPhone === true,
        showLinkedin: body.showLinkedin === true,
        showWebsite: body.showWebsite === true,
        newsletter: body.newsletter === true,
      })
    );

    // Only people who asked for email go on the mailing list: consent to be
    // published is not consent to be marketed to.
    if (body.newsletter === true) {
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
    }

    const row = (label: string, value?: string | string[]) => {
      const text = Array.isArray(value) ? value.join(", ") : (value ?? "");
      if (!text.trim()) return "";
      return `<p style="margin:0 0 8px"><strong>${escapeHtml(label)}:</strong><br/>${escapeHtml(
        text
      ).replace(/\n/g, "<br/>")}</p>`;
    };

    // Applications belong in the editorial inbox, not the shared leads one.
    const ownerTo = (process.env.EXPERTS_TO_EMAIL?.trim() || "info@aibusiness.vc").toLowerCase();

    const sent = await sendBrevoEmail({
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
        row("Languages", body.languages),
        row("Jurisdictions", body.jurisdictions),
        row("Availability", body.availability),
        row("Practice areas", practiceAreas),
        row("Frameworks", frameworks),
        row("Industries", industries),
        row("Open to", workFormats),
        row("About", body.about),
        row("Services", body.services),
        row("LinkedIn", linkedin),
        row("Website", website),
        row("Phone", body.phone),
        row("Publish email?", body.showEmail ? "yes" : "no, admin only"),
        row("Publish phone?", body.phone ? (body.showPhone ? "yes" : "no") : ""),
        row("Publish LinkedIn?", body.showLinkedin ? "yes" : "no"),
        row("Publish website?", website ? (body.showWebsite ? "yes" : "no") : ""),
        row("Newsletter opt-in", body.newsletter ? "yes" : "no"),
        `<p style="margin:0 0 8px"><strong>Photo:</strong> attached as ${escapeHtml(
          `${safeName}.${ext}`
        )}</p>`,
        `<p style="margin-top:12px;color:#666">Submitted ${escapeHtml(timestamp)}</p>`,
      ].join(""),
      text: `New expert application\n${body.name} <${email}>\n${body.headline}\n${body.region} / ${body.location}\nLinkedIn: ${linkedin}`,
      attachments: [{ name: `${safeName}.${ext}`, content: photo.data as string }],
    });

    if (!sent.ok) {
      // Never tell someone their application arrived when it did not.
      console.error("[expert_application_mail_failed]", sent.error);
      return NextResponse.json(
        {
          ok: false,
          error:
            "We could not deliver your application just now. Please try again, or send it to info@aibusiness.vc.",
        },
        { status: 502 }
      );
    }

    console.log("[expert_application_mailed]", ownerTo);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[expert_application_error]", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
