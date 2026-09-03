import {
  createResearchStoreFromEnv,
  ResearchEngine,
  type ResearchStore,
} from '@mada-ai/agent-core';
import { createModelRouterFromEnv } from '@mada-ai/models';
import { createSearchRouterFromEnv } from '@mada-ai/search';

// Dev re-evaluates route modules (Fast Refresh/Turbopack), which would reset a
// module-level singleton and orphan in-flight runs; globalThis survives that.
const globalForStore = globalThis as unknown as { __madaStore?: ResearchStore };

/**
 * Uses Supabase/Postgres when DATABASE_URL or SUPABASE_DB_URL is set;
 * otherwise falls back to the in-process memory store.
 */
export function getStore(): ResearchStore {
  if (!globalForStore.__madaStore) {
    globalForStore.__madaStore = createResearchStoreFromEnv();
  }
  return globalForStore.__madaStore;
}

export async function enqueueResearch(runId: string): Promise<'inline'> {
  const engine = new ResearchEngine({
    store: getStore(),
    models: createModelRouterFromEnv(),
    search: createSearchRouterFromEnv(),
  });
  void engine.run(runId).catch((error) => {
    console.error('Research run failed', error);
  });
  return 'inline';
}
