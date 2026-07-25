import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Container } from '@/components/atoms/Container/Container.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { Title } from '@/components/atoms/Title/Title.js';
import {
  ProcessPipeline,
  type ProcessPipelineLoop,
  type ProcessPipelineNode,
} from '@/components/organisms/ProcessPipeline/ProcessPipeline.js';

export type ProcessBandStep = {
  id: string;
  short: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
};

export interface ProcessBandProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Credit row under the intro (avatar + co-author line). */
  credit?: React.ReactNode;
  /** Pipeline diagram nodes. */
  nodes: readonly ProcessPipelineNode[];
  /** Optional quality-loop annotation on the pipeline. */
  loop?: ProcessPipelineLoop;
  /** Step cards under the diagram. */
  steps: readonly ProcessBandStep[];
  headingId?: string;
  /**
   * Extra props forwarded to ProcessPipeline (className, data-*).
   * Looser than ProcessPipelineProps so hosts can attach test hooks.
   */
  pipelineProps?: Record<string, unknown>;
}

/**
 * Two-column process / authorship band: intro + credit left, pipeline diagram
 * and step cards right. All labels and steps are host-supplied props.
 */
export function ProcessBand({
  eyebrow,
  title,
  description,
  credit,
  nodes,
  loop,
  steps,
  headingId = 'process-band-heading',
  pipelineProps,
  className,
  ...props
}: ProcessBandProps) {
  return (
    <section
      className={cn(
        'border-b border-[var(--border-color)] bg-[var(--bg-color)]',
        className
      )}
      aria-labelledby={headingId}
      {...props}
    >
      <Container className="py-14 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          <div className="flex flex-col gap-4 lg:col-span-5 max-w-xl">
            {eyebrow != null && (
              <Text
                as="p"
                size="xs"
                tone="secondary"
                weight="medium"
                className="font-mono uppercase tracking-[0.16em]"
              >
                {eyebrow}
              </Text>
            )}
            <Title
              as="h2"
              id={headingId}
              size={2}
              className="!text-3xl sm:!text-4xl !tracking-[-0.03em] text-[var(--strong-text-color)]"
            >
              {title}
            </Title>
            {description != null && (
              <Text as="p" tone="secondary" className="leading-relaxed text-pretty">
                {description}
              </Text>
            )}
            {credit != null ? credit : null}
          </div>

          <div className="lg:col-span-7 min-w-0">
            <ProcessPipeline
              {...(pipelineProps as object)}
              nodes={[...nodes]}
              loop={loop}
            />
            <ol className="mt-8 m-0 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 p-0">
              {steps.map((step, i) => (
                <li
                  key={step.id}
                  className="flex flex-col gap-1.5 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--card-bg-color)]/50 p-4"
                  data-pipeline-step={step.id}
                >
                  <Text
                    as="span"
                    size="xs"
                    weight="medium"
                    className="font-mono uppercase tracking-[0.12em] text-[var(--brand-primary)]"
                  >
                    Step {String(i + 1).padStart(2, '0')} · {step.short}
                  </Text>
                  <Title as="h3" size={5} className="!text-base !tracking-tight">
                    {step.title}
                  </Title>
                  <Text as="p" size="sm" tone="secondary" className="leading-relaxed">
                    {step.body}
                  </Text>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ProcessBand;
