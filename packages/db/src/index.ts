import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import * as schema from './schema/index.js';

export * from './schema/index.js';

export type Database = PostgresJsDatabase<typeof schema>;

let client: Sql | null = null;
let dbInstance: Database | null = null;

/**
 * Prefer Supabase pooled URL when present. Transaction poolers require
 * `prepare: false` (see Supabase Drizzle guide).
 */
export function resolveDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  return env.SUPABASE_DB_URL ?? env.DATABASE_URL ?? undefined;
}

export function createDb(connectionString: string): {
  sql: Sql;
  db: Database;
} {
  // Disable prepared statements for Supabase transaction pooler (port 6543).
  const usePooler =
    connectionString.includes('pooler.supabase.com') ||
    connectionString.includes(':6543');
  const sql = postgres(connectionString, {
    max: 10,
    ...(usePooler ? { prepare: false as const } : {}),
  });
  return { sql, db: drizzle(sql, { schema }) };
}

export function getDb(connectionString = resolveDatabaseUrl()): Database {
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL or SUPABASE_DB_URL is required for Postgres/Supabase access',
    );
  }
  if (!client || !dbInstance) {
    const created = createDb(connectionString);
    client = created.sql;
    dbInstance = created.db;
  }
  return dbInstance;
}

export function isDatabaseConfigured(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return Boolean(resolveDatabaseUrl(env));
}

export async function pingDatabase(
  connectionString = resolveDatabaseUrl(),
): Promise<boolean> {
  if (!connectionString) return false;
  const { sql } = createDb(connectionString);
  try {
    await sql`select 1`;
    return true;
  } catch {
    return false;
  } finally {
    await sql.end({ timeout: 5 });
  }
}
