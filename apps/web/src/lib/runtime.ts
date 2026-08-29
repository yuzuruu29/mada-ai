import {
  createResearchStoreFromEnv,
  ResearchEngine,
  type ResearchStore,
} from '@mada-ai/agent-core';
import { createModelRouterFromEnv } from '@mada-ai/models';
import { createSearchRouterFromEnv } from '@mada-ai/search';

let storeSingleton: ResearchStore | null = null;

/**
 * Uses Supabase/Postgres when DATABASE_URL or SUPABASE_DB_URL is set;
 * otherwise falls back to the in-process memory store.
 */
export function getStore(): ResearchStore {
  if (!storeSingleton) {
    storeSingleton = createResearchStoreFromEnv();
  }
  return storeSingleton;
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
