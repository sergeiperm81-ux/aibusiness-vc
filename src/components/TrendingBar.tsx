const trendingItems = [
  "AI Agents Market Hits $7.6B — Solo Builders Are Cashing In",
  "OpenAI Cuts API Prices by 40% — Startups Rejoice",
  "Marketing Agency Saves 40% with AI Automation",
  "Anthropic Raises $3.5B at $61.5B Valuation",
  "From Teacher to $8K/Month AI Freelancer",
  "Cursor Becomes #1 AI Coding Tool",
];

export function TrendingBar() {
  const items = [...trendingItems, ...trendingItems];

  return (
    <div className="bg-white border-b border-gray-200 h-9 flex items-center overflow-hidden">
      <div className="flex-shrink-0 px-4">
        <span className="bg-accent text-black text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
          Trending
        </span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex gap-8 animate-[scroll_40s_linear_infinite] whitespace-nowrap">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="text-[13px] text-gray-800 font-medium flex items-center gap-3"
            >
              <span className="text-accent text-[8px]">●</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
