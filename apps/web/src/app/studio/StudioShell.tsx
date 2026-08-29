'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Toolbar } from './components/Toolbar';
import { Sidebar, SidebarRail, type SidebarTab } from './components/Sidebar';
import { Inspector, type InspectorTab } from './components/Inspector';
import { Timeline } from './components/Timeline';
import { Composer, type ContextChip } from './components/Composer';
import { ChatArtifact, HeroContent, ArtifactFrame } from './components/Canvas';
import { TIMELINE_STEPS } from './data';

type Variation = 'focused' | 'hero' | 'pro';
type Theme = 'dark' | 'light';
type Accent = 'orange' | 'blue' | 'violet' | 'neutral';
type Density = 'comfortable' | 'dense';

const VARIATIONS: { id: Variation; label: string }[] = [
  { id: 'focused', label: 'Focused' },
  { id: 'hero', label: 'Center-stage' },
  { id: 'pro', label: 'Dense Pro' },
];

const ACCENTS: { id: Accent; swatch: string; title: string }[] = [
  { id: 'orange', swatch: '#F4A261', title: 'Orange accent' },
  { id: 'blue', swatch: '#6E9BFF', title: 'Blue accent' },
  { id: 'violet', swatch: '#B08CFF', title: 'Violet accent' },
  { id: 'neutral', swatch: '#A8A29E', title: 'Neutral accent' },
];

const PROJECT = 'Mada.AI Studio';
const THREAD = 'Landing hero variations';

