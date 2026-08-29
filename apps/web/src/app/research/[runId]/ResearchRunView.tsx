'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './run.module.css';

type RunPayload = {
  run: {
    id: string;
    question: string;
    mode: string;
    stage: string;
    status: string;
    coverageScore?: number;
    plan?: { objective: string; subquestions: string[] };
    claims: Array<{
      id: string;
      text: string;
      verificationStatus: string;
      importance: string;
      confidence: number;
    }>;
    evidence: Array<{
      id: string;
      sourceId: string;
      quoteOrExcerpt: string;
      supportStrength: number;
    }>;
    sources: Array<{
      id: string;
      title: string;
      url: string;
      category: string;
      doi?: string;
    }>;
    claimEvidence: Array<{
      claimId: string;
      evidenceId: string;
      relation: string;
      entailmentScore: number;
    }>;
    reportMarkdown?: string;
    errorMessage?: string;
  };
  events: Array<{ type: string; message: string; createdAt: string }>;
};

export function ResearchRunView({ runId }: { runId: string }) {
  const [data, setData] = useState<RunPayload | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const res = await fetch(`/api/research/${runId}`);
      if (!res.ok) {
        if (active) setError('Research run not found');
        return;
      }
      const json = (await res.json()) as RunPayload;
      if (active) setData(json);
    };
    void load();

    const source = new EventSource(`/api/research/${runId}/events`);
    source.addEventListener('status', () => {
      void load();
    });
    source.addEventListener('done', () => {
      void load();
      source.close();
    });
    source.onerror = () => {
      void load();
    };
    return () => {
      active = false;
      source.close();
    };
  }, [runId]);

  const selectedEvidence = useMemo(() => {
    if (!data || !selectedClaimId) return [];
    const links = data.run.claimEvidence.filter((l) => l.claimId === selectedClaimId);
    return links
      .map((link) => {
        const evidence = data.run.evidence.find((e) => e.id === link.evidenceId);
        const source = data.run.sources.find((s) => s.id === evidence?.sourceId);
        return evidence
          ? { link, evidence, source }
          : null;
      })
      .filter(Boolean);
  }, [data, selectedClaimId]);

  async function cancelRun() {
    await fetch(`/api/research/${runId}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    });
  }

  if (error) {
    return (
      <main className={styles.workspace}>
        <p>{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className={styles.workspace}>
        <p className={styles.muted}>Loading research run…</p>
      </main>
    );
  }

  const { run, events } = data;

  return (
    <main className={styles.workspace}>
      <aside className={styles.pane}>
        <p className={styles.brand}>Mada.AI</p>
        <p className={styles.meta}>Project navigation</p>
        <p>
          <a href="/">New research</a>
        </p>
        <p>
          <a href="/projects">All projects</a>
        </p>
        <p className={styles.meta}>Mode: {run.mode}</p>
        <span className={styles.stage}>
          {run.status} · {run.stage}
        </span>
        {typeof run.coverageScore === 'number' ? (
          <p className={styles.meta}>Coverage {run.coverageScore.toFixed(2)}</p>
        ) : null}
        <div className={styles.actions}>
          {run.status === 'running' || run.status === 'queued' ? (
            <button type="button" onClick={() => void cancelRun()}>
              Cancel
            </button>
          ) : null}
        </div>
        <h2>Research trace</h2>
        <ol className={styles.trace}>
          {events.map((event, index) => (
            <li key={`${event.createdAt}-${index}`}>
              <strong>{event.type}</strong>
              <div className={styles.muted}>{event.message}</div>
            </li>
          ))}
        </ol>
      </aside>

      <section className={styles.pane}>
        <h1>{run.question}</h1>
        {run.plan ? (
          <div>
            <h2>Plan</h2>
            <p>{run.plan.objective}</p>
            <ul>
              {run.plan.subquestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <h2>Report</h2>
        {run.errorMessage ? <p className={styles.meta}>{run.errorMessage}</p> : null}
        <article className={styles.report}>
          {run.reportMarkdown ?? 'Report will appear as verification completes.'}
        </article>
        <h2>Claims</h2>
        {run.claims.map((claim) => (
          <div className={styles.claim} key={claim.id}>
            <p>{claim.text}</p>
            <p className={styles.muted}>
              {claim.importance} · {claim.verificationStatus} · confidence{' '}
              {claim.confidence.toFixed(2)}
            </p>
            <button type="button" onClick={() => setSelectedClaimId(claim.id)}>
              Show evidence
            </button>
          </div>
        ))}
      </section>

      <aside className={styles.pane}>
        <h2>Evidence & sources</h2>
        {selectedClaimId ? (
          <div>
            <h3>Selected claim evidence</h3>
            {selectedEvidence.length ? (
              selectedEvidence.map((row) =>
                row ? (
                  <div className={styles.source} key={row.evidence.id}>
                    <p>{row.evidence.quoteOrExcerpt}</p>
                    <p className={styles.muted}>
                      {row.link.relation} · entailment {row.link.entailmentScore.toFixed(2)}
                    </p>
                    {row.source ? (
                      <a href={row.source.url} target="_blank" rel="noreferrer">
                        {row.source.title}
                      </a>
                    ) : null}
                  </div>
                ) : null,
              )
            ) : (
              <p className={styles.muted}>No linked evidence for this claim.</p>
            )}
          </div>
        ) : (
          <p className={styles.muted}>Select a claim to inspect supporting evidence.</p>
        )}
        <h3>Sources</h3>
        {run.sources.map((source) => (
          <div className={styles.source} key={source.id}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.title}
            </a>
            <p className={styles.muted}>
              {source.category}
              {source.doi ? ` · DOI ${source.doi}` : ''}
            </p>
          </div>
        ))}
      </aside>
    </main>
  );
}
