'use client';

import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Callout } from '@/components/molecules/Callout/Callout.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { FitContain } from '@/components/molecules/FitContain/FitContain.js';

/** Thumbnail display width (height follows natural aspect of the slide board). */
const THUMB_W = 220;

export type PresentationThumb = {
  id: string;
  num: string;
  label: string;
};

/**
 * Locale-driven chrome for strip + present mode.
 * Templates may use {n}, {total}, {num}, {label}, {current}.
 */
export type PresentationStripChrome = {
  prev?: string;
  next?: string;
  openFullScreen?: string;
  /** e.g. "Slide {n} of {total}" */
  slideOf?: string;
  footerHint?: string;
  slidesAria?: string;
  prevAria?: string;
  nextAria?: string;
  /** e.g. "Slide {num}: {label}. Double-click to present." */
  thumbAria?: string;
  close?: string;
};

export type PresentationStripProps = {
  slides: readonly PresentationThumb[];
  /** Render full slide body for index (host supplies content). */
  renderSlide: (index: number, slide: PresentationThumb) => React.ReactNode;
  /** Callout overline. Default "Presentation". */
  label?: React.ReactNode;
  /** Callout title. */
  title?: React.ReactNode;
  /** Short description under the title. */
  description?: React.ReactNode;
  /** Dialog header title. Defaults to title or "Presentation". */
  dialogTitle?: React.ReactNode;
  /** Natural slide width. Default 960. */
  slideNaturalW?: number;
  /** Natural slide height. Default 540. */
  slideNaturalH?: number;
  /** Locale-driven Prev/Next/fullscreen/aria strings. */
  chrome?: PresentationStripChrome;
  className?: string;
};

function fillTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] != null ? String(vars[key]) : `{${key}}`,
  );
}

function ThumbnailCard({
  slide,
  index,
  selected,
  onSelect,
  onOpen,
  renderSlide,
  naturalW,
  naturalH,
  thumbAriaTemplate,
}: {
  slide: PresentationThumb;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  renderSlide: (index: number, slide: PresentationThumb) => React.ReactNode;
  naturalW: number;
  naturalH: number;
  thumbAriaTemplate: string;
}) {
  const thumbH = (THUMB_W * naturalH) / naturalW;
  const ariaLabel = fillTemplate(thumbAriaTemplate, {
    num: slide.num,
    n: slide.num,
    label: slide.label,
  });

  return (
    // div (not button): slide previews may contain interactive controls.
    // Nested <button> breaks hydration and a11y.
    <div
      role="button"
      tabIndex={0}
      data-testid={`presentation-slide-thumb-${slide.id}`}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-current={selected ? 'true' : undefined}
      aria-label={ariaLabel}
      className={cn(
        'group relative shrink-0 cursor-pointer snap-start overflow-hidden rounded-lg border text-left outline-none transition',
        'focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-color)]',
        selected
          ? 'border-[var(--brand-primary)] shadow-[0_0_0_1px_var(--brand-primary)]'
          : 'border-[var(--border-color)] hover:border-[var(--brand-primary)]/50',
      )}
      style={{ width: THUMB_W, height: thumbH + 28 }}
    >
      <div
        className="pointer-events-none overflow-hidden bg-[var(--card-bg-color)]"
        style={{ width: THUMB_W, height: thumbH }}
        aria-hidden
      >
        <FitContain naturalW={naturalW} naturalH={naturalH} pad={0} className="h-full w-full">
          {renderSlide(index, slide)}
        </FitContain>
      </div>
      <div
        className={cn(
          'flex items-center justify-between gap-2 border-t px-2 py-1',
          selected
            ? 'border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/10'
            : 'border-[var(--border-color)] bg-[var(--bg-color)]/80',
        )}
      >
        <span className="truncate text-[11px] font-semibold text-[var(--strong-text-color)]">
          <span className="tabular-nums text-[var(--brand-primary)]">{slide.num}</span>{' '}
          {slide.label}
        </span>
      </div>
    </div>
  );
}

/**
 * Multi-page presentation strip: horizontal thumbnails + fullscreen present
 * mode with back/forward navigation. Host supplies slide content via
 * `renderSlide` — no product copy or chart data lives in the kit.
 */
