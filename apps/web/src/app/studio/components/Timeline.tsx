'use client';

import { Icon } from './icons';

type TimelineProps = {
  steps: string[];
  currentIndex: number;
};

/**
 * Agent plan timeline. Fix #8: the track scrolls horizontally
 * (overflow-x: auto) instead of being clipped with overflow: hidden.
 */
export function Timeline({ steps, currentIndex }: TimelineProps) {
  return (
    <div className="timeline">
      <div className="tl-head">
        <span className="title">
          <Icon.Flow size={12} style={{ marginRight: 6, verticalAlign: -1.5 }} />
          Plan
        </span>
        <span className="spacer" />
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--s-fg-3)' }}>
          {currentIndex + 1}/{steps.length}
        </span>
      </div>
      <div className="tl-track">
        {steps.map((step, i) => {
          const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending';
          return (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
              <div className={`tl-step ${state}`}>
                <span className="dot">
                  {state === 'done' && <Icon.Check size={9} />}
                </span>
                <span>{step}</span>
              </div>
              {i < steps.length - 1 && (
                <Icon.ChevRight size={11} className="tl-caret" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
