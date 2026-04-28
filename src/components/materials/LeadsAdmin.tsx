"use client";

import { useMemo, useState } from "react";
import { clearLocalLeads, leadsToCsv, readLocalLeads, type LocalLeadRecord } from "@/lib/leads-local";

function formatPayload(payload: Record<string, unknown>): string {
  const pairs = Object.entries(payload).slice(0, 4);
  if (pairs.length === 0) return "-";
  return pairs
    .map(([key, value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`)
    .join(" | ");
}

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<LocalLeadRecord[]>(() => readLocalLeads());

  const sorted = useMemo(
    () => [...leads].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [leads]
  );

  function refresh() {
    setLeads(readLocalLeads());
  }

  function downloadCsv() {
    const csv = leadsToCsv(sorted);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aibusiness-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    clearLocalLeads();
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Local Leads</p>
          <p className="text-lg font-bold text-gray-900">{sorted.length} records</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={refresh}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:border-accent hover:text-accent transition-colors"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={downloadCsv}
            disabled={sorted.length === 0}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-accent text-black hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            Download CSV
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={sorted.length === 0}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50"
          >
            Clear Local
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left">
              <th className="px-3 py-2 font-semibold text-gray-700">Timestamp</th>
              <th className="px-3 py-2 font-semibold text-gray-700">Email</th>
              <th className="px-3 py-2 font-semibold text-gray-700">Source</th>
              <th className="px-3 py-2 font-semibold text-gray-700">Payload</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                  No local leads yet. Submit from ROI calculator or templates.
                </td>
              </tr>
            ) : (
              sorted.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100">
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{new Date(lead.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2 text-gray-900">{lead.email}</td>
                  <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{lead.source}</td>
                  <td className="px-3 py-2 text-gray-600">{formatPayload(lead.payload)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
