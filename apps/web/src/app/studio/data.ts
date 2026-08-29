import type { IconName } from './components/icons';

/**
 * Sample data for the Studio shell. In production these are populated by
 * GET /threads, /models, /tools etc. (see design handoff "State Management").
 */

export type ComposerModel = { id: string; name: string; sub: string; kbd: string; tag: string };
export type ComposerTool = { id: string; name: string; sub: string; icon: IconName; on?: boolean };
export type SlashItem = { id: string; icon: IconName; title: string; sub: string; kbd: string };
export type MentionItem = { id: string; icon: IconName; name: string; sub: string };

export const MODELS: ComposerModel[] = [
  { id: 'sonnet', name: 'Claude Sonnet 4.5', sub: 'Balanced · 200K ctx', kbd: '⌘1', tag: 'S' },
  { id: 'opus', name: 'Claude Opus 4', sub: 'Most capable · 200K ctx', kbd: '⌘2', tag: 'O' },
  { id: 'haiku', name: 'Claude Haiku 4', sub: 'Fast · 100K ctx', kbd: '⌘3', tag: 'H' },
  { id: 'gpt5', name: 'GPT-5', sub: 'Reasoning · 128K ctx', kbd: '⌘4', tag: '5' },
  { id: 'gemini', name: 'Gemini 2.5 Pro', sub: 'Long context · 1M', kbd: '⌘5', tag: 'G' },
];

export const TOOLS: ComposerTool[] = [
  { id: 'auto', name: 'Auto route', sub: 'Pick the best tool for the job', icon: 'Wand', on: true },
  { id: 'search', name: 'Web search', sub: 'Fresh info from the internet', icon: 'Search' },
  { id: 'canvas', name: 'Canvas editor', sub: 'Draw & edit on the artboard', icon: 'Design', on: true },
  { id: 'code', name: 'Code runner', sub: 'Run Python / JS sandboxed', icon: 'Terminal' },
  { id: 'docs', name: 'Doc reader', sub: 'Query long PDFs and files', icon: 'Doc' },
  { id: 'image', name: 'Image gen', sub: 'Generate visuals from prompts', icon: 'Image' },
];

export const SLASH_ITEMS: SlashItem[] = [
  { id: 'design', icon: 'Design', title: '/design', sub: 'Create a design from scratch', kbd: '⌘D' },
  { id: 'edit', icon: 'Wand', title: '/edit', sub: 'Edit the active artifact', kbd: '⌘E' },
  { id: 'brainstorm', icon: 'Sparkle', title: '/brainstorm', sub: 'Explore ideas without committing', kbd: '⌘B' },
  { id: 'critique', icon: 'Eye', title: '/critique', sub: 'Get feedback on selection', kbd: '⌘K' },
  { id: 'handoff', icon: 'Share', title: '/handoff', sub: 'Prepare for developer / print', kbd: '⌘H' },
  { id: 'run', icon: 'Play', title: '/run', sub: 'Execute current plan', kbd: '⌘R' },
];

export const MENTION_ITEMS: MentionItem[] = [
  { id: 'm1', icon: 'Doc', name: 'brand-guidelines.md', sub: '12 pages' },
  { id: 'm2', icon: 'Image', name: 'logo-lockup.svg', sub: 'SVG · 4KB' },
  { id: 'm3', icon: 'Code', name: 'tokens.json', sub: '48 tokens' },
  { id: 'm4', icon: 'Chat', name: 'Landing hero variations', sub: 'current thread' },
  { id: 'm5', icon: 'Design', name: 'Design Director', sub: 'agent' },
];

export type ThreadItem = {
  id: string;
  title: string;
  meta: string;
  pinned?: boolean;
  active?: boolean;
};

export const SAMPLE_THREADS: ThreadItem[] = [
  { id: 't1', title: 'Landing hero variations', meta: 'now', pinned: true, active: true },
  { id: 't2', title: 'Brand color system audit', meta: '2h' },
  { id: 't3', title: 'Onboarding flow rewrite', meta: 'yesterday' },
  { id: 't4', title: 'Pricing page A/B copy', meta: 'Mon' },
  { id: 't5', title: 'Weekly changelog draft', meta: 'Jul 22' },
  { id: 't6', title: 'Feature spec — presence', meta: 'Jul 20' },
  { id: 't7', title: 'Support macro rewrite', meta: 'Jul 18' },
];

export const SAMPLE_FILES = [
  { id: 'f1', name: 'brand-tokens.json', icon: 'Code' as IconName },
  { id: 'f2', name: 'hero-copy.md', icon: 'Doc' as IconName },
  { id: 'f3', name: 'logo-lockup.svg', icon: 'Image' as IconName },
  { id: 'f4', name: 'wireframes/', icon: 'Folder' as IconName },
  { id: 'f5', name: 'screenshots/', icon: 'Folder' as IconName },
];

export const SAMPLE_AGENTS = [
  { id: 'a1', name: 'Design Director', icon: 'Design' as IconName },
  { id: 'a2', name: 'Copy Editor', icon: 'Type' as IconName },
  { id: 'a3', name: 'Researcher', icon: 'Book' as IconName },
  { id: 'a4', name: 'Frontend Engineer', icon: 'Code' as IconName },
];

export const SAMPLE_ASSETS = [
  { name: 'hero-mockup-01.png', meta: 'PNG · 2.1MB' },
  { name: 'brand-palette', meta: '8 colors' },
  { name: 'feature-diagram.svg', meta: 'SVG' },
  { name: 'customer-quote.mp3', meta: 'Audio · 0:42' },
];

export const TIMELINE_STEPS = [
  'Read brand-guidelines.md',
  'Pull tokens.json',
  'Draft 3 headlines',
  'Render hero mock',
  'Apply palette',
  'Handoff',
];

export const SUGGESTED_PROMPTS = [
  { icon: 'Design' as IconName, title: 'Design a landing page', sub: 'Hero, features, testimonials, footer' },
  { icon: 'Doc' as IconName, title: 'Rewrite this doc', sub: 'Tighter, more concrete, active voice' },
  { icon: 'Chat' as IconName, title: 'Interview 5 users', sub: 'Simulate personas and synthesize' },
  { icon: 'Code' as IconName, title: 'Prototype a flow', sub: 'Working HTML, click through the UX' },
];

export const RECENT_ASSETS_RAIL = [
  { name: 'Fern landing v3', sub: 'Design · yesterday', icon: 'Design' as IconName },
  { name: 'Onboarding flow', sub: 'Prototype · Mon', icon: 'Flow' as IconName },
  { name: 'Brand tokens', sub: 'Doc · Mon', icon: 'Sliders' as IconName },
  { name: 'Q3 changelog', sub: 'Doc · Sun', icon: 'Doc' as IconName },
  { name: 'Pricing hero', sub: 'Design · Sat', icon: 'Design' as IconName },
  { name: 'Support macros', sub: 'Doc · Fri', icon: 'Chat' as IconName },
];
