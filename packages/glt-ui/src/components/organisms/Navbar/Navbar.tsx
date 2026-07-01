'use client';

import * as React from 'react';
import { cn } from '../../../lib/cn.js';

/** Breakpoint below which the menu collapses behind the burger. Fixed at `md`. */
interface NavbarContextValue {
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

const NavbarContext = React.createContext<NavbarContextValue | null>(null);

function useNavbar(): NavbarContextValue {
  const ctx = React.useContext(NavbarContext);
  if (!ctx) throw new Error('Navbar sub-components must be used within <Navbar>.');
  return ctx;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Accessible label for the landmark. Defaults to "Main navigation". */
  label?: string;
}

/**
 * A responsive, composable horizontal navigation bar. Build it from a
 * `NavbarBrand` (always visible, holds the logo + burger) and a `NavbarMenu`
 * that splits into `NavbarStart` and `NavbarEnd`. Below the `md` breakpoint the
 * menu collapses behind the `NavbarBurger`; from `md` up it sits inline.
 */
export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, label = 'Main navigation', children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const toggle = React.useCallback(() => setOpen((o) => !o), []);
    const value = React.useMemo<NavbarContextValue>(() => ({ open, toggle, setOpen }), [open, toggle]);
    return (
      <NavbarContext.Provider value={value}>
        <nav
          ref={ref}
          aria-label={label}
          className={cn(
            'relative flex flex-col border-b border-[var(--border-color)] bg-[var(--card-bg-color)] text-[var(--text-color)] md:min-h-[3.25rem] md:flex-row md:items-stretch',
            className
          )}
          {...props}
        >
          {children}
        </nav>
      </NavbarContext.Provider>
    );
  }
);
Navbar.displayName = 'Navbar';

/**
 * The always-visible left side of the bar. Holds branding (logo, home link) and
 * the burger, which it pushes to the far right on mobile.
 */
export const NavbarBrand = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex min-h-[3.25rem] shrink-0 items-stretch justify-between', className)}
      {...props}
    />
  )
);
NavbarBrand.displayName = 'NavbarBrand';

/** The hamburger toggle. Hidden from `md` up; toggles the collapsed menu. */
export const NavbarBurger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { open, toggle } = useNavbar();
    return (
      <button
        ref={ref}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          'flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center text-[var(--text-color)] transition-colors hover:bg-[var(--border-color)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-primary)] md:hidden',
          className
        )}
        {...props}
      >
        <span aria-hidden="true" className="relative flex h-4 w-5 flex-col justify-between">
          <span className={cn('h-0.5 w-full rounded bg-current transition-transform', open && 'translate-y-[7px] rotate-45')} />
          <span className={cn('h-0.5 w-full rounded bg-current transition-opacity', open && 'opacity-0')} />
          <span className={cn('h-0.5 w-full rounded bg-current transition-transform', open && '-translate-y-[7px] -rotate-45')} />
        </span>
      </button>
    );
  }
);
NavbarBurger.displayName = 'NavbarBurger';

/**
 * The collapsible menu region. Hidden on mobile until the burger opens it;
 * always visible and laid out horizontally from `md` up. Compose it from
 * `NavbarStart` (pinned left) and `NavbarEnd` (pinned right).
 */
export const NavbarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { open } = useNavbar();
    return (
      <div
        ref={ref}
        className={cn(
          'border-t border-[var(--border-color)] py-2 shadow-inner md:flex md:flex-1 md:items-stretch md:border-t-0 md:py-0 md:shadow-none',
          open ? 'block' : 'hidden md:flex',
          className
        )}
        {...props}
      />
    );
  }
);
NavbarMenu.displayName = 'NavbarMenu';

/** The left part of the menu (sits next to the brand on desktop). */
export const NavbarStart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('md:mr-auto md:flex md:items-stretch', className)} {...props} />
  )
);
NavbarStart.displayName = 'NavbarStart';

