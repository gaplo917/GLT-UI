'use client';

import * as React from 'react';
import type { DocExample } from './types';

/**
 * Renders one documentation example: live preview + collapsible source.
 * Source is a plain <pre> (CodeBlock was removed from the slim package).
 */
export function ExamplePreview({ example }: { example: DocExample }) {
  const [showCode, setShowCode] = React.useState(true);

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] shadow-sm">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--border-color)] px-5 py-3">
        <div>
          <h4 className="text-base font-semibold text-[var(--strong-text-color)]">{example.title}</h4>
          {example.description && (
            <p className="mt-0.5 text-sm text-[var(--secondary-text-color)]">{example.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          className="shrink-0 rounded-md border border-[var(--border-color)] px-2.5 py-1 text-xs font-medium text-[var(--secondary-text-color)] transition-colors hover:text-[var(--strong-text-color)] hover:border-[var(--brand-primary)]"
        >
          {showCode ? 'Hide code' : 'Show code'}
        </button>
      </header>

      <div className="flex min-h-[72px] items-center bg-[var(--card-bg-color)] px-5 py-6">
        <div className={example.previewClassName ?? 'w-full'}>{example.render}</div>
      </div>

      {showCode && (
        <div className="border-t border-[var(--border-color)]">
          <pre className="overflow-x-auto bg-[var(--card-bg-color)] p-4 text-xs leading-relaxed text-[var(--text-color)]">
            <code>{example.code}</code>
          </pre>
        </div>
      )}
    </section>
  );
}
