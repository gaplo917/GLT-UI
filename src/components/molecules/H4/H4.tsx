import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Title, type TitleProps } from '@/components/atoms/Title/Title.js';

export interface H4Props extends Omit<TitleProps, 'as' | 'size'> {
  children: React.ReactNode;
  /** Title size ladder (default `5` for research minor heads). */
  size?: TitleProps['size'];
}

/**
 * Research essay minor heading (`h4`). Authoring shorthand over `Title`.
 */
export function H4({
  children,
  className,
  size = 5,
  ...props
}: H4Props) {
  return (
    <Title
      as="h4"
      size={size}
      className={cn('pt-2 tracking-tight', className)}
      {...props}
    >
      {children}
    </Title>
  );
}

export default H4;
