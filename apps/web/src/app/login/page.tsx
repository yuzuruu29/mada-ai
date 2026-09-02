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
      <a className="brand" href="/">
        Mada.AI
      </a>
      <div className="card">
        <h1>Sign in</h1>
        <p>
          Use Supabase Auth (Google) for a cloud workspace, or{' '}
          <a href="/">continue as guest</a> from the home page.
        </p>
        <button
          type="button"
          disabled={pending || !configured}
          onClick={() => void signInWithGoogle()}
        >
          {pending ? 'Redirecting…' : 'Continue with Google'}
        </button>
        {!configured ? (
          <p className="hint">Add Supabase URL + publishable key to enable OAuth.</p>
        ) : null}
        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <style jsx>{`
        .login {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 1.5rem;
        }
        .brand {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.3rem;
          color: var(--text);
        }
        .brand:hover {
          text-decoration: none;
        }
        .card {
          width: min(26rem, 100%);
          border: 1px solid var(--line);
          border-radius: 12px;
          background: var(--bg-elev);
          padding: 1.75rem;
        }
        h1 {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.5rem;
          margin: 0 0 0.5rem;
        }
        p {
          color: var(--text-dim);
          font-size: 0.92rem;
          line-height: 1.55;
          margin: 0 0 1rem;
        }
        button {
          width: 100%;
          padding: 0.65rem 1rem;
          border: 1px solid rgba(74, 222, 128, 0.4);
          border-radius: 8px;
          background: var(--accent-soft);
          color: var(--accent);
          font-weight: 600;
          cursor: pointer;
        }
        button:hover:not(:disabled) {
          background: rgba(74, 222, 128, 0.2);
        }
        button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .hint,
        .error {
          margin: 0.75rem 0 0;
          font-size: 0.82rem;
        }
        .hint {
          color: var(--text-faint);
        }
        .error {
          color: var(--red);
        }
      `}</style>
    </main>
  );
}
