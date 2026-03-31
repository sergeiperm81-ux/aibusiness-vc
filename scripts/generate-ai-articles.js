const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'src', 'content', 'articles');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const topics = [
  { category: 'AI Strategy', seed: 'AI strategy', tags: ['AI strategy', 'AI adoption', 'AI roadmap'] },
  { category: 'AI Operations', seed: 'AI automation', tags: ['AI automation', 'process automation', 'workflow automation'] },
  { category: 'AI Marketing', seed: 'AI marketing', tags: ['AI marketing', 'content marketing', 'social media AI'] },
  { category: 'AI Sales', seed: 'AI sales', tags: ['AI sales', 'sales automation', 'AI lead generation'] },
  { category: 'AI Finance', seed: 'AI finance', tags: ['AI finance', 'fintech AI', 'automated accounting'] },
  { category: 'AI Healthcare', seed: 'AI healthcare', tags: ['AI healthcare', 'medical AI', 'health automation'] },
  { category: 'AI Education', seed: 'AI education', tags: ['AI education', 'learning automation', 'edtech AI'] },
  { category: 'AI eCommerce', seed: 'AI ecommerce', tags: ['AI ecommerce', 'retail AI', 'personalization'] },
  { category: 'AI Real Estate', seed: 'AI real estate', tags: ['AI real estate', 'property AI', 'lead generation'] },
  { category: 'AI Freelance', seed: 'AI freelance', tags: ['AI freelance', 'side hustle AI', 'AI gigs'] },
  { category: 'AI Ethics', seed: 'AI ethics', tags: ['AI ethics', 'AI governance', 'responsible AI'] },
  { category: 'AI Tools', seed: 'AI tools', tags: ['AI tools', 'AI software', 'tool comparison'] },
];

const freeImageSources = [
  'https://unsplash.com/s/photos/',
  'https://pixabay.com/images/search/',
  'https://www.pexels.com/search/',
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-|-$/g, '');
}

for (let i = 1; i <= 100; i++) {
  const topic = topics[(i - 1) % topics.length];
  const title = `${topic.seed} playbook ${i}: ${topic.seed} tactics for 2026`; 
  const slug = slugify(title);
  const keywords = [topic.seed, ...topic.tags.slice(0, 3), `2026`, `high ROI`];
  const imageTopic = `${topic.seed} workflow`;
  const imageUrl = `${freeImageSources[i % freeImageSources.length]}${encodeURIComponent(imageTopic)}`;

  const content = `---
category: "${topic.category}"
title: "${title}"
description: "Proven ${topic.seed} tactics to drive growth in 2026 with ROI examples."
date: "2026-03-30"
keywords: ${JSON.stringify(keywords)}
---

# ${title}

This article explains ${topic.seed} tactics that drive traffic, increase efficiency, and improve results for the modern business.

## Quick snapshot

- Category: ${topic.category}
- Estimated impact: +20-50% efficiency 
- Use-case: ${topic.seed} value ladder
- Source free hero image: ${imageUrl}

## 1. Start with customer intent

- Identify 3 high-intent use cases.
- Combine with AI-enabled analytics tools.
- Optimize for long-tail queries like "${topic.seed} for small businesses".

## 2. Build a reproducible workflow

- Define the automation steps.
- Use tools and frameworks (NoCode + prompt + APIs).

## 3. Measure and iterate

- Track convert rate, CAC, LTV.
- Rotate content monthly.

## Image and media assets

For each workflow include one hero image from free stock:
- ${imageUrl}
- license: free for commercial use, no attribution needed (verify per source)

## Notes for SEO

- Add schema.org Article, FAQ, and breadcrumb
- Keep paragraphs short
- Add internal links back to /articles and pillar pages
`;

  const filePath = path.join(outputDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

console.log('Generated 100 article drafts in', outputDir);
