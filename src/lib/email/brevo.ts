import "server-only";

interface SendArgs {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/**
 * Sends a transactional email via Brevo (Sendinblue).
 * Returns { ok:false } (never throws) so callers can degrade gracefully.
 */
export async function sendBrevoEmail(args: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const from = process.env.LEADS_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return { ok: false, error: "email not configured (BREVO_API_KEY / LEADS_FROM_EMAIL)" };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { email: from, name: "AI Business" },
        to: [{ email: args.to, ...(args.toName ? { name: args.toName } : {}) }],
        ...(args.replyTo ? { replyTo: { email: args.replyTo } } : {}),
        subject: args.subject,
        htmlContent: args.html,
        textContent: args.text,
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `Brevo ${res.status}: ${(await res.text()).slice(0, 200)}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "send failed" };
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
