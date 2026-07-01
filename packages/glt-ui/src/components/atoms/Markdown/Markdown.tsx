import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Text, type TextTone, type TextSize } from '../Text/Text.js';
import { Code } from '../Code/Code.js';
import { List, ListItem } from '../List/List.js';

export interface MarkdownProps {
  /** Raw markdown source. */
  content: string;
  /** Text tone applied to prose (use `inherit` inside coloured surfaces). */
  tone?: TextTone;
  className?: string;
}

/** Inline markdown: `code`, **bold**, *italic* / _italic_, and [links](url). */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(`[^`]+`)|(\*\*[^*]+?\*\*)|(\*[^*]+?\*)|(_[^_]+?_)|(\[[^\]]+?\]\([^)]+?\))/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(<React.Fragment key={key++}>{text.slice(last, m.index)}</React.Fragment>);
    const tok = m[0];
    if (tok.startsWith('`')) {
      nodes.push(<Code key={key++}>{tok.slice(1, -1)}</Code>);
    } else if (tok.startsWith('**')) {
      nodes.push(<strong key={key++} className="font-semibold">{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith('*') || tok.startsWith('_')) {
      nodes.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      if (link) {
        nodes.push(
          <a key={key++} href={link[2]} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:opacity-80">
            {link[1]}
          </a>
        );
      } else {
        nodes.push(<React.Fragment key={key++}>{tok}</React.Fragment>);
      }
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(<React.Fragment key={key++}>{text.slice(last)}</React.Fragment>);
  return nodes;
}

const headingSize: Record<number, TextSize> = { 1: 'xl', 2: 'lg', 3: 'base', 4: 'base', 5: 'sm', 6: 'sm' };
const isBlockStart = (l: string) => /^\s*(#{1,6}\s|[-*]\s|\d+\.\s|>|```)/.test(l);

/**
 * A minimal, dependency-free Markdown renderer that composes the Text, Code, and
 * List atoms. Supports headings, paragraphs, unordered/ordered lists,
 * blockquotes, fenced code blocks, and inline **bold** / *italic* / `code` /
 * [links](url). Pass `tone="inherit"` to render inside a coloured surface (e.g.
 * a chat bubble) so prose follows the container colour.
 */
export const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
  ({ content, tone = 'default', className }, ref) => {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const blocks: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Fenced code block
      if (line.trim().startsWith('```')) {
        const buf: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          buf.push(lines[i]);
          i++;
        }
        i++; // skip closing fence
        blocks.push(
          <pre key={key++} className="overflow-x-auto rounded-md bg-black/10 p-3 font-mono text-sm">
            <code>{buf.join('\n')}</code>
          </pre>
        );
        continue;
      }

      // Heading
      const h = /^(#{1,6})\s+(.*)$/.exec(line);
      if (h) {
        blocks.push(
          <Text key={key++} as="p" weight="bold" tone={tone} size={headingSize[h[1].length]}>
            {renderInline(h[2])}
          </Text>
        );
        i++;
        continue;
      }

      // Blockquote
      if (line.trim().startsWith('>')) {
        const buf: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          buf.push(lines[i].replace(/^\s*>\s?/, ''));
          i++;
        }
        blocks.push(
          <blockquote key={key++} className="border-l-2 border-current/30 pl-3 opacity-90">
            <Text as="p" tone={tone}>{renderInline(buf.join(' '))}</Text>
          </blockquote>
        );
        continue;
      }

      // Unordered list
      if (/^\s*[-*]\s+/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
          i++;
        }
        blocks.push(
          <List key={key++} variant="disc" spacing={1}>
            {items.map((it, ix) => (
              <ListItem key={ix}>
                <Text as="span" tone={tone}>{renderInline(it)}</Text>
              </ListItem>
            ))}
          </List>
        );
        continue;
      }

      // Ordered list
      if (/^\s*\d+\.\s+/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
          i++;
        }
        blocks.push(
          <List key={key++} variant="decimal" spacing={1}>
            {items.map((it, ix) => (
              <ListItem key={ix}>
                <Text as="span" tone={tone}>{renderInline(it)}</Text>
              </ListItem>
            ))}
          </List>
        );
        continue;
      }

      // Paragraph (gather consecutive plain lines)
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      blocks.push(
        <Text key={key++} as="p" tone={tone}>{renderInline(buf.join(' '))}</Text>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-2 leading-relaxed', className)}>
        {blocks}
      </div>
    );
  }
);
Markdown.displayName = 'Markdown';

export default Markdown;
