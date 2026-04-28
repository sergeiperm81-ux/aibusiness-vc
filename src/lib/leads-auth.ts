const SESSION_COOKIE_NAME = "leads_dash_session";
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

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

export async function buildLeadsSessionToken(password: string): Promise<string> {
  return sha256(`leads-dashboard:${password}`);
}

export { SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE_SECONDS };
