---
title: "OpenAI and Anthropic Quietly Became Consulting Firms. That Tells You Where the Money in Enterprise AI Actually Is"
description: "OpenAI's Deployment Co raised over $4B at a $10-14B valuation. Anthropic and Blackstone put $1.5B into Ode. Accenture and Google Cloud just committed 1,000 embedded engineers. The labs concluded the model was never the bottleneck. Here's what that means for your AI budget and for anyone selling AI services."
date: "2026-09-12"
author: "Sergei Ponomarev"
category: "B2B"
image: "/images/articles/consulting-meeting-1.jpg"
keywords: ["forward deployed engineer", "OpenAI Deployment Company", "Anthropic Ode Blackstone", "AI implementation services 2026", "enterprise AI consulting", "AI implementation gap"]
---

# OpenAI and Anthropic Quietly Became Consulting Firms. That Tells You Where the Money in Enterprise AI Actually Is

On 8 September, Accenture and Google Cloud announced a joint unit built around **1,000 forward deployed engineers** who will sit inside client offices and wire Gemini into their workflows. It sounds like a routine partnership press release. It is the third act of the most important shift in enterprise AI this year, and the first two acts were much larger.

In May, OpenAI launched **OpenAI Deployment Co.**, a professional services business backed by more than **$4 billion** from 19 investors and valued between **$10 and $14 billion**. The same month, Anthropic and Blackstone launched **Ode**, a **$1.5 billion** AI implementation company. Both do the same thing: they send engineers into your building to redesign how your company works.

Read that back slowly, because the companies with the best AI models on Earth just spent billions of dollars building consulting firms. That is not a diversification play. It is an admission, and it is the most useful admission any AI vendor has made since this boom started: **the model was never the bottleneck.** If you have a budget for AI and have been wondering why the results keep underperforming the demos, the vendors have now answered you, in writing, with their own capital.

## What actually got built

Three announcements in four months, all pointing the same direction.

| Venture | Backers | Size | What it is |
|---|---|---|---|
| **OpenAI Deployment Co.** (May 2026) | Majority-owned by OpenAI, 19 investors, co-leads TPG, Advent, Bain Capital, Brookfield | **$4B+ raised, valued $10-14B** | Embedded engineers redesigning client workflows; McKinsey, Bain and Capgemini as partners; acquired Tomoro for ~150 engineers |
| **Ode** (May 2026) | Anthropic, Blackstone, Hellman & Friedman, Goldman Sachs | **$1.5B**, 100 engineers at launch | Built on the acquisition of Fractional AI; Claude-first but uses rival models when the job needs them |
| **Accenture Gemini Enterprise Business Group** (8 Sept 2026) | Accenture and Google Cloud | **1,000 forward deployed engineers** | Draws on Accenture's ~50,000 Google Cloud specialists; Google trains the engineers directly |

Notice who is on those cap tables. Blackstone, Goldman Sachs, TPG, Brookfield, Bain Capital: private equity and investment banks, not venture funds. That is the money that buys cash-generating services businesses, not the money that buys moonshots. They are underwriting this because they have looked at their own portfolio companies and concluded the demand is real and immediate.

Blackstone in particular did not guess. Ode was built out of **Fractional AI**, a boutique engineering services startup Blackstone had already hired to deploy AI across its portfolio, and which it identified as the standout performer before buying it outright. Fractional's founders, Chris Taylor and Eddie Siegel, now run Ode as CEO and chief technologist. This is a firm buying the contractor it already trusted, then scaling it.

## The quiet admission underneath

For two years the industry's answer to disappointing AI results was "wait for the next model." Better reasoning, longer context, cheaper tokens, and the returns would follow. Then the returns did not follow, at least not at the scale the spending implied, which is the pattern I dug into in [the Gartner no-ROI paradox](/b2b/ai-layoffs-no-roi-gartner-paradox-2026): the capability arrived, the measurable business return did not.

The labs have now diagnosed why, and their diagnosis is not technical. Ode's chief technologist put it about as plainly as an executive can: model selection matters, he said, but it is not where the majority of the calories are spent. Google Cloud's chief executive Thomas Kurian described the same gap from the buyer's side, saying companies struggle to understand how their business processes can be redesigned around AI.

That is the whole thesis in two sentences. The hard part is not choosing a model. The hard part is that AI does not pay off until somebody redraws the process it sits inside, and almost nobody inside a large company has the mandate, the technical depth, and the time to do that. It is the exact argument I have been making about [fixing the workflow before buying another AI tool](/b2b/before-you-buy-another-ai-tool-fix-the-workflow) and about [starting with services rather than functions](/b2b/start-ai-with-services-not-functions-2026). The difference is that now the people selling the models agree, and they have priced the disagreement at over $5 billion of committed capital.

