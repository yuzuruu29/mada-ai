import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const researchStageEnum = pgEnum('research_stage', [
  'RECEIVED',
  'CLASSIFY_INTENT',
  'BUILD_PLAN',
  'GENERATE_QUERIES',
  'SEARCH',
  'RANK_RESULTS',
  'FETCH_AND_PARSE',
  'EXTRACT_EVIDENCE',
  'ASSESS_COVERAGE',
  'GENERATE_FOLLOWUP_QUERIES',
  'BUILD_CLAIMS',
  'SYNTHESIZE_REPORT',
  'VERIFY_CITATIONS',
  'REPAIR_CLAIMS_OR_SOURCES',
  'FINALIZE',
  'FAILED',
  'CANCELLED',
]);

export const researchModeEnum = pgEnum('research_mode', [
  'ask',
  'research',
  'deep',
  'academic',
  'files',
  'compare',
]);

export const claimStatusEnum = pgEnum('claim_status', [
  'unverified',
  'verified',
  'partial',
  'unsupported',
  'conflicted',
]);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('users_email_uidx').on(table.email),
]);

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('accounts_provider_uidx').on(table.provider, table.providerAccountId),
]);

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('sessions_token_uidx').on(table.tokenHash),
  index('sessions_user_idx').on(table.userId),
]);

export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ownerUserId: text('owner_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const workspaceMembers = pgTable('workspace_members', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  userId: text('user_id').notNull().references(() => users.id),
  role: text('role').notNull().default('owner'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('workspace_members_uidx').on(table.workspaceId, table.userId),
]);

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('projects_workspace_idx').on(table.workspaceId),
]);

export const researchSessions = pgTable('research_sessions', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id),
  title: text('title').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const researchRuns = pgTable('research_runs', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  projectId: text('project_id').notNull().references(() => projects.id),
  sessionId: text('session_id').references(() => researchSessions.id),
  question: text('question').notNull(),
  mode: researchModeEnum('mode').notNull().default('research'),
  stage: researchStageEnum('stage').notNull().default('RECEIVED'),
  status: text('status').notNull().default('queued'),
  idempotencyKey: text('idempotency_key'),
  cancelRequested: boolean('cancel_requested').notNull().default(false),
  modelLabel: text('model_label').notNull().default('Community'),
  errorMessage: text('error_message'),
  planJson: jsonb('plan_json'),
  intentJson: jsonb('intent_json'),
  /** Working research payload (queries, sources, evidence, claims, report, …). */
  stateJson: jsonb('state_json').$type<Record<string, unknown>>().notNull().default({}),
  coverageScore: doublePrecision('coverage_score'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (table) => [
  index('research_runs_workspace_idx').on(table.workspaceId),
  index('research_runs_status_idx').on(table.status),
  uniqueIndex('research_runs_idempotency_uidx').on(table.idempotencyKey),
]);

export const researchEvents = pgTable('research_events', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => researchRuns.id),
  type: text('type').notNull(),
  message: text('message').notNull(),
  dataJson: jsonb('data_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('research_events_run_idx').on(table.runId),
]);

export const researchPlans = pgTable('research_plans', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => researchRuns.id),
  objective: text('objective').notNull(),
  planJson: jsonb('plan_json').notNull(),
  approved: boolean('approved').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const researchQuestions = pgTable('research_questions', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => researchRuns.id),
  text: text('text').notNull(),
  answered: boolean('answered').notNull().default(false),
});

export const searchQueries = pgTable('search_queries', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => researchRuns.id),
  query: text('query').notNull(),
  normalizedHash: text('normalized_hash').notNull(),
  provider: text('provider').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('search_queries_hash_idx').on(table.normalizedHash),
]);

