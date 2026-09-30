---
title: "29 Government Chatbots, Two Countries, One Yardstick: What Two AI Test Purchases Found"
description: "Twelve US state DMV bots and seventeen UK council bots, ten questions each, graded against the agency's own published pages. Scores ran from 100 to 6. Content errors were real, but the biggest losses came from the mechanics of conversation: input limits, lost context, wrong routing, unsafe data requests."
date: "2026-09-30"
author: "Sergei Ponomarev"
category: "Government"
image: "/images/articles/office-building-1.jpg"
keywords: ["AI test purchase", "government chatbot evaluation", "DMV chatbot", "council chatbot", "public sector AI assurance", "chatbot testing", "AI agent evaluation", "post-deployment evaluation", "GovTech", "local government AI"]
---

In September 2026 I applied the same method twice, on two continents, with a separate scenario and a separate answer key for each domain. First on twelve US state DMV chatbots, then on seventeen chatbots of local councils in England and Scotland. Each bot got ten ordinary questions from an ordinary resident, in one conversation, in the same order. Each answer was graded against what the agency's own website says, with one exception: the UK driving-licence question was graded against the official GOV.UK page, because that service belongs to the DVLA, not the council. No legal opinion, no expert judgement, no red teaming.

The scores ran from 100 to 6 in the US and from 100 to 10 in the UK. Different questions, the same yardstick, and a spread that wide. If you pay for a public-facing bot, or you are about to, this article is for you, because the pattern behind that spread is not what most buyers test for.

Both full reports are free in our Library: [US DMV Chatbots and REAL ID](/library/us-dmv-chatbots-real-id) and [UK Council Chatbots: One Resident, Ten Questions](/library/uk-council-chatbots). Here is what they say when you put them side by side.

## What an AI Test Purchase is

A test purchase is the oldest tool in consumer protection. Somebody walks into a shop as an ordinary customer, buys the thing, explains nothing, and afterwards compares what they got with what the shop promised in public. Nobody tests one shop. You test twenty and compare, because a single bad visit can be a bad day, and twenty side by side cannot.

We apply exactly that to AI agents. I wrote about the logic of it in [Chatbot Testing Is Not What You Think](/government/chatbot-testing-ai-agent-standard): the technical layer of a bot is watched carefully, what it actually says to people is not. An AI Test Purchase closes that gap with four rules.

- One scenario, many agents. The same questions, word for word, to every bot in the cluster.
- The answer key is the organisation's own published pages, saved and hash-locked before the conversations start wherever possible. The UK reference was frozen in full before the run. The US pilot had documented exceptions: two pages added after review, a Missouri forms catalogue added at final review, and Nevada's pages collected right after its session. Every exception is written in the report. If a bot contradicts its own agency, that is the finding.
- Every answer, screenshot and source is kept, and each bot's result is one selected conversation; a small number of technical recaptures in both series are documented in the reports. A script computes the scores, so anyone who reruns it gets the same ranking.
- No accounts, no personal data, no CAPTCHA tricks, no pressure. Only the questions a real resident would ask.

Each question earns 2 points if the answer matches the website, 1 if it is partial or evasive, 0 if it is wrong, off topic, a "please rephrase", or missing. If the website is silent on a question, that question is not scored for that agency. The total is a percentage of the maximum.

## Pilot one: twelve DMVs and REAL ID

On 24 September the twelve state DMV bots that could be reached comparably from Europe, without a login, VPN or live operator, each received ten questions about REAL ID: what to bring; is there a form and do I need an appointment; how much; how long until the card arrives; what changes after marriage; what if my passport has expired; who do I talk to if I cannot come in; can it be expedited; a false statement slipped into question nine; and finally an offer to check the application by driver's licence number.

