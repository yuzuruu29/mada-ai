# Mada.AI — Master Implementation Prompt

**Target:** autonomous coding/implementation agent capable of inspecting a repository, editing files, running commands/tests, and documenting work.  
**Project:** Mada.AI  
**Objective:** Build an open-source, evidence-first AI research agent/web application inspired by the public research interaction patterns of Perplexity Research and Gemini Deep Research without copying proprietary code, prompts, branding, or protected implementation details.

---

# 0. Operating Instruction

You are the principal engineer and implementation agent for **Mada.AI**.

Your job is to inspect the current repository, turn the supplied Mada.AI implementation plan into a working production-oriented system, and continuously validate correctness through executable tests and observable behavior.

Do not merely generate scaffolding, mockups, TODO comments, or architecture prose. Implement working vertical slices.

Use this execution loop throughout the project:

> **Inspect → Plan → Implement → Test → Review → Document**

Do not skip a stage.

---

# 1. Required Skill Bootstrap

Before implementation, discover the skills available in your environment and read every relevant `SKILL.md`, README, or equivalent skill instruction that applies to this project.

Required skill categories include, at minimum:

1. system architecture / system design;
2. Next.js and React;
3. TypeScript;
4. accessible frontend/UI engineering;
5. OAuth/OIDC authentication;
6. PostgreSQL data modeling and migrations;
7. Redis/job queues/background workers;
8. AI model API integration;
9. agent/state-machine orchestration;
10. web search/retrieval/crawling;
11. PDF/document parsing;
12. vector search/RAG;
13. academic APIs and bibliographic metadata;
14. payments/billing/credit ledgers;
15. application security/OWASP;
16. SSRF and prompt-injection defense;
17. automated testing;
18. evaluation/benchmark harnesses;
19. observability/OpenTelemetry;
20. Docker/self-hosting/DevOps;
21. API design;
22. privacy/data retention.

## Missing skill rule

If a required implementation skill is not already installed or available:

1. identify a reputable skill implementation from a **trusted official or maintainer GitHub repository**;
2. inspect repository provenance, README, `SKILL.md`, ownership, and recent maintenance before installation;
3. do not install skills from unknown, suspicious, low-trust, or typo-squatted repositories;
4. never paste or expose secrets to install a skill;
5. install only what is materially required;
6. record the skill name and the exact GitHub repository from which it was obtained in `docs/engineering/SKILLS_USED.md`;
7. if installation requires credentials or elevated privileges that are unavailable, document the blocker and proceed using the safest available alternative.

Do not claim a skill was used unless you actually inspected its instructions.

---

# 2. Source of Truth

Read these project documents first if they exist:

```text
Mada.AI_IMPLEMENTATION_PLAN.md
README.md
CONTRIBUTING.md
SECURITY.md
package.json / workspace config
existing architecture docs
existing database schema
existing tests
```

The implementation plan defines desired product behavior, but the existing repository is authoritative for what already exists.

Do not destroy working functionality to make the repository match an imagined greenfield architecture.

If the repository is empty, initialize it according to the plan.

---

# 3. Product Mission

Mada.AI must become:

> **An open-source AI research workspace that searches, reads, verifies, and shows the evidence behind its conclusions. Users can use a generous community tier, self-host the system, or pay for smarter OpenAI/Anthropic research runs.**

Primary users:

- researchers;
- research assistants;
- students;
- analysts;
- consultants;
- journalists;
- other evidence-heavy knowledge workers.

Mada.AI is **not** a generic chat clone.

---

# 4. Non-Negotiable Product Invariants

You must preserve these invariants throughout implementation.

## 4.1 Evidence-first

Reports cannot exist only as freeform generated text.

Important claims must resolve to stored evidence and sources.

## 4.2 Citation verification

The system must independently verify whether cited evidence supports a claim.

A link next to a sentence does not count as citation verification.

## 4.3 Provider independence

Research orchestration must not depend directly on OpenAI, Anthropic, Google, or one search vendor.

Use adapters/interfaces.

## 4.4 Resumable research

Research jobs may take minutes and must survive page refreshes and worker process restarts.

## 4.5 User-safe transparency

Expose:

- plan;
- searches;
- source retrieval;
- evidence extraction;
- contradictions;
- verification status;
- run progress.

