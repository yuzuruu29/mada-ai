'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
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

const STATUS_TONE: Record<string, 'ok' | 'run' | 'warn' | 'err' | 'idle'> = {
  completed: 'ok',
  running: 'run',
  queued: 'idle',
  failed: 'err',
  cancelled: 'warn',
};

const CLAIM_TONE: Record<string, 'ok' | 'run' | 'warn' | 'err' | 'idle'> = {
  verified: 'ok',
  partial: 'warn',
  unsupported: 'err',
  conflicted: 'err',
  unverified: 'idle',
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString('en-GB', { hour12: false });
}

export function ResearchRunView({ runId }: { runId: string }) {
  const [data, setData] = useState<RunPayload | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const traceRef = useRef<HTMLOListElement>(null);

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

  // Keep the trace pinned to the latest event while the run is live
  const eventCount = data?.events.length ?? 0;
  const isLive = data ? data.run.status === 'running' || data.run.status === 'queued' : false;
  useEffect(() => {
    const list = traceRef.current;
    if (list && isLive) list.scrollTop = list.scrollHeight;
  }, [eventCount, isLive]);

  const selectedEvidence = useMemo(() => {
    if (!data || !selectedClaimId) return [];
    const links = data.run.claimEvidence.filter((l) => l.claimId === selectedClaimId);
    return links
      .map((link) => {
        const evidence = data.run.evidence.find((e) => e.id === link.evidenceId);
        const source = data.run.sources.find((s) => s.id === evidence?.sourceId);
        return evidence ? { link, evidence, source } : null;
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
        <p className={styles.empty}>{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className={styles.workspace}>
        <p className={styles.empty}>Loading research run…</p>
      </main>
    );
  }

  const { run, events } = data;
  const statusTone = STATUS_TONE[run.status] ?? 'idle';
  const coverage = typeof run.coverageScore === 'number' ? run.coverageScore : null;
  const claimStats = {
    total: run.claims.length,
    verified: run.claims.filter((c) => c.verificationStatus === 'verified').length,
  };

  return (
    <main className={styles.workspace}>
      <aside className={styles.rail}>
        <div className={styles.railTop}>
          <a className={styles.brand} href="/">
            Mada.AI
          </a>
          <nav className={styles.railNav} aria-label="Run">
            <a href="/">+ New research</a>
            <a href="/projects">Projects</a>
          </nav>
        </div>

        <div className={styles.runMeta}>
          <span className={`${styles.badge} ${styles[statusTone]}`}>
            {statusTone === 'run' ? <span className={styles.liveDot} aria-hidden="true" /> : null}
            {run.status}
          </span>
          <span className={styles.stageMono}>{run.stage}</span>
          <span className={styles.modeMono}>mode:{run.mode}</span>
        </div>

        {coverage !== null ? (
          <div className={styles.coverage}>
            <div className={styles.coverageHead}>
              <span>Coverage</span>
              <span className={styles.mono}>{coverage.toFixed(2)}</span>
            </div>
            <div
              className={styles.meter}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={coverage}
              aria-label="Evidence coverage"
            >
              <div
                className={styles.meterFill}
                style={{ width: `${Math.round(coverage * 100)}%` }}
              />
            </div>
          </div>
        ) : null}

        {claimStats.total > 0 ? (
          <p className={styles.statLine}>
            <span className={styles.mono}>
              {claimStats.verified}/{claimStats.total}
            </span>{' '}
            claims verified · <span className={styles.mono}>{run.sources.length}</span>{' '}
            {run.sources.length === 1 ? 'source' : 'sources'} ·{' '}
            <span className={styles.mono}>{run.evidence.length}</span> evidence
          </p>
        ) : null}

        {isLive ? (
          <button type="button" className={styles.ghostDanger} onClick={() => void cancelRun()}>
            Cancel run
          </button>
        ) : null}

        <h2 className={styles.railTitle}>Trace</h2>
        <ol className={styles.trace} ref={traceRef} aria-live="polite">
          {events.map((event, index) => (
            <li key={`${event.createdAt}-${index}`}>
              <span className={styles.traceType}>{event.type}</span>
              <span className={styles.traceMsg}>{event.message}</span>
              <span className={styles.traceTime}>{formatTime(event.createdAt)}</span>
            </li>
          ))}
        </ol>
      </aside>

      <section className={styles.main}>
        <header className={styles.mainHead}>
          <p className={styles.eyebrow}>Research run · {run.id}</p>
          <h1>{run.question}</h1>
        </header>

        {run.plan ? (
          <section className={styles.card} aria-labelledby="plan-h">
            <h2 id="plan-h">Plan</h2>
            <p className={styles.objective}>{run.plan.objective}</p>
            <ol className={styles.subq}>
              {run.plan.subquestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className={styles.card} aria-labelledby="report-h">
          <h2 id="report-h">Report</h2>
          {run.errorMessage ? <p className={styles.errorText}>{run.errorMessage}</p> : null}
          {run.reportMarkdown ? (
            <article className={styles.report}>
              <ReactMarkdown>{run.reportMarkdown}</ReactMarkdown>
            </article>
          ) : (
            <p className={styles.placeholder}>
              {isLive
                ? 'Report will appear as verification completes…'
                : 'No report was generated for this run.'}
            </p>
          )}
        </section>

        <section aria-labelledby="claims-h">
          <h2 className={styles.sectionTitle}>Claims</h2>
          {run.claims.length === 0 ? (
            <p className={styles.placeholder}>
              {isLive ? 'Claims appear after evidence extraction…' : 'No claims recorded.'}
            </p>
          ) : null}
          {run.claims.map((claim) => {
            const tone = CLAIM_TONE[claim.verificationStatus] ?? 'idle';
            const selected = selectedClaimId === claim.id;
            return (
              <div
                className={selected ? `${styles.claim} ${styles.claimSelected}` : styles.claim}
                key={claim.id}
              >
                <p className={styles.claimText}>{claim.text}</p>
                <div className={styles.claimMeta}>
                  <span className={`${styles.badge} ${styles[tone]}`}>
                    {claim.verificationStatus}
                  </span>
                  <span className={styles.chip}>{claim.importance}</span>
                  <span
                    className={styles.confidence}
                    title={`Confidence ${claim.confidence.toFixed(2)}`}
                  >
                    <span className={styles.meter}>
                      <span
                        className={styles.meterFill}
                        style={{ width: `${Math.round(claim.confidence * 100)}%` }}
                      />
                    </span>
                    <span className={styles.mono}>{claim.confidence.toFixed(2)}</span>
                  </span>
                  <button
                    type="button"
                    className={styles.evidenceBtn}
                    aria-pressed={selected}
                    onClick={() => setSelectedClaimId(selected ? null : claim.id)}
                  >
                    {selected ? 'Hide evidence' : 'Evidence'}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </section>

      <aside className={styles.inspector}>
        <h2 className={styles.railTitle}>Evidence & sources</h2>
        {selectedClaimId ? (
          <div className={styles.inspectorSection}>
            <h3>Linked evidence</h3>
            {selectedEvidence.length ? (
              selectedEvidence.map((row) =>
                row ? (
                  <blockquote className={styles.evidence} key={row.evidence.id}>
                    <p>{row.evidence.quoteOrExcerpt}</p>
                    <footer>
                      <span className={styles.chip}>
                        {row.link.relation.replace(/_/g, ' ')}
                      </span>
                      <span className={styles.mono}>
                        entailment {row.link.entailmentScore.toFixed(2)}
                      </span>
                    </footer>
                    {row.source ? (
                      <a href={row.source.url} target="_blank" rel="noreferrer">
                        {row.source.title} ↗
                      </a>
                    ) : null}
                  </blockquote>
                ) : null,
              )
            ) : (
              <p className={styles.placeholder}>No linked evidence for this claim.</p>
            )}
          </div>
        ) : (
          <p className={styles.placeholder}>Select a claim to inspect its supporting evidence.</p>
        )}

        <h3 className={styles.sourcesTitle}>Sources</h3>
        {run.sources.length === 0 ? (
          <p className={styles.placeholder}>{isLive ? 'Searching…' : 'No sources retrieved.'}</p>
        ) : null}
        {run.sources.map((source, index) => (
          <div className={styles.source} key={source.id}>
            <a href={source.url} target="_blank" rel="noreferrer">
              <span className={styles.mono}>[{index + 1}]</span> {source.title} ↗
            </a>
            <p className={styles.sourceMeta}>
              <span className={styles.chip}>{source.category.replace(/_/g, ' ')}</span>
              {source.doi ? <span className={styles.mono}>doi:{source.doi}</span> : null}
            </p>
          </div>
        ))}
      </aside>
    </main>
  );
}
