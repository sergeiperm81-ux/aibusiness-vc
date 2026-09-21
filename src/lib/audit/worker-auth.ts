/**
 * Checks "Authorization: Bearer <secret>" in constant time. An unset or short
 * secret authorises nothing, so a missing variable closes the route rather
 * than opening it.
 */

import { timingSafeEqual } from "node:crypto";

const MIN_SECRET_LENGTH = 32;

export function workerAuthorised(header: string | null, secret: string | undefined): boolean {
  const expected = secret?.trim() ?? "";
  if (expected.length < MIN_SECRET_LENGTH || !header) return false;
  const given = Buffer.from(header);
  const wanted = Buffer.from(`Bearer ${expected}`);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}
