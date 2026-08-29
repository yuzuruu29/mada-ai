import { isDatabaseConfigured } from '@mada-ai/db';
import { createPostgresStore } from './postgres-store.js';
import { getGlobalMemoryStore, type ResearchStore } from './store.js';

/**
 * Prefer Supabase/Postgres when DATABASE_URL or SUPABASE_DB_URL is set.
 * Falls back to in-process memory for offline unit tests / demos.
 */
export function createResearchStoreFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): ResearchStore {
  if (isDatabaseConfigured(env)) {
    return createPostgresStore();
  }
  return getGlobalMemoryStore();
}
