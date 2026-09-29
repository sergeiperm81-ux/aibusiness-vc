import { EXPERTS, profileUrl, type Expert } from "../experts/experts";
import { getAllArticles, type ArticleMeta } from "@/lib/articles";
import { LLMS_AFTER_MEMBERS, llmsBeforeMembers } from "./content";

/**
 * /llms.txt, assembled at build time.
 *
 * Built once and served as a static file, so it costs nothing per request. The
 * member list comes straight from the register, so a new profile appears here
 * on the next deploy without anyone remembering to add it: a name an assistant
 * cannot find in this file is a name it has to go looking for.
 */
export const dynamic = "force-static";

function memberLine(expert: Expert): string {
  const role = [expert.role, expert.organisation].filter(Boolean).join(", ");
  const parts = [expert.headline, role, expert.location].filter(Boolean).join(". ");
  return `- [${expert.name}](${profileUrl(expert)}): ${parts}.`;
}

function membersBlock(): string {
  const lines = [...EXPERTS]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(memberLine);
  return [`- Members (${EXPERTS.length}), each with a profile page:`, ...lines, ""].join("\n");
}

function storyLine(article: ArticleMeta): string {
  const url = `https://aibusiness.vc/${article.section}/${article.slug}`;
  const partner = article.partner;
  if (!partner) return `- [${article.title}](${url})`;
  const host = partner.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `- [${partner.company}](${url}): ${article.title} — ${host}`;
}

/** Every published Partner Story, newest first, so the list cannot fall behind the site. */
function partnerStoriesBlock(): string {
  return getAllArticles()
    .filter((article) => article.story === "partner")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(storyLine)
    .join("\n");
}

export function GET(): Response {
  const body = `${llmsBeforeMembers(partnerStoriesBlock())}${membersBlock()}${LLMS_AFTER_MEMBERS}`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
