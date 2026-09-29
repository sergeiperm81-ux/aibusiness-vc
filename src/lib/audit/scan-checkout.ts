/**
 * The payment page for a scan, made through the Lemon Squeezy API so that it
 * carries our own "payment received" page as the return address and the
 * preview id as custom data. The buy link is the fallback when the API is
 * down: it carries the preview id too, only the return goes to Lemon
 * Squeezy's own thank-you page.
 */

import type { ScanKind } from "./company-check";

export const ORDER_RECEIVED_PATH = "/scan-order-received";
const SITE = "https://aibusiness.vc";
const TIMEOUT_MS = 10_000;
/** A checkout page is good for this long; the preview it belongs to lives longer. */
const CHECKOUT_TTL_MS = 24 * 3600 * 1000;

export interface CheckoutConfig {
  readonly apiKey: string;
  readonly storeId: string;
  readonly variantId: string;
  /** The buy link for the same variant, used when the API does not answer. */
  readonly buyLink: string;
}

export function orderReceivedUrl(kind: ScanKind): string {
  return `${SITE}${ORDER_RECEIVED_PATH}?scan=${kind}`;
}

/** The buy link with the preview id attached: what a buyer gets when the API is down. */
export function buyLinkFor(config: CheckoutConfig, previewId: string): string | null {
  try {
    const url = new URL(config.buyLink);
    url.searchParams.set("checkout[custom][preview_id]", previewId);
    return url.toString();
  } catch {
    return null;
  }
}

export async function createScanCheckout(config: CheckoutConfig, previewId: string, kind: ScanKind): Promise<string | null> {
  const back = orderReceivedUrl(kind);
  try {
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: { custom: { preview_id: previewId } },
            product_options: {
              redirect_url: back,
              receipt_button_text: "Where is my report?",
              receipt_link_url: back,
              receipt_thank_you_note: "Your report is being made now and arrives by email, usually within 1 to 5 minutes.",
            },
            expires_at: new Date(Date.now() + CHECKOUT_TTL_MS).toISOString(),
          },
          relationships: {
            store: { data: { type: "stores", id: config.storeId } },
            variant: { data: { type: "variants", id: config.variantId } },
          },
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(`[scan-checkout] Lemon Squeezy ${response.status}: ${(await response.text()).slice(0, 200)}`);
      return buyLinkFor(config, previewId);
    }
    const payload = (await response.json()) as { data?: { attributes?: { url?: string } } };
    const url = payload.data?.attributes?.url;
    return typeof url === "string" && /^https:\/\//.test(url) ? url : buyLinkFor(config, previewId);
  } catch (error) {
    console.error("[scan-checkout] Lemon Squeezy unreachable", error);
    return buyLinkFor(config, previewId);
  }
}
