/**
 * Journal files for paid runs: one file per run, never overwritten.
 *
 * An earlier version opened the journal with writeFileSync(path, ""), which
 * silently emptied any file already there. Reusing a report name destroyed the
 * previous run's cost record, and after a crash a second attempt would have
 * erased the very "started" line the two-phase journal exists to keep.
 *
 * Two guards now, either of which alone would stop that:
 * - every run gets its own id in the file name, so two runs never share a file;
 * - the file is created with the exclusive "wx" flag, so if a file with that
 *   name exists anyway the run refuses to start rather than touch it.
 */

import { randomBytes } from "node:crypto";
import { appendFileSync, closeSync, openSync } from "node:fs";
import type { JournalEvent, JournalSink } from "./usage";

/**
 * A run id that sorts by start time. The random tail makes a clash with another
 * run very unlikely, not impossible; if one ever happens, the exclusive create
 * in openJournal refuses the run rather than touching the existing file.
 */
export function newRunId(now: Date = new Date()): string {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  return `${stamp}-${randomBytes(3).toString("hex")}`;
}

/**
 * Creates the journal file and returns a sink that appends one line per event.
 *
 * Throws EEXIST, before anything is written, if the file already exists. The
 * caller must let that stop the run before any paid request is made.
 */
export function openJournal(path: string): JournalSink {
  closeSync(openSync(path, "wx"));
  return (event: JournalEvent): void => {
    appendFileSync(path, `${JSON.stringify(event)}\n`, "utf8");
  };
}
