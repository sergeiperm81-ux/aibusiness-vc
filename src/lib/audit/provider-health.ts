/**
 * Whether a paid scan can be sold right now.
 *
 * Only two of the five providers could tell us their balance, and none in a
 * form worth a request per page view. So availability is read from our own
 * traffic: a provider that just refused a request for money, quota or a bad
 * key is marked down for a while, and the checkout closes until it clears.
 * A plain rate limit is not a reason to close; it is retried.
 *
 * The same check closes the checkout when the day's paid runs are used up, and
 * when Redis cannot answer, because an order that cannot be stored must not be
 * sold.
 */

import type { DurableKv } from "./durable-kv";

export const PROVIDER_DOWN_SECONDS = 30 * 60;
/** Paid runs per UTC day. A cap on the day's spend, not a sales target. */
export const DAILY_PAID_RUN_LIMIT = 50;

const downKey = (providerId: string): string => `pscan:provider-down:${providerId}`;
const runsKey = (day: string): string => `pscan:runs:${day}`;

const MONEY_OR_KEY = /credit|quota|balance|billing|insufficient|payment|exhausted|api key|unauthori[sz]ed|forbidden|permission/i;

/** True for a refusal that retrying will not fix: no money, no quota, a bad key. */
export function isAccountProblem(error: string): boolean {
  if (/^HTTP (401|402|403)\b/.test(error)) return true;
  return /^HTTP (400|429)\b/.test(error) && MONEY_OR_KEY.test(error);
}

export async function markProviderDown(kv: DurableKv, providerId: string, reason: string): Promise<void> {
  await kv.set(downKey(providerId), reason.slice(0, 300), PROVIDER_DOWN_SECONDS);
}

export async function downProviders(kv: DurableKv, providerIds: readonly string[]): Promise<readonly string[]> {
  const values = await kv.mget(providerIds.map(downKey));
  return providerIds.filter((_, index) => values[index] !== null);
}

function utcDay(now: Date): string {
  return now.toISOString().slice(0, 10);
}

/** Counts one paid run against today. Returns the count after this one. */
export async function countPaidRun(kv: DurableKv, now: Date = new Date()): Promise<number> {
  return kv.incr(runsKey(utcDay(now)), 2 * 24 * 3600);
}

export type Availability =
  | { readonly open: true }
  | { readonly open: false; readonly reason: "provider_down" | "daily_limit" | "storage_unavailable" | "not_configured" };

export async function checkoutAvailability(
  kv: DurableKv,
  providerIds: readonly string[],
  configured: (providerId: string) => boolean,
  now: Date = new Date()
): Promise<Availability> {
  if (providerIds.some((id) => !configured(id))) return { open: false, reason: "not_configured" };
  try {
    if ((await downProviders(kv, providerIds)).length > 0) return { open: false, reason: "provider_down" };
    const runs = Number((await kv.get(runsKey(utcDay(now)))) ?? 0);
    if (runs >= DAILY_PAID_RUN_LIMIT) return { open: false, reason: "daily_limit" };
    return { open: true };
  } catch {
    return { open: false, reason: "storage_unavailable" };
  }
}
