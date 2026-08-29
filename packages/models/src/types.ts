export type ModelTask =
  | 'classification'
  | 'query_generation'
  | 'source_relevance'
  | 'extraction'
  | 'citation_verification'
  | 'synthesis'
  | 'planning';

export interface ModelCapabilities {
  id: string;
  label: string;
  supportsStreaming: boolean;
  supportsStructuredOutput: boolean;
  maxContextTokens: number;
}

export interface ModelRequest {
  task: ModelTask;
  system: string;
  prompt: string;
  json?: boolean;
  maxTokens?: number;
  temperature?: number;
}

export interface ModelResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  modelId: string;
  provider: string;
}

export interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  estimatedUsd: number;
  currency: 'USD';
}

export interface ModelEvent {
  type: 'delta' | 'done';
  text?: string;
}

export interface ModelProvider {
  complete(request: ModelRequest): Promise<ModelResponse>;
  stream(request: ModelRequest): AsyncIterable<ModelEvent>;
  estimateCost(request: ModelRequest): Promise<CostEstimate>;
  capabilities(): ModelCapabilities;
}

export interface ModelPriceRow {
  modelId: string;
  inputPerMillionUsd: number;
  outputPerMillionUsd: number;
}

/** Pricing is configuration data (ADR-005), not business logic. */
export const DEFAULT_MODEL_PRICES: ModelPriceRow[] = [
  { modelId: 'mock-community', inputPerMillionUsd: 0, outputPerMillionUsd: 0 },
  { modelId: 'gpt-5.6-luna', inputPerMillionUsd: 0.2, outputPerMillionUsd: 1.2 },
  { modelId: 'claude-sonnet-5', inputPerMillionUsd: 2, outputPerMillionUsd: 10 },
];

export function estimateFromPrices(
  modelId: string,
  inputTokens: number,
  outputTokens: number,
  prices = DEFAULT_MODEL_PRICES,
): CostEstimate {
  const row = prices.find((p) => p.modelId === modelId) ?? prices[0]!;
  const estimatedUsd =
    (inputTokens / 1_000_000) * row.inputPerMillionUsd +
    (outputTokens / 1_000_000) * row.outputPerMillionUsd;
  return {
    inputTokens,
    outputTokens,
    estimatedUsd,
    currency: 'USD',
  };
}
