import type { Metadata } from 'next';
import StudioShell from './StudioShell';
import './studio.css';

export const metadata: Metadata = {
  title: 'Studio — Mada.AI',
  description:
    'A multi-panel AI-agent workspace with an adaptive composer: focused, center-stage, and dense pro variations.',
};

export default function StudioPage() {
  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#141210',
      }}
    >
      <StudioShell />
    </main>
  );
}
