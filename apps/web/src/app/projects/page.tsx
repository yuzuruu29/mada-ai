'use client';

import { useEffect, useState } from 'react';

type Project = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void fetch('/api/projects')
      .then((res) => res.json())
      .then((data: { projects: Project[] }) => {
        setProjects(data.projects ?? []);
        setLoaded(true);
      });
  }, []);

  return (
    <main className="shell">
      <header className="top">
        <a className="brand" href="/">
          Mada.AI
        </a>
        <nav aria-label="Primary" className="nav">
          <a href="/">+ New research</a>
          <a href="/login">Sign in</a>
        </nav>
      </header>

      <h1 className="pageTitle">Projects</h1>

      {projects.length ? (
        <ul className="list">
          {projects.map((project) => (
            <li key={project.id} className="row">
              <div className="rowMain">
                <strong>{project.title}</strong>
                {project.description ? <span className="desc">{project.description}</span> : null}
              </div>
              <time className="date" dateTime={project.createdAt}>
                {new Date(project.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            </li>
          ))}
        </ul>
      ) : loaded ? (
        <div className="emptyState">
          <p>No projects yet.</p>
          <a href="/">Start your first research run →</a>
        </div>
      ) : (
        <p className="loading">Loading…</p>
      )}

      <style>{`
        .shell {
          min-height: 100vh;
          padding: 1.25rem clamp(1rem, 4vw, 3rem) 3rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }
        .brand {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.15rem;
          color: var(--text);
        }
        .brand:hover { text-decoration: none; }
        .nav {
          display: flex;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
        }
        .nav a {
          color: var(--text-dim);
          text-decoration: none;
          border: 1px solid var(--line);
          border-radius: 6px;
          padding: 0.3rem 0.65rem;
        }
        .nav a:hover {
          color: var(--text);
          border-color: var(--line-strong);
          text-decoration: none;
        }
        .pageTitle {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.9rem;
          letter-spacing: -0.02em;
          margin: 0 0 1.25rem;
        }
        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          overflow: hidden;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          padding: 0.85rem 1.1rem;
          background: var(--bg-elev);
          border-bottom: 1px solid var(--line);
        }
        .row:last-child { border-bottom: 0; }
        .rowMain {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }
        .rowMain strong { font-size: 0.95rem; }
        .desc {
          color: var(--text-dim);
          font-size: 0.82rem;
        }
        .date {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-faint);
          white-space: nowrap;
        }
        .emptyState {
          border: 1px dashed var(--line-strong);
          border-radius: var(--radius);
          padding: 3rem 1.5rem;
          text-align: center;
          color: var(--text-dim);
        }
        .loading { color: var(--text-faint); }
      `}</style>
    </main>
  );
}
