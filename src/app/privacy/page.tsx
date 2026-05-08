import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for aibusiness.vc",
};

export default function PrivacyPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 12, 2026</p>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Information We Collect</h2>
          <p>We collect anonymous usage data through Google Analytics (GA4) to understand how visitors use our site. This includes pages viewed, time spent, referral source, device type, and approximate location. We do not collect personal information unless you voluntarily provide it.</p>

          <h2 className="text-xl font-bold text-gray-900">Cookies</h2>
          <p>We use essential cookies for site functionality and analytics cookies (Google Analytics) to measure traffic. You can disable cookies in your browser settings at any time.</p>

          <h2 className="text-xl font-bold text-gray-900">Third-Party Services</h2>
          <p>Our site uses Google Analytics for traffic measurement. External links to tools and services reviewed on this site are subject to their own privacy policies. Some links may be affiliate links.</p>

          <h2 className="text-xl font-bold text-gray-900">Data Retention</h2>
          <p>Analytics data is retained for 14 months in Google Analytics. We do not store personal data on our servers.</p>

          <h2 className="text-xl font-bold text-gray-900">Your Rights</h2>
          <p>You may request deletion of any personal data by contacting us. EU residents have rights under GDPR including access, rectification, and erasure.</p>

          <h2 className="text-xl font-bold text-gray-900">Contact</h2>
          <p>For privacy questions, contact us at the email listed on our site.</p>
        </div>
      </div>
    </section>
  );
}
