/**
 * What an article's category is called on its badge. The category in an
 * article's front matter stays as written ("Tools", "Government"), so no
 * article or URL changes; only the words a reader sees do.
 */
const LABELS: Readonly<Record<string, string>> = {
  Government: "AI Governance",
  Tools: "Tech",
};

export function categoryLabel(category: string): string {
  return LABELS[category] ?? category;
}