export function PresentationStrip({
  slides,
  renderSlide,
  label = 'Presentation',
  title,
  description,
  dialogTitle,
  slideNaturalW = 960,
  slideNaturalH = 540,
  chrome,
  className,
}: PresentationStripProps) {
  const titleId = React.useId();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  /** Which fullscreen edge nav is hovered / keyboard-focused. */
  const [edgeNav, setEdgeNav] = React.useState<'prev' | 'next' | null>(null);
  const total = slides.length;
  const current = slides[index] ?? slides[0];

  const prevLabel = chrome?.prev ?? '← Prev';
  const nextLabel = chrome?.next ?? 'Next →';
  const openFullScreen = chrome?.openFullScreen ?? 'Open full screen';
  const slideOfTemplate = chrome?.slideOf ?? 'Slide {n} of {total}';
  const footerHint =
    chrome?.footerHint ??
    'Double-click a thumbnail or use Open full screen to present. Arrow keys work in full screen.';
  const slidesAria = chrome?.slidesAria ?? 'Presentation slides';
  const prevAria = chrome?.prevAria ?? 'Previous slide';
  const nextAria = chrome?.nextAria ?? 'Next slide';
  const thumbAria =
    chrome?.thumbAria ?? 'Slide {num}: {label}. Double-click to present.';
  const closeLabel = chrome?.close ?? 'Close';

  const go = React.useCallback(
    (next: number) => {
      if (total < 1) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const prev = React.useCallback(() => go(index - 1), [go, index]);
  const next = React.useCallback(() => go(index + 1), [go, index]);

  const openAt = React.useCallback((i: number) => {
    setIndex(i);
    const d = dialogRef.current;
    if (!d) return;
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
    setDialogOpen(true);
  }, []);

  const open = React.useCallback(() => openAt(index), [openAt, index]);

  const close = React.useCallback(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (typeof d.close === 'function') d.close();
    else d.removeAttribute('open');
    setDialogOpen(false);
  }, []);

  React.useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => setDialogOpen(false);
    d.addEventListener('close', onClose);
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    d.addEventListener('cancel', onCancel);
    return () => {
      d.removeEventListener('close', onClose);
      d.removeEventListener('cancel', onCancel);
    };
  }, [close]);

  React.useEffect(() => {
    if (!dialogOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        go(index + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialogOpen, go, index]);

  // Keep selected thumbnail in view in the strip
  React.useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !current) return;
    const el = strip.querySelector<HTMLElement>(
      `[data-testid="presentation-slide-thumb-${current.id}"]`,
    );
    el?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
  }, [current]);

  if (total < 1 || !current) {
    return null;
  }

  const calloutLabel = typeof label === 'string' ? label : undefined;
  const dialogHeading = dialogTitle ?? title ?? 'Presentation';
  const slideOfText = fillTemplate(slideOfTemplate, {
    n: current.num,
    current: current.num,
    total,
    num: current.num,
    label: current.label,
  });

  return (
    <Callout
      variant="fact"
      appearance="soft"
      size="md"
      label={calloutLabel}
      title={title}
      icon={false}
      className={cn('min-w-0', className)}
      data-testid="presentation-strip"
    >
      {label != null && typeof label !== 'string' ? (
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text-color)]">
          {label}
        </div>
      ) : null}

      {description != null && (
        <Text as="p" size="sm" tone="secondary" className="mb-3 leading-relaxed">
          {description}
        </Text>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="m-0 text-xs font-medium tabular-nums text-[var(--secondary-text-color)]">
            {slideOfText}
            <span className="mx-1.5 text-[var(--border-color)]">·</span>
            <span className="text-[var(--strong-text-color)]">{current.label}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="presentation-prev"
              onClick={prev}
              className="rounded-full border border-[var(--border-color)] bg-[var(--card-bg-color)] px-3 py-1.5 text-xs font-medium text-[var(--text-color)] hover:border-[var(--brand-primary)]/50"
              aria-label={prevAria}
            >
              {prevLabel}
            </button>
            <button
              type="button"
              data-testid="presentation-next"
              onClick={next}
              className="rounded-full border border-[var(--border-color)] bg-[var(--card-bg-color)] px-3 py-1.5 text-xs font-medium text-[var(--text-color)] hover:border-[var(--brand-primary)]/50"
              aria-label={nextAria}
            >
              {nextLabel}
            </button>
            <button
              type="button"
              data-testid="presentation-open"
              onClick={open}
              className="rounded-full border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-primary-foreground,#111)] shadow-sm"
            >
              {openFullScreen}
            </button>
          </div>
        </div>

        <div
          ref={stripRef}
          data-testid="presentation-strip-thumbs"
          className={cn(
            'flex gap-3 overflow-x-auto pb-1 pt-0.5',
            'snap-x snap-mandatory scroll-px-1',
            '[scrollbar-width:thin]',
          )}
          role="listbox"
          aria-label={slidesAria}
        >
          {slides.map((slide, i) => (
            <ThumbnailCard
              key={slide.id}
              slide={slide}
              index={i}
              selected={i === index}
              onSelect={() => setIndex(i)}
              onOpen={() => openAt(i)}
              renderSlide={renderSlide}
              naturalW={slideNaturalW}
              naturalH={slideNaturalH}
              thumbAriaTemplate={thumbAria}
            />
          ))}
        </div>

        <p className="m-0 text-center text-[11px] text-[var(--secondary-text-color)]">
          {footerHint}
        </p>
      </div>

      <dialog
        ref={dialogRef}
        data-testid="presentation-dialog"
        aria-labelledby={titleId}
        className={cn(
          'fixed inset-0 z-[80] m-0 h-full max-h-none w-full max-w-none',
          'border-0 bg-[var(--bg-color)] p-0 text-[var(--text-color)]',
          'open:flex open:flex-col',
        )}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border-color)] px-3 py-2 sm:px-5">
          <div className="min-w-0">
            <p
              id={titleId}
              className="truncate text-sm font-semibold tracking-tight text-[var(--strong-text-color)]"
            >
              {dialogHeading}
            </p>
            <p className="text-xs text-[var(--secondary-text-color)]">
              <span className="tabular-nums">
                {current.num}/{slides[total - 1]?.num ?? total}
              </span>{' '}
              · {current.label}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              data-testid="presentation-dialog-prev"
              onClick={prev}
              className="rounded-full border border-[var(--border-color)] bg-[var(--card-bg-color)] px-3 py-1.5 text-sm font-medium"
              aria-label={prevAria}
            >
              ←
            </button>
            <button
              type="button"
              data-testid="presentation-dialog-next"
              onClick={next}
              className="rounded-full border border-[var(--border-color)] bg-[var(--card-bg-color)] px-3 py-1.5 text-sm font-medium"
              aria-label={nextAria}
            >
              →
            </button>
            <button
              type="button"
              data-testid="presentation-dialog-close"
              onClick={close}
              className="rounded-full border border-[var(--border-color)] bg-[var(--card-bg-color)] px-3 py-1.5 text-sm font-medium text-[var(--text-color)]"
            >
              {closeLabel}
            </button>
          </div>
        </div>

        <div
          className="relative min-h-0 flex-1 p-2 sm:p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <FitContain
            active={dialogOpen}
            naturalW={slideNaturalW}
            naturalH={slideNaturalH}
            className="h-full w-full"
          >
            {renderSlide(index, current)}
          </FitContain>

          {/*
            Edge hover zones: translucent prev/next appear when the pointer is
            near the left or right edge (full-height hit target, center slide
            stays free for in-board controls). Inline width/opacity so the
            portal Tailwind scan cannot drop package-only utilities.
          */}
          <button
            type="button"
            data-testid="presentation-edge-prev"
            aria-label={prevAria}
            onClick={prev}
            onMouseEnter={() => setEdgeNav('prev')}
            onMouseLeave={() =>
              setEdgeNav((cur) => (cur === 'prev' ? null : cur))
            }
            onFocus={() => setEdgeNav('prev')}
            onBlur={() => setEdgeNav((cur) => (cur === 'prev' ? null : cur))}
            className="absolute inset-y-0 left-0 z-10 flex cursor-w-resize items-center justify-start border-0 bg-transparent p-0 pl-3 outline-none focus-visible:outline-none"
            style={{ width: 'min(7.5rem, 14%)' }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: edgeNav === 'prev' ? 1 : 0,
                transition: 'opacity 180ms ease',
                background:
                  'linear-gradient(to right, color-mix(in srgb, var(--bg-color) 55%, transparent), transparent)',
              }}
            />
            <span
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] text-lg font-semibold text-[var(--strong-text-color)] shadow-md"
              style={{
                opacity: edgeNav === 'prev' ? 1 : 0,
                transition: 'opacity 180ms ease',
                backgroundColor:
                  'color-mix(in srgb, var(--card-bg-color) 55%, transparent)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              ←
            </span>
          </button>
          <button
            type="button"
            data-testid="presentation-edge-next"
            aria-label={nextAria}
            onClick={next}
            onMouseEnter={() => setEdgeNav('next')}
            onMouseLeave={() =>
              setEdgeNav((cur) => (cur === 'next' ? null : cur))
            }
            onFocus={() => setEdgeNav('next')}
            onBlur={() => setEdgeNav((cur) => (cur === 'next' ? null : cur))}
            className="absolute inset-y-0 right-0 z-10 flex cursor-e-resize items-center justify-end border-0 bg-transparent p-0 pr-3 outline-none focus-visible:outline-none"
            style={{ width: 'min(7.5rem, 14%)' }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: edgeNav === 'next' ? 1 : 0,
                transition: 'opacity 180ms ease',
                background:
                  'linear-gradient(to left, color-mix(in srgb, var(--bg-color) 55%, transparent), transparent)',
              }}
            />
            <span
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] text-lg font-semibold text-[var(--strong-text-color)] shadow-md"
              style={{
                opacity: edgeNav === 'next' ? 1 : 0,
                transition: 'opacity 180ms ease',
                backgroundColor:
                  'color-mix(in srgb, var(--card-bg-color) 55%, transparent)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              →
            </span>
          </button>
        </div>

        {/* Thumbnail rail in present mode */}
        <div className="shrink-0 border-t border-[var(--border-color)] bg-[var(--bg-color)]/80 px-3 py-2 sm:px-4">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:thin]">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  'shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-medium tabular-nums transition',
                  i === index
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/15 text-[var(--strong-text-color)]'
                    : 'border-[var(--border-color)] text-[var(--secondary-text-color)] hover:border-[var(--brand-primary)]/40',
                )}
              >
                {slide.num} {slide.label}
              </button>
            ))}
          </div>
        </div>
      </dialog>
    </Callout>
  );
}

export default PresentationStrip;
