import { ResearchComposer } from '@/components/ResearchComposer';

export default function HomePage() {
  return (
    <main className="shell">
      <header className="top">
        <p className="brand">Mada.AI</p>
        <nav aria-label="Primary">
          <a href="/projects">Projects</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-brand">
        <p id="hero-brand" className="hero-brand">
          Mada.AI
        </p>
        <h1>Open research. Verifiable evidence.</h1>
        <p className="lede">
          Ask a question. Mada searches, reads sources, extracts evidence, verifies claims, and
          returns an auditable cited report.
        </p>
        <ResearchComposer />
        <div className="signal" aria-hidden="true" />
      </section>

      <style>{`
        .shell {
          min-height: 100vh;
          padding: 1.25rem clamp(1rem, 4vw, 3rem) 3rem;
        }
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: rise-in 500ms ease both;
        }
        .brand {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        nav a {
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }
        nav a:hover {
          border-bottom-color: var(--ink);
        }
        .hero {
          min-height: calc(100vh - 5rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1rem;
          max-width: 920px;
        }
        .hero-brand {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(3rem, 9vw, 6.5rem);
          line-height: 0.95;
          letter-spacing: -0.04em;
          animation: rise-in 650ms ease both;
        }
        h1 {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: clamp(1.35rem, 2.4vw, 1.85rem);
          color: var(--ink-soft);
          animation: rise-in 700ms ease both;
          animation-delay: 60ms;
        }
        .lede {
          margin: 0 0 0.5rem;
          max-width: 38rem;
          color: var(--ink-soft);
          animation: rise-in 700ms ease both;
          animation-delay: 90ms;
        }
        .signal {
          margin-top: 1.5rem;
          height: 2px;
          width: 180px;
          background: linear-gradient(90deg, var(--moss-bright), var(--amber));
          transform-origin: left center;
          animation: pulse-line 2.8s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
