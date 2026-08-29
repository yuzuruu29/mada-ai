import { describe, expect, it } from 'vitest';
import { entailmentScore, verifyClaimsAgainstEvidence } from './index.js';

describe('citation verifier', () => {
  it('scores overlapping claim/evidence pairs', () => {
    expect(
      entailmentScore(
        'Urban heat islands raise nighttime temperatures',
        'Urban heat islands raise nighttime temperatures in dense cities',
      ),
    ).toBeGreaterThan(0.6);
  });

  it('flags unsupported critical claims', () => {
    const result = verifyClaimsAgainstEvidence({
      claims: [
        {
          id: 'c1',
          text: 'Completely unrelated claim about deep sea volcanoes',
          claimType: 'factual',
          importance: 'critical',
          confidence: 0.5,
          verificationStatus: 'unverified',
        },
      ],
      evidence: [
        {
          id: 'e1',
          sourceId: 's1',
          quoteOrExcerpt: 'Cats sleep for many hours each day.',
          normalizedProposition: 'Cats sleep often',
          evidenceType: 'finding',
          supportStrength: 0.5,
          extractedBy: 'test',
        },
      ],
    });
    expect(result.blockingFailures.length).toBeGreaterThan(0);
    expect(result.claims[0]?.verificationStatus).toBe('unsupported');
  });
});