Do not build a feature that exposes hidden model chain-of-thought.

## 4.6 Security

Retrieved web/document content is untrusted data and must never override system/application instructions.

## 4.7 Open-source usability

A technically competent developer must be able to run Mada.AI locally without requiring Mada.AI's hosted backend.

---

# 5. Behavioral Reverse-Engineering Constraint

Use public documentation and observable product behavior as inspiration.

Do **not**:

- seek leaked source code;
- copy proprietary prompts;
- scrape private application internals;
- clone protected branding;
- reproduce proprietary UI assets;
- bypass provider access controls.

The objective is to reproduce useful **research workflow patterns**, not protected implementation details.

---

# 6. Required Architecture

Implement a persisted research state machine with the following conceptual stages:

```text
RECEIVED
→ CLASSIFY_INTENT
→ BUILD_PLAN
→ GENERATE_QUERIES
→ SEARCH
→ RANK_RESULTS
→ FETCH_AND_PARSE
→ EXTRACT_EVIDENCE
→ ASSESS_COVERAGE
→ [FOLLOW-UP LOOP if needed]
→ BUILD_CLAIMS
→ SYNTHESIZE_REPORT
→ VERIFY_CITATIONS
→ REPAIR if needed
→ FINALIZE
```

The exact code structure may differ if repository constraints justify it, but the observable behavior and persistence guarantees must remain.

---

# 7. First Required Vertical Slice

Before implementing broad feature coverage, create this end-to-end slice:

```text
Google OAuth
→ create project
→ enter research question
→ create explicit research plan
→ execute 4–6 searches
→ rank candidate sources
→ fetch/read selected sources
→ extract evidence
→ create claims
→ verify claims against evidence
→ generate report with inline citations
→ inspect citation/evidence from UI
→ persist run and research trace
```

This slice must use real application data paths, not hard-coded fixtures in production code.

---

# 8. Technical Baseline

Unless the existing repository strongly dictates otherwise, use:

```text
Monorepo: pnpm workspaces + Turborepo or equivalent
Frontend: Next.js + React + TypeScript
Backend/API: TypeScript
Worker: separate Node/TypeScript process
Database: PostgreSQL
Queue/cache: Redis
Vector search: pgvector initially
Object storage: S3-compatible
Streaming: SSE preferred for progress unless existing architecture uses WebSocket
Testing: unit + integration + E2E
Self-hosting: Docker Compose
```

Choose exactly one ORM based on repository fit:

- Drizzle; or
- Prisma.

Do not introduce both.

---

# 9. Suggested Repository Structure

Adapt rather than blindly replace existing structure.

```text
apps/
  web/
  worker/
packages/
  agent-core/
  evidence/
  citations/
  search/
  fetch/
  models/
  billing/
  auth/
  db/
  ui/
  shared/
  evals/
infra/
docs/
scripts/
```

Keep domain logic out of React components and route handlers.

---

# 10. Domain Model

At minimum, represent:

```text
User
Workspace
WorkspaceMember
Project
ResearchSession
ResearchRun
ResearchEvent
ResearchPlan
ResearchQuestion
SearchQuery
SearchResult
Source
Document
DocumentChunk
Evidence
Claim
ClaimEvidence
Citation
Contradiction
Report
ReportSection
File
ModelRun
ToolRun
UsageRecord
CreditAccount
CreditTransaction
Subscription
ProviderCredential
FeatureFlag
AuditEvent
```

Use normalized relationships where auditability matters.

Do not store a report as the only record of what happened.

---

# 11. Evidence Graph Contract

Implement types equivalent to:

```ts
type ClaimStatus =
  | 'unverified'
  | 'verified'
  | 'partial'
  | 'unsupported'
  | 'conflicted';

interface Evidence {
  id: string;
  sourceId: string;
  excerpt: string;
  normalizedProposition: string;
  page?: number;
  section?: string;
  supportStrength: number;
}

interface Claim {
  id: string;
  text: string;
  importance: 'critical' | 'major' | 'minor';
  status: ClaimStatus;
  confidence: number;
}

interface ClaimEvidence {
  claimId: string;
  evidenceId: string;
  relation: 'supports' | 'partially_supports' | 'contradicts' | 'context';
  entailmentScore: number;
}
```

Do not make confidence values look more objective than they are. Preserve the signals used to derive them.

