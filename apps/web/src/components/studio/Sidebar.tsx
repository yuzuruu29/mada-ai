import styles from './Sidebar.module.css';

type NavItem = {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  href?: string;
};

type NavSection = {
  label: string | null;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: null,
    items: [
      { icon: 'home', label: 'Home', active: true },
      { icon: 'runs', label: 'Research runs', badge: '12' },
      { icon: 'projects', label: 'Projects', href: '/projects' },
      { icon: 'sources', label: 'Sources' },
      { icon: 'library', label: 'Library' },
      { icon: 'alerts', label: 'Alerts' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { icon: 'academic', label: 'Academic Search' },
      { icon: 'deep', label: 'Deep Research' },
      { icon: 'compare', label: 'Compare' },
      { icon: 'extract', label: 'Extract Data' },
    ],
  },
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    home: 'M3 11.5 12 4l9 7.5M5.5 10.5V20h13v-9.5',
    runs: 'M4 6h16M4 12h10M4 18h13M17.5 11l2 2 3.5-4',
    projects: 'M4 5h6l2 3h8v11H4z',
    sources: 'M7 4h10v16H7zM10 8h4M10 12h4M10 16h2',
    library: 'M5 5h4v14H5zM11 5h4v14h-4zM17 6.5l3 13-3.5 1-3-13z',
    alerts: 'M12 4a6 6 0 0 1 6 6v4l2 3H4l2-3v-4a6 6 0 0 1 6-6zM10 20a2 2 0 0 0 4 0',
    academic: 'M12 5 2 9l10 4 10-4zM6 11v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4M22 9v6',
    deep: 'M12 3a9 9 0 1 0 9 9M12 8a4 4 0 1 0 4 4M12 12l8-8M17 3h3v3',
    compare: 'M8 4v13M8 7H4m4 6H4M16 4v13m0-13h4m-4 6h4M12 4v13',
    extract: 'M5 4h14v5H5zM5 11h14v5H5zM5 18h9v2H5z',
  };
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] ?? ''} />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.logo} aria-hidden="true">
          ✳
        </span>
        <div>
          <p className={styles.brandName}>Mada.AI</p>
          <p className={styles.brandTag}>Open research. Verifiable evidence.</p>
        </div>
      </div>

      <button type="button" className={styles.newResearch}>
        <span aria-hidden="true">＋</span> New research
      </button>

      <nav className={styles.nav} aria-label="Studio">
        {navSections.map((section, i) => (
          <div key={i} className={styles.navSection}>
            {section.label ? <p className={styles.navLabel}>{section.label}</p> : null}
            {section.items.map((item) => (
              <a
                key={item.label}
                href={item.href ?? '#'}
                className={item.active ? `${styles.navItem} ${styles.navActive}` : styles.navItem}
                aria-current={item.active ? 'page' : undefined}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {'badge' in item && item.badge ? (
                  <span className={styles.badge}>{item.badge}</span>
                ) : null}
              </a>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.proCard}>
        <p className={styles.proTitle}>
          Mada.AI Pro <span className={styles.proPill}>PRO</span>
        </p>
        <p className={styles.proCopy}>Unlock frontier models, deeper search and higher limits.</p>
        <button type="button" className={styles.proCta}>
          Upgrade
        </button>
      </div>

      <div className={styles.user}>
        <span className={styles.avatar} aria-hidden="true">
          AR
        </span>
        <div className={styles.userMeta}>
          <p className={styles.userName}>Alex Researcher</p>
          <p className={styles.userMail}>alex@mada.ai</p>
        </div>
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </div>
    </aside>
  );
}
