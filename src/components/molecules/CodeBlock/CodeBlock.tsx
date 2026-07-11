'use client';

import * as React from 'react';
import type { Highlighter } from 'shiki';
import { cn } from '@/lib/cn.js';
import { Button } from '@/components/atoms/Button/Button.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { Icon } from '@/components/atoms/Icon/Icon.js';
import { gapstyleTheme } from './gapstyle-theme.js';

const THEME_NAME = 'GapStyle VS';

/** Languages bundled for the highlighter. */
const LANGS = [
  'tsx',
  'ts',
  'jsx',
  'js',
  'bash',
  'json',
  'scss',
  'css',
  'html',
  'markdown',
] as const;

export type CodeBlockLang = (typeof LANGS)[number] | (string & {});

// Fallback colours from the theme's editor surface, used before Shiki loads
// (and as the static-export first paint) so there is no flash of white.
const FALLBACK_BG = '#282c34';
const FALLBACK_FG = '#abb2bf';

// Single shared highlighter instance across all CodeBlocks on the page.
let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({ themes: [gapstyleTheme], langs: LANGS as unknown as string[] })
    );
  }
  return highlighterPromise;
}

export interface CodeBlockProps {
  /** Source code to render. Leading/trailing blank lines are trimmed. */
  code: string;
  /** Language grammar (default `tsx`). */
  lang?: CodeBlockLang;
  /** Optional filename/label shown in the header bar. */
  title?: string;
  /** Show a copy-to-clipboard button (default true). */
  copyable?: boolean;
  className?: string;
}

/**
 * Syntax-highlighted code block using Shiki with the GapStyle VS theme.
 *
 * Highlighting runs in the browser (works in static export). Until it resolves,
 * a pre-formatted fallback in the theme's colours is shown, so there is no
 * layout shift or flash.
 */
export function CodeBlock({ code, lang = 'tsx', title, copyable = true, className }: CodeBlockProps) {
  const source = React.useMemo(() => code.replace(/^\n+/, '').replace(/\s+$/, ''), [code]);
  const [html, setHtml] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    getHighlighter()
      .then((hl) => {
        const loaded = hl.getLoadedLanguages();
        const useLang = loaded.includes(lang as string) ? (lang as string) : 'txt';
        return hl.codeToHtml(source, { lang: useLang, theme: THEME_NAME });
      })
      .then((out) => {
        if (active) setHtml(out);
      })
      .catch(() => {
        /* keep fallback on failure */
      });
    return () => {
      active = false;
    };
  }, [source, lang]);

  const copy = React.useCallback(() => {
    navigator.clipboard?.writeText(source).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      },
      () => {}
    );
  }, [source]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-[var(--border-color)] text-sm',
        // Shiki emits its own <pre>; normalize padding/scroll/font.
        '[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:leading-relaxed [&_pre]:font-mono',
        className
      )}
      style={{ backgroundColor: FALLBACK_BG }}
    >
      {(title || copyable) && (
        <div
          className="flex items-center justify-between gap-2 border-b border-black/30 px-4 py-2"
          style={{ color: FALLBACK_FG }}
        >
          <Text as="span" size="xs" tone="inherit" truncate className="font-mono opacity-80">
            {title ?? lang}
          </Text>
          {copyable && (
            <Button
              variant="ghost"
              size="xs"
              onClick={copy}
              className="h-auto px-2 py-0.5 text-xs text-inherit opacity-70 hover:translate-y-0 hover:bg-transparent hover:opacity-100 focus-visible:ring-white/40"
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  Copied <Icon icon="✓" tone="inherit" />
                </>
              ) : (
                'Copy'
              )}
            </Button>
          )}
        </div>
      )}
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="m-0 overflow-x-auto p-4 font-mono leading-relaxed" style={{ color: FALLBACK_FG }}>
          <code>{source}</code>
        </pre>
      )}
    </div>
  );
}

export default CodeBlock;
