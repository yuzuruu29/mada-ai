import type {
  CostEstimate,
  ModelCapabilities,
  ModelEvent,
  ModelProvider,
  ModelRequest,
  ModelResponse,
} from '../types.js';
import { estimateFromPrices } from '../types.js';

export class OpenAICompatibleProvider implements ModelProvider {
  constructor(
    private readonly options: {
      apiKey?: string;
      baseUrl: string;
      modelId: string;
      label?: string;
      providerName?: string;
    },
  ) {}

  capabilities(): ModelCapabilities {
    return {
      id: this.options.modelId,
      label: this.options.label ?? this.options.modelId,
      supportsStreaming: true,
      supportsStructuredOutput: true,
      maxContextTokens: 128_000,
    };
  }

  async estimateCost(request: ModelRequest): Promise<CostEstimate> {
    const inputTokens = Math.ceil((request.system.length + request.prompt.length) / 4);
    return estimateFromPrices(this.options.modelId, inputTokens, request.maxTokens ?? 1024);
  }

  async complete(request: ModelRequest): Promise<ModelResponse> {
    if (!this.options.apiKey && !this.options.baseUrl.includes('localhost')) {
      throw new Error('API key required for OpenAI-compatible provider');
    }
    const response = await fetch(`${this.options.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(this.options.apiKey ? { authorization: `Bearer ${this.options.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.options.modelId,
        temperature: request.temperature ?? 0.2,
        max_tokens: request.maxTokens ?? 2048,
        response_format: request.json ? { type: 'json_object' } : undefined,
        messages: [
          { role: 'system', content: request.system },
          { role: 'user', content: request.prompt },
        ],
      }),
    });
    if (!response.ok) {
      throw new Error(`OpenAI-compatible error: ${response.status}`);
    }
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const text = data.choices?.[0]?.message?.content ?? '';
    return {
      text,
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0,
      modelId: this.options.modelId,
      provider: this.options.providerName ?? 'openai-compatible',
    };
  }

  async *stream(request: ModelRequest): AsyncIterable<ModelEvent> {
    const result = await this.complete(request);
    yield { type: 'delta', text: result.text };
    yield { type: 'done' };
  }
}
