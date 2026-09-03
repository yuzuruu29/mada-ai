import { ResearchComposer } from '@/components/ResearchComposer';

const pipeline = [
  { step: '01', label: 'Plan', detail: 'decompose the question' },
  { step: '02', label: 'Search', detail: 'OpenAlex · Crossref · web' },
  { step: '03', label: 'Extract', detail: 'evidence from sources' },
  { step: '04', label: 'Verify', detail: 'claims against evidence' },
  { step: '05', label: 'Cite', detail: 'auditable report' },
];

export default function HomePage() {
  return (
    <main className="shell">
      <header className="top">
        <a className="brand" href="/">
          Mada.AI
        </a>
        <nav aria-label="Primary" className="nav">
          <a href="/projects">Projects</a>
          <a href="/login">Sign in</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <p className="kicker">
          <span className="pulse" aria-hidden="true" />
          Open-source research engine
        </p>
        <h1 id="hero-title">
          Open research.
          <br />
          <em>Verifiable</em> evidence.
        </h1>
        <p className="lede">
          Ask a question. Mada searches, reads sources, extracts evidence, verifies claims, and
          returns an auditable cited report — every step traceable.
        </p>
        <ResearchComposer />
        <ol className="pipeline" aria-label="How it works">
          {pipeline.map((item) => (
            <li key={item.step}>
              <span className="pipe-step">{item.step}</span>
              <span className="pipe-label">{item.label}</span>
              <span className="pipe-detail">{item.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      <style>{`
        .shell {
          min-height: 100vh;
          padding: 1.25rem clamp(1rem, 4vw, 3rem) 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: rise-in 500ms ease both;
        }
        .brand {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.15rem;
          letter-spacing: -0.01em;
          color: var(--text);
        }
        .brand:hover { text-decoration: none; }
        .nav {
          display: flex;
          gap: 1.25rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
        }
        .nav a {
          color: var(--text-dim);
          text-decoration: none;
          border: 1px solid transparent;
          border-radius: 6px;
          padding: 0.3rem 0.6rem;
          transition: color 120ms ease, border-color 120ms ease;
        }
        .nav a:hover {
          color: var(--text);
          border-color: var(--line-strong);
          text-decoration: none;
        }
        .hero {
          min-height: calc(100vh - 5rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.4rem;
          padding: 3rem 0;
        }
        .kicker {
          margin: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          animation: rise-in 600ms ease both;
        }
        .pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        h1 {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(2.6rem, 7vw, 4.6rem);
          line-height: 1.02;
          letter-spacing: -0.03em;
          animation: rise-in 650ms ease both;
          animation-delay: 60ms;
        }
        h1 em {
          font-style: italic;
          color: var(--accent);
        }
        .lede {
          margin: 0;
          max-width: 36rem;
          font-size: 1.05rem;
          color: var(--text-dim);
          animation: rise-in 700ms ease both;
          animation-delay: 100ms;
        }
        .pipeline {
          list-style: none;
          margin: 1.2rem 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          overflow: hidden;
          animation: rise-in 750ms ease both;
          animation-delay: 160ms;
        }
        .pipeline li {
          background: var(--bg-elev);
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .pipe-step {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-faint);
        }
        .pipe-label {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .pipe-detail {
          font-size: 0.78rem;
          color: var(--text-dim);
        }
      `}</style>
    </main>
  );
}
