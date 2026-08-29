import { createResearchStoreFromEnv, ResearchEngine } from '@mada-ai/agent-core';
import { createModelRouterFromEnv } from '@mada-ai/models';
import { createSearchRouterFromEnv } from '@mada-ai/search';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';

const RESEARCH_QUEUE = 'mada-research';
const connection = new Redis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
});

const store = createResearchStoreFromEnv();
const engine = new ResearchEngine({
  store,
  models: createModelRouterFromEnv(),
  search: createSearchRouterFromEnv(),
});

const worker = new Worker(
  RESEARCH_QUEUE,
  async (job) => {
    const runId = String((job.data as { runId?: string }).runId ?? '');
    if (!runId) throw new Error('runId missing');
    console.log(`[worker] starting ${runId}`);
    await engine.run(runId);
    console.log(`[worker] completed ${runId}`);
  },
  {
    connection,
    concurrency: Number(process.env.WORKER_CONCURRENCY ?? 2),
  },
);

worker.on('failed', (job, error) => {
  console.error(`[worker] job ${job?.id} failed`, error);
});

console.log('[worker] listening on queue', RESEARCH_QUEUE);
console.log(
  '[worker] store',
  process.env.SUPABASE_DB_URL || process.env.DATABASE_URL ? 'postgres' : 'memory',
);

process.on('SIGINT', async () => {
  await worker.close();
  await connection.quit();
  process.exit(0);
});