/** The right part of the menu (pinned to the end of the bar on desktop). */
export const NavbarEnd = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('md:ml-auto md:flex md:items-stretch', className)} {...props} />
  )
);
NavbarEnd.displayName = 'NavbarEnd';

type NavbarItemOwnProps = {
  /** Element to render. Defaults to `a` when `href` is set, otherwise `div`. */
  as?: 'a' | 'div';
  /** Mark the item as the current page. */
  active?: boolean;
  href?: string;
};

export type NavbarItemProps = NavbarItemOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NavbarItemOwnProps>;

const itemBaseClass =
  'flex items-center gap-2 px-4 py-2 text-[var(--text-color)] transition-colors md:py-0';
const itemInteractiveClass = 'hover:bg-[var(--border-color)]/40 hover:text-[var(--strong-text-color)]';
const itemActiveClass = 'bg-[var(--brand-primary)]/10 font-semibold text-[var(--brand-primary)]';

/**
 * A single navbar cell — a link (`a`) or a plain container (`div`). Interactive
 * when rendered as a link or when `onClick` is supplied.
 */
export const NavbarItem = React.forwardRef<HTMLElement, NavbarItemProps>(
  ({ as, active = false, href, className, onClick, ...props }, ref) => {
    const Component = (as ?? (href ? 'a' : 'div')) as React.ElementType;
    const interactive = Component === 'a' || onClick != null;
    return (
      <Component
        ref={ref}
        href={href}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={cn(itemBaseClass, interactive && itemInteractiveClass, active && itemActiveClass, className)}
        {...props}
      />
    );
  }
);
NavbarItem.displayName = 'NavbarItem';

/** A link that sits as the trigger of a dropdown; renders a trailing arrow. */
export const NavbarLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean; open?: boolean }>(
  ({ className, active = false, open = false, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        itemBaseClass,
        itemInteractiveClass,
        'cursor-pointer justify-between',
        active && itemActiveClass,
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className={cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-180')}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
);
NavbarLink.displayName = 'NavbarLink';

export interface NavbarDropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Trigger label rendered in the `NavbarLink`. */
  label: React.ReactNode;
  /** Mark the trigger as active/current. */
  active?: boolean;
  /** Align the desktop dropdown panel to the right edge of the trigger. */
  align?: 'start' | 'end';
}

/**
 * A dropdown attached to a navbar link. Opens on hover (desktop) or tap
 * (mobile). Fill it with `NavbarItem`s and `NavbarDivider`s.
 */
export const NavbarDropdown = React.forwardRef<HTMLDivElement, NavbarDropdownProps>(
  ({ label, active = false, align = 'start', className, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      if (!open) return;
      const onDocClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDocClick);
        document.removeEventListener('keydown', onKey);
      };
    }, [open]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn('relative md:flex md:items-stretch', className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        <NavbarLink
          role="button"
          aria-haspopup="menu"
          aria-expanded={open}
          active={active}
          open={open}
          onClick={(e) => {
            e.preventDefault();
            setOpen((o) => !o);
          }}
        >
          {label}
        </NavbarLink>
        <div
          role="menu"
          className={cn(
            'flex-col md:absolute md:top-full md:z-30 md:min-w-[15rem] md:rounded-md md:border md:border-[var(--border-color)] md:bg-[var(--card-bg-color)] md:py-2 md:shadow-lg',
            align === 'end' ? 'md:right-0' : 'md:left-0',
            open ? 'flex' : 'hidden',
            // Inset the collapsed (mobile) list so it reads as a sub-group.
            'pl-4 md:pl-0'
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);
NavbarDropdown.displayName = 'NavbarDropdown';

/** A horizontal rule separating items within a dropdown. */
export const NavbarDivider = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cn('my-2 h-px border-0 bg-[var(--border-color)]', className)} {...props} />
  )
);
NavbarDivider.displayName = 'NavbarDivider';

export default Navbar;
