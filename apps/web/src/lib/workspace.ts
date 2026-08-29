import { cookies } from 'next/headers';
import { createId } from '@mada-ai/shared';
import type { ResearchStore, WorkspaceBundle } from '@mada-ai/agent-core';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const GUEST_USER_COOKIE = 'mada_guest_user';
const GUEST_WS_COOKIE = 'mada_guest_ws';

function guestCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
  };
}

/**
 * Resolve the active workspace: Supabase Auth user when signed in,
 * otherwise a cookie-stable guest identity persisted in Postgres/Supabase.
 */
export async function resolveWorkspace(store: ResearchStore): Promise<WorkspaceBundle> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email && store.ensureUserWorkspace) {
      return store.ensureUserWorkspace({
        userId: user.id,
        email: user.email,
        name:
          (typeof user.user_metadata?.full_name === 'string'
            ? user.user_metadata.full_name
            : undefined) ??
          user.email.split('@')[0] ??
          'Researcher',
      });
    }
  }

  const jar = await cookies();
  let userId = jar.get(GUEST_USER_COOKIE)?.value;
  let workspaceId = jar.get(GUEST_WS_COOKIE)?.value;
  if (!userId || !workspaceId) {
    userId = createId('usr');
    workspaceId = createId('ws');
    jar.set(GUEST_USER_COOKIE, userId, guestCookieOptions());
    jar.set(GUEST_WS_COOKIE, workspaceId, guestCookieOptions());
  }

  return store.ensureGuestWorkspace({ userId, workspaceId });
}
