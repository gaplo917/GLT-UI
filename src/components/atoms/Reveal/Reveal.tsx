'use client';

import * as React from 'react';
import { cn } from '../../../lib/cn.js';
import { useInView } from '../../../lib/motion.js';

export type RevealAnimation = 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom';

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Entrance style. Defaults to `fade-up`. */
  animation?: RevealAnimation;
  /** Delay before animating in, in ms — stagger siblings with increasing values. */
  delay?: number;
  /** Animation duration in ms. Defaults to 600. */
  duration?: number;
  /** Re-animate every time it re-enters the viewport. Defaults to false (animate once). */
  repeat?: boolean;
}

const hiddenClasses: Record<RevealAnimation, string> = {
  fade: 'opacity-0',
  'fade-up': 'opacity-0 translate-y-4',
  'fade-down': 'opacity-0 -translate-y-4',
  'fade-left': 'opacity-0 translate-x-4',
  'fade-right': 'opacity-0 -translate-x-4',
  zoom: 'opacity-0 scale-95',
};

/**
 * Scroll-triggered entrance wrapper. Children start hidden/offset and ease into
 * place the first time they enter the viewport. Honors `prefers-reduced-motion`
 * (via Tailwind's `motion-reduce:` variant) by rendering fully visible with no
 * transition. Stagger a list by passing an increasing `delay` per item.
 */
export const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  ({ animation = 'fade-up', delay = 0, duration = 600, repeat = false, className, style, children, ...props }, forwardedRef) => {
    const [ref, inView] = useInView<HTMLDivElement>({ once: !repeat });

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef, ref]
    );

    return (
      <div
        ref={setRefs}
        className={cn(
          'transition-all ease-out will-change-[transform,opacity]',
          'motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100',
          inView ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : hiddenClasses[animation],
          className
        )}
        style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms`, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Reveal.displayName = 'Reveal';

export default Reveal;
