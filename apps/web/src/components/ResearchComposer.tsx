'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ResearchComposer.module.css';

const modes = [
  { id: 'ask', label: 'Ask' },
  { id: 'research', label: 'Research' },
  { id: 'academic', label: 'Academic' },
  { id: 'deep', label: 'Deep Research' },
] as const;

export function ResearchComposer() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<(typeof modes)[number]['id']>('research');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
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
      <textarea
        id="research-question"
        className={styles.textarea}
        name="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What are you researching?"
        rows={3}
        required
      />
      <div className={styles.row}>
        <div className={styles.modes} role="group" aria-label="Research depth">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={mode === item.id ? `${styles.mode} ${styles.active}` : styles.mode}
              onClick={() => setMode(item.id)}
              aria-pressed={mode === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button type="submit" className={styles.cta} disabled={busy}>
          {busy ? 'Starting…' : 'Start Research'}
        </button>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </form>
  );
}
