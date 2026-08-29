'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Composer.module.css';

const MODES = [
  { id: 'ask', label: 'Ask', icon: '✦' },
  { id: 'research', label: 'Research', icon: '◎' },
  { id: 'academic', label: 'Academic', icon: '❖' },
  { id: 'deep', label: 'Deep Research', icon: '◈' },
] as const;

const FILTERS = [
  { id: 'focus', label: 'Focus', value: 'Auto' },
  { id: 'sources', label: 'Sources', value: 'All' },
  { id: 'time', label: 'Time range', value: 'Any time' },
] as const;

export function Composer() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<(typeof MODES)[number]['id']>('research');
  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Autosize the textarea as the question grows.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [question]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = question.trim();
    if (!q || busy) return;
    setBusy(true);
    setError(null);
    try {
      const projectRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: q.slice(0, 80),
          description: 'Auto-created from studio composer',
        }),
      });
      if (!projectRes.ok) throw new Error('Could not create project');
      const project = (await projectRes.json()) as { id: string };

      const researchRes = await fetch('/api/research', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, question: q, mode }),
      });
      if (!researchRes.ok) throw new Error('Could not start research');
      const research = (await researchRes.json()) as { runId: string };
      router.push(`/research/${research.runId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setBusy(false);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // ⌘/Ctrl + Enter starts the run — matches modern composer UX.
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      onSubmit(event);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.composer}>
      <div className={styles.frame}>
        <label className={styles.srOnly} htmlFor="studio-question">
          What are you researching?
        </label>
        <textarea
          id="studio-question"
          ref={textareaRef}
          className={styles.textarea}
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="What are you researching?"
          rows={2}
          required
        />

        <div className={styles.modesRow} role="group" aria-label="Research mode">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={mode === item.id ? `${styles.mode} ${styles.modeActive}` : styles.mode}
              onClick={() => setMode(item.id)}
              aria-pressed={mode === item.id}
            >
              <span aria-hidden="true" className={styles.modeIcon}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={
                  filters[filter.id] ? `${styles.filter} ${styles.filterActive}` : styles.filter
                }
                onClick={() => setFilters((f) => ({ ...f, [filter.id]: !f[filter.id] }))}
                aria-pressed={!!filters[filter.id]}
              >
                {filter.label}
                <span className={styles.filterValue}>{filter.value}</span>
                <span className={styles.caret} aria-hidden="true">
                  ▾
                </span>
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.iconBtn} aria-label="Attach files">
              ⌗
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Voice input">
              ◉
            </button>
            <button type="submit" className={styles.cta} disabled={busy || !question.trim()}>
              {busy ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Starting…
                </>
              ) : (
                <>
                  Start research <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <p className={styles.hint}>
        <kbd>⌘</kbd> + <kbd>Enter</kbd> to launch · Mada searches, verifies claims against evidence,
        and returns an auditable cited report.
      </p>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