export const searchResults = pgTable('search_results', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => researchRuns.id),
  queryId: text('query_id').notNull().references(() => searchQueries.id),
  title: text('title').notNull(),
  url: text('url').notNull(),
  snippet: text('snippet').notNull(),
  provider: text('provider').notNull(),
  rankScore: doublePrecision('rank_score'),
  doi: text('doi'),
  metadataJson: jsonb('metadata_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sources = pgTable('sources', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  runId: text('run_id').references(() => researchRuns.id),
  canonicalUrl: text('canonical_url').notNull(),
  title: text('title').notNull(),
  author: text('author'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  contentHash: text('content_hash').notNull(),
  category: text('category').notNull().default('unknown'),
  doi: text('doi'),
  pmid: text('pmid'),
  arxivId: text('arxiv_id'),
  relevance: doublePrecision('relevance'),
  authority: doublePrecision('authority'),
  freshness: doublePrecision('freshness'),
  primarySource: boolean('primary_source').notNull().default(false),
  metadataJson: jsonb('metadata_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('sources_url_idx').on(table.canonicalUrl),
  index('sources_doi_idx').on(table.doi),
  index('sources_hash_idx').on(table.contentHash),
]);

export const documents = pgTable('documents', {
  id: text('id').primaryKey(),
  sourceId: text('source_id').notNull().references(() => sources.id),
  contentType: text('content_type').notNull(),
  text: text('text').notNull(),
  markdown: text('markdown').notNull(),
  sectionsJson: jsonb('sections_json'),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull().defaultNow(),
});

export const documentChunks = pgTable('document_chunks', {
  id: text('id').primaryKey(),
  documentId: text('document_id').notNull().references(() => documents.id),
  chunkIndex: integer('chunk_index').notNull(),
  text: text('text').notNull(),
  page: integer('page'),
  section: text('section'),
});

export const evidence = pgTable('evidence', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => researchRuns.id),
  sourceId: text('source_id').notNull().references(() => sources.id),
  quoteOrExcerpt: text('quote_or_excerpt').notNull(),
  normalizedProposition: text('normalized_proposition').notNull(),
  section: text('section'),
  page: integer('page'),
  evidenceType: text('evidence_type').notNull(),
  supportStrength: doublePrecision('support_strength').notNull(),
  extractedBy: text('extracted_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('evidence_run_idx').on(table.runId),
]);

export const claims = pgTable('claims', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => researchRuns.id),
  text: text('text').notNull(),
  claimType: text('claim_type').notNull(),
  importance: text('importance').notNull(),
  confidence: doublePrecision('confidence').notNull(),
  verificationStatus: claimStatusEnum('verification_status').notNull().default('unverified'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('claims_run_idx').on(table.runId),
]);

export const claimEvidence = pgTable('claim_evidence', {
  id: text('id').primaryKey(),
  claimId: text('claim_id').notNull().references(() => claims.id),
  evidenceId: text('evidence_id').notNull().references(() => evidence.id),
  relation: text('relation').notNull(),
  entailmentScore: doublePrecision('entailment_score').notNull(),
});

export const contradictions = pgTable('contradictions', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => researchRuns.id),
  summary: text('summary').notNull(),
  evidenceIdsJson: jsonb('evidence_ids_json').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const reports = pgTable('reports', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => researchRuns.id),
  title: text('title').notNull(),
  executiveSummary: text('executive_summary').notNull(),
  reportJson: jsonb('report_json').notNull(),
  markdown: text('markdown').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('reports_run_uidx').on(table.runId),
]);

export const reportSections = pgTable('report_sections', {
  id: text('id').primaryKey(),
  reportId: text('report_id').notNull().references(() => reports.id),
  heading: text('heading').notNull(),
  markdown: text('markdown').notNull(),
  sortOrder: integer('sort_order').notNull(),
  claimIdsJson: jsonb('claim_ids_json'),
});

export const citations = pgTable('citations', {
  id: text('id').primaryKey(),
  reportId: text('report_id').notNull().references(() => reports.id),
  claimId: text('claim_id').references(() => claims.id),
  sourceId: text('source_id').notNull().references(() => sources.id),
  label: text('label').notNull(),
  verificationStatus: claimStatusEnum('verification_status').notNull().default('unverified'),
});

export const usageRecords = pgTable('usage_records', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  runId: text('run_id').references(() => researchRuns.id),
  kind: text('kind').notNull(),
  modelId: text('model_id'),
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  estimatedCostUsd: doublePrecision('estimated_cost_usd').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const creditAccounts = pgTable('credit_accounts', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  balance: doublePrecision('balance').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('credit_accounts_workspace_uidx').on(table.workspaceId),
]);

export const creditTransactions = pgTable('credit_transactions', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull().references(() => creditAccounts.id),
  type: text('type').notNull(),
  amount: doublePrecision('amount').notNull(),
  idempotencyKey: text('idempotency_key'),
  metadataJson: jsonb('metadata_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('credit_tx_idempotency_uidx').on(table.idempotencyKey),
]);

export const featureFlags = pgTable('feature_flags', {
  id: text('id').primaryKey(),
  key: text('key').notNull(),
  enabled: boolean('enabled').notNull().default(false),
  configJson: jsonb('config_json'),
}, (table) => [
  uniqueIndex('feature_flags_key_uidx').on(table.key),
]);

export const auditEvents = pgTable('audit_events', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => workspaces.id),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  metadataJson: jsonb('metadata_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const schema = {
  users,
  accounts,
  sessions,
  workspaces,
  workspaceMembers,
  projects,
  researchSessions,
  researchRuns,
  researchEvents,
  researchPlans,
  researchQuestions,
  searchQueries,
  searchResults,
  sources,
  documents,
  documentChunks,
  evidence,
  claims,
  claimEvidence,
  contradictions,
  reports,
  reportSections,
  citations,
  usageRecords,
  creditAccounts,
  creditTransactions,
  featureFlags,
  auditEvents,
};
