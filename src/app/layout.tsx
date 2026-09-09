import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

const GA_ID = "G-1REBWZYEET";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aibusiness.vc"),
  verification: {
    google: "yRYv2YyqS-AMtu6oaPdAaEUZMzcubgWv-XVJE9aLnuM",
  },
  title: {
    default: "AI Business - How to Make Money with AI in 2026",
    template: "%s | AI Business",
  },
  description:
    "The definitive guide to making money with AI. News, tools, strategies, and real stories for solo earners, startups, and enterprises.",
  keywords: [
    "make money with AI",
    "AI business ideas",
    "AI side hustle",
    "AI tools",
    "AI automation agency",
    "AI startups",
    "AI for business",
  ],
  authors: [{ name: "AI Business", url: "https://aibusiness.vc" }],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aibusiness.vc",
    siteName: "AI Business",
    title: "AI Business - How to Make Money with AI in 2026",
    description:
      "News, tools, and strategies for making money with AI. For solo earners, startups, and enterprises.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Business - How to Make Money with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business - How to Make Money with AI",
    description: "News, tools, and strategies for making money with AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-foreground">
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});`}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
        <OrgSchemaOrg />
      </body>
    </html>
  );
}

function OrgSchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    // A stable identifier, an address and outbound links are what stop an
    // assistant merging this with the unrelated aibusiness.com. Asked where we
    // are based, one answered "Greater London", which is that publisher's
    // address, not ours. Counts are rounded down on purpose: an exact number
    // goes stale the week after it is written.
    "@id": "https://aibusiness.vc/#organization",
    name: "AI Business",
    alternateName: "aibusiness.vc",
    url: "https://aibusiness.vc",
    logo: "https://aibusiness.vc/og-image.jpg",
    description:
      "How to make money with AI. 300+ articles and 70+ LLM model profiles, plus independent test purchases of AI agents. Income methods, startup data, tool economics and enterprise case studies.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sveti Vlas",
      addressCountry: "BG",
    },
    founder: { "@id": "https://aibusiness.vc/sergei-ponomarev#person" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial and business enquiries",
      url: "https://www.linkedin.com/in/sergei-ponomarev/",
    },
    sameAs: ["https://www.linkedin.com/in/sergei-ponomarev/"],
    foundingDate: "2026",
    knowsAbout: [
      "Artificial Intelligence",
      "AI Tools",
      "AI Business Models",
      "Machine Learning",
      "AI Startups",
      "Prompt Engineering",
      "AI Automation",
      "Robotics",
      "Humanoid Robots",
      "Physical AI",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
