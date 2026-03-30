// Placeholder data — will be replaced with real data from agents
export interface AIModel {
  id: string;
  name: string;
  developer: string;
  released: string;
  elo: number | null;
  mmlu: number | null;
  humanEval: number | null;
  contextWindow: string;
  inputPrice: string;
  outputPrice: string;
  openSource: boolean;
  description: string;
}

export const models: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    developer: "OpenAI",
    released: "2024-05",
    elo: 1285,
    mmlu: 88.7,
    humanEval: 90.2,
    contextWindow: "128K",
    inputPrice: "$2.50",
    outputPrice: "$10.00",
    openSource: false,
    description: "OpenAI's flagship multimodal model with text, vision, and audio.",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    developer: "Anthropic",
    released: "2024-06",
    elo: 1271,
    mmlu: 88.7,
    humanEval: 92.0,
    contextWindow: "200K",
    inputPrice: "$3.00",
    outputPrice: "$15.00",
    openSource: false,
    description: "Anthropic's best balance of intelligence and speed. Top coding model.",
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    developer: "Google",
    released: "2024-02",
    elo: 1260,
    mmlu: 85.9,
    humanEval: 71.9,
    contextWindow: "2M",
    inputPrice: "$1.25",
    outputPrice: "$5.00",
    openSource: false,
    description: "Google's model with the largest context window — 2 million tokens.",
  },
  {
    id: "llama-3-1-405b",
    name: "Llama 3.1 405B",
    developer: "Meta",
    released: "2024-07",
    elo: 1210,
    mmlu: 87.3,
    humanEval: 89.0,
    contextWindow: "128K",
    inputPrice: "Free (self-host)",
    outputPrice: "Free (self-host)",
    openSource: true,
    description: "Meta's largest open-source model. Competitive with GPT-4.",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    developer: "DeepSeek",
    released: "2024-12",
    elo: 1280,
    mmlu: 87.1,
    humanEval: 82.6,
    contextWindow: "128K",
    inputPrice: "$0.27",
    outputPrice: "$1.10",
    openSource: true,
    description: "Chinese open-source model rivaling GPT-4 at a fraction of the cost.",
  },
  {
    id: "mistral-large",
    name: "Mistral Large 2",
    developer: "Mistral AI",
    released: "2024-07",
    elo: 1175,
    mmlu: 84.0,
    humanEval: 92.0,
    contextWindow: "128K",
    inputPrice: "$2.00",
    outputPrice: "$6.00",
    openSource: false,
    description: "Mistral's flagship model. Strong multilingual and coding capabilities.",
  },
];

export function getModelById(id: string): AIModel | undefined {
  return models.find((m) => m.id === id);
}
