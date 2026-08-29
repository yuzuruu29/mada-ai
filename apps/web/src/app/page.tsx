import Link from 'next/link';
import { Sidebar } from '@/components/studio/Sidebar';
import { Composer } from '@/components/studio/Composer';
import { CurrentRunPanel } from '@/components/studio/CurrentRunPanel';

const EXAMPLES = [
  {
    title: 'How is AI regulation evolving in the EU and UK in 2024–2025?',
    tags: ['Regulation', 'Comparative'],
    icon: '⚖',
    hue: 'violet',
  },
  {
    title: 'The impact of remote work on productivity: a systematic review',
    tags: ['Academic', 'Systematic review'],
    icon: '❖',
    hue: 'cyan',
  },
  {
    title: 'Compare renewable energy policies in Germany and Japan',
    tags: ['Compare', 'Policy'],
    icon: '◈',
    hue: 'violet',
  },
  {
    title: 'Latest advances in mRNA vaccine technology',
    tags: ['Deep Research', 'Medical'],
    icon: '✚',
    hue: 'cyan',
  },
] as const;

const RECENT_RUNS = [
  {
    title: 'How is AI regulation evolving in the EU and UK in 2024–2025?',
    meta: 'Just now · 37 claims · 18 sources',
    status: 'Running',
  },
  {
    title: 'Global AI governance comparison',
    meta: '2h ago · 54 claims · 22 sources',
    status: 'Completed',
  },
  {
    title: 'AI safety standards 2024',
    meta: 'Yesterday · 29 claims · 15 sources',
    status: 'Completed',
  },
  {
    title: 'US AI executive orders',
    meta: '2 days ago · 18 claims · 10 sources',
    status: 'Completed',
  },
] as const;

export default function HomePage() {
  return (
    <div className="studio">
      <Sidebar />

      <main className="studio-main">
        <header className="studio-top">
          <div>
            <h1 className="greeting">
              Good morning, Alex <span aria-hidden="true">👋</span>
            </h1>
            <p className="greetingSub">What would you like to research today?</p>
          </div>
          <div className="topActions">
            <Link href="/studio" className="ghostBtn studioLink" title="Open the new Studio workspace">
              ✦ Studio
            </Link>
            <button type="button" className="ghostBtn">
              History
            </button>
            <button type="button" className="ghostBtn" aria-label="Settings">
              ⚙
            </button>
          </div>
        </header>

        <Composer />

        <section aria-labelledby="examples-heading">
          <div className="sectionHead">
            <h2 id="examples-heading" className="sectionTitle">
              Try these examples
            </h2>
            <button type="button" className="ghostLink">
              See all examples →
            </button>
          </div>
          <div className="examples">
            {EXAMPLES.map((example) => (
              <button key={example.title} type="button" className="exampleCard">
                <span className={`exampleIcon exampleIcon-${example.hue}`} aria-hidden="true">
                  {example.icon}
                </span>
                <span className="exampleTitle">{example.title}</span>
                <span className="exampleTags">
                  {example.tags.map((tag) => (
                    <span key={tag} className="exampleTag">
                      {tag}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="recent-heading">
          <div className="sectionHead">
            <h2 id="recent-heading" className="sectionTitle">
              Recent research runs
            </h2>
            <button type="button" className="ghostLink">
              View all →
            </button>
          </div>
          <ul className="runs">
            {RECENT_RUNS.map((run) => (
              <li key={run.title} className="runRow">
                <span className="runIcon" aria-hidden="true">
                  ▤
                </span>
                <div className="runMeta">
                  <p className="runName">{run.title}</p>
                  <p className="runStats">{run.meta}</p>
                </div>
                <span
                  className={
                    run.status === 'Running' ? 'runStatus runStatusRunning' : 'runStatus'
                  }
                >
                  {run.status === 'Running' ? (
                    <span className="runPulse" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">✓ </span>
                  )}
                  {run.status}
                </span>
                <button type="button" className="runMore" aria-label="Run options">
                  ⋯
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <CurrentRunPanel />

      <style>{`
        .studio {
          display: grid;
          grid-template-columns: 248px minmax(0, 1fr) 332px;
          min-height: 100vh;
        }

        .studio-main {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          padding: 1.75rem clamp(1.25rem, 3vw, 2.5rem) 3rem;
          min-width: 0;
        }

        .studio-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          animation: rise-in 400ms ease both;
        }

        .greeting {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(1.45rem, 2.4vw, 1.8rem);
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .greetingSub {
          margin: 0.3rem 0 0;
          color: var(--ink-dim);
          font-size: 0.92rem;
        }

        .topActions {
          display: flex;
          gap: 0.5rem;
        }

        .ghostBtn {
          padding: 0.45rem 0.85rem;
          border: 1px solid var(--border);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.03);
          color: var(--ink-soft);
          font-size: 0.8rem;
          cursor: pointer;
          transition: border-color 140ms ease, color 140ms ease;
        }

        .ghostBtn:hover {
          border-color: var(--border-strong);
          color: var(--ink);
        }

        .studioLink {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          color: #c9bdff;
          border-color: rgba(124, 92, 255, 0.4);
        }

        .studioLink:hover {
          color: #fff;
        }

        .sectionHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }

        .sectionTitle {
          margin: 0;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--ink);
        }

        .ghostLink {
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--ink-dim);
          font-size: 0.78rem;
          cursor: pointer;
        }

        .ghostLink:hover {
          color: var(--accent-2);
        }

        .examples {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 0.8rem;
        }

        .exampleCard {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 1rem;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)), var(--bg-raised);
          color: var(--ink);
          text-align: left;
          cursor: pointer;
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
        }

        .exampleCard:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 92, 255, 0.45);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
        }

        .exampleIcon {
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          font-size: 0.85rem;
        }

        .exampleIcon-violet {
          background: rgba(124, 92, 255, 0.16);
          color: #c9bdff;
        }

        .exampleIcon-cyan {
          background: rgba(34, 211, 238, 0.12);
          color: var(--accent-2);
        }

        .exampleTitle {
          font-size: 0.84rem;
          font-weight: 500;
          line-height: 1.4;
        }

        .exampleTags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .exampleTag {
          padding: 0.12rem 0.5rem;
          border-radius: 999px;
          border: 1px solid var(--border);
          color: var(--ink-dim);
          font-size: 0.64rem;
        }

        .runs {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .runRow {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          border: 1px solid var(--border);
          border-radius: 13px;
          background: var(--bg-raised);
          transition: border-color 140ms ease, background 140ms ease;
          cursor: pointer;
        }

        .runRow:hover {
          border-color: var(--border-strong);
          background: var(--panel);
        }

        .runIcon {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--panel-3);
          color: var(--accent);
          flex-shrink: 0;
        }

        .runMeta {
          min-width: 0;
          flex: 1;
        }

        .runName {
          margin: 0;
          font-size: 0.86rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .runStats {
          margin: 0.15rem 0 0;
          font-size: 0.72rem;
          color: var(--ink-dim);
        }

        .runStatus {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.22rem 0.65rem;
          border-radius: 999px;
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.25);
          color: var(--success);
          font-size: 0.7rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .runStatusRunning {
          background: rgba(124, 92, 255, 0.12);
          border-color: rgba(124, 92, 255, 0.4);
          color: #c9bdff;
        }

        .runPulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse-dot 1.4s ease-in-out infinite;
        }

        .runMore {
          border: 0;
          background: transparent;
          color: var(--ink-dim);
          font-size: 1rem;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
          border-radius: 6px;
        }

        .runMore:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--ink);
        }

        @media (max-width: 1080px) {
          .studio {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
