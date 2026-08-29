'use client';

import { Icon } from './icons';

type ToolbarProps = {
  project: string;
  thread: string;
  running?: boolean;
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  inspectorHidden: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onToggleInspector: () => void;
  onRun: () => void;
  runDisabled?: boolean;
};

export function Toolbar({
  project,
  thread,
  running = false,
  theme,
  sidebarCollapsed,
  inspectorHidden,
  onToggleTheme,
  onToggleSidebar,
  onToggleInspector,
  onRun,
  runDisabled,
}: ToolbarProps) {
  return (
    <div className="std-toolbar">
      <div className="tb-group">
        <div className="tb-logo" aria-hidden="true">
          S
        </div>
        <div className="tb-breadcrumb" style={{ marginLeft: 4 }}>
          <span>{project}</span>
          <span className="sep">/</span>
          <b>{thread}</b>
        </div>
      </div>

      <span style={{ width: 12 }} />
      <button
        type="button"
        className="tb-icon-btn"
        title="Toggle sidebar"
        aria-label="Toggle sidebar"
        aria-pressed={!sidebarCollapsed}
        onClick={onToggleSidebar}
      >
        <Icon.PanelLeft size={16} />
      </button>
      <button type="button" className="tb-icon-btn" title="History" aria-label="History">
        <Icon.History size={16} />
      </button>

      <div className="tb-spacer" />

      <div className="tb-chip" role="status">
        <span className="dot" style={{ background: running ? 'var(--s-accent)' : 'var(--s-good)' }} />
        <span>{running ? 'Working' : 'Ready'}</span>
      </div>
      <button type="button" className="tb-chip" title="Share">
        <Icon.Share size={13} />
        <span>Share</span>
      </button>
      <button type="button" className="tb-run" onClick={onRun} disabled={runDisabled} title="Run (⌘↵)">
        <Icon.Play size={13} />
        <span>Run</span>
        <kbd>⌘↵</kbd>
      </button>
      <button
        type="button"
        className="tb-icon-btn"
        title="Toggle inspector"
        aria-label="Toggle inspector"
        aria-pressed={!inspectorHidden}
        onClick={onToggleInspector}
      >
        <Icon.PanelRight size={16} />
      </button>
      <button
        type="button"
        className="tb-icon-btn"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme (t)`}
        aria-label="Toggle theme"
        onClick={onToggleTheme}
      >
        {theme === 'dark' ? <Icon.Sun size={16} /> : <Icon.Moon size={16} />}
      </button>
      <div className="tb-avatar" title="Alex Kanter">
        AK
      </div>
    </div>
  );
}
