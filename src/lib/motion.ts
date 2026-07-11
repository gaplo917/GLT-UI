'use client';

import * as React from 'react';

export interface UseInViewOptions {
  /** Stop observing once it first enters the viewport. Defaults to true. */
  once?: boolean;
  /** IntersectionObserver rootMargin. */
  rootMargin?: string;
  /** Visibility ratio that counts as "in view". */
  threshold?: number;
}

/**
 * Observe an element and report when it scrolls into the viewport. Drives the
 * design system's entrance animations (Reveal, CountUp, Sparkline, …). Falls
 * back to `true` when IntersectionObserver is unavailable (SSR/old browsers).
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { once = true, rootMargin = '0px 0px -10% 0px', threshold = 0.2 } = options;
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      // Old browsers / non-DOM environments: reveal immediately on the next tick
      // (deferred so this isn't a synchronous setState inside the effect body).
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView];
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/** Track the user's `prefers-reduced-motion` setting, updating live. */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

/** Ease-out cubic — the house easing for count-ups and bar growth. */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