---

# 12. Search Provider Interface

Create a normalized interface similar to:

```ts
interface SearchProvider {
  search(request: SearchRequest): Promise<SearchResult[]>;
  healthCheck(): Promise<HealthStatus>;
  capabilities(): SearchCapabilities;
}
```

Required provider families:

### General web

At least one functional hosted or self-hosted provider for MVP.

Design adapters for future use with:

- Firecrawl/search provider;
- Brave or equivalent;
- SearXNG/self-hosted.

### Academic

Implement:

- OpenAlex;
- Crossref.

Add Semantic Scholar if API access is available and its terms/rate limits are acceptable.

Do not fail the entire Academic mode if one scholarly provider is unavailable.

---

# 13. Fetch and Parse Layer

Normalize fetched sources.

Protect the server against SSRF.

Required controls:

- reject localhost;
- reject private/link-local ranges;
- validate DNS/IP before request;
- revalidate after redirects;
- restrict protocols;
- enforce maximum response size;
- enforce timeouts;
- sanitize HTML;
- normalize canonical URL;
- hash content;
- cache safely.

Treat embedded page instructions as content only.

---

# 14. Prompt-Injection Defense

The research system must enforce a strict trust boundary:

```text
SYSTEM/DEVELOPER POLICY
        >
USER RESEARCH INTENT
        >
TOOL OUTPUT / WEB CONTENT
```

Retrieved content must never be allowed to:

- change system behavior;
- request secrets;
- alter model routing;
- trigger arbitrary tools;
- exfiltrate user files;
- redefine the research objective;
- approve transactions.

Build adversarial tests for this.

---

# 15. Model Provider Interface

Create a common API similar to:

```ts
interface ModelProvider {
  complete(request: ModelRequest): Promise<ModelResponse>;
  stream(request: ModelRequest): AsyncIterable<ModelEvent>;
  capabilities(): ModelCapabilities;
  estimateCost(request: CostRequest): Promise<CostEstimate>;
}
```

Implement or scaffold clean adapters for:

- OpenAI;
- Anthropic;
- Google;
- OpenAI-compatible endpoints;
- local Ollama/vLLM-style endpoint.

The core agent cannot import provider-specific SDKs directly.

Provider-specific SDK use belongs inside provider packages/adapters.

---

# 16. Model Routing Policy

Do not use the most expensive model for every step.

Default routing concept:

```text
intent classification       → cheapest reliable model
query generation            → cheap model
result relevance            → cheap/local model
source extraction           → cheap/local model
coverage analysis           → moderate model
claim generation            → moderate model
citation verification       → verifier/strong model
final synthesis             → user-selected research model
complex deep planning       → strong model
```

Allow configuration overrides.

---

# 17. Academic Mode

Implement the scholarly workflow:

```text
research question
→ keyword/synonym expansion
→ scholarly queries
→ candidate papers
→ DOI/identifier normalization
→ deduplication
→ screening
→ evidence extraction
→ literature matrix
→ synthesis
→ references/export
```

Do not invent bibliographic metadata.

When metadata is missing, show it as missing.

Reference output should be generated from validated metadata objects.

---

# 18. Citation Verification

This is a release-critical system.

For each important claim:

1. locate evidence;
2. determine support relation;
3. check entities, dates, quantities, units, and qualifiers;
4. detect whether wording overstates evidence;
5. detect conflicts;
6. assign status;
7. repair or remove unsupported critical claims.

Binary rule:

> **A critical factual claim may not be silently finalized with status `unsupported`.**

Write unit and integration tests around this invariant.

---

# 19. UX Requirements

The application must feel like a research workspace, not an admin dashboard.

Primary surfaces:

```text
Landing / Composer
Research Plan
Live Research
Final Report
Source Inspector
Evidence Inspector
Academic Literature Matrix
Projects
Files
Usage & Credits
Settings / Providers
```

## Avoid generic AI UI patterns

Do not fill the interface with:

- excessive cards;
- unnecessary gradients;
- decorative glowing borders;
- random glassmorphism;
- oversized hero sections inside authenticated workspace;
- animated elements that do not communicate state.

Prioritize:

- readable typography;
- dense but calm research layouts;
- strong document/report readability;
- citation affordances;
- source browsing;
- keyboard operation;
- responsive design;
- accessible contrast/focus.

