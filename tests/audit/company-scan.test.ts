/**
 * AI Company Scan on the shared engine: the questions, the site input, the
 * preview, the order and the report.
 * No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildScanQuestions, toScanSubject } from "../../src/lib/audit/company-check";
import { parseCompanySite } from "../../src/lib/audit/company-site";
import { memoryKv } from "../../src/lib/audit/durable-kv";
import { anchorsFor, pageTiedToPerson } from "../../src/lib/audit/person-source-check";
import { buildPersonReportPdf } from "../../src/lib/audit/person-report-pdf";
import { loadOrder } from "../../src/lib/audit/professional-order";
import { parseIdentity } from "../../src/lib/audit/professional-preview";
import { productNameFor, reportEmailContent } from "../../src/lib/audit/professional-delivery";
import { handleProScanOrder } from "../../src/lib/audit/professional-webhook";
import type { AnswerCheck } from "../../src/lib/audit/answer-check";
import type { PersonSubject } from "../../src/lib/audit/person-check";
import type { PersonSynthesis } from "../../src/lib/audit/person-synthesis";

const ACME: PersonSubject = {
  kind: "company",
  name: "Acme Robotics",
  role: "Warehouse robots",
  company: "Acme Robotics GmbH",
  location: "Berlin, Germany",
  profileUrl: "https://acme-robotics.de",
  companyDomain: "acme-robotics.de",
};

test("a company gets company questions with the same ids, and a person keeps hers", () => {
  const questions = buildScanQuestions(ACME);
  assert.deepEqual(questions.map((q) => q.id), ["who", "does", "reputation"]);
  assert.match(questions[0].question, /Who is behind Acme Robotics, Warehouse robots \(acme-robotics\.de\)\?/);
  assert.match(questions[2].question, /lawsuits, regulatory actions, scam warnings/);
  const person = buildScanQuestions({ name: "Jane Doe", role: "Analyst", company: "Doe Ltd", profileUrl: "https://www.linkedin.com/in/jane" });
  assert.match(person[0].question, /^Who is Jane Doe, Analyst at Doe Ltd/);
  assert.equal(toScanSubject(ACME).kind, "company");
  assert.equal(toScanSubject(ACME).domain, "acme-robotics.de");
});

test("the site field takes a domain in any spelling and refuses social networks and private hosts", () => {
  const ok = parseCompanySite("https://www.Acme-Robotics.de/about?x=1");
  assert.ok(ok.ok);
  assert.equal(ok.domain, "acme-robotics.de");
  assert.equal(ok.target.url, "https://acme-robotics.de");
  assert.equal(parseCompanySite("linkedin.com/company/acme").ok, false);
  assert.equal(parseCompanySite("localhost").ok, false);
  assert.equal(parseCompanySite("10.0.0.1").ok, false);
  assert.equal(parseCompanySite("").ok, false);
});

test("the company preview keeps a name with digits and symbols, and marks the preview as a company", () => {
  const json = {
    choices: [{ message: { content: JSON.stringify({ found: true, name: "AT&T 3M <script>", role: "Telecom", company: "", field: "x", location: "Dallas" }) } }],
  };
  const identity = parseIdentity(json, { url: "https://att.com", networkLabel: "website", handle: "att.com" }, "company");
  assert.equal(identity.kind, "company");
  assert.equal(identity.name, "AT&T 3M script");
  assert.equal(identity.found, true);
});

test("a page counts for a company when it names it next to its domain, legal name or city; its own site is trusted", () => {
  const anchors = anchorsFor(ACME);
  assert.equal(anchors.ownDomain, "acme-robotics.de");
  assert.equal(pageTiedToPerson("Acme Robotics (acme-robotics.de) raised a round.", anchors), true);
  assert.equal(pageTiedToPerson("Acme Robotics of Berlin, Germany ships robots.", anchors), true);
  assert.equal(pageTiedToPerson("Acme Robotics Inc. in Ohio was sued.", anchors), false);
});

async function withCompanyPreview(kv: ReturnType<typeof memoryKv>): Promise<void> {
  await kv.set(
    "pscan:preview:c0ffee0123456789abcdef01",
    JSON.stringify({
      id: "c0ffee0123456789abcdef01",
      kind: "company",
      profileUrl: "https://acme-robotics.de",
      network: "website",
      found: true,
      name: "Acme Robotics",
      role: "Warehouse robots",
      company: "Acme Robotics GmbH",
      field: "robotics",
      location: "Berlin, Germany",
      source: null,
      createdAt: "t",
    }),
    60
  );
}

const PAID = { status: "paid", user_email: "buyer@example.com", discount_total: 0 };
const CUSTOM = { preview_id: "c0ffee0123456789abcdef01" };

test("a company order is stored as a company, with its domain", async () => {
  const kv = memoryKv();
  await withCompanyPreview(kv);
  const outcome = await handleProScanOrder(kv, { data: { id: "900" }, attributes: PAID, customData: CUSTOM, variantId: "88", kind: "company" });
  assert.equal(outcome.body.queued, true);
  const order = await loadOrder(kv, "900:88");
  assert.equal(order?.subject.kind, "company");
  assert.equal(order?.subject.companyDomain, "acme-robotics.de");
  assert.ok(order);
  assert.equal(productNameFor(order), "AI Company Scan");
  assert.match(reportEmailContent(order).subject, /^AI Company Scan: Acme Robotics/);
});

test("paying for one scan with a preview for the other is not fulfilled, and the owner is told", async () => {
  const kv = memoryKv();
  await withCompanyPreview(kv);
  const outcome = await handleProScanOrder(kv, { data: { id: "901" }, attributes: PAID, customData: CUSTOM, variantId: "77", kind: "person" });
  assert.equal(outcome.startWorker, false);
  assert.match(outcome.ownerAlert ?? "", /other scan/);
  assert.equal(await loadOrder(kv, "901:77"), null);
});

test("the company report renders", async () => {
  const answer = (providerId: string, providerLabel: string) => ({
    providerId: providerId as "openai",
    providerLabel,
    model: "m",
    askedAt: "2026-09-21T08:00:00Z",
    ok: true,
    text: "Acme Robotics makes warehouse robots in Berlin.",
    citations: ["https://acme-robotics.de/about"],
    usage: [],
  });
  const check: AnswerCheck = {
    subject: toScanSubject(ACME),
    checkedAt: "2026-09-21T08:00:00.000Z",
    providers: [
      { id: "openai", label: "OpenAI", model: "gpt-4.1-mini" },
      { id: "xai", label: "Grok", model: "grok-4.3" },
    ],
    results: buildScanQuestions(ACME).map((fact) => ({ fact, answers: [answer("openai", "OpenAI"), answer("xai", "Grok")] })),
  };
  const synthesis: PersonSynthesis = {
    identity: { summary: "Acme Robotics is a Berlin robotics firm.", facts: [{ label: "Founded", value: "2019", saidBy: ["OpenAI"] }] },
    professional: { summary: "It sells robots.", roles: [{ label: "Offer", value: "Warehouse robots", saidBy: ["OpenAI", "Grok"] }], activity: [], activityNote: "" },
    redFlags: { flags: [], clear: ["No lawsuits found"], caveats: [], reviews: [] },
    mixups: [],
    disagreements: [],
    coverage: check.results.flatMap((row) => check.providers.map((p) => ({ provider: p.label, questionId: row.fact.id, status: "found" as const }))),
    recommendations: [{ title: "Name the owners", why: "No model named them.", steps: ["Publish one dated page that names the owners."] }],
  };
  const bytes = await buildPersonReportPdf({ name: "Acme Robotics", profileUrl: ACME.profileUrl, check, synthesis });
  assert.equal(Buffer.from(bytes.slice(0, 5)).toString("latin1"), "%PDF-");
});
