'use client';

import * as React from 'react';
import { Icon } from './icons';
import { SUGGESTED_PROMPTS, RECENT_ASSETS_RAIL } from '../data';

/**
 * Canvas content shared by the three variations.
 * Inline oklch values in LandingHeroMock are the artifact's own palette
 * (a "design preview"), intentionally independent of the studio theme.
 */

export function ChatArtifact() {
  return (
    <div className="chat-thread">
      <div className="msg">
        <div className="msg-avatar user">AK</div>
        <div className="msg-body">
          <div className="msg-name">
            <b>Alex</b> <span className="time">2:42 PM</span>
          </div>
          <div className="msg-content">
            <p>
              Design a landing hero for <code>Fern</code>, a note-taking app. Use the warm earth
              palette from <code>@brand-guidelines.md</code>. The headline should feel calm and
              confident — no exclamation points.
            </p>
          </div>
        </div>
      </div>

      <div className="msg">
        <div className="msg-avatar agent">
          <Icon.Sparkle size={13} />
        </div>
        <div className="msg-body">
          <div className="msg-name">
            <b>Studio</b> <span className="time">2:42 PM</span>
            <span className="model-tag">SONNET 4.5</span>
          </div>
          <div className="msg-content">
            <p>
              I&apos;ve drafted three headline directions, all calm and grounded. The first pairs a
              benefit with a metaphor; the second is a soft imperative; the third leans into the
              product&apos;s personality.
            </p>
            <p>I&apos;ll render the winner on the canvas — you can tweak in the inspector.</p>

            <button type="button" className="msg-artifact-card" style={{ width: '100%', textAlign: 'left' }}>
              <div className="msg-artifact-icon">
                <Icon.Design size={18} />
              </div>
              <div className="msg-artifact-info">
                <div className="msg-artifact-title">Fern — Landing hero (v3)</div>
                <div className="msg-artifact-meta">1440 × 900 · edited 2m ago · 12 layers</div>
              </div>
              <Icon.ChevRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="msg">
        <div className="msg-avatar user">AK</div>
        <div className="msg-body">
          <div className="msg-name">
            <b>Alex</b> <span className="time">2:44 PM</span>
          </div>
          <div className="msg-content">
            <p>
              Nice. Tighten the leading on the headline and swap the CTA color to match{' '}
              <code>@tokens.json</code> primary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingHeroMock() {
  return (
    <div
      style={{
        background:
          'linear-gradient(180deg, oklch(0.97 0.02 80) 0%, oklch(0.94 0.04 70) 100%)',
        color: 'oklch(0.22 0.03 40)',
        padding: '36px 40px 48px',
        fontFamily: 'var(--s-font-display)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Nav */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 46,
          fontSize: 12,
          fontFamily: 'var(--s-font-ui)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'oklch(0.45 0.13 145)' }} />
          Fern
        </div>
        <div style={{ display: 'flex', gap: 20, color: 'oklch(0.4 0.02 40)' }}>
          <span>Product</span>
          <span>Pricing</span>
          <span>Journal</span>
          <span>Sign in</span>
        </div>
        <div
          style={{
            padding: '5px 12px',
            background: 'oklch(0.28 0.05 40)',
            color: 'white',
            borderRadius: 6,
            fontSize: 11.5,
          }}
        >
          Get Fern
        </div>
      </div>

      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'oklch(0.45 0.13 145)',
              marginBottom: 12,
              fontFamily: 'var(--s-font-ui)',
              fontWeight: 500,
            }}
          >
            THINKING, ROOTED
          </div>
          <h1
            style={{
              fontSize: 44,
              lineHeight: 1.05,
              margin: '0 0 14px',
              letterSpacing: '-0.02em',
              fontWeight: 500,
            }}
          >
            A quieter place
            <br />
            to grow your ideas.
          </h1>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              color: 'oklch(0.42 0.02 40)',
              margin: '0 0 22px',
              maxWidth: 380,
              fontFamily: 'var(--s-font-ui)',
            }}
          >
            Fern is a notebook that thinks with you. Capture rough sparks, tend them into essays,
            and cross-pollinate across your whole garden of thought.
          </p>
          <div style={{ display: 'flex', gap: 10, fontFamily: 'var(--s-font-ui)' }}>
            <div
              style={{
                padding: '9px 16px',
                background: 'oklch(0.28 0.05 40)',
                color: 'white',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
              }}
            >
              Start writing — free
            </div>
            <div
              style={{
                padding: '9px 16px',
                background: 'transparent',
                color: 'oklch(0.28 0.05 40)',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
                border: '1px solid oklch(0.28 0.05 40 / 0.2)',
              }}
            >
              Watch demo
            </div>
          </div>
          <div
            style={{
              marginTop: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              color: 'oklch(0.5 0.02 40)',
              fontFamily: 'var(--s-font-ui)',
            }}
          >
            <div style={{ display: 'flex' }}>
              {['oklch(0.7 0.13 30)', 'oklch(0.65 0.13 140)', 'oklch(0.6 0.13 260)', 'oklch(0.68 0.13 60)'].map(
                (c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: c,
                      marginLeft: i === 0 ? 0 : -6,
                      border: '2px solid oklch(0.97 0.02 80)',
                    }}
                  />
                ),
              )}
            </div>
            <span>Trusted by 12,000+ thinkers</span>
          </div>
        </div>

        {/* Placeholder image */}
        <div
          style={{
            aspectRatio: '4/3',
            borderRadius: 14,
            background:
              'repeating-linear-gradient(45deg, oklch(0.87 0.04 70) 0 8px, oklch(0.85 0.05 65) 8px 16px)',
            border: '1px solid oklch(0.75 0.05 60)',
            display: 'grid',
            placeItems: 'center',
            color: 'oklch(0.4 0.03 50)',
            fontFamily: 'var(--s-font-mono)',
            fontSize: 10,
          }}
        >
          product screenshot · 4:3
        </div>
      </div>
    </div>
  );
}

