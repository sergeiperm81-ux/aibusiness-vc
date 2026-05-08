interface AuditCheckoutOptions {
  plan: "standard" | "deep";
  auditId?: string;
  domain?: string;
  email?: string;
}

function cleanUrl(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function pickBaseCheckoutUrl(plan: "standard" | "deep"): string | null {
  if (plan === "deep") {
    return (
      cleanUrl(process.env.LEMONSQUEEZY_AUDIT_DEEP_CHECKOUT_URL) ??
      cleanUrl(process.env.LEMONSQUEEZY_AUDIT_CHECKOUT_URL)
    );
  }
  return (
    cleanUrl(process.env.LEMONSQUEEZY_AUDIT_STANDARD_CHECKOUT_URL) ??
    cleanUrl(process.env.LEMONSQUEEZY_AUDIT_CHECKOUT_URL)
  );
}

function normalizeEmail(value?: string): string | null {
  const email = value?.trim().toLowerCase();
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function getAuditCheckoutUrl(options: AuditCheckoutOptions): string | null {
  const baseUrl = pickBaseCheckoutUrl(options.plan);
  if (!baseUrl) return null;

  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return null;
  }

  const email = normalizeEmail(options.email);
  if (email) {
    url.searchParams.set("checkout[email]", email);
  }
  if (options.auditId) {
    url.searchParams.set("checkout[custom][audit_id]", options.auditId);
  }
  if (options.domain) {
    url.searchParams.set("checkout[custom][domain]", options.domain);
  }

  return url.toString();
}

