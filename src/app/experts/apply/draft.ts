/**
 * A draft of the expert application, kept on the applicant's own device.
 *
 * Why this exists. On many Android phones, opening the photo gallery pushes the
 * browser tab out of memory. When the person comes back, Chrome reloads the page
 * and puts the typed text back into the fields, but the form's own state starts
 * empty: the fields look filled in, the counters read zero, and the form sends
 * nothing. One applicant lost her application to exactly that three times.
 *
 * Saving every change here, and restoring it on load, makes the form survive a
 * reload whatever the browser does. The photo is deliberately not stored: it is
 * optional, it can follow by email, and a restored picture would not reappear in
 * the crop circle anyway.
 */

const KEY = "aibusiness:expert-application:v1";

/** Drafts older than this are treated as abandoned and ignored. */
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

export interface ApplicationDraft {
  /** Named text inputs, textareas and selects, by name. */
  fields: Record<string, string>;
  /** Named checkboxes, by name. */
  checks: Record<string, boolean>;
  practiceAreas: string[];
  industries: string[];
  workFormats: string[];
  other: string;
  savedAt: number;
}

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function namedFields(form: HTMLFormElement): Field[] {
  return Array.from(form.elements).filter(
    (el): el is Field =>
      (el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement) &&
      Boolean(el.name) &&
      !(el instanceof HTMLInputElement && el.type === "file")
  );
}

/** What is actually in the form's fields right now, read from the page itself. */
export function readFields(form: HTMLFormElement): Pick<ApplicationDraft, "fields" | "checks"> {
  const fields: Record<string, string> = {};
  const checks: Record<string, boolean> = {};
  for (const el of namedFields(form)) {
    if (el instanceof HTMLInputElement && el.type === "checkbox") checks[el.name] = el.checked;
    else fields[el.name] = el.value;
  }
  return { fields, checks };
}

/** Put a saved draft back into the page's fields. */
export function writeFields(form: HTMLFormElement, draft: ApplicationDraft): void {
  for (const el of namedFields(form)) {
    if (el instanceof HTMLInputElement && el.type === "checkbox") {
      if (el.name in draft.checks) el.checked = draft.checks[el.name];
    } else if (el.name in draft.fields) {
      el.value = draft.fields[el.name];
    }
  }
}

/** True when the draft holds anything worth restoring. */
function hasContent(draft: ApplicationDraft): boolean {
  return (
    Object.values(draft.fields).some((v) => v.trim() !== "") ||
    draft.practiceAreas.length > 0 ||
    draft.industries.length > 0 ||
    draft.workFormats.length > 0 ||
    draft.other.trim() !== ""
  );
}

// Storage can be unavailable (private mode, blocked site data). The form must
// keep working without it, so every access is wrapped and failure is silent by
// design: losing the draft is the old behaviour, not a new error.

export function saveDraft(draft: ApplicationDraft): void {
  try {
    if (hasContent(draft)) localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* storage unavailable: the form still works, just without a draft */
  }
}

export function loadDraft(): ApplicationDraft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as ApplicationDraft;
    if (!draft || typeof draft !== "object" || !draft.fields) return null;
    if (Date.now() - (draft.savedAt ?? 0) > MAX_AGE_MS) return null;
    return {
      fields: draft.fields ?? {},
      checks: draft.checks ?? {},
      practiceAreas: Array.isArray(draft.practiceAreas) ? draft.practiceAreas : [],
      industries: Array.isArray(draft.industries) ? draft.industries : [],
      workFormats: Array.isArray(draft.workFormats) ? draft.workFormats : [],
      other: typeof draft.other === "string" ? draft.other : "",
      savedAt: draft.savedAt,
    };
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}
