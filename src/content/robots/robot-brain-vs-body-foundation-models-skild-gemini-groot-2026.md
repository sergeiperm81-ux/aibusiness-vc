---
title: "A Robot Body Now Costs $16,000. A Company That Builds No Robots Is Worth $14 Billion."
description: "Google DeepMind shipped Gemini Robotics 2 in August. Nvidia's reference humanoid runs on Unitree hardware. Skild AI is valued above $14B with zero robots. The body is becoming a commodity and the money is moving to the brain — here's the math."
date: "2026-09-03"
author: "Sergei Ponomarev"
category: "Robots"
image: "/images/articles/robot-arm-1.jpg"
keywords: ["robot foundation model 2026", "Gemini Robotics 2", "Skild AI valuation", "Nvidia GR00T humanoid", "robot brain vs body", "physical AI investing"]
---

# A Robot Body Now Costs $16,000. A Company That Builds No Robots Is Worth $14 Billion.

Put two facts side by side and the whole robotics industry rearranges itself in your head. A Unitree G1 humanoid — arms, legs, hands, sensors, the entire physical machine — starts around **$16,000**. Skild AI, a company founded in 2023 that has never shipped a robot and does not intend to, is valued at **more than $14 billion**.

That isn't a bubble anecdote. It's the clearest signal yet of where value is settling in physical AI. For three years the robotics story was about bodies: who can build a humanoid that walks, grips, and doesn't fall over. That problem is being solved, and — critically — it's being solved *cheaply*, mostly in China. So the interesting money has moved one layer up, to the thing that tells the body what to do. August 2026 made this impossible to ignore: Google DeepMind shipped a robot brain that runs across different machines, and Nvidia's own reference humanoid turns out to be built on someone else's hardware. Let me show you the shift and the arithmetic behind it.

## What DeepMind actually shipped

On **August 6, 2026**, Google DeepMind released **Gemini Robotics 2** — a vision-language-action (VLA) model, meaning it takes in what the robot sees plus an instruction in plain language and outputs motor control. It's the layer that converts "tidy this bench" into thousands of joint commands.

Three things about it matter commercially, not just technically:

