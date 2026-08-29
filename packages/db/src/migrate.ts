import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveDatabaseUrl } from './index.js';

const connectionString = resolveDatabaseUrl();
if (!connectionString) {
  console.error('DATABASE_URL or SUPABASE_DB_URL is required');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.resolve(__dirname, '../../../infra/migrations');

const usePooler =
  connectionString.includes('pooler.supabase.com') ||
  connectionString.includes(':6543');

const client = postgres(connectionString, {
  max: 1,
  ...(usePooler ? { prepare: false as const } : {}),
});
const db = drizzle(client);

await migrate(db, { migrationsFolder });
await client.end();
console.log('Migrations applied');
