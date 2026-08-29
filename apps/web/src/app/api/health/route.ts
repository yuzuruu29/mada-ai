import { NextResponse } from 'next/server';
import { isDatabaseConfigured, pingDatabase, resolveDatabaseUrl } from '@mada-ai/db';
import { isSupabaseAuthConfigured } from '@/lib/supabase/server';

export async function GET() {
  const dbConfigured = isDatabaseConfigured();
  let dbOk: boolean | null = null;
  if (dbConfigured) {
    dbOk = await pingDatabase();
  }

  return NextResponse.json({
    ok: true,
    service: 'mada-web',
    time: new Date().toISOString(),
    backend: {
      databaseConfigured: dbConfigured,
      databaseReachable: dbOk,
      databaseHost: summarizeHost(resolveDatabaseUrl()),
      supabaseAuthConfigured: isSupabaseAuthConfigured(),
      store: dbConfigured ? 'postgres' : 'memory',
    },
  });
}

function summarizeHost(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return 'configured';
  }
}
