import type { NextConfig } from "next";

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "img-src 'self' data: https: blob:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/**
 * Paid deliverables that happen to live under `public/`.
 *
 * The implementation guide is read from disk by the fulfilment code and shipped
 * unchanged inside the paid kit, so it cannot simply be moved: on Vercel a file
 * outside `public/` is not guaranteed to reach the serverless bundle, and a
 * silent break in fulfilment is worse than the leak. Blocking it at the HTTP
 * layer instead leaves `fs.readFile` untouched while the URL stops resolving.
 *
 * The sample report is deliberately absent from this list: it is linked from
 * the audit page as a public example of what a buyer receives.
 */
const NOT_PUBLICLY_SERVED = [
  "/audit-kit/Manual-Implementation-Guide-Template.docx",
  "/audit-kit/Executive-Brief-Template.pdf",
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  async rewrites() {
    return {
      // `beforeFiles` runs ahead of the static file handler. An ordinary rewrite
      // would lose to the file on disk and serve it anyway.
      beforeFiles: NOT_PUBLICLY_SERVED.map((source) => ({
        source,
        destination: "/audit-kit/not-publicly-served",
      })),
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
