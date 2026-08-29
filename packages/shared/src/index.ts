export type ResearchMode = 'ask' | 'research' | 'deep' | 'academic' | 'files' | 'compare';

export type ResearchStage =
  | 'RECEIVED'
  | 'CLASSIFY_INTENT'
  | 'BUILD_PLAN'
  | 'GENERATE_QUERIES'
  | 'SEARCH'
  | 'RANK_RESULTS'
  | 'FETCH_AND_PARSE'
  | 'EXTRACT_EVIDENCE'
  | 'ASSESS_COVERAGE'
  | 'GENERATE_FOLLOWUP_QUERIES'
  | 'BUILD_CLAIMS'
  | 'SYNTHESIZE_REPORT'
  | 'VERIFY_CITATIONS'
  | 'REPAIR_CLAIMS_OR_SOURCES'
  | 'FINALIZE'
  | 'FAILED'
  | 'CANCELLED';

export type ClaimStatus =
  | 'unverified'
  | 'verified'
  | 'partial'
  | 'unsupported'
  | 'conflicted';

export type ClaimImportance = 'critical' | 'major' | 'minor';

export type ClaimType =
  | 'factual'
  | 'interpretive'
  | 'comparative'
  | 'forecast'
  | 'recommendation';

export type EvidenceType =
  | 'finding'
  | 'definition'
  | 'statistic'
  | 'method'
  | 'opinion'
  | 'background';

export type ClaimEvidenceRelation =
  | 'supports'
  | 'partially_supports'
  | 'contradicts'
  | 'context';

export type SourceCategory =
  | 'primary_research'
  | 'systematic_review'
  | 'meta_analysis'
  | 'government'
  | 'standards_body'
  | 'official_company'
  | 'primary_document'
  | 'news'
  | 'industry_report'
  | 'secondary_analysis'
  | 'blog'
  | 'forum'
  | 'social_media'
  | 'unknown';

export interface IntentClassification {
  taskType: string;
  freshness: string;
  sourceDomains: Array<'academic' | 'web' | 'files'>;
  depth: ResearchMode;
  needsCode: boolean;
  needsFiles: boolean;
  highStakes: boolean;
}

export interface ResearchPlan {
  objective: string;
  subquestions: string[];
  searchStrategy: string[];
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  freshnessRequirements: Record<string, string>;
  preferredSourceTypes: string[];
  completionCriteria: string[];
}

export interface NormalizedSearchResult {
  id: string;
  provider: string;
  title: string;
  url: string;
  snippet: string;
  publishedAt?: string;
  doi?: string;
  pmid?: string;
  arxivId?: string;
  authors?: string[];
  score?: number;
}

export interface FetchedDocument {
  canonicalUrl: string;
  title: string;
  author?: string;
  publishedAt?: string;
  contentType: string;
  markdown: string;
  text: string;
  metadata: Record<string, unknown>;
  sections: Array<{ heading: string; text: string }>;
  pageMap?: Array<{ page: number; text: string }>;
  fetchedAt: string;
  contentHash: string;
}

export interface EvidenceRecord {
  id: string;
  sourceId: string;
  quoteOrExcerpt: string;
  normalizedProposition: string;
  section?: string;
  page?: number;
  startOffset?: number;
  endOffset?: number;
  evidenceType: EvidenceType;
  supportStrength: number;
  extractedBy: string;
}

export interface ClaimRecord {
  id: string;
  text: string;
  claimType: ClaimType;
  importance: ClaimImportance;
  confidence: number;
  verificationStatus: ClaimStatus;
}

export interface ClaimEvidenceLink {
  claimId: string;
  evidenceId: string;
  relation: ClaimEvidenceRelation;
  entailmentScore: number;
}

export interface ResearchEventPayload {
  type: string;
  runId: string;
  message: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface ReportDocument {
  title: string;
  executiveSummary: string;
  sections: Array<{
    heading: string;
    markdown: string;
    claimIds: string[];
  }>;
  limitations: string[];
  contradictions: string[];
  confidence: Record<string, number>;
  references: Array<{
    sourceId: string;
    title: string;
    url: string;
    citationLabel: string;
  }>;
}

export class MadaError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    status = 400,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'MadaError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function createId(prefix: string): string {
  const random = crypto.randomUUID().replace(/-/g, '');
  return `${prefix}_${random.slice(0, 20)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function assertNever(value: never, message = 'Unexpected value'): never {
  throw new Error(`${message}: ${String(value)}`);
}
