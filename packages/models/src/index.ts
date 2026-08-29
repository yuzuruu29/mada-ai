import type { ModelProvider, ModelTask } from './types.js';
import { MockModelProvider } from './local/mock.js';
import { OpenAICompatibleProvider } from './openai-compatible/index.js';

export * from './types.js';
export { MockModelProvider } from './local/mock.js';
export { OpenAICompatibleProvider } from './openai-compatible/index.js';

const TASK_ROUTING: Record<ModelTask, 'cheap' | 'strong'> = {
  classification: 'cheap',
  query_generation: 'cheap',
  source_relevance: 'cheap',
  extraction: 'cheap',
  citation_verification: 'strong',
  synthesis: 'strong',
  planning: 'strong',
};

export class ModelRouter {
  constructor(
    private readonly cheap: ModelProvider,
    private readonly strong: ModelProvider = cheap,
  ) {}

  forTask(task: ModelTask): ModelProvider {
    return TASK_ROUTING[task] === 'strong' ? this.strong : this.cheap;
  }

  complete(task: ModelTask, ...args: Parameters<ModelProvider['complete']>) {
    return this.forTask(task).complete(...args);
  }
}

export function createModelRouterFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): ModelRouter {
  const provider = (env.MODEL_PROVIDER ?? 'mock').toLowerCase();
  if (provider === 'openai' && env.OPENAI_API_KEY) {
    const openai = new OpenAICompatibleProvider({
      apiKey: env.OPENAI_API_KEY,
      baseUrl: env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1',
      modelId: env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      label: 'Smart',
      providerName: 'openai',
    });
    return new ModelRouter(openai, openai);
  }
  if (provider === 'ollama') {
    const ollama = new OpenAICompatibleProvider({
      baseUrl: `${(env.OLLAMA_BASE_URL ?? 'http://localhost:11434').replace(/\/$/, '')}/v1`,
      modelId: env.OLLAMA_MODEL ?? 'llama3.2',
      label: 'Community',
      providerName: 'ollama',
    });
    return new ModelRouter(ollama, ollama);
  }
  const mock = new MockModelProvider();
  return new ModelRouter(mock, mock);
}