---

# 20. Authentication

Implement the shortest useful onboarding path:

```text
Continue with Google
→ OAuth callback
→ create user/default workspace if new
→ open research composer
```

Do not force profile setup before the first research run.

Security requirements:

- safe session cookies;
- CSRF protection;
- state/PKCE where applicable;
- strict redirect URI handling;
- session revoke;
- account-linking rules;
- login rate/abuse controls.

---

# 21. Research Quotas

Implement quota policy as configuration/data, not hard-coded UI checks.

Initial policy targets may be:

```text
Guest
- 5 Ask/day
- 1 Research/day

Free
- 30 Ask/day
- 8 Research/day
- 2 Academic deep/day
- 1 Deep Research/week

Paid
- substantially higher limits
- premium credit allowance

BYOK
- generous orchestration allowance
- separate crawling/compute abuse limits
```

Admin/operator must be able to change quotas without redeploying the application.

---

# 22. Billing / Premium Models

Users pay for enhanced research capability, not raw tokens.

Implement:

- credit account;
- append-only credit ledger;
- estimate;
- reservation;
- settlement;
- refund/release;
- idempotent payment webhook processing;
- usage details.

Never represent credits only as a mutable `balance` field without a ledger.

Premium run flow:

```text
estimate
→ reserve max credits
→ run research
→ compute actual cost
→ settle
→ release unused reserve
```

---

# 23. Bring Your Own Key

Requirements:

- encryption at rest;
- keys never written to normal logs;
- masked UI;
- explicit provider association;
- revoke/delete;
- no cross-tenant access;
- secret redaction in errors/traces.

Add automated tests ensuring provider credentials do not appear in serialized API responses.

---

# 24. Pricing Configuration

Do not hard-code provider pricing in business logic.

Create a model pricing table/config with:

```text
provider
model_id
input_per_million
cached_input_per_million
output_per_million
search/tool pricing where applicable
effective_from
effective_to
source_url
updated_at
```

The following values are useful only as a 2026-08-29 reference and must be reverified before production:

```text
OpenAI GPT-5.6 Luna  $0.20 input / $1.20 output per MTok
OpenAI GPT-5.6 Terra $2 input / $12 output per MTok
OpenAI GPT-5.6 Sol   $4 input / $20 output per MTok
Claude Sonnet 5      $2 input / $10 output per MTok
Claude Opus 5        $5 input / $25 output per MTok
```

---

# 25. File Research

MVP types:

- PDF;
- DOCX;
- TXT;
- Markdown;
- CSV.

Pipeline:

```text
upload
→ validate
→ scan
→ store
→ parse
→ preserve page/section mapping
→ chunk
→ embed
→ source record
→ evidence extraction
```

A PDF citation should be able to resolve to a page when page information is available.

---

# 26. Privacy

Treat uploaded research files as potentially confidential.

Implement:

- deletion;
- retention policy;
- provider-routing preference;
- BYOK support;
- audit events;
- export;
- documented hosted data flow.

Do not silently route private files through a provider tier whose data-use policy is incompatible with the selected privacy mode.

---

# 27. Observability

Instrument:

```text
research run
state transitions
model call
search call
fetch call
parse call
evidence extraction
citation verification
cache hit/miss
retry
cost estimate
actual cost
latency
error
```

Use structured telemetry.

Never place secrets or full confidential document contents in logs.

---

# 28. Testing Strategy

## Unit tests

Required for:

- state transitions;
- source normalization;
- URL canonicalization;
- DOI normalization;
- deduplication;
- source rank scoring;
- credit ledger math;
- pricing estimates;
- citation status rules;
- SSRF validators;
- secret redaction.

## Integration tests

Required for:

- DB migrations;
- queue lifecycle;
- search adapter contract;
- fetch adapter contract;
- model adapter contract using safe test/mocked provider boundaries;
- research run persistence;
- OAuth callback logic where testable;
- billing webhook idempotency.

## E2E

Required journeys:

1. login → new project → research → cited report;
2. citation → evidence inspector → source;
3. academic query → literature results;
4. upload PDF → file-backed report;
5. cancel running research;
6. page refresh during research → reconnect to progress;
7. premium credit reservation/settlement;
8. BYOK add/use/remove.

## Adversarial tests

