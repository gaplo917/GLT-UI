import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Title, type TitleProps } from '@/components/atoms/Title/Title.js';

export interface H2Props extends Omit<TitleProps, 'as' | 'size'> {
  children: React.ReactNode;
  /** Title size ladder (default `3` for research section heads). */
  size?: TitleProps['size'];
}

/**
 * Research essay section heading (`h2`). Authoring shorthand over `Title`.
 */
export function H2({
  children,
  className,
  size = 3,
  ...props
}: H2Props) {
  return (
    <Title
      as="h2"
      size={size}
      className={cn('pt-4 tracking-tight', className)}
      {...props}
    >
      {children}
    </Title>
  );
}

export default H2;
