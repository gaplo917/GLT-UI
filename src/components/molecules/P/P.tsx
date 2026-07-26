import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text, type TextProps } from '@/components/atoms/Text/Text.js';

export interface PProps extends Omit<TextProps, 'as' | 'size'> {
  children: React.ReactNode;
  /** Override body size (default `lg` for research essays). */
  size?: TextProps['size'];
}

/**
 * Research essay body paragraph — large leading body type.
 * Authoring shorthand over `Text as="p" size="lg"`.
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
      className={cn('leading-[1.75]', className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export default P;