/** V2 center-stage hero: glyph, headline, composer slot, suggestions, recents rail. */
export function HeroContent({
  composer,
  onPickPrompt,
}: {
  composer: React.ReactNode;
  onPickPrompt: (title: string) => void;
}) {
  return (
    <div className="hero-wrap">
      <div className="hero-glyph">S</div>
      <h1 className="hero-title">What are we making today?</h1>
      <p className="hero-sub">
        Describe an outcome, drop a file, or start with a template. Studio will pick the right
        tools.
      </p>

      <div className="hero-composer">{composer}</div>

      <div className="suggest-grid">
        {SUGGESTED_PROMPTS.map((s) => {
          const SuggestIcon = Icon[s.icon];
          return (
            <button
              key={s.title}
              type="button"
              className="suggest-card"
              onClick={() => onPickPrompt(s.title)}
            >
              <div className="s-icon">
                <SuggestIcon size={14} />
              </div>
              <div className="s-title">{s.title}</div>
              <div className="s-sub">{s.sub}</div>
            </button>
          );
        })}
      </div>

      <div className="assets-rail">
        <div className="rail-title">
          <span>Recent</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--s-fg-2)' }}>
            <kbd>⌘K</kbd>
            <span>to search</span>
          </span>
        </div>
        <div className="rail-scroll">
          {RECENT_ASSETS_RAIL.map((c) => {
            const RailIcon = Icon[c.icon];
            return (
              <div key={c.name} className="rail-card">
                <div className="rail-thumb">
                  <RailIcon size={22} />
                </div>
                <div className="rail-meta">
                  <div className="name">{c.name}</div>
                  <div className="sub">{c.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** V3 artifact frame with Preview/Code/Diff tabs and a generating pill. */
export function ArtifactFrame({ generating }: { generating: boolean }) {
  const [tab, setTab] = React.useState<'preview' | 'code' | 'diff'>('preview');
  return (
    <div className="artifact" style={{ width: 'min(820px, 100%)' }}>
      <div className="artifact-head">
        <Icon.Design size={13} style={{ color: 'var(--s-accent)' }} />
        <span className="art-title">Fern — Landing hero</span>
        <span className="art-type">HTML · 1440×900</span>
        <span className="spacer" />
        <div className="tabs" role="tablist" aria-label="Artifact view">
          {(['preview', 'code', 'diff'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              className="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        {generating && (
          <div className="gen-status" role="status">
            <span className="pulse" />
            <span>Rendering hero…</span>
            <span style={{ color: 'var(--s-fg-3)' }} className="mono">
              step 4/6
            </span>
          </div>
        )}
        {tab === 'preview' && <LandingHeroMock />}
        {tab === 'code' && (
          <pre
            className="mono"
            style={{
              margin: 0,
              padding: 20,
              fontSize: 11.5,
              lineHeight: 1.6,
              color: 'var(--s-fg-1)',
              overflow: 'auto',
              maxHeight: 420,
            }}
          >{`<section class="hero">
  <nav>…</nav>
  <h1>A quieter place<br/>to grow your ideas.</h1>
  <p>Fern is a notebook that thinks with you…</p>
  <div class="cta">
    <button>Start writing — free</button>
    <button class="ghost">Watch demo</button>
  </div>
</section>`}</pre>
        )}
        {tab === 'diff' && (
          <pre
            className="mono"
            style={{
              margin: 0,
              padding: 20,
              fontSize: 11.5,
              lineHeight: 1.6,
              color: 'var(--s-fg-1)',
              overflow: 'auto',
              maxHeight: 420,
            }}
          >{`@@ headline @@
-  Grow your ideas, faster!
+  A quieter place to grow your ideas.
@@ cta @@
-  background: var(--brand-pop)
+  background: var(--primary)  /* tokens.json */`}</pre>
        )}
      </div>
    </div>
  );
}