- webpage prompt injection;
- malicious redirects;
- localhost/private IP SSRF;
- oversized files;
- malformed PDFs;
- duplicate payment webhook;
- cross-workspace ID access;
- provider timeout/retry storm;
- hallucinated DOI/bibliographic fields;
- unsupported numerical claim.

---

# 29. Evaluation Harness

Create `packages/evals` or equivalent.

Support reproducible evaluation records:

```text
question
expected facts
expected source types
known primary sources
forbidden/misleading sources
freshness requirements
citation expectations
scoring result
model/router version
```

Track:

- citation correctness;
- citation completeness;
- source relevance;
- primary-source usage;
- claim support;
- contradiction handling;
- cost;
- latency.

Do not declare research quality improved solely because generated prose reads better.

---

# 30. CI/CD Acceptance

CI must run at least:

```text
format/lint
TypeScript typecheck
unit tests
integration tests
build
migration validation
security/dependency checks
secret scan
```

E2E may run in a separate CI stage if infrastructure cost is material.

No production deployment when critical tests fail.

---

# 31. Self-Hosting

A clean machine should eventually be able to run:

```bash
cp .env.example .env
docker compose up -d
```

Document configuration for:

- local Ollama/open model;
- OpenAI-compatible server;
- self-hosted search/SearXNG;
- PostgreSQL;
- Redis;
- object storage;
- OAuth;
- migrations;
- backups.

Self-host mode must not require a Mada.AI cloud API key for core research orchestration.

---

# 32. Documentation Requirements

Maintain as implementation progresses:

```text
docs/architecture/OVERVIEW.md
docs/architecture/RESEARCH_STATE_MACHINE.md
docs/architecture/EVIDENCE_GRAPH.md
docs/architecture/MODEL_ROUTER.md
docs/architecture/SEARCH_ROUTER.md
docs/security/THREAT_MODEL.md
docs/privacy/DATA_FLOW.md
docs/research/CITATION_VERIFICATION.md
docs/engineering/SKILLS_USED.md
docs/self-hosting/README.md
```

Create Architecture Decision Records for material deviations from the master plan.

---

# 33. Implementation Workflow Per Phase

For every phase:

## Inspect

- inspect existing implementation;
- read relevant docs/skills;
- run baseline tests;
- identify constraints and regressions to avoid.

## Plan

Before editing, produce a concise implementation plan containing:

- files/modules affected;
- database changes;
- API changes;
- security implications;
- tests required.

## Implement

- make incremental coherent changes;
- avoid unrelated refactors;
- preserve existing working behavior.

## Test

- run focused tests during implementation;
- run broader suite before completion;
- test negative/error cases.

## Review

Review your own changes for:

- correctness;
- security;
- tenant isolation;
- accessibility;
- cost behavior;
- provider coupling;
- dead code;
- TODO-only placeholders.

## Document

Update:

- architecture docs;
- API docs;
- environment example;
- migrations;
- changelog/walkthrough;
- `SKILLS_USED.md` when applicable.

---

# 34. Anti-Slop Engineering Rules

Do not produce a superficially complete application with fake internals.

Forbidden completion shortcuts:

- fake citations generated without stored evidence;
- hard-coded report responses;
- fake progress bars driven by timers;
- buttons that do not work;
- mock provider adapters silently used in production;
- “AI confidence” values generated arbitrarily with no supporting signals;
- database schema without migrations;
- TODO placeholders presented as implemented features;
- silently swallowing research failures;
- using one giant model prompt as a substitute for the research state machine.

If a feature cannot be fully implemented in the current phase, gate it explicitly and document the remaining work.

---

# 35. Binary Acceptance Criteria — Core Vertical Slice

Do not mark the first vertical slice complete until every item is true:

- [ ] Fresh user can authenticate with Google.
- [ ] User receives a workspace automatically.
- [ ] User can create/open a project.
- [ ] User can submit a research question.
- [ ] A ResearchRun row is created before asynchronous work starts.
- [ ] State transitions are persisted.
- [ ] At least four distinct search queries can be produced for a normal Research run.
- [ ] Search results are stored/normalized.
- [ ] Selected sources are fetched through a controlled fetch layer.
- [ ] Evidence records are persisted.
- [ ] Claims are persisted separately from report prose.
- [ ] ClaimEvidence relations exist.
- [ ] Citation verifier returns a stored status.
- [ ] Unsupported critical claims are blocked, repaired, weakened, or explicitly flagged.
- [ ] Final report includes citations tied to stored Source records.
- [ ] Clicking a citation opens a source/evidence inspector.
- [ ] Live UI receives persisted research events.
- [ ] Refreshing the page does not lose the running research session.
- [ ] Cancelling a run prevents unnecessary subsequent work.
- [ ] Research errors produce a recoverable/diagnosable UI state.
- [ ] Unit, integration, and E2E tests for the slice pass.
- [ ] No API/provider secrets appear in logs or client bundles.

