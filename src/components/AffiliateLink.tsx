import Link from "next/link";

interface AffiliateLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Affiliate link with disclosure badge.
 * Use for external tool links that have affiliate tracking.
 * Shows a small "affiliate" label for FTC compliance.
 */
export function AffiliateLink({ href, children, className = "" }: AffiliateLinkProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-amber-600 underline underline-offset-2 hover:text-amber-700 transition-colors ${className}`}
      >
        {children}
      </a>
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-100 text-amber-700 leading-none">
        affiliate
      </span>
    </span>
  );
}

/**
 * Inline disclosure banner for article pages that contain affiliate links.
 * Place once at the top of articles that mention affiliate tools.
 */
export function AffiliateDisclosureBanner() {
  return (
    <div className="mb-8 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-relaxed">
      <strong className="text-gray-700">Disclosure:</strong> Some links in this
      article are affiliate links. If you purchase through them, we earn a small
      commission at no extra cost to you.{" "}
      <Link
        href="/affiliate-disclosure"
        className="text-amber-600 underline underline-offset-1"
      >
        Full disclosure
      </Link>
    </div>
  );
}