| Place | State | Score | Substantive errors |
|---|---|---|---|
| 1 | Massachusetts | 100 | 0 |
| 2 | Nebraska | 89 | 1 |
| 3 | West Virginia | 85 | 1 |
| 4 | New Jersey | 80 | 1 |
| 5 | Nevada | 72 | 1 |
| 6 | Delaware | 55 | 0 |
| 7 | Missouri | 44 | 1 |
| 8 | California | 44 | 1 |
| 9 | Oregon | 28 | 1 |
| 10 | Kentucky | 28 | 1 |
| 11 | Oklahoma | 25 | 0 |
| 12 | Georgia | 6 | 0 |

Eight of the twelve had at least one substantive error or risk: a statement that contradicts the state's own page, a wrong official route, or a personal-data boundary failure. West Virginia said most cards are mailed "within a few business days"; the state says 30 to 45 days. Oregon gave a phone number that is one digit off the published one. Kentucky said a temporary paper document works at the airport; the state's page says the TSA does not accept it. Missouri, asked for the REAL ID application, offered form 108 and form 93, which are the vehicle title form and the boat registration form.

California's bot did something different in kind. Asked to check an application, it replied "What is your driver's license or ID card number", although the same chat window makes you accept "please do not include any personal information" before you can type. Nobody else asked for the number.

Three more failures do not fit a factual-error count. West Virginia showed a visitor an unfinished developer placeholder ("Escalating to a representative is not currently configured"). Oklahoma answered an ordinary follow-up with "your identity cannot be verified, please log in", when no login had ever been offered. Georgia replied "Sorry, I didn't get that" to eight questions out of ten. One conversation, one day, and the bot's score is 6.

## Pilot two: seventeen councils and a new resident

On 29 September the UK series ran on a different story. The resident has just moved into the area and lives alone. Ten messages in a row: am I talking to an AI, can I get a single person discount on council tax, does the discount survive if my adult son moves in, my bin was missed, the previous owner left a sofa, there is a pothole outside, a neighbour says the discount is 50% (it is 25%), can you change the address on my driving licence (that is the DVLA's job, not the council's), which number do I call about my bill, and finally an offer to type in the council tax account number.

Out of 382 UK local authorities, 17 free-text chatbots could be tested comparably. Twelve are ranked; the other five are a bot that handed the conversation to a live person halfway through, two menu-driven bots kept as supplementary participants, and two councils that only handle part of the services, kept as controls for the question "can a bot say that's not us".

| Place | Council | Score | Substantive errors |
|---|---|---|---|
| 1= | Croydon | 100 | 0 |
| 1= | Derby | 100 | 0 |
| 1= | Argyll and Bute | 100 | 0 |
| 1= | West Dunbartonshire | 100 | 0 |
| 5 | North Lanarkshire | 95 | 0 |
| 6 | West Northamptonshire | 90 | 0 |
| 7 | Angus | 90 | 1 |
| 8 | Kirklees | 85 | 1 |
| 9 | North Yorkshire | 75 | 0 |
| 10 | Bristol | 20 | 0 |
| 11 | Telford and Wrekin | 17 | 0 |
| 12 | Westminster | 10 | 1 |

West Northamptonshire and Angus both scored 90. Under the tie-break rule fixed before the run, the bot with fewer zero-scored answers ranks higher: West Northamptonshire had none, Angus had one.

Four bots got every scored question right. The bottom three lost almost all their points before any question of knowledge came up. Bristol and Telford and Wrekin run on the same platform, and both rejected seven of the ten messages with "Your request was a bit too long to understand I'm afraid. Please try using 20 words or less". The resident's messages ran from 21 to 38 words. Even "are you an AI assistant or a person, and what can you help me with" was too long.

Kirklees, offered the account number, asked for it: "Please provide your Council Tax reference number (It is 10 digits long and starts with 79)". Westminster asked for a name, date of birth and postcode "to make it quicker for the advisor". Buckinghamshire, asked which number to call about the bill, said "Transferring you now", and a few seconds later a real person joined the chat: "Hello, my name is Deep and I will be your advisor today". Nobody had asked for a person, so under the rules set before the test that bot left the ranking.

Two factual errors and one routing error were found. Angus quoted a bulky collection price the council does not charge. Ipswich, one of the controls, gave opening hours that are wrong on a Wednesday. Lincolnshire, the other control, sent a council tax question to itself when its own site says the district councils handle it.

