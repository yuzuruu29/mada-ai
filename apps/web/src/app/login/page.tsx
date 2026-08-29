'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const configured = isSupabaseBrowserConfigured();

  async function signInWithGoogle() {
    if (!configured) {
      setError('Supabase Auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and the publishable key.');
      return;
    }
    setPending(true);
    setError(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) setError(oauthError.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
      setPending(false);
    }
  }

  return (
    <main className="login">
      <h1>Sign in to Mada.AI</h1>
      <p>Use Supabase Auth (Google) for a cloud workspace, or continue as guest from the home page.</p>
      <button type="button" disabled={pending || !configured} onClick={() => void signInWithGoogle()}>
        {pending ? 'Redirecting…' : 'Continue with Google'}
      </button>
      {!configured ? (
        <p className="hint">Add Supabase URL + publishable key to enable OAuth.</p>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
      <style jsx>{`
        .login {
          max-width: 28rem;
          margin: 4rem auto;
          padding: 0 1.25rem;
          font-family: 'Iowan Old Style', 'Palatino Linotype', Palatino, serif;
        }
        h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        p {
          color: #3d4540;
          line-height: 1.5;
        }
        button {
          margin-top: 1.25rem;
          padding: 0.7rem 1.1rem;
          border: 1px solid #1c2420;
          background: #1c2420;
          color: #f4f1ea;
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .hint,
        .error {
          margin-top: 0.75rem;
          font-size: 0.9rem;
        }
        .error {
          color: #8b2e2e;
        }
      `}</style>
    </main>
  );
}
