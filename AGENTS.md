<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CRITICAL: Scope Restrictions for Automated Agents

## What you CAN do:
- Create NEW `.md` files in `src/content/` subdirectories (solo, b2b, startups, vc, government, tools, learn, materials)
- Each article must have valid frontmatter: title, description, date, category, image, keywords
- Use images from `/images/articles/` (check existing files before referencing)

## What you MUST NOT do:
- **NEVER modify `src/app/page.tsx`** (homepage layout)
- **NEVER modify `src/app/layout.tsx`** (global layout, GA4, meta tags)
- **NEVER modify any file in `src/components/`** (ArticlePage, Header, Footer, SectionPage, etc.)
- **NEVER modify `src/lib/`** (articles.ts, supabase.ts, news-aggregator.ts, tool-comparisons.ts)
- **NEVER modify `src/data/`** (tools, models, news, comparisons, etc.)
- **NEVER modify `src/app/api/`** (cron, leads, etc.)
- **NEVER modify section page files** (`src/app/solo/page.tsx`, `src/app/b2b/page.tsx`, etc.)
- **NEVER modify `vercel.json`, `next.config.ts`, `package.json`, `tsconfig.json`**
- **NEVER modify `public/robots.txt`, `public/llms.txt`, `public/og-image.jpg`**
- **NEVER create new routes** in `src/app/` (no new page.tsx files)
- **NEVER add new npm dependencies**
- **NEVER modify existing articles** — only create NEW ones

## Why these restrictions exist:
The site architecture, components, layouts, and data pipelines are maintained by a human developer.
Automated agents that modify these files cause breakage: missing sections on homepage,
broken internal links, corrupted images, lost SEO settings (canonical tags, OG images, schema markup).
Every time a layout file is overwritten, hours of work are lost.

## Article writing rules:
- Every article must connect AI to money (earning, saving, investing)
- Minimum 800 words
- Include specific dollar amounts, company names, percentages
- Conversational tone — NOT listicle/manual style
- No "The Bottom Line", no "Furthermore/Moreover/Additionally"
- Date format: "2026-MM-DD"
- Category must match the directory name (solo → "Solo", b2b → "B2B", etc.)
