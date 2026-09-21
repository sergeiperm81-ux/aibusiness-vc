/**
 * The one thing a buyer gives AI Company Scan: the company's website. Only a
 * plain public domain is accepted; a social profile belongs to AI Person Scan.
 */

import { cleanDomain } from "./person-check";
import { isAcceptableHostname } from "./hostname";
import type { PreviewTarget } from "./professional-preview";
import { isSocialAddress } from "./person-report-safety";

export type CompanySiteResult =
  | { readonly ok: true; readonly target: PreviewTarget; readonly domain: string }
  | { readonly ok: false; readonly error: string };

export function parseCompanySite(input: string): CompanySiteResult {
  const domain = cleanDomain(input).replace(/:\d+$/, "");
  if (!domain) return { ok: false, error: "Enter the company's website, for example acme.com." };
  if (isSocialAddress(`https://${domain}`)) {
    return { ok: false, error: "That is a social network. Enter the company's own website, or use AI Person Scan for a person." };
  }
  const host = isAcceptableHostname(domain);
  if (!host.ok) return { ok: false, error: host.reason ?? "That address cannot be checked." };
  return { ok: true, domain, target: { url: `https://${domain}`, networkLabel: "website", handle: domain } };
}
