import styles from './CurrentRunPanel.module.css';

const STEPS = [
  { label: 'Understand the question', state: 'done' },
  { label: 'Plan research', state: 'done' },
  { label: 'Search & find sources', state: 'active' },
  { label: 'Extract & analyze', state: 'todo' },
  { label: 'Synthesize findings', state: 'todo' },
  { label: 'Generate report', state: 'todo' },
] as const;

const FINDINGS = [
  {
    text: 'The EU AI Act entered into force on 1 August 2024.',
    cite: 'EUR-Lex (2024)',
  },
  {
    text: 'Prohibitions on unacceptable-risk AI practices apply from 2 February 2025.',
    cite: 'EUR-Lex (2024)',
  },
  {
    text: 'The UK updated its AI regulatory principles in January 2025.',
    cite: 'UK Government (2025)',
  },
];

const SOURCES = [
  { title: 'EUR-Lex – 32024R1689 · AI Act (2024)', type: 'Regulation' },
  { title: 'UK Government – AI Regulation (2025)', type: 'Policy' },
  { title: 'House of Lords – AI Legislation (2024)', type: 'Report' },
];

function StepIcon({ state }: { state: (typeof STEPS)[number]['state'] }) {
  if (state === 'done') {
    return (
      <span className={`${styles.stepDot} ${styles.stepDone}`} aria-label="Completed">
        ✓
      </span>
    );
  }
  if (state === 'active') {
    return <span className={`${styles.stepDot} ${styles.stepActive}`} aria-label="In progress" />;
  }
  return <span className={`${styles.stepDot} ${styles.stepTodo}`} aria-label="Pending" />;
}

export function CurrentRunPanel() {
  return (
    <aside className={styles.panel} aria-label="Current run">
      {/* Status card */}
      <section className={styles.card}>
        <header className={styles.cardHead}>
          <p className={styles.cardLabel}>Current run</p>
          <span className={styles.runningPill}>
            <span className={styles.pulseDot} aria-hidden="true" /> Running
          </span>
        </header>
        <h3 className={styles.runTitle}>
          How is AI regulation evolving in the EU and UK in 2024–2025?
        </h3>
        <div className={styles.progressMeta}>
          <span>Step 3 of 6</span>
          <span className={styles.progressPct}>60%</span>
        </div>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={60}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={styles.progressFill} style={{ width: '60%' }} />
        </div>
        <p className={styles.stageNote}>
          <span className={styles.stageSpinner} aria-hidden="true" />
          Extracting and analyzing sources…
        </p>
      </section>

      {/* Outline card */}
      <section className={styles.card}>
        <header className={styles.cardHead}>
          <p className={styles.cardLabel}>Research outline</p>
        </header>
        <ol className={styles.steps}>
          {STEPS.map((step, i) => (
            <li
              key={step.label}
              className={step.state === 'active' ? `${styles.step} ${styles.stepRowActive}` : styles.step}
            >
              <span className={styles.stepIndex}>{i + 1}</span>
              <span className={styles.stepLabel}>{step.label}</span>
              <StepIcon state={step.state} />
            </li>
          ))}
        </ol>
      </section>

      {/* Key findings card */}
      <section className={styles.card}>
        <header className={styles.cardHead}>
          <p className={styles.cardLabel}>Key findings</p>
          <span className={styles.countPill}>12</span>
        </header>
        <ul className={styles.findings}>
          {FINDINGS.map((finding) => (
            <li key={finding.text} className={styles.finding}>
              <span className={styles.findingDot} aria-hidden="true" />
              <div>
                <p className={styles.findingText}>{finding.text}</p>
                <p className={styles.findingCite}>{finding.cite}</p>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" className={styles.linkBtn}>
          View full report <span aria-hidden="true">→</span>
        </button>
      </section>

      {/* Sources card */}
      <section className={styles.card}>
        <header className={styles.cardHead}>
          <p className={styles.cardLabel}>Sources</p>
          <div className={styles.headRight}>
            <span className={styles.countPill}>18</span>
            <button type="button" className={styles.ghostLink}>
              View all →
            </button>
          </div>
        </header>
        <ul className={styles.sources}>
          {SOURCES.map((source) => (
            <li key={source.title} className={styles.source}>
              <span className={styles.sourceIcon} aria-hidden="true">
                ▤
              </span>
              <div className={styles.sourceMeta}>
                <p className={styles.sourceTitle}>{source.title}</p>
                <p className={styles.sourceType}>{source.type}</p>
              </div>
              <span className={styles.sourceOpen} aria-hidden="true">
                ↗
              </span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
