import { describe, expect, it } from 'vitest';
import { MockModelProvider } from './local/mock.js';

describe('MockModelProvider', () => {
  it('returns structured planning JSON', async () => {
    const provider = new MockModelProvider();
    const result = await provider.complete({
      task: 'planning',
      system: 'plan',
      prompt: JSON.stringify({ question: 'What causes urban heat islands?' }),
      json: true,
    });
    const parsed = JSON.parse(result.text) as { subquestions: string[] };
    expect(parsed.subquestions.length).toBeGreaterThanOrEqual(3);
  });
});
