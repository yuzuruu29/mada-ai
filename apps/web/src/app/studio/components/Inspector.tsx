'use client';

import * as React from 'react';
import { Icon, type IconName } from './icons';

export type InspectorTab = 'properties' | 'layers' | 'context';

type InspectorProps = {
  tab: InspectorTab;
  onTab: (tab: InspectorTab) => void;
};

const TABS: { id: InspectorTab; label: string; icon: IconName }[] = [
  { id: 'properties', label: 'Properties', icon: 'Sliders' },
  { id: 'layers', label: 'Layers', icon: 'Layers' },
  { id: 'context', label: 'Context', icon: 'Book' },
];

const PALETTE = ['#F4A261', '#E76F51', '#264653', '#2A9D8F', '#E9C46A', '#F6F4EF', '#1F1D1B'];

export function Inspector({ tab, onTab }: InspectorProps) {
  return (
    <aside className="std-inspector">
      {/* Fix #7: tabs are a flex row (icon + label), not stacked grid. */}
      <div className="insp-tabs" role="tablist" aria-label="Inspector panels">
        {TABS.map((t) => {
          const TabIcon = Icon[t.icon];
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              className="tab"
              aria-selected={tab === t.id}
              onClick={() => onTab(t.id)}
            >
              <TabIcon size={13} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="insp-body">
        {tab === 'properties' && <PropertiesTab />}
        {tab === 'layers' && <LayersTab />}
        {tab === 'context' && <ContextTab />}
      </div>
    </aside>
  );
}

function PropertiesTab() {
  const [swatch, setSwatch] = React.useState(0);
  return (
    <>
      <div className="insp-section">
        <div className="insp-section-title">Artifact</div>
        <div className="insp-row">
          <span className="lbl">Name</span>
          <span className="value">Landing hero — v3</span>
        </div>
        <div className="insp-row">
          <span className="lbl">Type</span>
          <span className="value">Design frame</span>
        </div>
        <div className="insp-row">
          <span className="lbl">Status</span>
          <span className="value" style={{ color: 'var(--s-accent)' }}>
            Generating
          </span>
        </div>
      </div>

      <div className="insp-section">
        <div className="insp-section-title">Layout</div>
        <div className="insp-2col">
          <label className="prop-field">
            <span className="label">W</span>
            <input defaultValue="1440" inputMode="numeric" aria-label="Width" />
          </label>
          <label className="prop-field">
            <span className="label">H</span>
            <input defaultValue="900" inputMode="numeric" aria-label="Height" />
          </label>
        </div>
        <div className="insp-2col">
          <label className="prop-field">
            <span className="label">Pad</span>
            <input defaultValue="24" inputMode="numeric" aria-label="Padding" />
          </label>
          <label className="prop-field">
            <span className="label">Radius</span>
            <input defaultValue="12" inputMode="numeric" aria-label="Corner radius" />
          </label>
        </div>
      </div>

      <div className="insp-section">
        <div className="insp-section-title">Palette</div>
        <div className="insp-swatches" role="listbox" aria-label="Palette">
          {PALETTE.map((c, i) => (
            <button
              key={c}
              type="button"
              className="insp-swatch"
              role="option"
              aria-selected={swatch === i}
              title={c}
              style={{ background: c }}
              onClick={() => setSwatch(i)}
            />
          ))}
        </div>
        <div className="insp-row" style={{ marginTop: 8 }}>
          <span className="lbl">Selected</span>
          <span className="value mono">{PALETTE[swatch]}</span>
        </div>
      </div>

      <div className="insp-section">
        <div className="insp-section-title">Typography</div>
        <div className="insp-row">
          <span className="lbl">Display</span>
          <span className="value">Instrument Sans</span>
        </div>
        <div className="insp-row">
          <span className="lbl">Body</span>
          <span className="value">Inter 13/20</span>
        </div>
        <div className="insp-row">
          <span className="lbl">Code</span>
          <span className="value mono">JetBrains Mono</span>
        </div>
      </div>

      <div className="insp-section">
        <div className="insp-section-title">Model</div>
        <div className="insp-row">
          <span className="lbl">Agent</span>
          <span className="value">Design Director</span>
        </div>
        <div className="insp-row">
          <span className="lbl">Model</span>
          <span className="value">Claude Sonnet 4.5</span>
        </div>
        <div className="insp-row">
          <span className="lbl">Temp</span>
          <span className="value mono">0.7</span>
        </div>
      </div>
    </>
  );
}

type LayerNode = {
  id: string;
  name: string;
  icon: IconName;
  depth: number;
  visible: boolean;
};

const LAYERS: LayerNode[] = [
  { id: 'l1', name: 'Landing hero — v3', icon: 'Frame', depth: 0, visible: true },
  { id: 'l2', name: 'Nav bar', icon: 'Rect', depth: 1, visible: true },
  { id: 'l3', name: 'Logo lockup', icon: 'Image', depth: 2, visible: true },
  { id: 'l4', name: 'Hero stack', icon: 'Rect', depth: 1, visible: true },
  { id: 'l5', name: 'Headline', icon: 'Text', depth: 2, visible: true },
  { id: 'l6', name: 'Sub-copy', icon: 'Text', depth: 2, visible: true },
  { id: 'l7', name: 'CTA button', icon: 'Rect', depth: 2, visible: true },
  { id: 'l8', name: 'Hero visual', icon: 'Image', depth: 1, visible: false },
  { id: 'l9', name: 'Footer strip', icon: 'Rect', depth: 1, visible: true },
];

function LayersTab() {
  const [layers, setLayers] = React.useState(LAYERS);
  const [selected, setSelected] = React.useState('l1');

  return (
    <div className="insp-section" style={{ borderBottom: 'none' }}>
      <div className="insp-section-title">Layers</div>
      <div role="tree" aria-label="Layer tree">
        {layers.map((l) => {
          const LayerIcon = Icon[l.icon];
          const VisIcon = l.visible ? Icon.Eye : Icon.EyeOff;
          return (
            <div
              key={l.id}
              role="treeitem"
              aria-selected={selected === l.id}
              className="layer-row"
              style={{ paddingLeft: 8 + l.depth * 14, opacity: l.visible ? 1 : 0.55 }}
              onClick={() => setSelected(l.id)}
            >
              <LayerIcon size={13} className="layer-icon" />
              <span className="layer-name">{l.name}</span>
              <button
                type="button"
                className="layer-vis"
                aria-label={l.visible ? `Hide ${l.name}` : `Show ${l.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLayers((prev) =>
                    prev.map((x) => (x.id === l.id ? { ...x, visible: !x.visible } : x)),
                  );
                }}
              >
                <VisIcon size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContextTab() {
  return (
    <>
      <div className="insp-section">
        <div className="insp-section-title">In this thread</div>
        <div className="insp-row">
          <span className="lbl">
            <Icon.Doc size={12} style={{ marginRight: 6, verticalAlign: -2 }} />
            brand-guidelines.md
          </span>
          <span className="value mono">12 pages</span>
        </div>
        <div className="insp-row">
          <span className="lbl">
            <Icon.Code size={12} style={{ marginRight: 6, verticalAlign: -2 }} />
            tokens.json
          </span>
          <span className="value mono">48 tokens</span>
        </div>
        <div className="insp-row">
          <span className="lbl">
            <Icon.Image size={12} style={{ marginRight: 6, verticalAlign: -2 }} />
            logo-lockup.svg
          </span>
          <span className="value mono">4 KB</span>
        </div>
      </div>

      <div className="insp-section">
        <div className="insp-section-title">Memory</div>
        <div className="insp-row">
          <span className="lbl">Brand voice</span>
          <span className="value">Warm, direct</span>
        </div>
        <div className="insp-row">
          <span className="lbl">Audience</span>
          <span className="value">Ops leads</span>
        </div>
        <div className="insp-row">
          <span className="lbl">Constraint</span>
          <span className="value">WCAG AA</span>
        </div>
      </div>
    </>
  );
}
