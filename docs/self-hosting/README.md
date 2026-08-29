# Self-hosting

```bash
git clone <repo>
cd mada-ai
cp .env.example .env
pnpm install
docker compose up -d postgres redis
pnpm db:migrate
pnpm --filter @mada-ai/web dev
pnpm --filter @mada-ai/worker dev
```

Minimum env (Supabase cloud):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_DB_URL=
REDIS_URL=
AUTH_SECRET=
MODEL_PROVIDER=mock
SEARCH_PROVIDER=openalex+web
```

See [supabase.md](./supabase.md) for project setup, migrations, and Google Auth.

For local-only models set `MODEL_PROVIDER=ollama` and `OLLAMA_BASE_URL`.
