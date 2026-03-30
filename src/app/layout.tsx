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
    "The definitive guide to making money with AI. Discover proven methods, the best AI tools, real income case studies, and step-by-step strategies to build your AI-powered business.",
  keywords: [
    "make money with AI",
    "AI business ideas",
    "AI side hustle",
    "AI tools",
    "AI automation agency",
    "AI freelancing",
    "how to make money with AI",
    "AI passive income",
  ],
  authors: [{ name: "AI Business", url: "https://aibusiness.vc" }],
  creator: "AI Business",
  publisher: "AI Business",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aibusiness.vc",
    siteName: "AI Business",
    title: "AI Business — How to Make Money with AI in 2026",
    description:
      "The definitive guide to making money with AI. Proven methods, real numbers, honest reviews.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business — How to Make Money with AI",
    description:
      "The definitive guide to making money with AI. Proven methods, real numbers, honest reviews.",
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
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <SchemaOrg />
      </body>
    </html>
  );
}

function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Business",
    url: "https://aibusiness.vc",
    description:
      "The definitive guide to making money with AI. Proven methods, real income case studies, and the best AI tools reviewed.",
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
