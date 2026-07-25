import type { DocEntry, DocSection } from './types';
import { slimSection } from './sections/slim';
import { PracticalDemo } from './PracticalDemo';

/**
 * Slim docs registry — only components kept for the research portal.
 */
const entryById = new Map<string, DocEntry>();
for (const e of slimSection.entries) entryById.set(e.id, e);

function layer(id: string, title: string, blurb: string, ids: string[]): DocSection {
  const entries = ids.map((eid) => entryById.get(eid)).filter((e): e is DocEntry => e != null);
  return { id, title, blurb, entries };
}

const atomsSection = layer('atoms', 'Atoms', 'Indivisible UI primitives.', [
  'text',
  'title',
  'icon',
  'list',
  'container',
  'grid',
  'divider',
  'button',
  'checkbox',
  'badge',
  'spinner',
  'tooltip',
]);

const moleculesSection = layer('molecules', 'Molecules', 'Small composed units.', [
  'callout',
  'quote',
  'figure',
]);

const organismsSection = layer('organisms', 'Organisms', 'Page sections and data.', [
  'card',
  'table',
  'chart',
  'page-hero',
  'site-header',
  'site-footer',
  'process-pipeline',
]);

const pagesSection: DocSection = {
  id: 'pages',
  title: 'Pages',
  blurb: 'Composed demos using the slim surface.',
  entries: [
    {
      id: 'practical-research',
      name: 'Research briefing (slim)',
      description:
        'End-to-end composition using only components the research portal keeps.',
      examples: [
        {
          title: 'Live composition',
          description: 'PageHero, Callout, Quote, ProcessPipeline, Chart, Table, Card.',
          code: '// see PracticalDemo.tsx',
          render: <PracticalDemo />,
        },
      ],
    },
  ],
};

export const docSections: DocSection[] = [
  atomsSection,
  moleculesSection,
  organismsSection,
  pagesSection,
];
