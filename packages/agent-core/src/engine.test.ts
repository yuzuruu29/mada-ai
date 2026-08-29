import { describe, expect, it } from 'vitest';
import { createModelRouterFromEnv } from '@mada-ai/models';
import { SearchRouter, type SearchProvider } from '@mada-ai/search';
import { createMemoryStore, ResearchEngine } from './index.js';

const stubSearch: SearchProvider = {
  capabilities: () => ({ id: 'stub', domains: ['web', 'academic'], requiresApiKey: false }),
  healthCheck: async () => ({ ok: true }),
  search: async ({ query }) => [
    {
      id: 'sr1',
      provider: 'stub',
      title: `Overview of ${query}`,
      url: 'https://example.com/research-overview',
      snippet: `${query} is an important research topic with measurable effects in urban environments.`,
      score: 0.8,
    },
  ],
};

describe('ResearchEngine', () => {
  it('runs the state machine to completion with stubs', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(
        `<html><title>Urban heat islands</title><body><p>Urban heat islands raise nighttime temperatures in dense cities through stored heat in buildings and pavement. Recent studies document stronger effects during heat waves. Limitations include sparse rural reference stations.</p></body></html>`,
        { status: 200, headers: { 'content-type': 'text/html' } },
      )) as typeof fetch;

    try {
      const store = createMemoryStore();
      const guest = await store.ensureGuestWorkspace();
      const project = await store.createProject({
        workspaceId: guest.workspaceId,
        title: 'Heat islands',
      });
      const run = await store.createRun({
        workspaceId: guest.workspaceId,
        projectId: project.id,
        question: 'What causes urban heat islands?',
        mode: 'research',
      });

      const engine = new ResearchEngine({
        store,
        models: createModelRouterFromEnv({ MODEL_PROVIDER: 'mock' }),
        search: new SearchRouter([stubSearch]),
        maxSources: 2,
        maxSearches: 2,
      });

      await engine.run(run.id);
      const completed = await store.getRun(run.id);
      expect(completed?.status).toBe('completed');
      expect(completed?.reportMarkdown).toBeTruthy();
      expect((completed?.claims.length ?? 0) > 0).toBe(true);
      const events = await store.listEvents(run.id);
      expect(events.some((e) => e.type === 'plan.created')).toBe(true);
      expect(events.some((e) => e.type === 'run.completed')).toBe(true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
