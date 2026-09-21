/**
 * What the payment webhook does with an AI Professional Scan order.
 *
 * It only stores the order and puts it on the queue. The report is made
 * afterwards, by the worker, from what was stored. If the order cannot be
 * stored, the webhook fails so Lemon Squeezy tries again: a paid order is
 * never accepted into memory that dies with the function.
 */

import type { DurableKv } from "./durable-kv";
import { loadPreview } from "./professional-preview";
import { createOrder } from "./professional-order";
import { checkoutAvailability, countPaidRun } from "./provider-health";

type Json = Record<string, unknown>;

/**
 * `ownerAlert` is set when a person has to look at the order. An order that
 * cannot be fixed by a retry is still answered 200, so Lemon Squeezy stops
 * sending it and the owner gets one letter, not one per retry.
 */
export type WebhookOutcome =
  | { readonly status: 200; readonly body: Json; readonly startWorker: boolean; readonly ownerAlert?: string }
  | { readonly status: 503; readonly body: Json; readonly startWorker: false; readonly ownerAlert?: undefined };

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : typeof value === "number" ? String(value) : null;
}

function email(value: unknown): string | null {
  const candidate = text(value)?.toLowerCase() ?? null;
  return candidate && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : null;
}

export async function handleProScanOrder(
  kv: DurableKv,
  input: { readonly data: Json; readonly attributes: Json; readonly customData: Json; readonly variantId: string },
  gate: { readonly providerIds: readonly string[]; readonly configured: (id: string) => boolean } = {
    providerIds: [],
    configured: () => true,
  }
): Promise<WebhookOutcome> {
  // order_created can arrive before the money has cleared; only a paid order is fulfilled.
  if (input.attributes.status !== "paid") {
    return { status: 200, body: { ok: true, ignored: true, reason: "not_paid_yet" }, startWorker: false };
  }
  const orderId = text(input.data.id) ?? text(input.attributes.order_number);
  const buyer = email(input.attributes.user_email) ?? email(input.attributes.customer_email);
  const previewId = text(input.customData.preview_id);
  if (!orderId || !buyer || !previewId) {
    return {
      status: 200,
      body: { ok: false, error: "Order is missing its id, email or preview" },
      startWorker: false,
      ownerAlert: `Order ${orderId ?? "?"} for ${buyer ?? "no email"} arrived without an id, an email or a preview. Refund or fulfil it by hand.`,
    };
  }

  try {
    const preview = await loadPreview(kv, previewId);
    if (!preview || !preview.found) {
      // Paid, but we no longer know who the report is about. The owner must see this.
      console.error(`[pscan/webhook] order ${orderId}: preview ${previewId} is missing`);
      return {
        status: 200,
        body: { ok: false, error: "Unknown preview" },
        startWorker: false,
        ownerAlert: `Order ${orderId} from ${buyer} was paid, but preview ${previewId} is not stored, so we do not know whom the report is about. Refund or ask the buyer for the link.`,
      };
    }
    const discountTotal = Number(input.attributes.discount_total ?? 0);
    const result = await createOrder(kv, {
      orderId,
      variantId: input.variantId,
      email: buyer,
      previewId,
      subject: {
        name: preview.name,
        role: preview.role,
        company: preview.company,
        location: preview.location,
        profileUrl: preview.profileUrl,
      },
      fullPrice: !(discountTotal > 0),
    });
    if (!result.created) return { status: 200, body: { ok: true, duplicate: true }, startWorker: true };
    // The checkout link can be reached without our gate, so the gate is read again here. The money is
    // taken either way: the order is kept, and the owner is told it came in while the shop was closed.
    const availability = await checkoutAvailability(kv, gate.providerIds, gate.configured);
    await countPaidRun(kv);
    return {
      status: 200,
      body: { ok: true, queued: true },
      startWorker: true,
      ownerAlert: availability.open
        ? undefined
        : `Order ${orderId} was paid while the checkout was closed (${availability.reason}). It is queued; watch it.`,
    };
  } catch (error) {
    console.error("[pscan/webhook] storage unavailable", error);
    return { status: 503, body: { ok: false, error: "Storage unavailable, retry" }, startWorker: false };
  }
}
