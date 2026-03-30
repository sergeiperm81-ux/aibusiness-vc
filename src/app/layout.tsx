import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";

import { Footer } from "@/components/Footer";
import "./globals.css";

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
  title: {
    default: "AI Business — How to Make Money with AI in 2026",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aibusiness.vc",
    siteName: "AI Business",
    title: "AI Business — How to Make Money with AI in 2026",
    description:
      "News, tools, and strategies for making money with AI. For solo earners, startups, and enterprises.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business — How to Make Money with AI",
    description:
      "News, tools, and strategies for making money with AI.",
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <OrgSchemaOrg />
      </body>
    </html>
  );
}

function OrgSchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Business",
    url: "https://aibusiness.vc",
    description:
      "How to make money with AI. News, tools, and strategies for solo earners, startups, and enterprises.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
