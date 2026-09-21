/**
 * The one place a paid API is called over HTTP.
 *
 * Returns enough to journal the attempt: the HTTP status, the provider's
 * request id for matching against its billing records, and which of the ways
 * the attempt ended. A timeout is told apart from other network failures
 * because a request cut off by our own timer may still have been processed,
 * and billed, on the provider's side.
 *
 * It never throws. Every failure comes back as a value, so the caller can
 * always journal the attempt.
 */

export type FailedOutcome = "http_error" | "timeout" | "network_error";

export type PostResult =
  | {
      readonly ok: true;
      readonly json: unknown;
      readonly status: number;
      readonly requestId: string | null;
    }
  | {
      readonly ok: false;
      readonly error: string;
      readonly status: number | null;
      readonly requestId: string | null;
      readonly outcome: FailedOutcome;
    };

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** OpenAI sends x-request-id, Anthropic sends request-id. */
function requestIdFrom(headers: Headers): string | null {
  return headers.get("x-request-id") ?? headers.get("request-id");
}

export async function postJson(
  url: string,
  headers: Readonly<Record<string, string>>,
  body: unknown,
  timeoutMs: number
): Promise<PostResult> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const requestId = requestIdFrom(response.headers);
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 300);
      return {
        ok: false,
        error: `HTTP ${response.status}: ${detail}`,
        status: response.status,
        requestId,
        outcome: "http_error",
      };
    }
    return { ok: true, json: (await response.json()) as unknown, status: response.status, requestId };
  } catch (error) {
    if (timedOut) {
      return {
        ok: false,
        error: `timeout after ${timeoutMs} ms`,
        status: null,
        requestId: null,
        outcome: "timeout",
      };
    }
    return { ok: false, error: message(error), status: null, requestId: null, outcome: "network_error" };
  } finally {
    clearTimeout(timer);
  }
}
