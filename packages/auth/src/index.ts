import { createId } from '@mada-ai/shared';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  provider: 'guest' | 'google' | 'github' | 'supabase';
}

/**
 * Guest session for local/dev when Supabase Auth is not used.
 * Hosted sign-in uses Supabase Auth (see apps/web `/login` + `/auth/callback`).
 */
export function createGuestSession(input?: { email?: string; name?: string }): AuthSession {
  if (process.env.ALLOW_GUEST_AUTH !== 'true' && process.env.NODE_ENV === 'production') {
    throw new Error('Guest auth disabled');
  }
  const userId = createId('usr');
  return {
    userId,
    email: input?.email ?? `guest+${userId}@mada.local`,
    name: input?.name ?? 'Guest Researcher',
    provider: 'guest',
  };
}

export function supabaseConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

export function oauthConfigured(env: NodeJS.ProcessEnv = process.env): {
  google: boolean;
  github: boolean;
  supabase: boolean;
} {
  return {
    google: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
    github: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET),
    supabase: supabaseConfigured(env),
  };
}
