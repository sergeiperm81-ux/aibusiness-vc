/**
 * Meta Conversions API, server side: the Purchase event sent from the payment
 * webhook, so a sale is counted even when the buyer's browser blocked the
 * pixel. The email is hashed before it leaves the server, as Meta requires;
 * the order id is the event id, so a pixel copy of the same purchase, if one
 * ever fires, is deduplicated rather than counted twice.
 *
 * Off unless META_PIXEL_ID and META_CAPI_TOKEN are set. Never throws: an ads
 * measurement failure must not fail an order.
 */

import { createHash } from "node:crypto";

const GRAPH_VERSION = "v21.0";
const TIMEOUT_MS = 8_000;

export interface PurchaseEvent {
  readonly orderId: string;
  readonly email: string;
  readonly value: number;
  readonly currency: string;
  readonly contentName: string;
  readonly sourceUrl: string;
  readonly clientIp?: string | null;
  readonly userAgent?: string | null;
}

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function metaCapiConfigured(): boolean {
  return Boolean(process.env.META_PIXEL_ID?.trim() && process.env.META_CAPI_TOKEN?.trim());
}

/** Sends one Purchase. Resolves to true when Meta accepted it, false otherwise; logs the reason. */
export async function sendMetaPurchase(event: PurchaseEvent): Promise<boolean> {
  const pixelId = process.env.META_PIXEL_ID?.trim();
  const token = process.env.META_CAPI_TOKEN?.trim();
  if (!pixelId || !token) return false;

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `purchase-${event.orderId}`,
        event_source_url: event.sourceUrl,
        action_source: "website",
        user_data: {
          em: [sha256(event.email)],
          ...(event.clientIp ? { client_ip_address: event.clientIp } : {}),
          ...(event.userAgent ? { client_user_agent: event.userAgent } : {}),
        },
        custom_data: {
          value: event.value,
          currency: event.currency,
          content_name: event.contentName,
          order_id: event.orderId,
        },
      },
    ],
    ...(process.env.META_CAPI_TEST_CODE?.trim() ? { test_event_code: process.env.META_CAPI_TEST_CODE.trim() } : {}),
  };

  try {
    const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.ok) return true;
    console.error(`[meta-capi] Purchase ${event.orderId} rejected: ${response.status} ${(await response.text()).slice(0, 300)}`);
    return false;
  } catch (error) {
    console.error(`[meta-capi] Purchase ${event.orderId} not sent:`, error);
    return false;
  }
}
