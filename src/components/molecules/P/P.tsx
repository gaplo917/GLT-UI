import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text, type TextProps, type TextSizeProp } from '@/components/atoms/Text/Text.js';

export interface PProps extends Omit<TextProps, 'as' | 'size'> {
  children: React.ReactNode;
  /**
   * Body size (default `lg` for research essays).
   * Use `inherit` for MDX blocks so Quote / layout shell scale is not overridden.
   */
  size?: TextSizeProp;
  /**
   * Rendered element. Default `p`.
   * Use `div` for MDX body blocks that may nest interactive chips (`RefCite`
   * tooltips) — a real `<p>` cannot contain those descendants.
   */
  as?: 'p' | 'div';
}

/**
 * Research essay body paragraph — large leading body type.
 * Authoring shorthand over `Text as="p" size="lg"`.
 */
export function P({
  children,
  className,
  size = 'lg',
  as = 'p',
  ...props
}: PProps) {
  const inherit = size === 'inherit';
  return (
    <Text
      as={as}
      size={size}
      className={cn(
        !inherit && 'leading-[1.75]',
        'text-pretty',
        as === 'div' && 'mdx-prose-block',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  );
}

export default P;
