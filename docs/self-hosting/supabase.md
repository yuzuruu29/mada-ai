# Supabase cloud backend

Mada.AI uses **Supabase Postgres** (via Drizzle) as the primary cloud database and **Supabase Auth** for hosted sign-in.

## 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable / anon key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Open **Project Settings → Database** and copy the connection string:
   - Prefer **Session pooler** (port `5432`) for `pnpm db:migrate`
   - **Transaction pooler** (port `6543`) is fine for the app; Drizzle sets `prepare: false` automatically
   - Put it in `SUPABASE_DB_URL` (or `DATABASE_URL`)

## 2. Enable Google Auth (optional but recommended)

1. In Supabase: **Authentication → Providers → Google**
2. Add Google OAuth client credentials
3. Add redirect URL: `http://localhost:3000/auth/callback` (and your production URL)

Sign-in UI: `/login`

## 3. Apply schema

```bash
cp .env.example .env
# fill SUPABASE_DB_URL + NEXT_PUBLIC_SUPABASE_* keys
pnpm install
pnpm db:generate   # when schema changes
pnpm db:migrate
```

## 4. Run the app

```bash
pnpm --filter @mada-ai/shared build
pnpm --filter @mada-ai/db build
pnpm --filter @mada-ai/agent-core build
# …build other packages as needed, or: pnpm build
pnpm --filter @mada-ai/web dev
```

`GET /api/health` reports whether the store is `postgres` or `memory` and whether the database is reachable.

## Guests vs signed-in users

- **Signed in (Supabase Auth):** workspace is keyed by the Supabase user id.
- **Guest:** cookie-stable `mada_guest_user` / `mada_guest_ws` identities are upserted into the same Postgres tables so research persists across reloads without an account.

## Local Docker alternative

If Supabase URLs are unset, set `DATABASE_URL=postgresql://mada:mada@localhost:5432/mada` and run `docker compose up -d postgres redis`.
