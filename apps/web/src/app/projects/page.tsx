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

  useEffect(() => {
    void fetch('/api/projects')
      .then((res) => res.json())
      .then((data: { projects: Project[] }) => setProjects(data.projects ?? []));
  }, []);

  return (
    <main style={{ padding: '1.5rem clamp(1rem, 4vw, 3rem)' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
        Mada.AI
      </p>
      <h1>Projects</h1>
      <p>
        <a href="/">Start new research</a>
      </p>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <strong>{project.title}</strong>
            <div style={{ color: 'var(--ink-soft)' }}>{project.description}</div>
          </li>
        ))}
      </ul>
      {!projects.length ? <p>No projects yet. Start from the home composer.</p> : null}
    </main>
  );
}
