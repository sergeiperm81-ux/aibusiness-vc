/**
 * The scanner's network layer.
 *
 * Global `fetch` cannot be told how to resolve a name, so validating a hostname
 * and then calling `fetch` leaves a window: the name is resolved a second time
 * for the connection, and a hostile DNS server can answer differently that time
 * (DNS rebinding). `node:https` accepts a `lookup` function, so the address the
 * socket connects to is the very address we approved — there is no second
 * resolution to poison.
 *
 * The same layer caps how much it will read. A timeout that ends when headers
 * arrive does not protect against a body that never ends.
 */

import http from "node:http";
import https from "node:https";
import type { LookupAddress } from "node:dns";
import { lookup as dnsLookup } from "node:dns";
import { isAcceptableHostname } from "./hostname";
import { isPrivateAddress } from "./safe-host";

export interface SafeResponse {
  readonly ok: boolean;
  readonly status: number;
  readonly url: string;
  readonly headers: Headers;
  readonly text: string;
  readonly truncated: boolean;
  readonly durationMs: number;
}

export interface SafeFetchOptions {
  readonly timeoutMs?: number;
  readonly maxBytes?: number;
  readonly maxRedirects?: number;
  readonly userAgent?: string;
}

const DEFAULT_TIMEOUT_MS = 9000;
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024; // 2 MB is far more than any homepage needs
const DEFAULT_MAX_REDIRECTS = 4;
const DEFAULT_UA = "AIBusinessAuditBot/1.0 (+https://aibusiness.vc/audit)";

/**
 * A DNS lookup that refuses private answers.
 *
 * Passed to `node:https`, so the check and the connection share one resolution.
 */
const guardedLookup: typeof dnsLookup = ((
  hostname: string,
  options: unknown,
  callback: unknown
) => {
  const done = (typeof options === "function" ? options : callback) as (
    err: NodeJS.ErrnoException | null,
    address?: string | LookupAddress[],
    family?: number
  ) => void;
  const opts = (typeof options === "function" ? {} : options) as {
    all?: boolean;
    family?: number;
  };

  dnsLookup(hostname, { ...opts, all: true }, (err, addresses) => {
    if (err) return done(err);

    const list = addresses as LookupAddress[];
    if (list.length === 0) {
      return done(Object.assign(new Error("Domain does not resolve"), { code: "ENOTFOUND" }));
    }
    if (list.some((entry) => isPrivateAddress(entry.address))) {
      return done(
        Object.assign(new Error("Refusing to connect to a private address"), {
          code: "EACCES",
        })
      );
    }

    if (opts.all) return done(null, list);
    return done(null, list[0].address, list[0].family);
  });
}) as typeof dnsLookup;

function requestOnce(
  target: URL,
  timeoutMs: number,
  maxBytes: number,
  userAgent: string
): Promise<{
  status: number;
  headers: Headers;
  location: string | null;
  text: string;
  truncated: boolean;
}> {
  return new Promise((resolve, reject) => {
    const transport = target.protocol === "http:" ? http : https;

    let settled = false;
    // Assigned once, below, but read by finish() above that line, which can run first (an early
    // error). As const it would be in its temporal dead zone there and throw, so it stays let.
    // eslint-disable-next-line prefer-const
    let hardTimer: NodeJS.Timeout | undefined;

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      if (hardTimer) clearTimeout(hardTimer);
      fn();
    };

    const req = transport.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || (target.protocol === "http:" ? 80 : 443),
        path: `${target.pathname}${target.search}`,
        method: "GET",
        headers: {
          "user-agent": userAgent,
          accept: "text/html,text/plain,*/*",
          "accept-encoding": "identity",
        },
        lookup: guardedLookup,
        servername: target.hostname,
        timeout: timeoutMs,
      },
      (res) => {
        const headers = new Headers();
        for (const [key, value] of Object.entries(res.headers)) {
          if (typeof value === "string") headers.set(key, value);
          else if (Array.isArray(value)) headers.set(key, value.join(", "));
        }

        const status = res.statusCode ?? 0;
        const location = typeof res.headers.location === "string" ? res.headers.location : null;

        if (location && status >= 300 && status < 400) {
          res.destroy();
          finish(() => resolve({ status, headers, location, text: "", truncated: false }));
          return;
        }

        const chunks: Buffer[] = [];
        let received = 0;
        let truncated = false;

        res.on("data", (chunk: Buffer) => {
          received += chunk.length;
          if (received > maxBytes) {
            truncated = true;
            // Enough has been read to score the page; stop before memory bites.
            chunks.push(chunk.subarray(0, Math.max(0, chunk.length - (received - maxBytes))));
            res.destroy();
            return;
          }
          chunks.push(chunk);
        });

        res.on("end", () =>
          finish(() =>
            resolve({
              status,
              headers,
              location: null,
              text: Buffer.concat(chunks).toString("utf8"),
              truncated,
            })
          )
        );

        res.on("close", () => {
          if (truncated) {
            finish(() =>
              resolve({
                status,
                headers,
                location: null,
                text: Buffer.concat(chunks).toString("utf8"),
                truncated,
              })
            );
          }
        });

        res.on("error", (error) => finish(() => reject(error)));
      }
    );

    // `timeout` above is an idle-socket timeout: a server that dribbles one byte
    // at a time resets it forever. This deadline is absolute — once it fires the
    // request is torn down no matter how busy the socket looks.
    hardTimer = setTimeout(() => {
      req.destroy(new Error("Request timed out"));
      finish(() => reject(new Error("Request timed out")));
    }, timeoutMs);

    req.on("timeout", () => {
      req.destroy(new Error("Request timed out"));
    });
    req.on("error", (error) => finish(() => reject(error)));
    req.end();
  });
}

/** Fetches a stranger-supplied URL, validating every hop and capping the body. */
export async function safeFetchText(
  rawUrl: string,
  options: SafeFetchOptions = {}
): Promise<SafeResponse> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
  const userAgent = options.userAgent ?? DEFAULT_UA;

  const started = Date.now();
  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }

  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    if (target.protocol !== "https:" && target.protocol !== "http:") {
      throw new Error("Only http and https addresses can be scanned.");
    }
    if (target.username || target.password) {
      throw new Error("Addresses with a login cannot be scanned.");
    }
    if (target.port && target.port !== "80" && target.port !== "443") {
      throw new Error("Only standard web ports can be scanned.");
    }

    const syntax = isAcceptableHostname(target.hostname);
    if (!syntax.ok) throw new Error(syntax.reason ?? "That address cannot be scanned.");

    const elapsed = Date.now() - started;
    const remaining = timeoutMs - elapsed;
    if (remaining <= 0) throw new Error("Request timed out");

    const result = await requestOnce(target, remaining, maxBytes, userAgent);

    if (result.location) {
      target = new URL(result.location, target);
      continue;
    }

    return {
      ok: result.status >= 200 && result.status < 300,
      status: result.status,
      url: target.toString(),
      headers: result.headers,
      text: result.text,
      truncated: result.truncated,
      durationMs: Date.now() - started,
    };
  }

  throw new Error("Too many redirects");
}
