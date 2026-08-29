# Architecture overview

Mada.AI runs a deterministic research state machine:

`RECEIVED → CLASSIFY_INTENT → BUILD_PLAN → GENERATE_QUERIES → SEARCH → RANK_RESULTS → FETCH_AND_PARSE → EXTRACT_EVIDENCE → ASSESS_COVERAGE → BUILD_CLAIMS → SYNTHESIZE_REPORT → VERIFY_CITATIONS → FINALIZE`

Core packages:

- `@mada-ai/agent-core` orchestrates stages and emits user-safe events
- `@mada-ai/search` normalizes academic/web providers
- `@mada-ai/fetch` performs SSRF-safe retrieval
- `@mada-ai/evidence` extracts evidence and assesses coverage
- `@mada-ai/citations` verifies claim-evidence entailment
- `@mada-ai/models` routes tasks across providers

See the product plan: `Mada.AI_IMPLEMENTATION_PLAN.md`.
