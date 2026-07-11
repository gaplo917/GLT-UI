import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max width constraint */
  max?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxMap = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, max = 'xl', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mx-auto w-full px-4 sm:px-6', maxMap[max], className)}
      {...props}
    >
      {children}
    </div>
  )
);
Container.displayName = 'Container';
export default Container;
