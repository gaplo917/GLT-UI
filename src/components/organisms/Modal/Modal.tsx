'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Button } from '@/components/atoms/Button/Button.js';
import { Surface } from '@/components/atoms/Surface/Surface.js';

export interface ModalProps {
  triggerLabel: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/**
 * A trigger + overlay dialog, composed from the Button and Surface atoms. The
 * backdrop fades and the panel scales in on open, reversing on close (kept
 * mounted for the exit); both settle instantly under prefers-reduced-motion.
 */
export function Modal({ triggerLabel, children, defaultOpen = false }: ModalProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [mounted, setMounted] = React.useState(defaultOpen);
  const [visible, setVisible] = React.useState(defaultOpen);

  const openModal = React.useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);
  const closeModal = React.useCallback(() => {
    setVisible(false);
    setOpen(false);
  }, []);

  // On open, flip to visible next frame so the entrance transition runs. On
  // close, unmount after the exit transition. Both run in deferred callbacks.
  React.useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    const timer = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(timer);
  }, [open]);

  React.useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mounted, closeModal]);

  return (
    <>
      <Button
        variant="link"
        onClick={openModal}
        className="text-[var(--text-color)] underline hover:text-[var(--brand-primary)]"
      >
        {triggerLabel}
      </Button>
      {mounted && (
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ease-out motion-reduce:transition-none',
            visible ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0'
          )}
          onClick={closeModal}
        >
          <Surface
            tone="plain"
            bordered
            radius="lg"
            padding="lg"
            className={cn(
              'max-w-sm text-base shadow-xl transition-all duration-200 ease-out will-change-[transform,opacity] motion-reduce:transition-none',
              visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={closeModal}>
                Close
              </Button>
            </div>
          </Surface>
        </div>
      )}
    </>
  );
}

export default Modal;
