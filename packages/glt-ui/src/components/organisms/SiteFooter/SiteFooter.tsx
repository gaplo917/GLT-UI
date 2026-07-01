import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { Stack } from '../../atoms/Stack/Stack.js';

export interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

/**
 * A page footer landmark. Lays its children out as a centered, wrapping row via
 * the Stack atom so the copyright note and secondary links stay spaced apart
 * (and stack cleanly on mobile) instead of running together.
 */
export function SiteFooter({ children, className, ...props }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        'border-t border-[var(--border-color)] py-10 text-base text-[var(--secondary-text-color)]',
        className
      )}
      {...props}
    >
      <Stack direction="row" gap={4} wrap align="center" justify="center">
        {children}
      </Stack>
    </footer>
  );
}

export default SiteFooter;
