'use client';

import * as React from 'react';
import { Icon } from './icons';
import {
  MODELS,
  TOOLS,
  SLASH_ITEMS,
  MENTION_ITEMS,
  type ComposerModel,
  type ComposerTool,
} from '../data';

export type ContextChip = { icon: keyof typeof Icon; label: string; attach?: boolean };
export type ComposerMenu = 'model' | 'tool' | 'slash' | 'mention' | null;

type ComposerProps = {
  thinking?: boolean;
  showModel?: boolean;
  showTools?: boolean;
  showMeter?: boolean;
  placeholder?: string;
  contextChips?: ContextChip[];
  model?: string;
  toolActive?: string;
  tokensUsed?: number;
  tokensMax?: number;
  /** Controlled value (the shell owns it so send/shortcuts stay in sync). */
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  onRemoveChip?: (index: number) => void;
  onModelChange?: (id: string) => void;
  onToolChange?: (id: string) => void;
  /** Ref forwarding target so ⌘K can focus the input. */
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
};

/** Renders @mentions as <mark> and /commands as <code> in the highlight layer. */
function highlightSegments(text: string) {
  // Split into tokens, keeping delimiters, then classify.
  const parts = text.split(/(\s+)/);
  return parts.map((part, i) => {
    if (/^@[\w\-.]+$/.test(part)) return <mark key={i}>{part}</mark>;
    if (/^\/\w+$/.test(part)) return <code key={i}>{part}</code>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function Composer({
  thinking = false,
  showModel = true,
  showTools = true,
  showMeter = true,
  placeholder = 'Ask, design, or / for actions…',
  contextChips = [],
  model = 'sonnet',
  toolActive = 'auto',
  tokensUsed = 12400,
  tokensMax = 200000,
  value,
  onChange,
  onSend,
  onRemoveChip,
  onModelChange,
  onToolChange,
  inputRef,
}: ComposerProps) {
  const [openMenu, setOpenMenu] = React.useState<ComposerMenu>(null);
  const internalRef = React.useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? internalRef;
  const rootRef = React.useRef<HTMLDivElement>(null);

  const isEmpty = value.trim().length === 0;
  const fallbackModel: ComposerModel = {
    id: 'sonnet', name: 'Claude Sonnet 4.5', sub: 'Balanced · 200K ctx', kbd: '⌘1', tag: 'S',
  };
  const fallbackTool: ComposerTool = {
    id: 'auto', name: 'Auto route', sub: 'Pick the best tool for the job', icon: 'Wand', on: true,
  };
  const activeModel = MODELS.find((m) => m.id === model) ?? fallbackModel;
  const activeTool = TOOLS.find((t) => t.id === toolActive) ?? fallbackTool;
  const ToolGlyph = Icon[activeTool.icon];
  const meterPct = Math.min(1, tokensUsed / tokensMax);

  // Autosize the textarea.
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.min(el.scrollHeight, 146)}px`;
  }, [value, textareaRef]);

  // Close menus on outside click / Escape.
  React.useEffect(() => {
    if (!openMenu) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu(null);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [openMenu]);

  function toggle(menu: Exclude<ComposerMenu, null>) {
    setOpenMenu((m) => (m === menu ? null : menu));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isEmpty) onSend(value.trim());
      return;
    }
    if (e.key === '/' && value === '') {
      // Open slash menu as the command starts filtering.
      setOpenMenu('slash');
      return;
    }
    if (e.key === '@' && value === '') {
      setOpenMenu('mention');
      return;
    }
    if (e.key === 'Escape' && openMenu) {
      setOpenMenu(null);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    onChange(next);
    // Keep slash menu filtered/closed in sync with the text.
    if (openMenu === 'slash' && !next.startsWith('/')) setOpenMenu(null);
    if (openMenu === 'mention' && !next.includes('@')) setOpenMenu(null);
  }

  const slashQuery = value.startsWith('/') ? value : '/';
  const filteredSlash = SLASH_ITEMS.filter((s) =>
    slashQuery.length > 1 ? s.title.startsWith(slashQuery) : true,
  );

  return (
    <div className={`composer ${thinking ? 'thinking' : ''}`} ref={rootRef}>
      {contextChips.length > 0 && (
        <div className="composer-context">
          {contextChips.map((chip, i) => {
            const ChipIcon = Icon[chip.icon] ?? Icon.At;
            return (
              <span key={i} className={`ctx-chip ${chip.attach ? 'attach' : ''}`}>
                <ChipIcon size={11} className="icon" />
                <span>{chip.label}</span>
                <button
                  type="button"
                  className="x"
                  aria-label={`Remove ${chip.label}`}
                  onClick={() => onRemoveChip?.(i)}
                >
                  <Icon.X size={10} />
                </button>
              </span>
            );
          })}
          <button type="button" className="ctx-chip">
            <Icon.Plus size={11} />
            <span>Add context</span>
          </button>
        </div>
      )}

      {/* Input with transparent-text highlight overlay */}
      <div className="composer-input-wrap">
        <div className="composer-highlight" aria-hidden="true">
          {highlightSegments(value)}
          {value.endsWith('\n') ? '\u00a0' : ''}
        </div>
        <textarea
          ref={textareaRef}
          className="composer-input"
          rows={1}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Message Studio"
        />
      </div>

      {/* Toolbar row */}
      <div className="composer-toolbar">
        <button type="button" className="comp-icon-btn" title="Attach files or images">
          <Icon.Paperclip size={15} />
        </button>

        {/* @ mention */}
        <div className="menu-anchor">
          <button
            type="button"
            className={`comp-icon-btn ${openMenu === 'mention' ? 'active' : ''}`}
            title="Add context (@)"
            aria-expanded={openMenu === 'mention'}
            onClick={() => toggle('mention')}
          >
            <Icon.At size={15} />
          </button>
          {openMenu === 'mention' && <MentionMenu onPick={(name) => {
            onChange(value ? `${value} @${name}` : `@${name}`);
            setOpenMenu(null);
            textareaRef.current?.focus();
          }} />}
        </div>

        {/* Slash commands */}
        <div className="menu-anchor">
          <button
            type="button"
            className={`comp-icon-btn ${openMenu === 'slash' ? 'active' : ''}`}
            title="Slash commands (/)"
            aria-expanded={openMenu === 'slash'}
            onClick={() => toggle('slash')}
          >
            <Icon.Command size={15} />
          </button>
          {openMenu === 'slash' && (
            <SlashMenu
              items={filteredSlash}
              onPick={(title) => {
                onChange(`${title} `);
                setOpenMenu(null);
                textareaRef.current?.focus();
              }}
            />
          )}
        </div>

        {/* Tool picker */}
        {showTools && (
          <div className="menu-anchor">
            <button
              type="button"
              className={`comp-btn ${toolActive !== 'auto' ? 'active' : ''}`}
              aria-expanded={openMenu === 'tool'}
              onClick={() => toggle('tool')}
            >
              <ToolGlyph className="icon" size={15} />
              <span>{activeTool.name}</span>
              <Icon.ChevDown size={11} />
            </button>
            {openMenu === 'tool' && (
              <ToolMenu
                activeId={toolActive}
                onPick={(id) => {
                  onToolChange?.(id);
                  setOpenMenu(null);
                }}
              />
            )}
          </div>
        )}

        <button type="button" className="comp-icon-btn" title="Voice input">
          <Icon.Mic size={15} />
        </button>

        <span className="comp-spacer" />

        {showMeter && (
          <div
            className="comp-meter"
            title={`${tokensUsed.toLocaleString()} / ${tokensMax.toLocaleString()} tokens`}
          >
            <span className="bar">
              <span className="fill" style={{ transform: `scaleX(${meterPct})` }} />
            </span>
            <span>{Math.round(meterPct * 100)}%</span>
          </div>
        )}

        {showModel && (
          <div className="menu-anchor">
            <button
              type="button"
              className="comp-btn"
              aria-expanded={openMenu === 'model'}
              onClick={() => toggle('model')}
            >
              <span className="model-tag-tile">{activeModel.tag}</span>
              <span>{activeModel.name.replace('Claude ', '')}</span>
              <Icon.ChevDown size={11} />
            </button>
            {openMenu === 'model' && (
              <ModelMenu
                activeId={model}
                onPick={(id) => {
                  onModelChange?.(id);
                  setOpenMenu(null);
                }}
              />
            )}
          </div>
        )}

        <button
          type="button"
          className="comp-send"
          disabled={isEmpty}
          title="Send (⌘↵)"
          aria-label="Send message"
          onClick={() => onSend(value.trim())}
        >
          <Icon.ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}

function ModelMenu({ activeId, onPick }: { activeId: string; onPick: (id: string) => void }) {
  return (
    <div className="menu" style={{ right: 0, width: 280 }} role="menu" aria-label="Model">
      <div className="menu-header">Model</div>
      {MODELS.map((m: ComposerModel) => (
        <button
          type="button"
          key={m.id}
          className={`menu-item ${activeId === m.id ? 'active' : ''}`}
          onClick={() => onPick(m.id)}
        >
          <span className="m-icon">{m.tag}</span>
          <span className="m-info">
            <span className="m-title">{m.name}</span>
            <span className="m-sub" style={{ display: 'block' }}>
              {m.sub}
            </span>
          </span>
          <span className="m-kbd">{m.kbd}</span>
        </button>
      ))}
      <div className="menu-sep" />
      <button type="button" className="menu-item">
        <span className="m-icon">
          <Icon.Settings size={13} />
        </span>
        <span className="m-info">
          <span className="m-title">Model settings</span>
        </span>
      </button>
    </div>
  );
}

function ToolMenu({ activeId, onPick }: { activeId: string; onPick: (id: string) => void }) {
  return (
    <div className="menu" style={{ left: 0, width: 260 }} role="menu" aria-label="Tools">
      <div className="menu-header">Tools available</div>
      {TOOLS.map((t: ComposerTool) => {
        const ToolIcon = Icon[t.icon];
        return (
          <button
            type="button"
            key={t.id}
            className={`menu-item ${activeId === t.id ? 'active' : ''}`}
            onClick={() => onPick(t.id)}
          >
            <span className="m-icon">
              <ToolIcon size={13} />
            </span>
            <span className="m-info">
              <span className="m-title">{t.name}</span>
              <span className="m-sub" style={{ display: 'block' }}>
                {t.sub}
              </span>
            </span>
            {t.on && (
              <span className="m-kbd" style={{ color: 'var(--s-good)' }}>
                ON
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function SlashMenu({
  items,
  onPick,
}: {
  items: typeof SLASH_ITEMS;
  onPick: (title: string) => void;
}) {
  return (
    <div className="menu" style={{ left: 0, width: 320 }} role="menu" aria-label="Commands">
      <div className="menu-header">Commands · type to filter</div>
      {items.map((s) => {
        const SlashIcon = Icon[s.icon];
        return (
          <button
            type="button"
            key={s.id}
            className="menu-item"
            onClick={() => onPick(s.title)}
          >
            <span className="m-icon">
              <SlashIcon size={13} />
            </span>
            <span className="m-info">
              <span className="m-title mono">{s.title}</span>
              <span className="m-sub" style={{ display: 'block' }}>
                {s.sub}
              </span>
            </span>
            <span className="m-kbd">{s.kbd}</span>
          </button>
        );
      })}
    </div>
  );
}

function MentionMenu({ onPick }: { onPick: (name: string) => void }) {
  return (
    <div className="menu" style={{ left: 0, width: 280 }} role="menu" aria-label="Mention">
      <div className="menu-header">Mention a file, thread, or agent</div>
      {MENTION_ITEMS.map((m) => {
        const MentionIcon = Icon[m.icon];
        return (
          <button
            type="button"
            key={m.id}
            className="menu-item"
            onClick={() => onPick(m.name)}
          >
            <span className="m-icon">
              <MentionIcon size={13} />
            </span>
            <span className="m-info">
              <span className="m-title">{m.name}</span>
              <span className="m-sub" style={{ display: 'block' }}>
                {m.sub}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
