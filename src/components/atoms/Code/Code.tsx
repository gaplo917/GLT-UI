import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type CodeProps = React.HTMLAttributes<HTMLElement>;

/**
 * Inline code — a token-styled `<code>` for identifiers, tokens, and short
 * snippets within running text. For multi-line highlighted blocks use CodeBlock.
 */
export const Code = React.forwardRef<HTMLElement, CodeProps>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      'rounded px-1.5 py-0.5 text-[0.9em] font-[family-name:var(--code-font-family)] text-[var(--inline-code-text-color)] bg-[var(--inline-code-bg-color)]',
      className
    )}
    {...props}
  />
));
Code.displayName = 'Code';

export default Code;
