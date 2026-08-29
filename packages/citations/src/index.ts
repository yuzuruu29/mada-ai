import {
  type ClaimEvidenceLink,
  type ClaimRecord,
  type ClaimStatus,
  type EvidenceRecord,
  createId,
} from '@mada-ai/shared';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 3);
}

export function entailmentScore(claim: string, evidence: string): number {
  const claimTokens = tokenize(claim);
  if (!claimTokens.length) return 0;
  const evidenceSet = new Set(tokenize(evidence));
  const hits = claimTokens.filter((t) => evidenceSet.has(t)).length;
  return Number(Math.min(0.98, hits / claimTokens.length).toFixed(3));
}

export function statusFromScore(score: number): ClaimStatus {
  if (score >= 0.65) return 'verified';
  if (score >= 0.4) return 'partial';
  return 'unsupported';
}

export function verifyClaimsAgainstEvidence(input: {
  claims: ClaimRecord[];
  evidence: EvidenceRecord[];
}): {
  claims: ClaimRecord[];
  links: ClaimEvidenceLink[];
  blockingFailures: string[];
} {
  const links: ClaimEvidenceLink[] = [];
  const blockingFailures: string[] = [];

  const claims = input.claims.map((claim) => {
    let best: { evidence: EvidenceRecord; score: number } | null = null;
    for (const evidence of input.evidence) {
      const score = entailmentScore(claim.text, `${evidence.quoteOrExcerpt} ${evidence.normalizedProposition}`);
      if (!best || score > best.score) best = { evidence, score };
    }

    if (!best) {
      const status: ClaimStatus = 'unsupported';
      if (claim.importance === 'critical') {
        blockingFailures.push(`Critical claim lacks evidence: ${claim.text}`);
      }
      return { ...claim, verificationStatus: status, confidence: 0.1 };
    }

    const status = statusFromScore(best.score);
    links.push({
      claimId: claim.id,
      evidenceId: best.evidence.id,
      relation: status === 'unsupported' ? 'context' : status === 'partial' ? 'partially_supports' : 'supports',
      entailmentScore: best.score,
    });

    if (claim.importance === 'critical' && (status === 'unsupported' || status === 'conflicted')) {
      blockingFailures.push(`Critical claim not supported: ${claim.text}`);
    }

    return {
      ...claim,
      verificationStatus: status,
      confidence: best.score,
    };
  });

  return { claims, links, blockingFailures };
}

export function repairUnsupportedCriticalClaims(input: {
  claims: ClaimRecord[];
  blockingFailures: string[];
}): ClaimRecord[] {
  if (!input.blockingFailures.length) return input.claims;
  return input.claims.map((claim) => {
    if (claim.importance !== 'critical') return claim;
    if (claim.verificationStatus === 'verified' || claim.verificationStatus === 'partial') {
      return claim;
    }
    return {
      ...claim,
      text: `Insufficient verified evidence for: ${claim.text}`,
      claimType: 'interpretive',
      verificationStatus: 'unsupported',
      confidence: Math.min(claim.confidence, 0.25),
    };
  });
}

export function citationLabel(index: number): string {
  return `[${index + 1}]`;
}

export function createCitationId(): string {
  return createId('cit');
}
