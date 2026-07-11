import * as React from 'react';
import type { DocEntry, DocSection } from './types';
import { layoutSection } from './sections/layout';
import { typographySection } from './sections/typography';
import { actionsSection } from './sections/actions';
import { formsSection } from './sections/forms';
import { dataSection } from './sections/data';
import { feedbackSection } from './sections/feedback';
import { navigationSection } from './sections/navigation';
import { siteSection } from './sections/site';
import { PracticalDemo } from './PracticalDemo';

/**
 * The docs are authored in feature-oriented section files, but presented in the
 * sidebar by Atomic Design layer. We flatten every authored entry into an id →
 * entry map, then re-bucket the ids into atomic layers below.
 * See https://atomicdesign.bradfrost.com/chapter-2/
 */
const authoredSections: DocSection[] = [
  layoutSection,
  typographySection,
  actionsSection,
  formsSection,
  dataSection,
  feedbackSection,
  navigationSection,
  siteSection,
];

const entryById = new Map<string, DocEntry>();
for (const s of authoredSections) for (const e of s.entries) entryById.set(e.id, e);

/** Build a layer section from an ordered list of entry ids, skipping any gaps. */
function layer(id: string, title: string, blurb: string, ids: string[]): DocSection {
  const entries = ids.map((eid) => entryById.get(eid)).filter((e): e is DocEntry => e != null);
  return { id, title, blurb, entries };
}

/** Atoms — indivisible primitives: a single element or the smallest wrapper. */
const atomsSection = layer('atoms', 'Atoms', 'Indivisible UI primitives.', [
  // text & content
  'text', 'title', 'heading', 'code', 'label', 'icon', 'content', 'markdown', 'list', 'block',
  // layout
  'box', 'container', 'grid', 'surface', 'divider', 'level', 'media-object',
  // controls
  'button', 'delete-button', 'text-input', 'text-area', 'select-field', 'checkbox', 'radio', 'switch',
  // display
  'badge', 'avatar', 'progress-bar', 'progress-ring', 'spinner', 'skeleton', 'sparkline', 'count-up', 'tooltip', 'image-placeholder', 'site-nav-link',
  // motion
  'reveal',
]);

/** Molecules — small groups of atoms working as one unit. */
const moleculesSection = layer('molecules', 'Molecules', 'Small groups of atoms working as one unit.', [
  'form-field', 'callout', 'alert', 'message', 'quote',
  'breadcrumb', 'pagination', 'dropdown-menu', 'code-block',
  'stat-metric', 'data-highlight', 'derived-metric', 'figure', 'tag-group', 'site-brand',
]);

/** Organisms — distinct, self-contained sections built from molecules + atoms. */
const organismsSection = layer('organisms', 'Organisms', 'Distinct sections built from molecules and atoms.', [
  'card', 'navbar', 'tabs', 'accordion', 'panel', 'modal',
  'table', 'data-table', 'chart', 'benchmark-chart', 'comparison-slider', 'stat-grid', 'technique-grid',
  'page-hero', 'site-header', 'site-footer', 'simulation-panel',
]);

/** Templates — content-agnostic, page-level layout scaffolds. */
const templatesSection = layer('templates', 'Templates', 'Page-level layout scaffolds.', ['section']);

/** Pages — concrete template instances filled with real content. */
const pagesSection: DocSection = {
  id: 'pages',
  title: 'Pages',
  blurb: 'Concrete instances of templates with real content.',
  entries: [
    {
      id: 'practical-research',
      name: 'Research Briefing',
      description:
        'A complete, interactive research report built end-to-end from glt-ui primitives — hero, live simulation, filtered technique tabs, and expandable evidence. The atomic layers composed into a real production page.',
      custom: <PracticalDemo />,
    },
  ],
};

/** All doc sections, in sidebar order — by Atomic Design layer. */
export const docSections: DocSection[] = [
  atomsSection,
  moleculesSection,
  organismsSection,
  templatesSection,
  pagesSection,
];
