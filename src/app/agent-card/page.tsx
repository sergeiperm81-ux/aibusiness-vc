import { permanentRedirect } from "next/navigation";

/**
 * The Agent Card is no longer a standalone product: it ships inside the
 * AI Visibility Audit package. The page is kept as a permanent redirect so
 * old links, bookmarks and indexed results land on the product that absorbed
 * it instead of a 404.
 */
export default function AgentCardRedirect(): never {
  permanentRedirect("/audit");
}
