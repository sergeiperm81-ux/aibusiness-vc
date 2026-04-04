import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const sectionNames: Record<string, string> = {
  solo: "Solo",
  startups: "Startups",
  b2b: "B2B",
  tools: "Tools",
  models: "Models",
  news: "News",
  learn: "Learn",
  materials: "Materials",
  vc: "VC",
  government: "Government",
  compare: "Compare",
  salaries: "Salaries",
  regulation: "Regulation",
  articles: "Articles",
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs text-white/50 mb-3 flex items-center gap-1.5 flex-wrap">
        {allItems.map((item, i) => (
          <span key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-white/30">/</span>}
            {i < allItems.length - 1 ? (
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-white/70">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
      <BreadcrumbSchema items={allItems} />
    </>
  );
}

export function BreadcrumbsLight({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs text-black/40 mb-3 flex items-center gap-1.5 flex-wrap">
        {allItems.map((item, i) => (
          <span key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-black/20">/</span>}
            {i < allItems.length - 1 ? (
              <Link href={item.href} className="hover:text-black transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-black/60">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
      <BreadcrumbSchema items={allItems} />
    </>
  );
}

function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `https://aibusiness.vc${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function getBreadcrumbsForSection(section: string): BreadcrumbItem[] {
  return [{ label: sectionNames[section] ?? section, href: `/${section}` }];
}

export function getBreadcrumbsForArticle(
  section: string,
  title: string,
  slug: string
): BreadcrumbItem[] {
  return [
    { label: sectionNames[section] ?? section, href: `/${section}` },
    { label: title.length > 50 ? title.slice(0, 47) + "..." : title, href: `/${section}/${slug}` },
  ];
}
