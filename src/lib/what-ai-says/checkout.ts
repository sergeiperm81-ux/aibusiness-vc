/**
 * Checkout link for the AI answer diagnostic.
 *
 * One product, one price, no plans: everything larger than a single company and its
 * principal product is quoted by hand, so there is nothing here to branch on.
 *
 * The URL comes from the environment rather than the source, so the store can be
 * repointed or a price changed without a deploy. When it is missing the page shows the
 * form and no buy button, which is the right failure: a request that reaches the inbox
 * is recoverable, a checkout that 404s is not.
 */

interface CheckoutOptions {
  email?: string;
  company?: string;
}

function cleanUrl(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeEmail(value?: string): string | null {
  const email = value?.trim().toLowerCase();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

export function getDiagnosticCheckoutUrl(options: CheckoutOptions = {}): string | null {
  const baseUrl = cleanUrl(process.env.LEMONSQUEEZY_AI_DIAGNOSTIC_CHECKOUT_URL);
  if (!baseUrl) return null;

  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return null;
  }

  const email = normalizeEmail(options.email);
  if (email) url.searchParams.set("checkout[email]", email);

  // Carried through the payment so an order can be matched to the request that
  // preceded it. Buyer-supplied text, so it is capped rather than trusted.
  const company = options.company?.trim().slice(0, 120);
  if (company) url.searchParams.set("checkout[custom][company]", company);

  return url.toString();
}