## Why a lab would want a low-margin business

Here is the thing that should puzzle you if you think about margins for a living. API revenue is beautiful: software gross margins, no headcount attached to each dollar. Consulting revenue is the opposite: you bill for people, you carry those people, and the margin is a fraction of software. Why would the highest-margin businesses in technology deliberately bolt a low-margin one to the side?

Three reasons, and they compound.

**It sells tokens.** Every workflow an embedded engineer rebuilds becomes a permanent, high-volume consumer of the lab's model. The services arm is not really a profit center, it is a distribution channel wearing a consultancy's clothes. Judge it by the API revenue it drags behind it, not by its own P&L.

**It defends the account.** Once a lab's engineers have rebuilt your claims process or your underwriting flow, switching models stops being a procurement decision and becomes a re-engineering project. That is a far deeper moat than a benchmark lead, which lasts about one release cycle.

**It moves the labs up the value chain before the models commoditise.** Frontier capability is converging and prices keep falling, from [the Sonnet 5 price cuts](/tools/claude-sonnet-5-cheaper-than-opus-real-cost-2026) to near-free open weights. Implementation does not commoditise, because it is people work bound to a specific company's mess. Owning the last mile is how you keep pricing power after the first mile becomes a commodity.

Note the OpenAI Deployment Co valuation in that light. Ten to fourteen billion dollars for a services business that barely existed in May makes no sense on services multiples. It makes complete sense if the market is pricing the model consumption it will generate rather than the consulting fees it will book.

## The collision nobody has priced yet

Point this at the incumbents and the picture gets uncomfortable. Accenture, TCS, Infosys, Capgemini and the rest built enormous businesses on being the neutral party that implements other people's software. The AI labs now want that work, and they arrive with an advantage no systems integrator can match: they own the model, they know its failure modes before anyone else does, and they can price implementation as a loss leader against downstream token revenue.

Accenture's response to that threat is instructive. It did not compete with Google, it partnered, and the September announcement is the shape of the compromise: Accenture supplies the bodies and the industry knowledge, Google supplies the platform and trains the engineers itself. McKinsey, Bain and Capgemini took the same path into the OpenAI vehicle, joining as partners rather than rivals.

| The old model | The 2026 model |
|---|---|
| Vendor sells licences, SI implements, both stay independent | Vendor owns or co-owns the implementer |
| SI is model-neutral | Implementation is Claude-first, Gemini-first, GPT-first |
| Value in the software | Value in the process redesign around the software |
| Buyer negotiates vendor and SI separately | Buyer gets one throat to choke and one supplier to be locked into |

That last row is the one to keep in mind when you sign anything. The compromise the integrators struck is good for them and worse for you: the party redesigning your process now has a direct commercial interest in which model that process ends up depending on. Neutrality was never perfect, but it used to at least be the pitch.

## The job this created, and what it pays

If you want proof that a market is real, look at what it pays for scarce labour. Forward deployed engineering, a job title Palantir invented and nobody else wanted, has become one of the best-paid roles in technology.

| Role | Total compensation |
|---|---|
| Forward deployed engineer, Palantir median | ~$215,000 |
| Senior FDE at a frontier lab, median | **~$485,000** |
| Staff-level FDE at a frontier lab | **clearing $725,000** |
| Senior FDEs at OpenAI and Anthropic, top of range | **north of $785,000** |

Job postings for the role jumped more than **800%** between January and September 2025, and the labs use different names for the same person: OpenAI keeps "forward deployed engineer", Anthropic calls it "applied AI engineer".

The skill being paid for is worth naming precisely, because it is learnable and it is not what most people assume. It is not model training. It is sitting with an operations manager, understanding a real workflow well enough to see where judgement actually lives, and then building and shipping something that survives contact with the people who have to use it. Engineering plus consulting plus product sense, aimed at one company's specific mess. That is the profile at the top of [the AI job split premium](/learn/ai-job-split-2026-skills-premium-how-to-land-on-the-right-side) and the highest-paying corner of [the AI jobs market](/learn/highest-paying-ai-jobs-2026), and it is a much shorter path than an ML research career.

## What this means for you

**If you buy AI for a company**, take the vendors at their word and rebalance the budget. The industry consensus, funded with billions, is that licences are the cheap part and process redesign is where the return hides. If your AI budget is 90% seat licences and 10% change work, you have it backwards, and you will keep getting the results you have been getting. Also read the incentive: an implementation partner owned by a model vendor is an excellent engineer and an interested party. Use them, and keep an independent voice on the architecture, especially on anything that decides which model you depend on. The [seat-cost math](/tools/microsoft-copilot-seat-math-2026) is only half your bill; the other half is the redesign nobody budgeted for.

