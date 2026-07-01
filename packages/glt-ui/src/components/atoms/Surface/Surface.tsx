import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export type SurfaceTone = 'card' | 'muted' | 'brand' | 'plain';
export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg';
export type SurfaceRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SurfaceAlign = 'left' | 'center' | 'right';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Background token. */
  tone?: SurfaceTone;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
  bordered?: boolean;
  align?: SurfaceAlign;
}

const toneClasses: Record<SurfaceTone, string> = {
  card: 'bg-[var(--card-bg-color)] text-[var(--text-color)]',
  muted: 'bg-[var(--border-color)] text-[var(--text-color)]',
  brand: 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]',
  plain: 'bg-[var(--bg-color)] text-[var(--text-color)]',
};

const paddingClasses: Record<SurfacePadding, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
};

const radiusClasses: Record<SurfaceRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const alignClasses: Record<SurfaceAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * A token-filled surface — the general-purpose colored/rounded box behind
 * cells, tiles, and grouped content. Complements Card (structured/elevated)
 * and Box (simple bordered) with a flexible tone/padding/radius API.
 */
export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ tone = 'card', padding = 'md', radius = 'md', bordered = false, align, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        toneClasses[tone],
        paddingClasses[padding],
        radiusClasses[radius],
        bordered && 'border border-[var(--border-color)]',
        align && alignClasses[align],
        className
      )}
      {...props}
    />
  )
);
Surface.displayName = 'Surface';

export default Surface;
