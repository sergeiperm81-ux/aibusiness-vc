"use client";

export type LeadSource = "roi_calculator" | "playbook_templates";

export interface LocalLeadRecord {
  id: string;
  timestamp: string;
  email: string;
  source: LeadSource;
  payload: Record<string, unknown>;
}

const STORAGE_KEY = "aibusiness_leads_v1";

function safeString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "";
  return JSON.stringify(value);
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replaceAll("\"", "\"\"")}"`;
  }
  return value;
}

export function readLocalLeads(): LocalLeadRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalLeadRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function appendLocalLead(lead: Omit<LocalLeadRecord, "id" | "timestamp">): LocalLeadRecord {
  const record: LocalLeadRecord = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...lead,
  };

  const current = readLocalLeads();
  current.unshift(record);
  if (current.length > 500) current.length = 500;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return record;
}

export function clearLocalLeads() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function leadsToCsv(leads: LocalLeadRecord[]): string {
  const headers = ["id", "timestamp", "email", "source", "payload"];
  const rows = leads.map((lead) => [
    lead.id,
    lead.timestamp,
    lead.email,
    lead.source,
    JSON.stringify(lead.payload),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => csvEscape(safeString(cell))).join(","))
    .join("\n");
}