**If you sell AI services**, this is the strongest demand signal you will get all year, and it comes with a warning. The signal: the biggest, best-informed players on the planet just bet over $5 billion that implementation is the business, which validates the [AI consulting](/solo/ai-consulting-business) and [automation agency](/solo/ai-automation-agency-guide) models more convincingly than any case study could. The warning: they are competing with you now, and they pay $485,000 for the people you want to hire.

The way through is the one part of the market they structurally cannot serve. OpenAI Deployment Co and Ode are built for the Fortune 500, because a hundred engineers can only be pointed at very large accounts. Nobody at a $14 billion venture is going to redesign the intake process for a forty-person insurance brokerage. That entire tier, the one that also has money and the same broken workflows, is left to independents, and the playbook those clients need is in [the small business implementation guide](/b2b/how-to-implement-ai-in-small-business). Sell the outcome and the process work, not access to a model they can buy themselves for twenty dollars. That is method six in [the nine ways people actually make money with AI](/solo/how-to-make-money-with-ai-2026), and this week it got a five-billion-dollar endorsement.

**If you invest**, watch the margin mix at the labs. Services revenue grows the top line and dilutes gross margin, which matters a great deal for a company being valued on software multiples, [OpenAI at $852 billion](/vc/openai-852-billion-valuation-1-trillion-ipo-what-it-means-2026) very much included. It also matters for the incumbents: the systems integrators face a new competitor that owns the underlying product and can subsidise the work. And note the wider pattern. Between the labs buying their implementers and [Mistral being valued on jurisdiction rather than capability](/vc/mistral-3-billion-samsung-sovereign-ai-business-model-2026), the value in AI keeps migrating away from the model itself.

## What to watch

**Whether the labs report services revenue separately.** If they do, you can finally see the real margin. If they bury it inside the API line, assume it is thin and assume the point is token consumption.

**Whether the integrators stay partners.** Accenture, McKinsey and Bain have all chosen to join rather than fight. The moment one of them builds a genuinely model-neutral AI implementation practice at scale and markets it on independence, the neutrality problem becomes a live commercial issue rather than a footnote.

**Whether the ROI numbers finally move.** This is the real test. The labs have made an expensive bet that embedded engineers close the gap between AI capability and business return. If enterprise ROI data improves through 2027, they were right and the services model becomes permanent. If it does not, then the problem was never implementation either, and that would be the most important finding of the whole cycle.

**Whether it reaches the middle market.** Watch for a productised, fixed-price version of this aimed at companies with a few hundred employees. Whoever builds that owns a much larger market than the Fortune 500 tier everyone is fighting over now.

## The honest take

The detail I keep returning to is that Blackstone did not theorise its way here. It hired a small firm to fix AI deployment inside its own portfolio companies, watched what actually worked, and then bought the firm and put $1.5 billion behind it. That is not narrative, it is a private equity giant acting on its own operating data. Whatever you think of the valuations, that particular sequence is hard to argue with.

The pattern worth carrying is one this site keeps circling. Every time the technology layer gets cheaper and more capable, the money moves one step closer to the customer's actual problem. It moved from chips to models, then from models to the workflow, and the workflow is where it will stay for a while, because a workflow is specific to one company and therefore cannot be commoditised by the next release.

Which is why the most valuable AI skill in 2026 is not prompting, and it is not training models. It is knowing how work actually gets done inside an organisation, and being able to rebuild it. The frontier labs just paid over five billion dollars to acquire that skill, having failed to find enough of it on the market. If you have it, you are holding the scarce asset. If you are buying AI, that is the thing you are actually short of, and no model release is going to deliver it to you.

So here is the question worth putting to your next vendor meeting: if the companies that build the models have concluded that the models are not the hard part, why is the hard part still missing from your budget?

Sources: [TechCrunch: Anthropic and Blackstone bet the next trillion-dollar AI business is implementation](https://techcrunch.com/2026/07/15/anthropic-blackstone-bet-the-next-trillion-dollar-ai-business-is-implementation-not-models/); [Accenture newsroom: Accenture Gemini Enterprise Business Group](https://newsroom.accenture.com/news/2026/accenture-and-google-cloud-deepen-partnership-with-formation-of-new-accenture-gemini-enterprise-business-group); [AIwire: OpenAI launches Deployment Company](https://www.hpcwire.com/aiwire/2026/05/11/openai-launches-deployment-company-to-scale-enterprise-ai-adoption/).
