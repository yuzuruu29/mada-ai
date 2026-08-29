import { describe, expect, it } from 'vitest';
import { SearchRouter, type SearchProvider } from './index.js';

describe('SearchRouter', () => {
  it('deduplicates by URL', async () => {
    const provider: SearchProvider = {
      capabilities: () => ({ id: 'stub', domains: ['web'], requiresApiKey: false }),
      healthCheck: async () => ({ ok: true }),
      search: async () => [
        {
          id: 'a',
          provider: 'stub',
          title: 'One',
          url: 'https://example.com/a',
          snippet: 'x',
        },
        {
          id: 'b',
          provider: 'stub',
          title: 'Two',
          url: 'https://example.com/a',
          snippet: 'y',
        },
      ],
    };
    const router = new SearchRouter([provider]);
    const results = await router.search({ query: 'test' });
    expect(results).toHaveLength(1);
  });
});