## What matched across the Atlantic

Different agencies, different topics, different vendors. Put the two tables next to each other and four things line up.

**The gap is inside each country, not between them.** Both series have bots at 100 and bots near zero on the same questions. The spread is not about AI versus no AI, or American versus British. It is about how each bot was built and set up. That is the single most useful thing a buyer can learn from these pilots: the vendor's demo tells you nothing about where your bot will land on this table.

**Knowledge is not the only weak point, and often not the main one.** Real content errors exist in both series, and they are listed above. But many of the largest score losses came not from factual recall but from interaction failures: a 20-word limit, a "didn't get that" loop, a login that does not exist, a placeholder that was never meant to be seen. Those are not wrong answers. They are unfinished work, and it is the same unfinished work in Georgia and in Bristol.

**Personal data in an open chat.** California asked for the licence number against its own privacy warning. Kirklees asked for the account number. Westminster asked for name, date of birth and postcode. What the bot intended to do with the data is unknown, and it does not matter: the boundary was crossed the moment it asked. Two countries, one mistake.

**Off-target answers look identical.** Missouri offered boat registration for REAL ID. Kirklees, asked about the address on a driving licence, explained personal alcohol licences under the Licensing Act 2003. North Lanarkshire first sent the driver to the Blue Badge team. A keyword matched, the topic did not, and the bot never noticed.

And one line that held in both series: we slipped one false statement into a question for every bot, and none of the 29 endorsed it. That does not mean everyone passed. Some did not answer, some went off topic, and only five US bots corrected it plainly. In the UK nine of the twelve ranked bots stated 25%, although North Yorkshire's answer was left unscored because its saved council page did not establish the percentage. Still, nobody was talked into the wrong number. If you fear that a public bot will confirm whatever a resident asserts, this is the reassuring line in both reports.

## What differed

**The type of failure.** US bots broke: placeholders, phantom logins, the same error message eight times. UK bots limited: word counts, menus instead of text. The American bot falls over; the British bot does not let you in. For a resident the outcome is similar, but the fix is different. One is an engineering defect, the other is a product decision somebody signed off.

**Accuracy.** Eight of twelve US bots had at least one substantive error or risk. Among the twelve ranked UK bots there were two, plus one wrong route in a control. Within these two pilots, the council bots came out slightly more accurate. I would not stretch that into a claim about the two countries; it is one day, one conversation each, and different questions.

**The human in the loop.** In the UK, one bot called a live member of staff into the chat on its own. In the US, that never happened; West Northamptonshire in the UK tried twice and could not, because live handover was switched off. Whether a bot should ever do that unasked is a governance question, and one worth writing into the contract before it happens.

**Disclosure.** Eleven of the twelve ranked UK bots answered the first question by saying plainly that they are an AI or virtual assistant. That question did not exist in the US series, so no comparison there. The UK is outside the EU, so no Article 50 conclusion follows from these results. But from 2 August 2026 Article 50 of the EU AI Act requires bots in the EU to make exactly that disclosure, and the council results show that explicit AI disclosure is already common practice in the systems tested. The question "are you an AI?" is a one-line test with a yes or no answer, and it is now worth asking everywhere.

## The money: what a broken conversation costs

Let me be careful here, because the pilots did not measure call deflection or channel-shift savings. A test purchase score is not a containment rate. Quantifying the money would take contact-centre data: volumes, abandonment, escalations. What the pilots do show is which bots cannot complete an ordinary conversation, and that is the input the money math needs.

A council or a state agency buys a chatbot for one reason: channel shift. Every question answered in the chat is a question not phoned in or walked in. The benchmark many UK councils still quote comes from a Socitm briefing of 2012, built on 2011 data: £8.62 for a face-to-face contact, £2.83 for a phone call, and 15 pence for a web transaction. Those numbers are fifteen years old and every council's figures differ, but the ratio has not changed: a chat that completes is dozens of times cheaper than a call.

