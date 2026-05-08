import type { AIModel } from "@/data/models";

type LinkSet = {
  docsUrl: string;
  tryUrl: string;
  searchUrl: string;
  docsLabel: string;
  tryLabel: string;
};

const PROVIDER_LINKS: Record<
  string,
  { docsUrl: string; tryUrl: string; docsLabel: string; tryLabel: string }
> = {
  OpenAI: {
    docsUrl: "https://platform.openai.com/docs/models",
    tryUrl: "https://chatgpt.com",
    docsLabel: "OpenAI models docs",
    tryLabel: "Try in ChatGPT",
  },
  Anthropic: {
    docsUrl: "https://docs.anthropic.com/en/docs/about-claude/models/all-models",
    tryUrl: "https://claude.ai",
    docsLabel: "Claude models docs",
    tryLabel: "Try in Claude",
  },
  Google: {
    docsUrl: "https://ai.google.dev/gemini-api/docs/models",
    tryUrl: "https://gemini.google.com",
    docsLabel: "Gemini models docs",
    tryLabel: "Try in Gemini",
  },
  Meta: {
    docsUrl: "https://ai.meta.com/llama/",
    tryUrl: "https://ai.meta.com",
    docsLabel: "Llama model hub",
    tryLabel: "Open Meta AI",
  },
  "Mistral AI": {
    docsUrl: "https://docs.mistral.ai/getting-started/models/",
    tryUrl: "https://chat.mistral.ai",
    docsLabel: "Mistral models docs",
    tryLabel: "Try in Le Chat",
  },
  DeepSeek: {
    docsUrl: "https://www.deepseek.com/api-docs",
    tryUrl: "https://chat.deepseek.com",
    docsLabel: "DeepSeek API docs",
    tryLabel: "Try in DeepSeek Chat",
  },
  xAI: {
    docsUrl: "https://docs.x.ai/",
    tryUrl: "https://grok.com",
    docsLabel: "xAI API docs",
    tryLabel: "Try Grok",
  },
  Cohere: {
    docsUrl: "https://docs.cohere.com/",
    tryUrl: "https://dashboard.cohere.com",
    docsLabel: "Cohere docs",
    tryLabel: "Open Cohere dashboard",
  },
  Alibaba: {
    docsUrl: "https://qwen.readthedocs.io/en/latest/",
    tryUrl: "https://chat.qwen.ai",
    docsLabel: "Qwen docs",
    tryLabel: "Try Qwen Chat",
  },
  "Moonshot AI": {
    docsUrl: "https://platform.moonshot.ai/docs",
    tryUrl: "https://kimi.ai",
    docsLabel: "Moonshot API docs",
    tryLabel: "Try Kimi",
  },
};

export function getModelExternalLinks(model: AIModel): LinkSet {
  const mapped = PROVIDER_LINKS[model.developer];
  const query = encodeURIComponent(`${model.name} ${model.developer} official`);
  const searchUrl = `https://duckduckgo.com/?q=${query}`;

  if (mapped) {
    return {
      docsUrl: mapped.docsUrl,
      tryUrl: mapped.tryUrl,
      searchUrl,
      docsLabel: mapped.docsLabel,
      tryLabel: mapped.tryLabel,
    };
  }

  return {
    docsUrl: searchUrl,
    tryUrl: searchUrl,
    searchUrl,
    docsLabel: "Find official docs",
    tryLabel: "Find official website",
  };
}
