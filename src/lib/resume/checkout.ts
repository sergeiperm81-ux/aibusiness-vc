function cleanUrl(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeEmail(value?: string): string | null {
  const email = value?.trim().toLowerCase();
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function getResumeCheckoutUrl(options?: { email?: string }): string | null {
  const baseUrl = cleanUrl(process.env.LEMONSQUEEZY_RESUME_AUDIT_CHECKOUT_URL);
  if (!baseUrl) return null;

  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return null;
  }

  const email = normalizeEmail(options?.email);
  if (email) {
    url.searchParams.set("checkout[email]", email);
  }

  const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://aibusiness.vc"}/labs/resume-audit/success?order_id=[order_id]&email=[email]`;
  url.searchParams.set("checkout[custom][redirect_url]", successUrl);
  url.searchParams.set("checkout[custom][product]", "resume_audit");

  return url.toString();
}
