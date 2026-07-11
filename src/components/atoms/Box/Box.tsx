import * as React from 'react';
import { Surface, type SurfacePadding } from '@/components/atoms/Surface/Surface.js';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Inner padding. Defaults to `sm` — the classic compact box. */
  padding?: SurfacePadding;
}

/** Simple padded, centered, bordered surface — the most basic container. */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, padding = 'sm', className, ...props }, ref) => (
    <Surface
      ref={ref}
      tone="plain"
      bordered
      radius="lg"
      padding={padding}
      align="center"
      className={className}
      {...props}
    >
      {children}
    </Surface>
  )
);
Box.displayName = 'Box';

export default Box;