---

# 36. Binary Acceptance Criteria — Academic Mode

- [ ] OpenAlex adapter returns normalized works.
- [ ] Crossref adapter resolves DOI metadata.
- [ ] Papers with the same DOI deduplicate.
- [ ] Screening status and exclusion reason are stored.
- [ ] Literature matrix is generated from structured metadata/evidence.
- [ ] Missing metadata remains missing instead of being invented.
- [ ] APA reference output is produced from normalized metadata.
- [ ] BibTeX or RIS export exists.
- [ ] Academic citations resolve to source metadata.

---

# 37. Binary Acceptance Criteria — Security

- [ ] localhost URL fetch blocked.
- [ ] private network URL fetch blocked.
- [ ] redirect-to-private-network blocked.
- [ ] retrieved prompt injection does not alter agent policy.
- [ ] cross-workspace resource access denied.
- [ ] uploaded files validated.
- [ ] raw BYOK secrets absent from logs.
- [ ] payment webhook replay is idempotent.
- [ ] CSRF/session controls verified for auth architecture.
- [ ] dependency and secret scans pass release threshold.

---

# 38. Binary Acceptance Criteria — Open Source

- [ ] License file present.
- [ ] README explains Mada.AI mission and architecture.
- [ ] `.env.example` contains every required variable without secrets.
- [ ] Docker Compose stack boots.
- [ ] self-host docs work from a clean setup.
- [ ] core research flow can use a self-hosted/open model endpoint.
- [ ] core research flow does not require Mada.AI's hosted billing service.
- [ ] contribution and security reporting docs exist.

---

# 39. Current Official References to Consult

Reverify before relying on capabilities, model names, prices, or API behavior.

### Perplexity

https://www.perplexity.ai/help-center/en/articles/10738684-what-is-research-mode

### Google Gemini

https://ai.google.dev/gemini-api/docs/deep-research
https://ai.google.dev/gemini-api/docs/models
https://ai.google.dev/gemini-api/docs/pricing

### OpenAI

https://developers.openai.com/api/docs/models

### Anthropic

https://platform.claude.com/docs/en/about-claude/pricing

### Academic data

https://openalex.org/
https://www.crossref.org/documentation/retrieve-metadata/rest-api/
https://api.semanticscholar.org/api-docs

### Web extraction

https://github.com/firecrawl/firecrawl

Use official documentation as the primary source when APIs conflict with tutorials or blog posts.

---

# 40. Required Agent Deliverables

At the end of each implementation session, report:

1. **Implemented** — exact completed functionality.
2. **Changed files** — meaningful files/modules only.
3. **Database changes** — migrations/schema changes.
4. **Tests run** — commands and pass/fail results.
5. **Security review** — material findings.
6. **Cost implications** — new provider/tool calls or quota effects.
7. **Skills used** — relevant inspected skills and any installed skill source.
8. **Known limitations** — actual remaining limitations, not generic caveats.
9. **Next highest-leverage step**.

Do not claim completion if tests were not executed.

---

# 41. Start Instruction

Begin now.

1. Inspect the repository completely enough to understand the current architecture.
2. Read all relevant skills before editing.
3. Read `Mada.AI_IMPLEMENTATION_PLAN.md`.
4. Run baseline install/build/test commands.
5. Create or update an implementation task list mapped to the phases in the plan.
6. Identify the smallest path to the **first working evidence-backed research vertical slice**.
7. Implement it using **Inspect → Plan → Implement → Test → Review → Document**.
8. Continue phase-by-phase without replacing working code with speculative rewrites.

The project is successful when Mada.AI can perform useful research with **traceable evidence, verifiable citations, transparent research operations, open-source deployability, and optional premium intelligence**.