export default function StudioShell() {
  const router = useRouter();

  // ---- Studio state (per handoff StudioState shape) ----
  const [variation, setVariation] = React.useState<Variation>('hero');
  const [theme, setTheme] = React.useState<Theme>('dark');
  const [accent, setAccent] = React.useState<Accent>('orange');
  const [density, setDensity] = React.useState<Density>('comfortable');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [sidebarTab, setSidebarTab] = React.useState<SidebarTab>('chats');
  const [inspectorHidden, setInspectorHidden] = React.useState(false);
  const [inspectorTab, setInspectorTab] = React.useState<InspectorTab>('context');

  // ---- Composer state ----
  const [value, setValue] = React.useState('');
  const [model, setModel] = React.useState('sonnet');
  const [tool, setTool] = React.useState('auto');
  const [thinking, setThinking] = React.useState(false);
  const [tokensUsed, setTokensUsed] = React.useState(12400);
  const [chips, setChips] = React.useState<ContextChip[]>([
    { icon: 'Doc', label: 'brand-guidelines.md' },
    { icon: 'Code', label: 'tokens.json' },
  ]);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // ---- Variation presets (each is a coherent state, per handoff) ----
  const applyVariation = React.useCallback((v: Variation) => {
    setVariation(v);
    if (v === 'hero') {
      // V2: empty new session — rail sidebar, no inspector, clean composer.
      setSidebarCollapsed(true);
      setInspectorHidden(true);
      setThinking(false);
      setChips([]);
      setValue('');
    } else if (v === 'focused') {
      // V1: mid-conversation.
      setSidebarCollapsed(false);
      setInspectorHidden(false);
      setInspectorTab('context');
      setThinking(false);
      setChips([
        { icon: 'Doc', label: 'brand-guidelines.md' },
        { icon: 'Code', label: 'tokens.json' },
      ]);
      setModel('sonnet');
      setTool('auto');
      setTokensUsed(12400);
    } else {
      // V3: generating — dense workspace, layers open, thinking composer.
      setSidebarCollapsed(false);
      setSidebarTab('files');
      setInspectorHidden(false);
      setInspectorTab('layers');
      setThinking(true);
      setChips([
        { icon: 'Doc', label: 'brand-guidelines.md' },
        { icon: 'Code', label: 'tokens.json' },
        { icon: 'Image', label: 'hero-mockup-01.png', attach: true },
      ]);
      setModel('opus');
      setTool('canvas');
      setTokensUsed(87000);
    }
  }, []);

  // ---- Send: create a project, start a research run, navigate to it. ----
  const send = React.useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || thinking) return;
      setThinking(true);
      setError(null);
      try {
        const projectRes = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            title: q.slice(0, 80),
            description: 'Auto-created from Mada.AI Studio',
          }),
        });
        if (!projectRes.ok) throw new Error('Could not create project');
        const project = (await projectRes.json()) as { id: string };

        const researchRes = await fetch('/api/research', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ projectId: project.id, question: q, mode: 'research' }),
        });
        if (!researchRes.ok) throw new Error('Could not start research');
        const research = (await researchRes.json()) as { runId: string };
        router.push(`/research/${research.runId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setThinking(false);
      }
    },
    [thinking, router],
  );

  // ---- Keyboard shortcuts (spec: 1/2/3, t, ⌘K; ⌘↵ handled by Composer) ----
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const editable =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // ⌘K focuses the composer from anywhere.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      if (editable || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '1') applyVariation('focused');
      else if (e.key === '2') applyVariation('hero');
      else if (e.key === '3') applyVariation('pro');
      else if (e.key.toLowerCase() === 't') setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [applyVariation]);

  const composerEl = (
    <Composer
      thinking={thinking}
      value={value}
      onChange={setValue}
      onSend={send}
      contextChips={chips}
      onRemoveChip={(i) => setChips((c) => c.filter((_, j) => j !== i))}
      model={model}
      onModelChange={setModel}
      toolActive={tool}
      onToolChange={setTool}
      tokensUsed={tokensUsed}
      showMeter={variation !== 'hero'}
      inputRef={inputRef}
      placeholder={
        variation === 'hero' ? 'Ask, design, or / for actions…' : 'Reply, refine, or / for actions…'
      }
    />
  );

  const shellAttrs = {
    'data-sidebar': sidebarCollapsed ? 'collapsed' : undefined,
    'data-inspector': inspectorHidden ? 'hidden' : undefined,
  } as const;

  return (
    <div className="studio-root" data-theme={theme} data-accent={accent} data-density={density}>
      <div className="std-shell" {...shellAttrs}>
        <Toolbar
          project={PROJECT}
          thread={THREAD}
          running={variation === 'pro' && thinking}
          theme={theme}
          sidebarCollapsed={sidebarCollapsed}
          inspectorHidden={inspectorHidden}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
          onToggleInspector={() => setInspectorHidden((h) => !h)}
          onRun={() => send(value)}
          runDisabled={thinking || value.trim().length === 0}
        />

        {sidebarCollapsed ? <SidebarRail /> : <Sidebar tab={sidebarTab} onTab={setSidebarTab} />}

        {/* Center canvas */}
        <div className="std-center">
          {variation === 'hero' ? (
            <HeroContent
              composer={composerEl}
              onPickPrompt={(title) => {
                setValue(`${title}: `);
                inputRef.current?.focus();
              }}
            />
          ) : (
            <>
              <div className="canvas-wrap">
                <div className="canvas-inner">
                  {variation === 'focused' && <ChatArtifact />}
                  {variation === 'pro' && <ArtifactFrame generating={thinking} />}
                </div>
              </div>
              {variation === 'pro' && <Timeline steps={TIMELINE_STEPS} currentIndex={3} />}
            </>
          )}
        </div>

        {!inspectorHidden && <Inspector tab={inspectorTab} onTab={setInspectorTab} />}

        {variation !== 'hero' && (
          <div className="std-composer-slot">
            {error && (
              <div
                role="alert"
                style={{
                  margin: '0 0 8px',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--s-danger)',
                  color: 'var(--s-danger)',
                  fontSize: 12,
                }}
              >
                {error}
              </div>
            )}
            {composerEl}
          </div>
        )}
      </div>

      {/* Floating variation / accent / density switcher (design-review affordance) */}
      <div className="variation-switcher" role="toolbar" aria-label="Studio variations">
        {VARIATIONS.map((v, i) => (
          <React.Fragment key={v.id}>
            {i > 0 && <span className="vs-sep" />}
            <button
              type="button"
              className="vs-btn"
              aria-selected={variation === v.id}
              onClick={() => applyVariation(v.id)}
              title={`${v.label} (press ${i + 1})`}
            >
              {v.label}
            </button>
          </React.Fragment>
        ))}
        <span className="vs-sep" />
        {ACCENTS.map((a) => (
          <button
            key={a.id}
            type="button"
            className="vs-btn"
            aria-selected={accent === a.id}
            title={a.title}
            onClick={() => setAccent(a.id)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: a.swatch,
                border: '1px solid var(--s-line)',
              }}
            />
          </button>
        ))}
        <span className="vs-sep" />
        <button
          type="button"
          className="vs-btn"
          aria-selected={density === 'dense'}
          onClick={() => setDensity((d) => (d === 'dense' ? 'comfortable' : 'dense'))}
          title="Toggle density"
        >
          {density === 'dense' ? 'Dense' : 'Comfortable'}
        </button>
        <span className="vs-sep" />
        <button
          type="button"
          className="vs-btn"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          title="Toggle theme (press t)"
        >
          {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
      </div>
    </div>
  );
}
