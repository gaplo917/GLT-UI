import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarShape = 'circle' | 'square';

export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image source; when omitted, initials/fallback render. */
  src?: string;
  alt?: string;
  /** Text fallback (usually initials) shown when no image is provided. */
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Presence indicator dot rendered at the bottom-right. */
  status?: AvatarStatus;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-lg',
};

const shapeClasses: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
};

const statusColors: Record<AvatarStatus, string> = {
  online: 'bg-[var(--color-success)]',
  offline: 'bg-[var(--secondary-text-color)]',
  busy: 'bg-[var(--color-danger)]',
  away: 'bg-[var(--color-warning)]',
};

/** Circular/square user or org avatar with image or initials fallback. */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    { className, src, alt = '', initials, size = 'md', shape = 'circle', status, ...props },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        'relative inline-flex select-none items-center justify-center overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg-color)] font-semibold text-[var(--secondary-text-color)]',
        shapeClasses[shape],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden={!alt}>{initials}</span>
      )}
      {status && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--bg-color)]',
            statusColors[status]
          )}
        />
      )}
    </span>
  )
);
Avatar.displayName = 'Avatar';

export default Avatar;
