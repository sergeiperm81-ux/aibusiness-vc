/**
 * A run's journal is never overwritten.
 *
 * Uses a temporary directory. No network, no keys. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { newRunId, openJournal } from "../../src/lib/audit/journal-file";
import type { JournalEvent } from "../../src/lib/audit/usage";

function withTempDir(body: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), "answer-check-journal-"));
  try {
    body(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const started: JournalEvent = {
  event: "started",
  clientRequestId: "abc",
  provider: "openai",
  model: "gpt-4.1-mini",
  purpose: "answer",
  factId: "what",
  attemptNumber: 1,
  startedAt: "2026-09-12T12:00:00.000Z",
  bounds: { maxInputTokens: 1, maxOutputTokens: 1, maxWebSearches: 1 },
};

test("refuses to open a journal that already exists, and leaves it untouched", () => {
  withTempDir((dir) => {
    const path = join(dir, "report.md.usage.jsonl");
    const survivor = `${JSON.stringify(started)}\n`;
    writeFileSync(path, survivor, "utf8");

    assert.throws(() => openJournal(path), /EEXIST/);
    assert.equal(readFileSync(path, "utf8"), survivor);
  });
});

test("creates a new journal and appends one line per event", () => {
  withTempDir((dir) => {
    const path = join(dir, "report.md.usage.jsonl");
    const journal = openJournal(path);
    journal(started);
    journal(started);

    const lines = readFileSync(path, "utf8").split("\n").filter((line) => line.length > 0);
    assert.equal(lines.length, 2);
    assert.deepEqual(JSON.parse(lines[0]), started);
  });
});

test("run ids differ even for runs started in the same millisecond", () => {
  const now = new Date("2026-09-12T12:00:00.000Z");
  assert.notEqual(newRunId(now), newRunId(now));
});

test("run ids are safe in a file name and sort by start time", () => {
  const id = newRunId(new Date("2026-09-12T12:00:00.000Z"));
  assert.match(id, /^2026-09-12T12-00-00-000Z-[0-9a-f]{6}$/);
});
