import {
  createId,
  type ClaimRecord,
  type EvidenceRecord,
  type EvidenceType,
} from '@mada-ai/shared';

const STOPWORDS = new Set([
  'the', 'and', 'for', 'that', 'with', 'from', 'this', 'are', 'was', 'were',
  'have', 'has', 'been', 'into', 'their', 'about', 'which', 'while', 'where',
]);

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && s.length < 500);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 3 && !STOPWORDS.has(t));
}

function overlapScore(a: string, b: string): number {
  const aTokens = new Set(tokenize(a));
  const bTokens = tokenize(b);
  if (!aTokens.size || !bTokens.length) return 0;
  const hits = bTokens.filter((t) => aTokens.has(t)).length;
  return Math.min(1, hits / Math.max(4, Math.min(aTokens.size, 12)));
}

function classifyEvidence(sentence: string): EvidenceType {
  if (/\d+%|\d+\s*(million|billion|mg|km)/i.test(sentence)) return 'statistic';
  if (/define|means|refers to|is known as/i.test(sentence)) return 'definition';
  if (/method|protocol|sampled|randomized/i.test(sentence)) return 'method';
  if (/believe|argue|suggest|opinion/i.test(sentence)) return 'opinion';
  if (/history|background|context/i.test(sentence)) return 'background';
  return 'finding';
}

export function extractEvidenceFromText(input: {
  sourceId: string;
  text: string;
  question: string;
  extractedBy?: string;
  maxItems?: number;
}): EvidenceRecord[] {
  const maxItems = input.maxItems ?? 4;
  const ranked = sentences(input.text)
    .map((sentence) => ({
      sentence,
      score: overlapScore(input.question, sentence),
      type: classifyEvidence(sentence),
    }))
    .filter((row) => row.score >= 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems);

  return ranked.map((row) => ({
    id: createId('ev'),
    sourceId: input.sourceId,
    quoteOrExcerpt: row.sentence.slice(0, 280),
    normalizedProposition: row.sentence.slice(0, 220),
    evidenceType: row.type,
    supportStrength: Number(row.score.toFixed(3)),
    extractedBy: input.extractedBy ?? 'heuristic-extractor',
  }));
}

export function buildClaimsFromEvidence(input: {
  question: string;
  evidence: EvidenceRecord[];
}): ClaimRecord[] {
  const top = [...input.evidence]
    .sort((a, b) => b.supportStrength - a.supportStrength)
    .slice(0, 8);

  const claims: ClaimRecord[] = top.map((item, index) => ({
    id: createId('cl'),
    text: item.normalizedProposition,
    claimType: item.evidenceType === 'statistic' ? 'factual' : 'interpretive',
    importance: index < 2 ? 'critical' : index < 5 ? 'major' : 'minor',
    confidence: item.supportStrength,
    verificationStatus: 'unverified',
  }));

  if (!claims.length) {
    claims.push({
      id: createId('cl'),
      text: `Available open sources provide limited direct evidence for: ${input.question}`,
      claimType: 'interpretive',
      importance: 'critical',
      confidence: 0.2,
      verificationStatus: 'unverified',
    });
  }

  return claims;
}

export function assessCoverage(input: {
  subquestions: string[];
  evidenceCount: number;
  sourceCount: number;
  providerDiversity: number;
}): { score: number; sufficient: boolean; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  if (input.evidenceCount >= 5) score += 0.35;
  else reasons.push('Need more extracted evidence');
  if (input.sourceCount >= 3) score += 0.35;
  else reasons.push('Need more distinct sources');
  if (input.providerDiversity >= 2) score += 0.2;
  else reasons.push('Source provider diversity is low');
  if (input.subquestions.length <= Math.max(1, Math.floor(input.evidenceCount / 2))) {
    score += 0.1;
  } else {
    reasons.push('Some subquestions may remain unanswered');
  }
  return {
    score: Number(score.toFixed(3)),
    sufficient: score >= 0.7 || input.evidenceCount >= 6,
    reasons,
  };
}