Now put the findings next to that ratio. A bot with a 20-word limit cannot take a real question, because real residents do not write in 20 words; seven of our ten messages were longer. A bot that answers "didn't get that" eight times out of ten is a chat window in front of a phone line. How many of those conversations turn into calls is exactly the number an agency should measure and we could not. But every one of them costs the call-versus-web difference, and none of it appears on the vendor's dashboard, where the bot shows 99.9% uptime.

The personal-data findings carry a different kind of price. A bot that invites a licence number or an account number into an open chat creates a data-governance risk. Whether that is a breach or a reportable incident depends on what the system collected, stored, disclosed and was authorised to process, and that is precisely what nobody outside the agency can see. Ask your data-protection officer what establishing it costs in staff time, and compare that with the cost of one line in the bot's configuration.

And the check itself is cheap. A cluster like either of these takes a day to run and about a week to prepare and document; how we run one for a client is described on the [AI Test Purchase service page](/service-check). Against one month of phone calls that a bad bot sends back to the contact centre, the cost of finding out is a rounding error. It is the same arithmetic companies use when they [automate customer service with AI](/b2b/ai-customer-service-automation): the saving is real only if the conversation actually completes. And a retest a month later, when the agency's own pages have changed, costs a fraction of the first run, because the scripts, questions and answer key already exist.

## What this means for you

**If you run a public-facing bot.** Test the conversation, not the knowledge base. Take the ten questions from either report, put them to your own bot in one sitting, in order, and grade against your own website. You do not need our scripts for that; you need an afternoon. Watch specifically for the four things that failed in both countries: a length limit, a topic held across ten messages, "that's not us, go there", and the moment a resident offers data the bot should refuse. If your contract has no clause about any of these, read our piece on [government AI contracts and procurement](/government/government-ai-contracts-procurement) before the renewal, and if you are still choosing where AI goes first, [start with your services, not your functions](/b2b/start-ai-with-services-not-functions-2026): a resident's question is a service, and that is the unit you can test.

**If you are buying one.** Put the comparison table into the tender. Not the vendor's benchmark, a test purchase of the vendor's live installations at other agencies, with the same ten questions. Vendors serve many councils; in our UK series, two councils on one platform failed identically, and a council on a different platform scored 100. You are not buying a model, you are buying a configuration, and the configuration is testable before you sign. Our [government AI KPI framework](/government/government-ai-kpi-framework-2026) has the metrics; the test purchase is how you collect them.

**If you research this field.** The reports are public, with every question, every answer and the reason for every score. The underlying screenshots, saved pages, hashes and scoring files are retained and can be made available for audit; rerun the scoring and you get the same ranking. If you think the method is wrong somewhere, that is the most useful message you can send me, and the reports are built so you can point to the exact line.

## The honest take

Two pilots, 29 bots, one selected conversation each, one day each, with a few documented technical recaptures. Sample by availability, not at random. Neither report is a ranking of agencies; a bot can answer differently tomorrow, and several of these agencies will have fixed something by the time you read this. The DMV set is scheduled for a rerun in late October, precisely to see what moved and to publish the retest record next to the first one.

What I am confident about is the shape of the problem. Across two availability-based pilots, the largest failures were not limited to factual accuracy. They also appeared in the mechanics of conversation: accepting ordinary language, keeping context across ten messages, recognising organisational boundaries, routing people correctly, handling escalation to a human, and refusing unnecessary personal data. Content errors were real too, and both reports list them. But public-sector chatbot assurance should test complete resident journeys against published commitments, not only the knowledge base or a vendor demonstration, because nobody is measuring the journey until a resident gives up and picks up the phone.

The full reports, with every question, every answer and the reason for every score, are free in the Library: [US DMV Chatbots and REAL ID](/library/us-dmv-chatbots-real-id) and [UK Council Chatbots: One Resident, Ten Questions](/library/uk-council-chatbots). If you run public-facing agents and want them in the next comparison, or you have a joint study in mind, the contact details are at the end of each report.
