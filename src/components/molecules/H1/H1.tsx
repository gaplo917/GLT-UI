import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Title, type TitleProps } from '@/components/atoms/Title/Title.js';

export interface H1Props extends Omit<TitleProps, 'as' | 'size'> {
  children: React.ReactNode;
  /** Title size ladder (default `2` for research page/display heads). */
  size?: TitleProps['size'];
}

/**
 * Research essay top-level heading (`h1`). Authoring shorthand over `Title`.
 * Prefer TopicHeader for route titles; use H1 for in-body display heads.
 */
export function H1({
  children,
  className,
  size = 2,
  ...props
}: H1Props) {
  return (
    <Title
      as="h1"
      size={size}
      className={cn('pt-2 tracking-tight', className)}
      {...props}
    >
      {children}
    </Title>
  );
}

export default H1;
