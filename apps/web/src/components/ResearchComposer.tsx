'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ResearchComposer.module.css';

const modes = [
  { id: 'ask', label: 'Ask', hint: 'Quick grounded answer' },
  { id: 'research', label: 'Research', hint: 'Search, read, verify, cite' },
  { id: 'academic', label: 'Academic', hint: 'Papers first (OpenAlex, Crossref)' },
  { id: 'deep', label: 'Deep', hint: 'Iterative follow-up queries' },
] as const;

export function ResearchComposer() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<(typeof modes)[number]['id']>('research');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // "/" focuses the composer from anywhere on the page
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      event.preventDefault();
      textareaRef.current?.focus();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!question.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const projectRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: question.trim().slice(0, 80),
          description: 'Auto-created from composer',
        }),
      });
      if (!projectRes.ok) throw new Error('Could not create project');
      const project = (await projectRes.json()) as { id: string };

      const researchRes = await fetch('/api/research', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          question: question.trim(),
          mode,
        }),
      });
      if (!researchRes.ok) throw new Error('Could not start research');
      const research = (await researchRes.json()) as { runId: string };
      router.push(`/research/${research.runId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.composer}>
      <label className={styles.srOnly} htmlFor="research-question">
        What are you researching?
      </label>
      <div className={styles.box}>
        <textarea
          ref={textareaRef}
          id="research-question"
          className={styles.textarea}
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Ask a research question…  ( / to focus, ⌘↵ to run )"
          rows={3}
          required
        />
        <div className={styles.bar}>
          <div className={styles.modes} role="group" aria-label="Research depth">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.hint}
                className={mode === item.id ? `${styles.mode} ${styles.active}` : styles.mode}
                onClick={() => setMode(item.id)}
                aria-pressed={mode === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button type="submit" className={styles.cta} disabled={busy || !question.trim()}>
            {busy ? (
              'Starting…'
            ) : (
              <>
                Start research <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>
      </div>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
