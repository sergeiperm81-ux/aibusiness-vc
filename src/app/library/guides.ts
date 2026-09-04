export interface Guide {
  slug: string;
  title: string;
  kicker: string;
  tagline: string;
  cardBlurb: string;
  description: string;
  includes: string[];
  pdf: string;
  fileLabel?: string;
  pages: number;
  pagesLabel?: string;
  year: string;
  /** Bold audience label, e.g. "For entrepreneurs" / "For consumers". Rendered as a badge. */
  audience?: string;
  review?: { quote: string; author: string };
}

export const GUIDES: Guide[] = [
  {
    slug: "two-companies-one-agent-one-error",
    title: "Two Companies, One Agent, One Error",
    kicker: "Case 14/30 · A thought experiment",
    audience: "For leaders running an AI agent",
    tagline:
      "The bot is fixed in an hour. Then the real questions start: when did it begin, how many customers were turned away, and which of them went to their banks. One company can answer. The other spends weeks reconstructing its own control environment before the investigation can even begin.",
    cardBlurb:
      "An AI agent quietly tells customers the return period is fourteen days instead of thirty, and refuses everyone who asks later. The company finds out from a bank chargeback. Two fictional online retailers suffer that failure on the same day, from the same supplier update, with the same agent. One has an AI Policy, an AI Service Passport, an AI Receipt for every interaction and the rules that hold them together. The other has the usual set: terms on the website, a system prompt and a dialogue log. The system does not prevent the failure. It changes everything that happens after.",
    description:
      "Everyone running an AI agent wants the same assurance: that it does what it is supposed to do and not what it is not. The hard part is not preventing failure, because agents drift and suppliers ship updates that change behaviour quietly. The hard part is finding the failure fast, establishing what actually happened, and limiting the damage. This case models that moment. Alpha and Omega are fictional online retailers of household goods, comparable range, around ten thousand orders a month, a 30-day returns rule, the same base agent from the same supplier. For some period the agent tells customers the return window is fourteen days and automatically closes later requests as out of time. Both companies discover it the same way, from a customer who disputed the charge with their bank. At least forty customers were refused. Some left reviews, some went to their banks. The warehouse, not receiving the expected returns, revised its stock forecast. Marketing attributed the drop to the new packaging. The developer fixes the agent in an hour, and a repeat check now returns thirty days, which proves the current behaviour in one scenario and nothing else. Alpha investigates against a map prepared in advance: the passport fixes which wording of the rule was in force on which date, every AI Receipt carries the policy and passport versions applied, the change register narrows the list of candidate causes, a reverse search over machine-readable receipts finds every interaction where the wrong criterion was applied, and an output map names who consumed the erroneous returns data. Omega has to establish what counted as the norm on a given day before it can begin, because the rule lives in four texts with no edit history, the update was applied automatically and recorded nowhere, and completeness of the affected list cannot be proved. The case walks both investigations step by step, answers twelve questions any such investigation has to face in both modes, and states plainly what the approach cannot do: it did not prevent the failure, documents alone prove nothing, information never recorded is not recoverable, and the saving in time and money has not been measured. The companies and all circumstances are fictional. This is a modelled situation, not a report on any real company.",
    includes: [
      "The failure in full: what both companies could establish at the moment of discovery, and what they could not",
      "Alpha's investigation: containment, the norm, the defect window, the affected customers and the completeness test",
      "Why remediation splits into three layers, and why fixing the agent is not one of the other two",
      "Omega's investigation: four versions of the same rule, an unrecorded update and a knowingly wider window",
      "Twelve questions any investigation has to answer, side by side in both modes",
      "The summary comparison, from which norm was in force to what you can show an auditor or an insurer",
      "Seven things this analysis does not establish, stated explicitly",
      "Testable hypotheses: what to measure in a controlled simulation, and what can be measured in a real incident",
    ],
    pdf: "/library/two-companies-one-agent-one-error.pdf",
    pages: 7,
    year: "2026",
  },
  {
    slug: "silence-rather-than-error",
    title: "Silence Rather Than Error",
    kicker: "Joint paper with Andrey Ekhmenin, ANDEKS",
    audience: "For leaders and AI evaluators",
    tagline:
      "What checking one public AI agent through two independently applied approaches revealed: an agent can say nothing false and still leave the customer without an answer the company has already published.",
    cardBlurb:
      "A joint research paper by Sergei Ponomarev and Andrey Ekhmenin, founder of ANDEKS. Two independently applied approaches examined the same public support agent: a customer-side test purchase and an independent assessment of what the evidence establishes. Neither identified incorrect information in the answers examined, yet the agent failed to convey published conditions on restrictions, refunds and personal data. The finding: avoiding invention is not the same as answering the customer's question.",
    description:
      "What does it mean for a customer-facing AI agent to answer correctly? In August 2026, Sergei Ponomarev and Andrey Ekhmenin, founder of ANDEKS, examined the same live public support agent through two independently applied approaches. Each froze his findings before seeing the other's. Ponomarev compared the company's public promises with the customer's experience through a test purchase; Ekhmenin assessed which conclusions the available evidence could actually support. Neither approach identified incorrect information in the answers examined. But questions about restrictions, refunds and personal data exposed a different problem: the agent did not convey conditions its own company had already published. The paper distinguishes a legitimate admission of uncertainty from silence about an available public rule. It also explains where the approaches differed over response speed, round-the-clock availability and the source of an answer, and proposes assessing factual correctness, absence of invention, completeness of relevant published rules and resolution of the customer's question separately. The six-page article sets out the findings, practical implications and evidence limitations, including incomplete preservation of the test-purchase recordings and limits on session independence. This is a study of one agent in specific scenarios, not a certification, legal opinion or general quality rating.",
    includes: [
      "How two researchers fixed their findings independently before comparing results",
      "The shared finding: accurate answers can still omit a company's published conditions",
      "Three observed gaps: service restrictions, refund conditions and personal data processing",
      "The difference between justified uncertainty and failing to convey an available public rule",
      "Why observed speed, sampled availability and matching facts support different kinds of conclusion",
      "Four assessment axes: correctness, no invention, relevant rules and resolution of the customer's question",
      "Practical lessons for companies, with explicit limits on the evidence and the conclusions",
    ],
    pdf: "/library/silence-rather-than-error.pdf",
    pages: 6,
    year: "2026",
  },
  {
    slug: "from-ai-induction-to-ai-accountability",
    title: "From AI Induction to AI Accountability",
    kicker: "Joint paper with Amanda Cunningham, Savvy Pixel®",
    audience: "For executives",
    tagline:
      "Connecting organisational readiness with customer-facing transparency: what must happen inside the organisation before AI meets a customer, and how to prove the promise survived contact with the real world.",
    cardBlurb:
      "A two-stage argument written with Amanda Cunningham of Savvy Pixel®. Stage one: AI arrives in organisations without a formal decision, so capability gets ahead of authority. Induct AI the way you would a new employee, with eight questions leadership must be able to answer. Stage two: once the AI faces customers, prove the promise: the EU AI Act's disclosure duty as the floor, three documents as the voluntary standard, and the test purchase as the check.",
    description:
      "AI is intimidating not as a technology but as unexplored territory, and the real difficulty is not complexity but excess: in the digital world almost anything is possible, so projects drown in options. The frame has to come from your business, and you are not required to understand code, only your own services, prices and rules. This joint paper connects two halves of one accountability problem. Amanda Cunningham examines what must happen inside an organisation before AI meets the customer: AI usually arrives incrementally, through accounts and updates, without any formal moment of decision, so organisations acquire AI capability without ever defining AI authority. Her answer is AI induction, treating the system the way you would a new employee, with an eight-question readiness check for leadership: purpose, context, access, authority, boundaries, accountability, evidence, review. Sergei Ponomarev takes over at the moment the AI becomes customer-facing: Article 50 of the EU AI Act (applicable from 2 August 2026) requires telling people they are talking to an AI. That is the legal floor, not the customer proposition. A customer really has three questions: how does this company use AI at all, what can this particular bot do, and how do I prove my case if it goes wrong. Three documents answer them, an AI Policy, an AI Service Passport and an AI Receipt, and a periodic test purchase checks that the answers are true. The paper closes with an executive checklist and one claim: responsible AI is a loop that never stops turning. Intent, authority, experience, evidence, review.",
    includes: [
      "Why AI capability is not AI authority, and how organisations acquire one without the other",
      "AI induction: treating a new AI system the way you would a new employee",
      "The eight-question executive readiness check, from purpose to review",
      "What Article 50 of the EU AI Act actually requires, and where the legal floor ends",
      "The customer's three questions, and the three documents that answer them",
      "Why one public AI policy beats rules scattered across five bots",
      "The AI receipt: what it contains and why it is the customer's evidence",
      "The test purchase as the closing link: checking that the promise survived contact with reality",
      "A joint executive checklist covering both stages",
    ],
    pdf: "/library/from-ai-induction-to-ai-accountability.pdf",
    pages: 12,
    year: "2026",
  },
  {
    slug: "ai-agent-test-purchase",
    title: "AI Agent Test Purchase",
    kicker: "The method, published in full",
    audience: "For anyone checking an AI agent",
    tagline:
      "A method for evaluating AI services through the customer's eyes — carried over from seven years of test purchases in public services.",
    cardBlurb:
      "The author's method of Sergei Ponomarev, PhD, in full. Companies put AI agents in front of customers, and those agents quote prices, place orders and promise call-backs. The logs show what the bot said, never what it was supposed to say. This is the full method for closing that gap: the standard, the forms of a check, scoring, ethics, limits, and the open reference pilot run with a Swiss metrology company.",
    description:
      "This is the author's method of Sergei Ponomarev, PhD, set out in full. A test purchase is an old discipline: write down what a service is supposed to do, then go through it as an ordinary customer and record every gap between the promise and the practice. This guide carries that method over to AI agents, where the human shopper becomes an AI shopper, the clerk becomes the company's agent, and the analysis becomes a reconciliation between what the agent said and what the system actually recorded. It sets out the six steps of a check — standard, script, run, reconciliation, report, fix and re-test — and the three documents that serve as the norm: a public AI Policy, an AI Service Passport per service, and an AI Receipt per interaction. It covers the five axes along which a check is designed (external or internal, manual or automated, partial or full, comprehensive or targeted, standard or specialised), how evidence is captured so the results can be believed, and how findings are scored. It is equally clear about the boundaries: one run documents a failure but never establishes how often it happens, an external check answers what the customer got rather than why, and the analyst is an AI too and can be wrong. The method is carried over from seven years of the author's own work on service quality: nationwide monitoring of public services, hundreds of independent assessments and test purchases. The reference pilot, run jointly with the Swiss AI metrology company NeoMundi, is published in full as open source, code, prompts, transcripts and defects included.",
    includes: [
      "Why reading chat logs proves almost nothing, and what does prove a bot broke a promise",
      "The three-document standard: a public AI Policy, an AI Service Passport, and an AI Receipt",
      "External and internal test purchases: how to check any bot, with or without access",
      "The five axes of designing a check, and how to choose the right combination",
      "How one bot tests another: the AI shopper, the AI analyst, and where the human methodologist stays irreplaceable",
      "Recording and validation: what counts as evidence, and how to capture it before the website changes",
      "Real cases: an airline bot that closed every route to a human, and a tribunal that made a company answer for its chatbot's invented rule",
      "Honest limits: why a single test purchase proves guilt but never innocence, and what that means for monitoring",
      "Ethics and law, the budget, partners, and a readiness checklist to work through before you start",
    ],
    pdf: "/library/ai-agent-test-purchase.pdf",
    pages: 35,
    year: "2026",
  },
  {
    slug: "ai-through-the-customers-eyes",
    title: "Your Company's AI Through the Customer's Eyes",
    kicker: "For business owners adopting AI",
    audience: "For entrepreneurs",
    tagline:
      "Five requests from your most demanding customer — a full guide to adopting AI so that the people who pay you actually accept it.",
    cardBlurb:
      "MIT found 95% of generative-AI pilots produce zero results — and it's rarely the AI that fails. It's the customers who don't accept it. This guide is written in the voice of your most demanding customer: five requests, a sample AI Service Passport, and a final checklist.",
    description:
      "Most companies adopt AI by choosing a model, hiring a vendor, and counting the savings — and never ask the one question that decides everything: what will the customer think? This guide flips the perspective. It is written in the voice of your most demanding customer — the collective, maximally difficult one, the person Jeff Bezos kept an empty chair for at Amazon's meetings. Chapter by chapter, that customer walks you through five requests: ask me what I need first; prove your AI benefits me (the three-number test and the \"AI guillotine\"); agree on the rules with me — a full system of three documents: public AI Rules, the AI Service Passport, and the AI Receipt that explains what your AI actually did, with worked samples of all three; talk to me like a human being; and check yourselves through my eyes — evaluation systems, mystery shopping, living rules. With the EU AI Act transparency requirements arriving on 2 August 2026 and similar US state laws already in force, most of these requests will soon stop being polite suggestions. Better to meet them before your competitors do — and with a smile.",
    includes: [
      "The five requests of the demanding customer — the full customer-side view of AI adoption",
      "Levels of collaboration: from \"respondent\" to \"co-author\", and how to ask so customers don't lie",
      "The three-number test and the \"AI guillotine\" — how customers actually judge your AI's value",
      "The three-document system: public AI Rules, the AI Service Passport, and the AI Receipt — with complete worked samples of each",
      "How to talk about AI plainly and use it as an occasion to care — not a cost-cutting excuse",
      "An evaluation system with mystery shopping, plus the Demanding Customer's Final Checklist",
    ],
    pdf: "/library/ai-through-the-customers-eyes.pdf",
    pages: 42,
    year: "2026",
    review: {
      quote:
        "A thoughtful and important guide. The customer-centred perspective adds something that is still too often missing from conversations about business AI.",
      author: "Amanda Cunningham, Savvy Pixel®",
    },
  },
  {
    slug: "demand-the-ai-receipt",
    title: "Demand the AI Receipt",
    kicker: "For customers dealing with company AI",
    audience: "For consumers",
    tagline:
      "How to get value — not headaches — from the AI that companies now put between you and what you pay for. The consumer's companion to \"Through the Customer's Eyes.\"",
    cardBlurb:
      "Companies are wiring AI into sales, pricing, and support faster than any rulebook can keep up. This guide hands you, the consumer, three concrete demands that put you back in control — the AI Receipt, the AI Service Passport, and Public AI Rules — with a ready-to-send message at the end of every chapter.",
    description:
      "The rules for how AI treats customers are being written right now — and if consumers stay silent, they will be written entirely by companies. This guide is the consumer's side of the same three-document system covered in \"Your Company's AI Through the Customer's Eyes,\" turned into demands you can actually make. It teaches you to tell useful AI from harmful AI with a simple three-part check, to insist on plain human language, and then to ask for three things by name: the AI Receipt — a keepable record of what a company's AI actually did, said, and promised (the consumer's gateway to justice when something goes wrong); the AI Service Passport — the yardstick that tells you what the AI can do, what it cannot, and when a human steps in; and Public AI Rules — the standards a company commits to openly. Every chapter ends with a ready-made message you can send to a company almost as-is, inserting the service name and your own case. Short, practical, and written so one person can start changing the system today.",
    includes: [
      "The three-part check for telling genuinely useful AI from the harmful kind",
      "How to demand plain, human language — and confirmation you can keep",
      "The AI Receipt: what it must contain, and why it's your gateway to justice",
      "The AI Service Passport and Public AI Rules — explained from the consumer's side",
      "A ready-to-send message at the end of every chapter — just add your case",
      "How to move from one-off feedback to genuine co-authorship of the rules",
    ],
    pdf: "/library/demand-the-ai-receipt.pdf",
    pages: 32,
    year: "2026",
  },
  {
    slug: "start-with-your-services",
    title: "Start with Your Services",
    kicker: "AI Service Governance",
    tagline:
      "A leader's 7-step playbook for adopting AI — in business, nonprofits, and public institutions.",
    cardBlurb:
      "You can't digitize chaos. A practical 7-step method for putting your services in order first, then putting AI safely inside them — built around a ready-to-use AI Service Passport.",
    description:
      "Most leaders bring AI into their internal functions first, because it feels like the easy win. This playbook argues the opposite: start with the services your customers actually pay for, describe each one properly, and only then hand it to an AI agent. It's my own system for standardizing AI services, grown out of years of moving government services online during administrative reform — and it fits business, non-profits, and public institutions alike. You get a clear sequence: answer the ten questions every leader should be able to answer before AI faces a customer, pick a safe first pilot, set how far the agent may act on its own, and write an AI Service Passport that doubles as manifesto, storefront, and system prompt. Treat it not as dogma but as a working template — a place to start as you find your footing with AI.",
    includes: [
      "The 10 questions to answer before you put AI in front of customers",
      "Why to start with services, not internal functions — and how to pick a safe first pilot",
      "A 5-level matrix for setting how far an AI agent may act on its own (up to agent-to-agent)",
      "The AI Service Passport — a three-part tool (manifesto, storefront, prompt) you build per service",
      "Rules for AI services at scale + how to monitor quality (mystery shopping, audits, feedback)",
      "EU AI Act disclosure (mandatory from August 2026) built in from the start",
    ],
    pdf: "/library/start-with-your-services.pdf",
    pages: 14,
    year: "2026",
  },
  {
    slug: "ai-transparency-kit",
    title: "AI Transparency Kit",
    kicker: "EU AI Act · Customer Disclosure",
    tagline:
      "Turn AI disclosure from a compliance checkbox into a customer care moment — free, editable templates for every touchpoint.",
    cardBlurb:
      "From 2 August 2026, the EU AI Act requires businesses to tell customers when they're talking to AI. This kit gives you ready-to-use templates — badges, emails, FAQs, rights cards, and 'AI Works Here' badges — to make that message feel like care, not a legal notice.",
    description:
      "On 2 August 2026, EU AI Act transparency requirements start to apply. And similar rules are already appearing in California, Utah, Maine, Colorado, and other US states. Many businesses will treat this as another compliance task — a dry notice buried in small print. That would be a mistake. Telling your customers that you use AI is a chance to show you care. Not with legal language, but with a clear, human message: we value you, we are improving our service, and here is exactly how AI helps you and when a real person steps in. This kit gives you everything you need to make that message land — ready-to-use templates covering every customer touchpoint, all editable in PowerPoint so you can adapt them to your brand and your voice. Use it not just to comply with the rules, but to show care, collect feedback, remind customers about your service, and make your company better.",
    includes: [
      "Social media post and customer email announcing your AI adoption",
      "One-page website notice and FAQ for customers",
      "Customer rights card and simple privacy notice",
      '"AI is answering you" label and short customer guide',
      '"AI Works Here" badges for your website, messengers, and office',
      "Instructions for customizing all materials with your own AI assistant",
    ],
    pdf: "/library/ai-transparency-kit.pptx",
    fileLabel: "PowerPoint kit",
    pages: 16,
    pagesLabel: "slides",
    year: "2026",
  },
  {
    slug: "consumer-control-of-ai",
    title: "Consumer Control of AI",
    kicker: "Governance from the consumer side",
    tagline:
      "How ordinary people can judge the quality of AI services — and help make them better.",
    cardBlurb:
      "A practical method — plus a ready-to-use assessment card — for judging any AI service from the customer's side of the counter.",
    description:
      "Companies are building internal control over their AI — they call it AI governance. But that control serves the company. The other side of the counter, the consumer's side, stands almost empty. This guide hands you that side: a simple, proven method for judging the quality of any AI service from your own experience, gathering evidence, and pushing to have problems fixed. It is adapted from seven years of standards, independent quality assessment, and mystery shopping in public services — now pointed at AI. At its heart is a ready-to-use Assessment Card you can apply to any AI bot today.",
    includes: [
      "What consumer control is — and how it differs from corporate AI governance",
      "The four-step method: observe, gather evidence, assess, demand action",
      "A ready-to-use Assessment Card to evaluate any AI service",
      "Your rights under the EU AI Act and GDPR — and where to turn",
    ],
    pdf: "/library/consumer-control-of-ai.pdf",
    pages: 10,
    year: "2026",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
