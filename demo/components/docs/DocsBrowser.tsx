'use client';

import * as React from 'react';
import { Badge, Code, CodeBlock } from 'glt-ui';
import { ExamplePreview } from './ExamplePreview';
import type { DocEntry, DocPropsTable, DocSection } from './types';

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  if (isDark) {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}

/** Flatten sections to a lookup of id → entry. */
function useEntryIndex(sections: DocSection[]) {
  return React.useMemo(() => {
    const map = new Map<string, DocEntry>();
    for (const s of sections) for (const e of s.entries) map.set(e.id, e);
    return map;
  }, [sections]);
}

export interface DocsBrowserProps {
  sections: DocSection[];
  /** Brand title shown in the header. */
  title?: string;
  subtitle?: string;
}

export function DocsBrowser({ sections, title = 'GLT UI', subtitle = 'Component Browser' }: DocsBrowserProps) {
  const index = useEntryIndex(sections);
  const firstId = sections[0]?.entries[0]?.id ?? '';
  const [activeId, setActiveId] = React.useState(firstId);
  const [query, setQuery] = React.useState('');
  const [navOpen, setNavOpen] = React.useState(false);
  const mainRef = React.useRef<HTMLDivElement>(null);

  // Sync selection with the URL hash so entries are deep-linkable in the static export.
  React.useEffect(() => {
    const applyHash = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (id && index.has(id)) setActiveId(id);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [index]);

  const select = (id: string) => {
    setActiveId(id);
    setNavOpen(false);
    if (window.location.hash !== `#${id}`) window.history.replaceState(null, '', `#${id}`);
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  };

  const active = index.get(activeId) ?? sections[0]?.entries[0];

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({ ...s, entries: s.entries.filter((e) => e.name.toLowerCase().includes(q) || e.id.includes(q)) }))
      .filter((s) => s.entries.length > 0);
  }, [sections, query]);

  return (
    <div className="flex h-dvh flex-col bg-[var(--bg-color)] text-[var(--text-color)]">
      {/* Top bar */}
      <header className="flex shrink-0 items-center gap-3 border-b border-[var(--border-color)] bg-[var(--nav-bar-bg-color)] px-4 py-3">
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((v) => !v)}
          className="rounded-md border border-[var(--border-color)] px-2 py-1 text-sm lg:hidden"
        >
          ☰
        </button>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-[var(--strong-text-color)]">{title}</span>
          <span className="hidden text-sm text-[var(--secondary-text-color)] sm:inline">{subtitle}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="#practical-research"
            onClick={(e) => {
              e.preventDefault();
              select('practical-research');
            }}
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-[var(--secondary-text-color)] transition-colors hover:text-[var(--brand-primary)] sm:inline"
          >
            Practical demo
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-[var(--border-color)] px-3 py-1.5 text-sm font-medium text-[var(--secondary-text-color)] transition-colors hover:text-[var(--strong-text-color)] hover:border-[var(--brand-primary)]"
          >
            Toggle theme
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <nav
          className={[
            'w-72 shrink-0 overflow-y-auto border-r border-[var(--border-color)] bg-[var(--card-bg-color)] px-3 py-4',
            'absolute inset-y-0 left-0 z-20 mt-[57px] transition-transform lg:static lg:mt-0 lg:translate-x-0',
            navOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          ].join(' ')}
        >
          <div className="mb-4 px-1">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter components…"
              className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-color)] px-3 py-1.5 text-sm text-[var(--text-color)] outline-none focus:border-[var(--brand-primary)]"
            />
          </div>
          {filtered.map((section) => (
            <div key={section.id} className="mb-5">
              <div className="px-2 pb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--secondary-text-color)]">
                {section.title}
              </div>
              <ul className="space-y-0.5">
                {section.entries.map((entry) => {
                  const selected = entry.id === activeId;
                  return (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          select(entry.id);
                        }}
                        className={[
                          'block rounded-md border-l-2 px-2 py-1.5 text-sm transition-colors',
                          selected
                            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 font-semibold text-[var(--brand-primary)]'
                            : 'border-transparent text-[var(--text-color)] hover:bg-[var(--border-color)]',
                        ].join(' ')}
                      >
                        {entry.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Backdrop for mobile nav */}
        {navOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
            className="fixed inset-0 z-10 bg-black/30 lg:hidden"
          />
        )}

        {/* Main panel */}
        <div ref={mainRef} className="min-w-0 flex-1 overflow-y-auto">
          {active && <EntryView entry={active} />}
        </div>
      </div>
    </div>
  );
}

function EntryView({ entry }: { entry: DocEntry }) {
  if (entry.custom) {
    return <div className="mx-auto w-full">{entry.custom}</div>;
  }
  return (
    <article className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-10">
      <header className="mb-8 border-b border-[var(--border-color)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--strong-text-color)] md:text-4xl">{entry.name}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--secondary-text-color)]">{entry.description}</p>
        {entry.importLine && (
          <div className="mt-5 max-w-2xl">
            <CodeBlock code={entry.importLine} lang="tsx" copyable />
          </div>
        )}
      </header>

      {entry.examples && entry.examples.length > 0 && (
        <div className="space-y-8">
          {entry.examples.map((ex, i) => (
            <ExamplePreview key={`${entry.id}-${i}`} example={ex} />
          ))}
        </div>
      )}

      {entry.propsTables && entry.propsTables.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-[var(--strong-text-color)]">Props API</h2>
          <div className="space-y-8">
            {entry.propsTables.map((table, i) => (
              <PropsTable key={`${entry.id}-props-${i}`} table={table} fallbackTitle={entry.name} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function PropsTable({ table, fallbackTitle }: { table: DocPropsTable; fallbackTitle: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)]">
      <div className="border-b border-[var(--border-color)] bg-[var(--card-bg-color)] px-5 py-3">
        <h3 className="font-mono text-sm font-semibold text-[var(--strong-text-color)]">{table.title ?? fallbackTitle}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)] text-xs uppercase tracking-wider text-[var(--secondary-text-color)]">
              <th className="px-5 py-2.5 font-semibold">Prop</th>
              <th className="px-5 py-2.5 font-semibold">Type</th>
              <th className="px-5 py-2.5 font-semibold">Default</th>
              <th className="px-5 py-2.5 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {table.props.map((p) => (
              <tr key={p.name} className="border-b border-[var(--border-color)] last:border-0 align-top">
                <td className="whitespace-nowrap px-5 py-3">
                  <Code>{p.name}</Code>
                  {p.required && (
                    <Badge variant="danger" size="sm" className="ml-1.5 align-middle">
                      required
                    </Badge>
                  )}
                </td>
                <td className="px-5 py-3">
                  <Code className="text-[var(--brand-primary)]">{p.type}</Code>
                </td>
                <td className="whitespace-nowrap px-5 py-3">
                  {p.default ? (
                    <Code>{p.default}</Code>
                  ) : (
                    <span className="text-[var(--secondary-text-color)]">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-[var(--text-color)]">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
