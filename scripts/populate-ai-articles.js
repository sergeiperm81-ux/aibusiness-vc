const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = path.join(__dirname, '..', 'src', 'content', 'articles');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f.includes('-playbook-'));

function normalizeSentence(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function generateSection(title, bulletPoints, paragraph) {
  let result = `## ${title}\n\n`;
  result += `${paragraph}\n\n`;
  if (bulletPoints && bulletPoints.length > 0) {
    for (const point of bulletPoints) {
      result += `- ${point}\n`;
    }
    result += '\n';
  }
  return result;
}

for (const file of files) {
  const filePath = path.join(dir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const meta = parsed.data;
  if (!meta || !meta.title || !meta.category) continue;

  const title = normalizeSentence(meta.title);
  const category = meta.category;
  const slug = file.replace('.md', '');
  const now = new Date().toISOString().split('T')[0];

  // build a topic phrase for differentiating
  const topic = title.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

  const intro = `${title} is part of a high-velocity content series built for AI practitioners, marketers, and operators. At a time when AI budgets are growing 5x year-over-year, this guide gives you an implementable step-by-step roadmap to deliver immediate ROI and organic traffic. The content in this article targets high-intent search queries like "${topic}" and "${topic} strategy".\n\n`;

  const section1 = generateSection(
    `Why ${title} Matters in 2026`,
    [
      'Acceleration of AI adoption across industries (45% increase in enterprise projects).',
      'Demand for practical workflows that cut cost and speed up execution.',
      'Search queries are moving from “what is” to “how to implement”.'
    ],
    'Today’s buyers are no longer satisfied with conceptual content. They want frameworks that include measurements, checklists, and sample prompts that they can copy & paste into their workspace.'
  );

  const section2 = generateSection(
    `Core Metrics to Track`,
    [
      'Time saved per manual task (hours/week).',
      'Process completion rate after automation (%).',
      'Customer satisfaction impact (NPS, CSAT).',
      'Cost per outcome (revenue/expense).'
    ],
    'For each tactic, establish baseline before the AI rollout and compare monthly results. Use dashboards from GA4, Databox, or Metabase to keep stakeholders aligned.'
  );

  const section3 = generateSection(
    'Step-by-Step Implementation',
    [
      'Define a specific problem statement with success criteria.',
      'Choose AI tooling (GPT, Claude, open-source + connectors).',
      'Build a small pilot: 1-2 user stories with clear mapping.',
      'Iterate for 3 sprints, then scale across the team.'
    ],
    'A repeatable implementation model drives adoption. This is how you reduce risk and accelerate from pilot to production in 30 days.'
  );

  const section4 = generateSection(
    'Content and SEO Playbook',
    [
      'Use keyword clusters with commercial intent to capture search volume fast.',
      'Create 1500+ word long-form pieces with 7+ subsections and table of contents.',
      'Add schema (FAQ, HowTo, Article) for featured snippets.',
      'Maintain an update cadence: refresh quarterly with new stats and case studies.'
    ],
    'The aim is to become a topical authority. Cross-link all related playbooks and pillar pages, and include internal links to lower-funnel conversion pages.'
  );

  const section5 = generateSection(
    'Example AI Workflow',
    [
      'Ingest data (CRM, email, chat logs) into vector DB.',
      'Run intent and sentiment classification with LLM.',
      'Auto-generate personalized responses + follow-ups.',
      'Log actions in your ops system and trigger next steps.'
    ],
    'This workflow is template-based, so it can be customized for sales, customer support, marketing, finance, or operations.'
  );

  const section6 = generateSection(
    'Action Plan for Next 30 Days',
    [
      'Week 1: validate use cases and select tools.',
      'Week 2: build and test an MVP with early adopters.',
      'Week 3: measure results and optimize prompts.',
      'Week 4: launch the scalable workflow + documentation.'
    ],
    'Use a simple RACI matrix and a shared Notion / Confluence page to coordinate execution.'
  );

  const conclusion = `## Wrap-up and scaling strategy\n\n` +
    `With ${title}, your objective is to move from proof-of-concept to a sustainable AI operating model. Track both business outcomes and “speed-to-value”; both are essential for earning ongoing investment.\n\n` +
    `> Free image suggestion: https://unsplash.com/s/photos/${encodeURIComponent(topic)}\n` +
    `> Optional downloadable asset: one-page checklist and prompt library for the workflow above.\n`;

  const content = `---\ncategory: "${category}"\ntitle: "${title}"\ndescription: "Practical, high-ROI tactics for ${topic} in 2026, with execution templates."\ndate: "${now}"\nkeywords: ${JSON.stringify(meta.keywords || [])}\n---\n\n# ${title}\n\n${intro}${section1}${section2}${section3}${section4}${section5}${section6}${conclusion}`;

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Populated', files.length, 'articles with full text.');
