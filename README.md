# Mada.AI

Open research. Verifiable evidence.

Mada.AI is an open-source AI research workspace that searches, reads sources, extracts evidence, verifies claims against that evidence, and produces an auditable cited report.

## Cloud backend (Supabase)

Hosted data and auth use **Supabase**:

- Postgres via Drizzle (`SUPABASE_DB_URL` / `DATABASE_URL`)
- Auth via `@supabase/ssr` (Google OAuth at `/login`)

See [docs/self-hosting/supabase.md](docs/self-hosting/supabase.md).

```bash
pnpm install
cp .env.example .env
# Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_DB_URL
pnpm db:migrate
pnpm build
pnpm --filter @mada-ai/web dev
```

Without database URLs the app falls back to an in-process memory store (fine for unit tests only).

## Quick start (local vertical slice)

```bash
pnpm install
cp .env.example .env
pnpm --filter @mada-ai/shared build
pnpm --filter @mada-ai/db build
pnpm --filter @mada-ai/models build
pnpm --filter @mada-ai/search build
pnpm --filter @mada-ai/fetch build
pnpm --filter @mada-ai/evidence build
pnpm --filter @mada-ai/citations build
pnpm --filter @mada-ai/agent-core build
pnpm --filter @mada-ai/web dev
```

Open http://localhost:3000, ask a research question, and watch the live research trace.

Default model provider is `mock` (no API keys required). Academic search uses OpenAlex + Crossref. Web fallback uses Wikipedia search. Fetches are SSRF-guarded.

## Docker (local Postgres + Redis + web + worker)

```bash
cp .env.example .env
docker compose up --build
```

For production-shaped deploys, point `SUPABASE_DB_URL` at your Supabase project instead of the Compose Postgres service.

## Workspace layout

```text
apps/web          Next.js UI + API + Supabase Auth clients
apps/worker       BullMQ research worker (shares Postgres store)
packages/agent-core   Persisted research state machine + Postgres store
packages/db           Drizzle schema + Supabase/Postgres client
packages/evidence     Evidence extraction + coverage
packages/citations    Claim verification
packages/search       OpenAlex / Crossref / web adapters
packages/fetch        SSRF-safe fetch + ranking helpers
packages/models       Provider-neutral model router
```

## Scripts

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm db:generate` / `pnpm db:migrate`

## License

AGPL-3.0 for server/core (see `LICENSE`). Legal review required before public release.
