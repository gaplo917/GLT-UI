import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Title, type TitleProps } from '@/components/atoms/Title/Title.js';

export interface H3Props extends Omit<TitleProps, 'as' | 'size'> {
  children: React.ReactNode;
  /** Title size ladder (default `4` for research subsection heads). */
  size?: TitleProps['size'];
}

/**
 * Research essay subsection heading (`h3`). Authoring shorthand over `Title`.
 */
export function H3({
  children,
  className,
  size = 4,
  ...props
}: H3Props) {
  return (
    <Title
      as="h3"
      size={size}
      className={cn('pt-3 tracking-tight', className)}
      {...props}
    >
      {children}
    </Title>
  );
}

export default H3;
