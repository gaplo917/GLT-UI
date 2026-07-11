'use client';

import * as React from 'react';
import { CodeBlock } from 'glt-ui';
import type { DocExample } from './types';

/**
 * Renders one documentation example: a live preview surface stacked above its
 * source snippet (collapsible). The preview and the code are authored together
 * so what you see is what the snippet produces.
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
          <CodeBlock code={example.code} lang={example.lang ?? 'tsx'} copyable />
        </div>
      )}
    </section>
  );
}
