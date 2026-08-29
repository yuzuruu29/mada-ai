import * as React from 'react';

/**
 * Inline SVG icon set for the Studio. Flat, 1.6px stroke, 24×24 grid.
 * Lucide-equivalent style per the design handoff (icons.jsx).
 */

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Icon = {
  Search: (p: IconProps) =>
    base({ ...p, children: (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>) }),
  Plus: (p: IconProps) => base({ ...p, children: <path d="M12 5v14M5 12h14" /> }),
  Sparkle: (p: IconProps) =>
    base({ ...p, children: (<><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" /><path d="M19 15l.7 1.8L21.5 17.5 19.7 18.2 19 20l-.7-1.8L16.5 17.5l1.8-.7z" /></>) }),
  PanelLeft: (p: IconProps) =>
    base({ ...p, children: (<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></>) }),
  PanelRight: (p: IconProps) =>
    base({ ...p, children: (<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></>) }),
  Play: (p: IconProps) => base({ ...p, children: <path d="M7 5l12 7-12 7V5z" /> }),
  Chat: (p: IconProps) => base({ ...p, children: <path d="M4 5h16v11H8l-4 4V5z" /> }),
  File: (p: IconProps) =>
    base({ ...p, children: (<><path d="M6 3h9l5 5v13H6V3z" /><path d="M15 3v5h5" /></>) }),
  Folder: (p: IconProps) => base({ ...p, children: <path d="M3 6h6l2 2h10v11H3V6z" /> }),
  Image: (p: IconProps) =>
    base({ ...p, children: (<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M4 18l5-5 4 4 3-3 4 4" /></>) }),
  Doc: (p: IconProps) =>
    base({ ...p, children: (<><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 8h8M8 12h8M8 16h5" /></>) }),
  Code: (p: IconProps) => base({ ...p, children: <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" /> }),
  Design: (p: IconProps) =>
    base({ ...p, children: (<><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 10h18M8 4v6M16 4v6" /></>) }),
  Mic: (p: IconProps) =>
    base({ ...p, children: (<><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M6 11a6 6 0 0012 0M12 17v4M9 21h6" /></>) }),
  Paperclip: (p: IconProps) =>
    base({ ...p, children: <path d="M20 12l-8 8a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l7-7" /> }),
  At: (p: IconProps) =>
    base({ ...p, children: (<><circle cx="12" cy="12" r="4" /><path d="M16 12v2a3 3 0 006 0v-2a10 10 0 10-4 8" /></>) }),
  ChevDown: (p: IconProps) => base({ ...p, children: <path d="M6 9l6 6 6-6" /> }),
  ChevRight: (p: IconProps) => base({ ...p, children: <path d="M9 6l6 6-6 6" /> }),
  ChevLeft: (p: IconProps) => base({ ...p, children: <path d="M15 6l-6 6 6 6" /> }),
  Settings: (p: IconProps) =>
    base({ ...p, children: (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 010-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1-.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 014 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 010 4h-.1a1.6 1.6 0 00-1.5 1z" /></>) }),
  Sun: (p: IconProps) =>
    base({ ...p, children: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>) }),
  Moon: (p: IconProps) => base({ ...p, children: <path d="M20 15A8 8 0 019 4a8 8 0 1011 11z" /> }),
  Share: (p: IconProps) =>
    base({ ...p, children: (<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M8.6 10.5l6.8-4" /></>) }),
  History: (p: IconProps) =>
    base({ ...p, children: (<><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3M3 3v5h5" /><path d="M12 7v5l3 2" /></>) }),
  Eye: (p: IconProps) =>
    base({ ...p, children: (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>) }),
  EyeOff: (p: IconProps) =>
    base({ ...p, children: (<><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><path d="M2 2l20 20" /></>) }),
  MoreH: (p: IconProps) =>
    base({ ...p, children: (<><circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" /></>) }),
  Command: (p: IconProps) =>
    base({ ...p, children: <path d="M9 6a3 3 0 100 6h6a3 3 0 100-6 3 3 0 00-3 3v6a3 3 0 11-3-3z" /> }),
  Layers: (p: IconProps) =>
    base({ ...p, children: (<><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5M3 18l9 5 9-5" /></>) }),
  Sliders: (p: IconProps) =>
    base({ ...p, children: (<><path d="M4 7h6M14 7h6M4 12h2M10 12h10M4 17h10M18 17h2" /><circle cx="12" cy="7" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="16" cy="17" r="2" /></>) }),
  Type: (p: IconProps) => base({ ...p, children: <path d="M4 6V4h16v2M9 20h6M12 4v16" /> }),
  Wand: (p: IconProps) =>
    base({ ...p, children: <path d="M15 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM3 21l10-10M13 8l3 3" /> }),
  Frame: (p: IconProps) => base({ ...p, children: <path d="M4 8h16M4 16h16M8 4v16M16 4v16" /> }),
  Rect: (p: IconProps) => base({ ...p, children: <rect x="4" y="4" width="16" height="16" rx="2" /> }),
  Text: (p: IconProps) => base({ ...p, children: <path d="M6 4h12M12 4v16" /> }),
  Check: (p: IconProps) => base({ ...p, children: <path d="M4 12l5 5 11-11" /> }),
  X: (p: IconProps) => base({ ...p, children: <path d="M6 6l12 12M18 6L6 18" /> }),
  ArrowUp: (p: IconProps) => base({ ...p, children: <path d="M12 19V5M5 12l7-7 7 7" /> }),
  Book: (p: IconProps) =>
    base({ ...p, children: <path d="M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4V4zM20 4h-6a3 3 0 00-3 3v13a2 2 0 012-2h7V4z" /> }),
  Grid: (p: IconProps) =>
    base({ ...p, children: (<><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>) }),
  Flow: (p: IconProps) =>
    base({ ...p, children: (<><rect x="3" y="4" width="7" height="5" rx="1" /><rect x="14" y="4" width="7" height="5" rx="1" /><rect x="8" y="15" width="8" height="5" rx="1" /><path d="M6.5 9v3M17.5 9v3M6.5 12h11v3" /></>) }),
  Terminal: (p: IconProps) =>
    base({ ...p, children: (<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3M13 15h5" /></>) }),
  Users: (p: IconProps) =>
    base({ ...p, children: (<><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0114 0M17 11a4 4 0 000-8M22 21a7 7 0 00-5-7" /></>) }),
};

export type IconName = keyof typeof Icon;