- It controls **full humanoids, feet to fingertips**, as well as two-armed robots — not one vendor's arm, a *class* of machines. DeepMind calls it "intelligent whole-body control."
- It ships in **three variants**: the standard VLA, **Gemini Robotics ER 2** for embodied reasoning (a robot understanding a scene and a human's intent), and **Gemini Robotics On-Device 2** that runs at the edge without a cloud round-trip.
- Robots running it can **collaborate as a team** with other robots.

Read that first bullet again, because it's the business model hiding in a research announcement. A brain that runs on many bodies is a *platform*. A brain that runs on one body is a feature. DeepMind built the first kind — and a demonstration on an Apptronik humanoid, not a Google-made one, made the point in public.

## The brain layer is now crowded and extremely well funded

Gemini Robotics 2 isn't alone. A serious field has assembled around the same bet, and the funding tells you how seriously it's taken:

| Player | What they're building | Money signal |
|---|---|---|
| **Skild AI** | "Skild Brain" — one model to control **any robot, any task**, without bespoke retraining | **$1.4B Series C** (Jan 2026, SoftBank-led); valued **above $14B** — roughly triple its worth seven months earlier |
| **Google DeepMind** | Gemini Robotics 2 / ER 2 / On-Device 2, plus the Genie 3 world model | Funded by Alphabet; shipping across third-party hardware |
| **Nvidia** | **Isaac GR00T** open foundation model + Cosmos world models | GR00T N2 due end-2026; Cosmos 3 shipped May 31, 2026 |
| **Physical Intelligence** | pi-series robot foundation models | Among the most-watched independents in the category |
| **Meta** | V-JEPA 2 world model | Big-tech entry into physical-world prediction |

Look at Skild's investor list, because it's a who's-who of people who would know: SoftBank led, with **Nvidia's NVentures, Bezos Expeditions, Samsung, LG, Schneider Electric and Salesforce Ventures** alongside. Samsung, LG and Schneider all *make physical things*. When manufacturers put money into a software company that controls robots rather than into another robot, they're telling you which half of the stack they think is scarce.

## The tell: Nvidia's own humanoid runs on Unitree hardware

If one detail convinces you, make it this one. Nvidia announced an **Isaac GR00T Reference Humanoid Robot** at GTC Taipei on June 1, 2026 — and it is **built on Unitree hardware**, with availability expected late 2026.

Sit with what that means. The most valuable semiconductor company on Earth, building a reference platform for humanoid robotics, did not design its own body. It took a Chinese manufacturer's machine and treated it as a standard chassis to run software on. That's not a cost-saving shortcut; it's a statement about where the difficulty — and therefore the margin — no longer lives. The body has become something you *source*, the way a PC maker sources a case.

This is the same structural pattern I've traced in adjacent markets. It's what [Qualcomm spent $3.9 billion to attack in the CUDA software layer](/startups/qualcomm-modular-4-billion-break-nvidia-cuda-moat-2026): whoever controls the layer everybody depends on collects the toll, and the layer beneath commoditizes. Robotics is running the same play, one floor down from the chip.

## The money math: body economics versus brain economics

Here's why the value is migrating, in plain arithmetic. Compare what each layer can actually charge:

| | **The body** | **The brain** |
|---|---|---|
| Unit price | Unitree G1 from **~$16,000**; [Neura's 4NE-1 ~€98,000](/robots/neura-robotics-1-4-billion-europe-humanoid-bet-2026) | Licensed per robot / per hour / per task |
| Cost structure | Steel, actuators, batteries, assembly — real bill of materials every unit | Trained once, copied at near-zero marginal cost |
| Who wins on price | Chinese manufacturers, [structurally](/robots/why-china-builds-humanoids-cheaper) | Whoever has the best model and the most data |
| Margin direction | **Compressing** toward manufacturing cost | **Expanding** with scale |
| Revenue shape | One-time sale, then spare parts | **Recurring**, on every robot-hour worked |

That bottom-right cell is the prize. I wrote recently about [Figure billing BMW roughly $25 per robot-operating-hour](/robots/humanoid-robots-25-dollars-per-hour-bmw-figure-raas-2026) — the moment robot labour got an hourly rate. Now ask the follow-up: when a robot bills $25 an hour, who gets the money? Today, whoever owns the whole stack. But once bodies standardize and brains are portable, the brain vendor can take a cut of **every hour, on every body, at every customer** — without ever manufacturing anything. Software margins on physical-world labour is one of the most attractive business models anyone has sketched this decade.

Meanwhile the hardware side keeps proving it can't hold a premium. Unitree ships more humanoids than any Western rival at roughly a tenth of the price, the price war I mapped in [the Unitree IPO piece](/startups/china-humanoid-robots-unitree-ipo-price-war-2026), and the [full price board](/robots/humanoid-robot-price-comparison-2026) has been sliding all year.

## The Android moment — with one important caveat

The obvious analogy is smartphones: hardware became a commodity assembled largely in Asia, while Google and Apple captured the profit through the operating system and its ecosystem. Robotics looks like it's heading the same way, and the players are positioning exactly as if it is — Nvidia offering an *open* foundation model plus a reference body is a near-perfect replay of the Android playbook.

The caveat is that robots are not phones, and I'd be overselling the analogy if I skipped this. Phones don't need to understand friction, weight, or what happens when a grip slips. The data required to make a robot competent is **physical interaction data**, and that data is generated by *bodies doing work in the world*. That gives whoever operates large fleets — Figure at BMW, Amazon in warehouses — a data flywheel a pure-software company can't easily buy. Nvidia's own GR00T N2, due end-2026 on a "DreamZero" world-action architecture, is aimed squarely at this: it's expected to more than double the success rate on unfamiliar tasks in unfamiliar environments, which is precisely the gap that stops today's brains from being truly universal.

So the honest position is: the brain layer is where the margin *wants* to go, and the market is pricing it that way — but the moat may end up belonging to whoever pairs a good model with a large deployed fleet.

## What would break this thesis

Let me argue the other side properly, because the "brains beat bodies" story is seductive and could be wrong.

**Vertical integration might win.** Figure — valued at **$39 billion** after a Series C of more than $1 billion backed by Nvidia, Intel Capital and Qualcomm Ventures — builds both the body and the intelligence, and it has the paying customer. Tesla is doing the same with Optimus. If tight body-brain co-design produces meaningfully better robots than mix-and-match, the integrated players keep the value and the platform story never happens, exactly as I weighed it in [Figure versus Tesla Optimus](/robots/figure-vs-tesla-optimus-real-vs-hype-2026).

**Bodies might not standardize.** The Android analogy needs interchangeable hardware. If every humanoid has meaningfully different kinematics, a "runs anywhere" brain stays a demo.

**The valuations might simply be too high.** $14 billion for a company with no shipping product is a bet on a future that hasn't arrived, and it lives in the same frothy market I examined in [the AI bubble math](/vc/is-ai-a-bubble-2026-numbers-what-to-do-with-your-money). Physical AI has a long history of impressive demos and disappointing deployments.

## The robot stack, layer by layer

If you're trying to work out where you or your money sits in all this, it helps to see the stack drawn out. Robotics has separated into four layers in about eighteen months, and they are not equally attractive:

| Layer | Who leads | Economics |
|---|---|---|
| **Silicon & simulation** | Nvidia (Isaac, Cosmos) | Picks-and-shovels; sells to everyone regardless of who wins above |
| **Foundation model (the brain)** | Skild, DeepMind, Physical Intelligence, Nvidia GR00T | Train once, copy free; **recurring revenue per robot** |
| **Body / hardware** | Unitree, AgiBot, Neura, Figure, XPeng Dogotix | Real bill of materials; **price war already underway** |
| **Deployment & fleet ops** | Integrators, RaaS operators, in-house teams | Services margin; owns the customer *and* the interaction data |

That bottom row is the one most people overlook, and it may be the quiet winner. Whoever runs fleets in production accumulates the physical-interaction data that makes brains better — and holds the customer relationship where the $25-an-hour invoice actually gets signed. A brain vendor without deployed fleets is training on someone else's problem; a fleet operator without a brain is renting intelligence. The companies that end up owning both layers are the ones to watch, which is exactly why the integrated players can't be written off.

Notice too that the top row is the safest seat in the house. Nvidia sells simulation and silicon to every layer beneath it, publishes an open foundation model, and now ships a reference body — it profits whether brains or bodies win, which is the same structural position it holds in the [data-centre AI market](/startups/nvidia-q1-fy27-earnings-78-billion-test-2026).

## What this means for you

**If you invest in the robot theme**, the practical takeaway is to stop treating "robotics" as one trade. There are now at least three distinct layers — chips and simulation ([Nvidia](/startups/nvidia-q1-fy27-earnings-78-billion-test-2026)), foundation models (Skild, DeepMind, Physical Intelligence), and bodies (Unitree, Figure, Neura, XPeng's Dogotix unit, which just raised over **$900 million** at more than **$6.3 billion**). They have completely different margin profiles, and the cheap-body dynamic argues against paying a software multiple for a manufacturer. The basket logic in [how to invest in the robot boom](/robots/how-to-invest-in-the-robot-boom) still applies, but pick your layer deliberately.

**If you're a business that might buy or rent robots**, this shift is good news and worth planning around. Standardized bodies plus portable brains means falling prices and, eventually, the ability to change your software without replacing your hardware. Which leads to the question you should be asking any vendor now: *if I buy your robot, whose brain runs it, and can I switch?* That is the physical-world version of the lock-in lesson from [OpenAI cutting off Cursor's model access](/tools/openai-cuts-off-cursor-spacex-model-lock-in-lesson-2026) — a robot you can't re-brain is a robot whose capabilities are hostage to one supplier's business decisions.

**If you build or work in this field**, the skills that compound are the ones near the brain and the deployment: robot learning, data collection from real fleets, integration and fleet operations. Body manufacturing is heading where manufacturing always heads — toward whoever does it cheapest at scale. That's the same reallocation of who-gets-paid I keep tracking across [AI and jobs](/b2b/ai-replacing-jobs).

## The honest take

What makes this moment interesting isn't that robots got smarter in August — they did, but incrementally. It's that the industry quietly agreed on where the difficulty lies. When Nvidia builds its reference humanoid on a Chinese chassis, when Samsung and LG write cheques to a software company instead of building another robot, and when a brain with no body is worth $14 billion, the market has made a collective judgment: **the hard, defensible, high-margin part of robotics is the intelligence, not the machine.**

The pattern behind it is the one this site keeps running into. In every technology stack, one layer becomes the thing everyone depends on and can't easily replace, and that layer takes the profit while the rest competes itself toward cost. Chips had CUDA. Phones had the operating system. Robotics is choosing its layer right now, in public, and the bodies — impressive, expensive-looking, the part that makes the videos — are lining up to be the commodity.

So here's the question worth carrying into the next humanoid announcement you see: everyone will be looking at the machine. Ask instead whose brain is running it, whether that brain could run on a cheaper body tomorrow, and who collects the fee for every hour it works. That answer, not the backflip, tells you where the money goes.

Sources: [Google DeepMind — Gemini Robotics 2](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/); [TechCrunch — Skild AI hits $14B valuation](https://techcrunch.com/2026/01/14/robotic-software-maker-skild-ai-hits-14b-valuation/); [NVIDIA — Isaac GR00T reference humanoid](https://nvidianews.nvidia.com/news/nvidia-open-humanoid-robot-reference-design).
