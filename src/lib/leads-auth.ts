const SESSION_COOKIE_NAME = "leads_dash_session";
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours
const DEFAULT_LEADS_DASH_USER = "owner";

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return toHex(digest);
}

export function normalizeLeadsUser(value: string): string {
  return value.trim().toLowerCase();
}

export function getExpectedLeadsUser(): string {
  return normalizeLeadsUser(process.env.LEADS_DASH_USER ?? DEFAULT_LEADS_DASH_USER);
}

export function getExpectedLeadsPassword(): string | undefined {
  const value = process.env.LEADS_DASH_PASSWORD?.trim();
  return value ? value : undefined;
}

export async function buildLeadsSessionToken(username: string, password: string): Promise<string> {
  const normalizedUser = normalizeLeadsUser(username);
  return sha256(`leads-dashboard:${normalizedUser}:${password}`);
}

export { SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE_SECONDS, DEFAULT_LEADS_DASH_USER };
