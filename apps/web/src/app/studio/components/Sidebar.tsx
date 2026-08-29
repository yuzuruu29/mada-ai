'use client';

import * as React from 'react';
import { Icon } from './icons';
import { SAMPLE_THREADS, SAMPLE_FILES, SAMPLE_AGENTS, SAMPLE_ASSETS } from '../data';

export type SidebarTab = 'chats' | 'files' | 'agents' | 'assets';

type SidebarProps = {
  tab: SidebarTab;
  onTab: (tab: SidebarTab) => void;
};

const TABS: { id: SidebarTab; label: string }[] = [
  { id: 'chats', label: 'Chats' },
  { id: 'files', label: 'Files' },
  { id: 'agents', label: 'Agents' },
  { id: 'assets', label: 'Assets' },
];

export function Sidebar({ tab, onTab }: SidebarProps) {
  const [active, setActive] = React.useState('t1');
  return (
    <aside className="std-sidebar">
      <div className="sb-header">
        <div className="sb-search-wrap">
          <Icon.Search size={13} />
          <input className="sb-search" placeholder="Search or ⌘K" aria-label="Search" />
        </div>
        <button type="button" className="sb-new" title="New thread" aria-label="New thread">
          <Icon.Plus size={16} />
        </button>
      </div>

      <div className="sb-tabs" role="tablist" aria-label="Sidebar sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            className="sb-tab"
            aria-selected={tab === t.id}
            onClick={() => onTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="sb-scroll">
        {tab === 'chats' && (
          <>
            <div className="sb-section-label">
              <span>Pinned</span>
              <Icon.Plus size={12} />
            </div>
            {SAMPLE_THREADS.filter((t) => t.pinned).map((t) => (
              <button
                type="button"
                key={t.id}
                className="sb-item"
                style={{ width: '100%', textAlign: 'left' }}
                aria-selected={active === t.id}
                onClick={() => setActive(t.id)}
              >
                <Icon.Chat size={14} className="sb-item-icon" />
                <span className="sb-item-title">{t.title}</span>
                <span className="sb-item-meta">{t.meta}</span>
              </button>
            ))}
            <div className="sb-section-label">
              <span>Recent</span>
            </div>
            {SAMPLE_THREADS.filter((t) => !t.pinned).map((t) => (
              <button
                type="button"
                key={t.id}
                className="sb-item"
                style={{ width: '100%', textAlign: 'left' }}
                aria-selected={active === t.id}
                onClick={() => setActive(t.id)}
              >
                <Icon.Chat size={14} className="sb-item-icon" />
                <span className="sb-item-title">{t.title}</span>
                <span className="sb-item-meta">{t.meta}</span>
              </button>
            ))}
          </>
        )}
        {tab === 'files' && (
          <>
            <div className="sb-section-label">
              <span>Project files</span>
              <Icon.Plus size={12} />
            </div>
            {SAMPLE_FILES.map((f) => {
              const FileIcon = Icon[f.icon];
              return (
                <button
                  type="button"
                  key={f.id}
                  className="sb-item"
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <FileIcon size={14} className="sb-item-icon" />
                  <span className="sb-item-title">{f.name}</span>
                </button>
              );
            })}
          </>
        )}
        {tab === 'agents' && (
          <>
            <div className="sb-section-label">
              <span>Team</span>
              <Icon.Plus size={12} />
            </div>
            {SAMPLE_AGENTS.map((a) => {
              const AgentIcon = Icon[a.icon];
              return (
                <button
                  type="button"
                  key={a.id}
                  className="sb-item"
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <AgentIcon size={14} className="sb-item-icon" />
                  <span className="sb-item-title">{a.name}</span>
                </button>
              );
            })}
          </>
        )}
        {tab === 'assets' && (
          <>
            <div className="sb-section-label">
              <span>Recent assets</span>
            </div>
            {SAMPLE_ASSETS.map((a, i) => (
              <button
                type="button"
                key={i}
                className="sb-item"
                style={{ width: '100%', textAlign: 'left' }}
              >
                <Icon.Image size={14} className="sb-item-icon" />
                <span className="sb-item-title">{a.name}</span>
                <span className="sb-item-meta">{a.meta}</span>
              </button>
            ))}
          </>
        )}
      </div>

      <div className="sb-footer">
        <div className="sb-footer-avatar">AK</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sb-footer-name">Alex Kanter</div>
          <div className="sb-footer-mail">alex@studio.co</div>
        </div>
        <span className="sb-footer-plan">Pro</span>
      </div>
    </aside>
  );
}

export function SidebarRail() {
  return (
    <aside className="std-sidebar">
      <div className="sb-rail">
        <button
          type="button"
          className="rail-btn"
          title="New"
          aria-label="New"
          style={{ background: 'var(--s-accent-soft)', color: 'var(--s-accent)' }}
        >
          <Icon.Plus size={18} />
        </button>
        <div style={{ height: 8 }} />
        <button type="button" className="rail-btn" aria-selected="true" title="Chats">
          <Icon.Chat size={16} />
        </button>
        <button type="button" className="rail-btn" title="Files">
          <Icon.Folder size={16} />
        </button>
        <button type="button" className="rail-btn" title="Agents">
          <Icon.Sparkle size={16} />
        </button>
        <button type="button" className="rail-btn" title="Assets">
          <Icon.Image size={16} />
        </button>
        <div style={{ flex: 1 }} />
        <button type="button" className="rail-btn" title="Settings">
          <Icon.Settings size={16} />
        </button>
        <div className="sb-footer-avatar">AK</div>
      </div>
    </aside>
  );
}
