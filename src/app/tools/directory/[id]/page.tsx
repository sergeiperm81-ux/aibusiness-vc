import Link from "next/link";
import type { Metadata } from "next";
import { tools, getToolById } from "@/data/tools";
import { getAllToolComparisons } from "@/lib/tool-comparisons";
import { TrackEventOnView } from "@/components/analytics/TrackEventOnView";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return tools.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tool = getToolById(id);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: `${tool.name} Review — Is It Worth the Money? Pricing & ROI (2026)`,
    description: `${tool.name} honest review: ${tool.description} Pricing: ${tool.pricing}. Best for: ${tool.targetUser}. ROI analysis and alternatives.`,
  };
}

function slugifyCategory(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type BillingPeriod = "hour" | "month" | "year" | "unknown";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatUsd(value: number): string {
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  return usdFormatter.format(rounded);
}

function extractPrice(pricing: string): number {
  const match = pricing.match(/\$(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function inferBillingPeriod(pricing: string): BillingPeriod {
  const normalized = pricing.toLowerCase();

  if (/(?:\/|\bper\b)\s*(?:hour|hr)\b/.test(normalized)) return "hour";
  if (/(?:\/|\bper\b)\s*(?:month|mo)\b/.test(normalized)) return "month";
  if (/(?:\/|\bper\b)\s*(?:year|yr)\b/.test(normalized)) return "year";
  if (/\bannually\b|\bannual\b/.test(normalized)) return "year";

  return "unknown";
}

function getRoiPricingCopy(toolName: string, pricing: string, category: string, targetUser: string): string | null {
  const price = extractPrice(pricing);
  if (price <= 0) return null;

  const billingPeriod = inferBillingPeriod(pricing);

  if (billingPeriod === "month") {
    const yearly = price * 12;
    const breakEvenHours = Math.ceil(price / 50);
    return `At ${pricing}, you're investing ${formatUsd(yearly)}/year. For a ${category.toLowerCase()} tool, the question is whether it saves you enough time to justify that cost. If ${toolName} saves you just ${breakEvenHours} hours per month (at a $50/hr effective rate), it pays for itself. Most ${targetUser.toLowerCase()} report significantly higher time savings.`;
  }

  if (billingPeriod === "year") {
    const monthlyBreakEvenHours = Math.max(1, Math.ceil(price / 50 / 12));
    return `At ${pricing}, the annual cost is ${formatUsd(price)}. For a ${category.toLowerCase()} tool, that means roughly ${monthlyBreakEvenHours} break-even hour${monthlyBreakEvenHours > 1 ? "s" : ""} per month at a $50/hr effective rate.`;
  }

  if (billingPeriod === "hour") {
    const monthlyUsageHours = 10;
    const annualEstimate = price * monthlyUsageHours * 12;
    return `At ${pricing}, pricing is usage-based rather than a flat subscription. If you use it ${monthlyUsageHours} hours per month, that's about ${formatUsd(annualEstimate)}/year, so ROI depends on your actual usage volume.`;
  }

  return `At ${pricing}, cost structure may vary by plan and usage. Evaluate ROI by estimating how much time this tool saves in your real workflow.`;
}

export default async function ToolPage({ params }: Props) {
  const { id } = await params;
  const tool = getToolById(id);
  if (!tool) notFound();

  const alternatives = tools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 6);

  const comparisons = getAllToolComparisons()
    .filter((c) => c.toolA.id === tool.id || c.toolB.id === tool.id)
    .slice(0, 4);

  const roiPricingCopy = getRoiPricingCopy(tool.name, tool.pricing, tool.category, tool.targetUser);
  const hasFree = tool.pricing.toLowerCase().includes("free");

  return (
    <>
      <TrackEventOnView
        eventName="view_tool"
        params={{ tool: "tool_review", tool_id: tool.id, tool_name: tool.name, tool_category: tool.category }}
      />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-3 text-xs">
            <Link href="/tools" className="text-muted hover:text-accent transition-colors">
              Tools
            </Link>
            <span className="text-muted">/</span>
            <Link
              href={`/tools/category/${slugifyCategory(tool.category)}`}
              className="text-muted hover:text-accent transition-colors"
            >
              {tool.category}
            </Link>
            <span className="text-muted">/</span>
            <span className="text-accent">{tool.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-xl flex-shrink-0">
              {tool.name[0]}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {tool.name}
              </h1>
              <p className="text-sm text-muted mt-0.5">
                {tool.category} &middot; {tool.pricing}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Key Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Category</p>
              <p className="font-semibold text-gray-900 mt-1">{tool.category}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Pricing</p>
              <p className="font-semibold text-gray-900 mt-1">{tool.pricing}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Best For</p>
              <p className="font-semibold text-gray-900 mt-1">{tool.targetUser}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Affiliate Program</p>
              <p className="font-semibold text-gray-900 mt-1">
                {tool.hasAffiliate === true ? "Yes" : tool.hasAffiliate === false ? "No" : "Unknown"}
              </p>
            </div>
          </div>

          {/* What is it */}
          <div className="bg-background rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-3">
              What is {tool.name}?
            </h2>
            <p className="text-muted leading-relaxed mb-4">{tool.description}</p>
            <div className="pt-4 border-t border-card-border">
              <p className="text-xs text-muted mb-1">Key Differentiator</p>
              <p className="text-sm text-white font-medium">{tool.keyFeature}</p>
            </div>
          </div>

          {/* ROI Analysis */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Is {tool.name} Worth the Money?</h2>
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              {hasFree && (
                <p>
                  {tool.name} offers a free tier, which means you can test the core functionality before
                  spending a cent. This is ideal for freelancers and solopreneurs who want to validate
                  the tool fits their workflow before committing.
                </p>
              )}
              {roiPricingCopy && <p>{roiPricingCopy}</p>}
              <p>
                {tool.name}&apos;s core value proposition — {tool.keyFeature.toLowerCase()} — directly translates to either
                faster output, higher quality work, or both. In the {tool.category.toLowerCase()} space,
                tools that deliver on their core promise typically generate 3-5x returns on subscription cost.
              </p>
            </div>
          </div>

          {/* Who Should Use It */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Who Should Use {tool.name}?</h2>
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              <p>
                {tool.name} is designed for {tool.targetUser.toLowerCase()}. If that describes you, this tool
                will feel intuitive from day one. The interface and features are optimized for your specific workflows.
              </p>
              <p>
                <strong>Best fit:</strong> Professionals who need {tool.keyFeature.toLowerCase()} as part
                of their daily work. If you&apos;re currently doing this manually, {tool.name} will likely
                save you significant time.
              </p>
              <p>
                <strong>Not ideal for:</strong> Users who need occasional, lightweight {tool.category.toLowerCase()} capabilities.
                If you only need this type of tool a few times per month, a free alternative may be sufficient.
              </p>
            </div>
          </div>

          {/* Comparisons */}
          {comparisons.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {tool.name} vs Competitors
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {comparisons.map((comp) => {
                  const other = comp.toolA.id === tool.id ? comp.toolB : comp.toolA;
                  return (
                    <Link
                      key={comp.slug}
                      href={`/tools/compare/${comp.slug}`}
                      className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all"
                    >
                      <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                        {tool.name} <span className="text-accent">vs</span> {other.name}
                      </p>
                      <p className="text-[10px] text-muted mt-1">{other.pricing}</p>
                      <p className="text-[11px] font-medium text-accent mt-2">Compare &rarr;</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {tool.name} Alternatives
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.id}
                    href={`/tools/directory/${alt.id}`}
                    className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-xs flex-shrink-0">
                        {alt.name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm group-hover:text-accent transition-colors">
                          {alt.name}
                        </h3>
                        <p className="text-[11px] text-muted">{alt.pricing}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted">{alt.description}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
