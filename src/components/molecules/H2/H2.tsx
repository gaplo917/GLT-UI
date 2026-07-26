import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text, type TextProps } from '@/components/atoms/Text/Text.js';

export type H2Props = Omit<TextProps, 'as'>;

/**
 * Research essay section heading — `Text as="h2"` with section defaults.
 * Default: `size="3xl"` / `weight="semibold"` / `tone="strong"`.
 */
export function H2({
  children,
  className,
  size = '3xl',
  weight = 'semibold',
  tone = 'strong',
  ...props
}: H2Props) {
  return (
    <Text
      as="h2"
      size={size}
      weight={weight}
      tone={tone}
      className={cn('pt-4 leading-tight tracking-tight', className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export default H2;
