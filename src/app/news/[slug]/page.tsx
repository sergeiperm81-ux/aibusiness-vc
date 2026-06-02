// News articles don't have individual pages — they open in the accordion on /news.
// This redirect prevents bots from generating expensive server renders for every news slug.
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NewsSlugRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/news?open=${slug}`);
}
