import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text, type TextProps } from '@/components/atoms/Text/Text.js';

export type PProps = Omit<TextProps, 'as'>;

/**
 * Research essay body paragraph — `Text as="p"` with essay defaults.
 * Default: `size="lg"` + relaxed leading.
 */
export function P({
  children,
  className,
  size = 'lg',
  ...props
}: PProps) {
  return (
    <Text
      as="p"
      size={size}
      className={cn(
        size !== 'inherit' && 'leading-[1.75]',
        'text-pretty',
        className,
      )}
      {...props}
    >
      {children}
    </Text>
  );
}

export default P;
