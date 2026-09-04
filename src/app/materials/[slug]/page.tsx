import { permanentRedirect, notFound } from "next/navigation";
import { getAllArticles } from "@/lib/articles";

/**
 * Rescues the old /materials/<slug> addresses.
 *
 * Articles that once lived under /materials were reorganised into /solo,
 * /society and the other sections, and the old URLs were left returning 404.
 * A 404 is the correct answer for a page that is simply gone — but these are
 * not gone, they moved, and two of them are still linked from live articles.
 * Where the same slug exists elsewhere the visitor is sent there permanently;
 * where it does not, the 404 stands.
 *
 * Static child routes (/materials/roi-calculator and friends) take precedence
 * over this dynamic segment, so they are unaffected.
 */

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default async function MovedMaterialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const match = getAllArticles().find((article) => article.slug === slug);

  if (!match) notFound();

  permanentRedirect(`/${match.section}/${match.slug}`);
}
