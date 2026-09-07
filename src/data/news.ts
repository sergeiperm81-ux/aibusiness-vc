export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  badgeColor: string;
  date: string;
  image: string;
}

export const newsData: NewsItem[] = [
  {
    slug: "startup-funding-510b-h1-2026-ai",
    title: "Startup Funding Hits Record $510B in H1 2026 — AI Took the Lion's Share",
    excerpt: "Global venture funding smashed every record in the first half of 2026, and AI swallowed most of it — OpenAI and Anthropic alone pulled in $217B.",
    body: `<p>Global startup investment reached a record <strong>$510 billion</strong> in the first half of 2026, according to Crunchbase — surpassing the $440 billion invested in <em>all</em> of 2025, and setting a new high for any half-year on record.</p><p>The engine is AI. In Q1 alone, roughly <strong>80% of all global venture funding</strong> — about $242 billion — went to AI companies. And the capital is brutally concentrated: <strong>OpenAI and Anthropic together took $217 billion</strong>, or 43% of all startup funding in H1. Nearly 88% of AI funding went to US-headquartered companies.</p><p><strong>Why it matters for your wallet:</strong> When half a trillion dollars floods into startups in six months, it cascades downstream — into salaries, contractor budgets, new tools, and thousands of companies that suddenly have money to spend on AI services. That demand is exactly where solo operators and small teams get paid.</p><p><strong>The flip side:</strong> Concentration this extreme means most of the money is chasing a handful of frontier labs. The opportunity for everyone else isn't competing with them — it's building on top of them.</p><p style="margin-top:16px;padding-top:12px;border-top:1px solid #e5e7eb;"><a href="https://news.crunchbase.com/venture/global-startup-exits-ipo-ma-soar-ai-q2-h1-2026/" target="_blank" rel="noopener noreferrer" style="color:#d97706;text-decoration:underline;font-weight:600;">Read the full data on Crunchbase News &rarr;</a></p>`,
    category: "VC",
    badgeColor: "bg-rose-500 text-white",
    date: "July 7, 2026",
    image: "/images/articles/charts-screen-1.jpg",
  },
  {
    slug: "mgx-49-billion-ai-fund-2026",
    title: "MGX Raises $49 Billion — One of the Biggest AI Funds Ever",
    excerpt: "Abu Dhabi's MGX, just two years old, closed a $49B fund dedicated to AI deals — instantly one of the most consequential investors in the sector.",
    body: `<p>Abu Dhabi's <strong>MGX</strong> has raised <strong>$49 billion</strong> for one of the largest funds ever dedicated to artificial intelligence — a staggering war chest for a firm that is only two years old.</p><p>The raise vaults MGX into the top tier of AI investors globally, alongside the biggest names in venture and sovereign capital. The fund is aimed squarely at AI infrastructure, compute, and the frontier-model companies burning through capital to train the next generation of systems.</p><p><strong>Why it matters for your wallet:</strong> When a single fund controls $49B earmarked for AI, it reshapes who gets funded and at what valuation. That capital flows into data centers, chips, and the startups building on top — creating downstream demand for talent, tools, and services that individuals and small companies can supply.</p><p><strong>The bigger picture:</strong> Q1 2026 already shattered venture records, with AI pushing global startup investment to roughly $300B. MGX's fund is the clearest signal yet that the money behind AI is still accelerating, not cooling.</p><p style="margin-top:16px;padding-top:12px;border-top:1px solid #e5e7eb;"><a href="https://news.bloomberglaw.com/mergers-and-acquisitions/mgx-raises-49-billion-for-one-of-the-biggest-ever-ai-funds" target="_blank" rel="noopener noreferrer" style="color:#d97706;text-decoration:underline;font-weight:600;">Read the full story on Bloomberg &rarr;</a></p>`,
    category: "VC",
    badgeColor: "bg-rose-500 text-white",
    date: "July 6, 2026",
    image: "/images/articles/money-cash-1.jpg",
  },
  {
    slug: "ai-agents-market-7b",
    title: "AI Agents Market Hits $7.6B — Individual Developers Are Building Custom Agents for $500-1,500 Each",
    excerpt: "The AI agents market reached $7.63 billion in 2025, projected to hit $183 billion by 2033. Solo builders are cashing in.",
    body: `<p>The AI agents market reached <strong>$7.63 billion</strong> in 2025 and is on track to reach <strong>$183 billion by 2033</strong>, growing at a staggering 49.6% CAGR.</p><p>What's making headlines isn't just the big companies — it's individual developers building custom AI agents for businesses at <strong>$500-1,500 per agent</strong>.</p><p>These agents handle everything from customer support to sales outreach to invoice processing. Unlike chatbots that just answer questions, AI agents take autonomous action: they book meetings, update CRMs, send emails, and process refunds without human intervention.</p><p><strong>Why businesses are buying:</strong> A customer support employee costs $4,000/month. An AI agent handling 70% of that workload costs $500-1,000/month. The math speaks for itself.</p><p>The tools making this possible — LangChain, CrewAI, OpenAI Assistants API, and the Claude Agent SDK — have matured to the point where a skilled developer can build a production-ready agent in days, not months.</p><p>McKinsey reports that 92% of companies plan to increase their AI automation investment in the next 12 months. The demand for custom agents is only accelerating.</p>`,
    category: "Solo",
    badgeColor: "bg-amber-500 text-black",
    date: "March 30, 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
  },
  {
    slug: "anthropic-raises-3-5b",
    title: "Anthropic Raises $3.5B at $61.5B Valuation — AI Safety Race Intensifies",
    excerpt: "Anthropic's latest funding round makes it the second most valuable AI startup after OpenAI.",
    body: `<p>Anthropic has closed a <strong>$3.5 billion</strong> funding round, valuing the AI safety company at <strong>$61.5 billion</strong>.</p><p>The company behind Claude is now the second most valuable AI startup globally, trailing only OpenAI's $157 billion valuation. The round was led by existing investors including Google, Salesforce, and several sovereign wealth funds.</p><p><strong>What the money is for:</strong> Anthropic plans to scale compute infrastructure, expand its research team, and accelerate next-generation models. The company grew from 500 to over 1,200 employees in 2025.</p><p><strong>The bigger picture:</strong> Total AI startup funding hit $72 billion in 2025 — more than double the previous year. The concentration of capital in a handful of frontier model companies is reshaping the tech landscape.</p><p>For builders and developers, more competition among model providers means better models, lower prices, and more options.</p>`,
    category: "Startups",
    badgeColor: "bg-purple-500 text-white",
    date: "March 29, 2026",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80",
  },
  {
    slug: "openai-api-price-cut",
    title: "OpenAI Slashes API Prices by 40% — Startups See Immediate Margin Boost",
    excerpt: "GPT-4o API costs drop significantly, making AI products cheaper to build and run.",
    body: `<p>OpenAI has reduced API pricing for GPT-4o by <strong>40%</strong>, bringing input costs down to <strong>$1.50 per million tokens</strong> and output to <strong>$6.00 per million tokens</strong>.</p><p>For AI startups that rely on OpenAI's API, this translates to immediate margin improvements. A startup processing 10 million tokens per day saves approximately <strong>$3,600 per month</strong>.</p><p><strong>Why it matters for builders:</strong> Lower API costs make previously marginal AI products viable. Use cases that were too expensive — like AI customer support for small businesses or AI tutoring — are now economically feasible.</p><p><strong>The competitive context:</strong> DeepSeek V3 offers comparable performance at $0.27 per million input tokens. Google's Gemini 2.0 Flash is priced aggressively. The trend is clear: frontier AI capabilities are getting cheaper fast.</p>`,
    category: "Startups",
    badgeColor: "bg-purple-500 text-white",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
  },
  {
    slug: "cursor-top-coding-tool",
    title: "Cursor Becomes #1 AI Coding Tool — Developers Are Switching in Droves",
    excerpt: "The AI-first code editor surpasses GitHub Copilot in developer satisfaction surveys.",
    body: `<p>Cursor has officially overtaken GitHub Copilot as the most popular AI coding tool. <strong>68% of developers</strong> who tried Cursor report it as their primary coding tool in the 2026 Stack Overflow Developer Survey.</p><p>The AI-first code editor, valued at <strong>$9 billion</strong>, combines VS Code's familiar interface with deeply integrated AI — inline generation, multi-file editing, and natural language chat.</p><p><strong>What makes it different:</strong> Unlike Copilot which adds AI to an existing editor, Cursor was built from the ground up around AI interaction. Developers report <strong>40-55% faster coding speed</strong> compared to vanilla VS Code.</p><p>At $20/month for the Pro plan, it's one of the highest-ROI tools for any developer.</p>`,
    category: "Tools",
    badgeColor: "bg-emerald-500 text-white",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80",
  },
  {
    slug: "eu-ai-act-enforcement",
    title: "EU AI Act Enforcement Begins — Companies Face Up to 7% Revenue Penalties",
    excerpt: "The world's first comprehensive AI law starts enforcing compliance requirements across Europe.",
    body: `<p>The European Union's AI Act has entered its enforcement phase. Non-compliance can result in fines of up to <strong>7% of global annual revenue</strong> — or <strong>\u20ac35 million</strong>, whichever is higher.</p><p><strong>What's now required:</strong></p><ul><li>AI systems classified as "unacceptable risk" are <strong>banned</strong> (social scoring, real-time biometric surveillance)</li><li>High-risk AI must undergo conformity assessments</li><li>Generative AI providers must disclose AI-generated content</li><li>Training data documentation required</li></ul><p><strong>Who's affected:</strong> Any company deploying AI in the EU market, regardless of headquarters location.</p><p>The EU AI Act is the template for global regulation. Similar legislation is advancing in Canada, Brazil, and South Korea.</p>`,
    category: "B2B",
    badgeColor: "bg-blue-500 text-white",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
  },
  {
    slug: "deepseek-cost-efficiency",
    title: "DeepSeek V3 Proves You Don't Need Billions to Build Frontier AI",
    excerpt: "The Chinese open-source model matches GPT-4 performance at 1/10th the API cost.",
    body: `<p>DeepSeek V3 delivers <strong>GPT-4-class performance</strong> at just <strong>$0.27 per million input tokens</strong> — roughly <strong>10x cheaper</strong> than GPT-4o.</p><p>DeepSeek's success is forcing every API provider to justify their pricing. OpenAI's recent 40% price cut was partly a response to this competitive pressure.</p><p>For solo developers and bootstrapped startups, this means AI-powered products that were economically impossible a year ago are now viable.</p>`,
    category: "Startups",
    badgeColor: "bg-purple-500 text-white",
    date: "March 25, 2026",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&q=80",
  },
  {
    slug: "enterprise-ai-58-percent",
    title: "Enterprise AI Adoption Hits 58% — What Separates Winners from Failures",
    excerpt: "More than half of enterprises now use AI in production, but 42% of projects fail to deliver ROI.",
    body: `<p><strong>58% of enterprises</strong> now use AI in at least one business function, up from 35% in 2023, according to McKinsey's 2025 Global AI Survey. But <strong>42% of AI projects fail</strong> to deliver expected ROI.</p><p><strong>What winners do differently:</strong></p><ul><li>Start with one specific, measurable problem</li><li>Choose high-volume, repetitive processes first</li><li>Measure ROI weekly, not quarterly</li></ul><p>Companies that start with a single well-defined use case see positive ROI within <strong>3-6 months</strong>. Average return: <strong>300-400% over 18 months</strong>.</p>`,
    category: "B2B",
    badgeColor: "bg-blue-500 text-white",
    date: "March 24, 2026",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  },
];

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return newsData.find((n) => n.slug === slug);
}
