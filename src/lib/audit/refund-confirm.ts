/**
 * The owner's confirmation that a promised refund was made.
 *
 * The link in the reminder carries an HMAC of the order key, so only someone
 * with the email can confirm, and the change needs a button press: mail
 * scanners open links, and an open must not mark money as returned.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import type { DurableKv } from "./durable-kv";
import { finish, loadOrder, saveOrder } from "./professional-order";

export function refundSignature(key: string, secret: string): string {
  return createHmac("sha256", secret).update(`refund:${key}`).digest("hex").slice(0, 32);
}

export function refundSignatureValid(key: string, signature: string, secret: string): boolean {
  if (!secret || secret.length < 32 || !/^[a-f0-9]{32}$/.test(signature)) return false;
  const wanted = Buffer.from(refundSignature(key, secret));
  const given = Buffer.from(signature);
  return wanted.length === given.length && timingSafeEqual(wanted, given);
}

export type ConfirmResult = "confirmed" | "already" | "not_pending" | "unknown";

export async function confirmRefund(kv: DurableKv, key: string, now: Date = new Date()): Promise<ConfirmResult> {
  const order = await loadOrder(kv, key);
  if (!order) return "unknown";
  if (order.state === "refunded") return "already";
  if (order.state !== "refund_pending") return "not_pending";
  await saveOrder(kv, order, { state: "refunded" }, now);
  await finish(kv, key);
  return "confirmed";
}
