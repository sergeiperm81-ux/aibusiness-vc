// Verbatim quotes only, each checked against its original source.
// Attribution names the organisation, not a job title, so the line stays true.
interface Quote {
  text: string;
  author: string;
  org: string;
}

const quotes: readonly Quote[] = [
  {
    // "Three Observations", blog.samaltman.com, February 2025
    text: "The cost to use a given level of AI falls about 10x every 12 months.",
    author: "Sam Altman",
    org: "OpenAI",
  },
  {
    // "Machines of Loving Grace", darioamodei.com, October 2024
    text: "A country of geniuses in a datacenter.",
    author: "Dario Amodei",
    org: "Anthropic",
  },
  {
    // VivaTech, Paris, May 2024 (CNN)
    text: "In a benign scenario, probably none of us will have a job.",
    author: "Elon Musk",
    org: "xAI",
  },
  {
    // The Guardian interview, August 2025
    text: "It'll be 10 times bigger than the Industrial Revolution, and maybe 10 times faster.",
    author: "Demis Hassabis",
    org: "Google DeepMind",
  },
  {
    // Lex Fridman Podcast #434, June 2024
    text: "You ask it a question, you get an answer. Except the difference is, all the answers are backed by sources.",
    author: "Aravind Srinivas",
    org: "Perplexity",
  },
  {
    // Town hall, San Francisco, January 2018 (CNBC)
    text: "I think of it as something more profound than electricity or fire.",
    author: "Sundar Pichai",
    org: "Google",
  },
  {
    // Milken Institute Global Conference, May 2025 (CNBC)
    text: "You're not going to lose your job to an AI, but you're going to lose your job to someone who uses AI.",
    author: "Jensen Huang",
    org: "Nvidia",
  },
  {
    // Dwarkesh Patel podcast, February 2025
    text: "The real benchmark is: the world growing at 10%.",
    author: "Satya Nadella",
    org: "Microsoft",
  },
];

export function TrendingBar() {
  const items = [...quotes, ...quotes];

  return (
    <div className="bg-white border-b border-gray-200 h-9 flex items-center overflow-hidden">
      <div className="flex-shrink-0 px-4">
        <span className="bg-accent text-black text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
          On AI
        </span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex gap-8 animate-[scroll_90s_linear_infinite] whitespace-nowrap">
          {items.map((quote, i) => (
            <span
              key={`${quote.author}-${i}`}
              className="text-[13px] text-gray-800 font-medium flex items-center gap-3"
            >
              <span className="text-accent text-[8px]">●</span>
              <span>&ldquo;{quote.text}&rdquo;</span>
              <span className="font-bold text-black">
                {quote.author}, {quote.org}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
