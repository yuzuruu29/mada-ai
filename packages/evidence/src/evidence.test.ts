import { describe, expect, it } from 'vitest';
import { extractEvidenceFromText } from './index.js';

describe('extractEvidenceFromText', () => {
  it('extracts overlapping sentences', () => {
    const evidence = extractEvidenceFromText({
      sourceId: 'src_1',
      question: 'urban heat islands cause higher temperatures in cities',
      text: 'Urban heat islands cause higher temperatures in cities during summer nights. Cats sleep often. Another sentence about traffic congestion exists here for noise.',
    });
    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence[0]?.sourceId).toBe('src_1');
  });
});
