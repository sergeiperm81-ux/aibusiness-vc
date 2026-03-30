import rawModels from "./models-raw.json";

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

export const models: AIModel[] = rawModels as AIModel[];

export function getModelById(id: string): AIModel | undefined {
  return models.find((m) => m.id === id);
}
