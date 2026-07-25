'use client';

import * as React from 'react';
import {
  AttentionShiftBars,
  Badge,
  Button,
  Callout,
  Card,
  CardContent,
  CatalogList,
  Chart,
  Checkbox,
  Container,
  CostScoreBoard,
  CostScoreScatter,
  Divider,
  FigureDataTableToggle,
  FullBleedFigure,
  Grid,
  HashScrollCta,
  Icon,
  List,
  ListItem,
  MethodPillars,
  PageHero,
  ProcessBand,
  ProcessPipeline,
  Quote,
  RefCite,
  ResolveRateTrend,
  SectionIntro,
  SiteFooter,
  SiteHeader,
  Spinner,
  SvgRefCite,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
  Tooltip,
  type RefCiteItem,
} from 'glt-ui';
import type { DocSection } from '../types';

/** Fictional demo cites — not portal bibliography data. */
const DEMO_REF_ITEMS: readonly RefCiteItem[] = [
  {
    n: 1,
    author: 'A. North',
    date: '2025-03',
    dateLabel: 'Mar 2025',
    publisher: 'Sample Press',
    title: 'Measuring review throughput in small teams',
    summary: 'Field note on how review latency shapes release cadence.',
  },
  {
    n: 2,
    author: 'B. Vale',
    date: '2024-11',
    dateLabel: 'Nov 2024',
    publisher: 'Toolkit Journal',
    title: 'Harness patterns for long-running agents',
    summary: 'Checklist of evals, hooks, and docs that keep agents honest.',
  },
];

/** Single section documenting every component kept in the slim package. */
export const slimSection: DocSection = {
  id: 'slim',
  title: 'Portal surface',
  blurb: 'Components exported by glt-ui after pruning to research-portal usage.',
  entries: [
    {
      id: 'text',
      name: 'Text',
      description: 'Body copy with size, tone, and weight props.',
      importLine: "import { Text } from 'glt-ui';",
      examples: [
        {
          title: 'Sizes',
          code: '<Text size="lg">Lead</Text>\n<Text>Body</Text>\n<Text size="sm" tone="secondary">Meta</Text>',
          render: (
            <div className="space-y-1">
              <Text size="lg">Lead</Text>
              <Text>Body</Text>
              <Text size="sm" tone="secondary">
                Meta
              </Text>
            </div>
          ),
        },
      ],
    },
    {
      id: 'title',
      name: 'Title',
      description: 'Display headings.',
      importLine: "import { Title } from 'glt-ui';",
      examples: [
        {
          title: 'Title ladder',
          code: '<Title size={2}>Section</Title>\n<Title size={4}>Card</Title>',
          render: (
            <div className="space-y-2">
              <Title size={2}>Section</Title>
              <Title size={4}>Card</Title>
            </div>
          ),
        },
      ],
    },
    {
      id: 'icon',
      name: 'Icon',
      description: 'Glyph wrapper (used by Quote and Callout).',
      importLine: "import { Icon } from 'glt-ui';",
      examples: [
        {
          title: 'Quote mark',
          code: '<Icon icon="“" className="text-[var(--brand-primary)]" />',
          render: <Icon icon={'“'} className="text-4xl text-[var(--brand-primary)]" />,
        },
      ],
    },
    {
      id: 'list',
      name: 'List',
      description: 'Unordered or decimal lists.',
      importLine: "import { List, ListItem } from 'glt-ui';",
      examples: [
        {
          title: 'Items',
          code: '<List><ListItem>One</ListItem><ListItem>Two</ListItem></List>',
          render: (
            <List>
              <ListItem>One</ListItem>
              <ListItem>Two</ListItem>
            </List>
          ),
        },
      ],
    },
    {
      id: 'container',
      name: 'Container',
      description: 'Centered page width constraint.',
      importLine: "import { Container } from 'glt-ui';",
      examples: [
        {
          title: 'Default',
          code: '<Container><Text>Content</Text></Container>',
          render: (
            <Container>
              <Text>Content in container</Text>
            </Container>
          ),
        },
      ],
    },
    {
      id: 'grid',
      name: 'Grid',
      description: 'Responsive CSS grid helper.',
      importLine: "import { Grid } from 'glt-ui';",
      examples: [
        {
          title: 'Two columns',
          code: '<Grid columns={2} gap={4}>…</Grid>',
          render: (
            <Grid columns={2} gap={4}>
              <Text>A</Text>
              <Text>B</Text>
            </Grid>
          ),
        },
      ],
    },
    {
      id: 'divider',
      name: 'Divider',
      description: 'Horizontal rule.',
      importLine: "import { Divider } from 'glt-ui';",
      examples: [
        {
          title: 'Default',
          code: '<Divider />',
          render: <Divider />,
        },
      ],
    },
    {
      id: 'button',
      name: 'Button',
      description: 'Primary actions (transitive via Callout/Card).',
      importLine: "import { Button } from 'glt-ui';",
      examples: [
        {
          title: 'Variants',
          code: '<Button>Primary</Button>\n<Button variant="outline">Outline</Button>',
          render: (
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
            </div>
          ),
        },
      ],
    },
    {
      id: 'checkbox',
      name: 'Checkbox',
      description: 'Filter controls on research charts.',
      importLine: "import { Checkbox } from 'glt-ui';",
      examples: [
        {
          title: 'Checked',
          code: '<Checkbox defaultChecked label="Show models" />',
          render: <Checkbox defaultChecked label="Show models" />,
        },
      ],
    },
    {
      id: 'badge',
      name: 'Badge',
      description: 'Compact status chip.',
      importLine: "import { Badge } from 'glt-ui';",
      examples: [
        {
          title: 'Badge',
          code: '<Badge>Research</Badge>',
          render: <Badge>Research</Badge>,
        },
      ],
    },
    {
      id: 'spinner',
      name: 'Spinner',
      description: 'Loading indicator (used by Button loading state).',
      importLine: "import { Spinner } from 'glt-ui';",
      examples: [
        {
          title: 'Spinner',
          code: '<Spinner />',
          render: <Spinner />,
        },
      ],
    },
    {
      id: 'tooltip',
      name: 'Tooltip',
      description: 'Hover preview for citations.',
      importLine: "import { Tooltip } from 'glt-ui';",
      examples: [
        {
          title: 'Hover me',
          code: '<Tooltip content="Preview"><a href="#">[1]</a></Tooltip>',
          render: (
            <Tooltip content="Reference preview">
              <a href="#ref" className="font-semibold text-[var(--brand-primary)]">
                [1]
              </a>
            </Tooltip>
          ),
        },
      ],
    },
    {
      id: 'callout',
      name: 'Callout',
      description: 'Highlighted note block.',
      importLine: "import { Callout } from 'glt-ui';",
      examples: [
        {
          title: 'Info',
          code: '<Callout title="Note" variant="info">Body</Callout>',
          render: (
            <Callout title="Note" variant="info">
              Body
            </Callout>
          ),
        },
      ],
    },
    {
      id: 'quote',
      name: 'Quote',
      description: 'Editorial pull-quote with cite + source.',
      importLine: "import { Quote } from 'glt-ui';",
      examples: [
        {
          title: 'Attributed',
          code: '<Quote cite="Name, Title@Org" source={<>Venue, Jun 2026</>}>…</Quote>',
          render: (
            <Quote cite="Fiona Fung, Manager of Claude Code@Anthropic" source={<>Lenny’s Podcast, Jun 2026</>}>
              Coding is no longer the bottleneck.
            </Quote>
          ),
        },
      ],
    },
    {
      id: 'figure',
      name: 'FullBleedFigure',
      description: 'Essay figure shell + optional data-table toggle.',
      importLine: "import { FullBleedFigure, FigureDataTableToggle } from 'glt-ui';",
      examples: [
        {
          title: 'Shell',
          code: '<FullBleedFigure title="Figure 1" caption="Caption">…</FullBleedFigure>',
          render: (
            <FullBleedFigure title="Figure 1 · Sample" caption="Caption only.">
              <div className="flex h-24 items-center justify-center text-sm text-[var(--secondary-text-color)]">
                Chart region
              </div>
              <FigureDataTableToggle>
                <Text size="sm">Hidden data table region</Text>
              </FigureDataTableToggle>
            </FullBleedFigure>
          ),
        },
      ],
    },
    {
      id: 'ref-cite',
      name: 'RefCite',
      description:
        'Compact [n] citation markers with hover preview. HTML body, captions, tables.',
      importLine: "import { RefCite, type RefCiteItem } from 'glt-ui';",
      examples: [
        {
          title: 'Inline markers',
          code: `<Text>
  Throughput rose after the harness landed
  <RefCite items={[{ n: 1, author: 'A. North', … }]} />.
</Text>`,
          render: (
            <Text>
              Throughput rose after the harness landed
              <RefCite items={DEMO_REF_ITEMS.slice(0, 1)} />. Two sources can stack
              <RefCite items={DEMO_REF_ITEMS} /> when a claim needs dual backing.
            </Text>
          ),
        },
      ],
    },
    {
      id: 'svg-ref-cite',
      name: 'SvgRefCite',
      description:
        'In-SVG [n] markers via native <a href="#ref-n"> + portaled HTML tooltip.',
      importLine: "import { SvgRefCite, type RefCiteItem } from 'glt-ui';",
      examples: [
        {
          title: 'Diagram footer cites',
          code: `<svg viewBox="0 0 320 80" className="w-full">
  <rect … />
  <SvgRefCite items={items} x={160} y={64} fontSize={11} />
</svg>`,
          render: (
            <svg
              viewBox="0 0 320 80"
              className="w-full max-w-md text-[var(--brand-primary)]"
              role="img"
              aria-label="Sample diagram with citation markers"
            >
              <rect
                x={24}
                y={12}
                width={272}
                height={36}
                rx={6}
                fill="var(--bg-color)"
                stroke="var(--border-color)"
              />
              <text
                x={160}
                y={34}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[var(--strong-text-color)]"
                style={{ fontSize: 12 }}
              >
                Sample diagram region
              </text>
              <SvgRefCite items={DEMO_REF_ITEMS} x={160} y={64} fontSize={11} />
            </svg>
          ),
        },
      ],
    },
    {
      id: 'card',
      name: 'Card',
      description: 'Topic list cards.',
      importLine: "import { Card, CardContent } from 'glt-ui';",
      examples: [
        {
          title: 'Card',
          code: '<Card><CardContent>…</CardContent></Card>',
          render: (
            <Card>
              <CardContent className="p-4">
                <Title size={5}>Topic</Title>
                <Text size="sm" tone="secondary">
                  Deck line
                </Text>
              </CardContent>
            </Card>
          ),
        },
      ],
    },
    {
      id: 'table',
      name: 'Table',
      description: 'Semantic table primitives for figure data.',
      importLine: "import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from 'glt-ui';",
      examples: [
        {
          title: 'Basic',
          code: '<Table>…</Table>',
          render: (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Model</TableHeaderCell>
                  <TableHeaderCell>Score</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>A</TableCell>
                  <TableCell>90</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ),
        },
      ],
    },
    {
      id: 'chart',
      name: 'Chart',
      description: 'Themed Chart.js wrapper.',
      importLine: "import { Chart } from 'glt-ui';",
      examples: [
        {
          title: 'Bar',
          code: '<Chart type="bar" labels={[…]} series={[…]} />',
          render: (
            <Chart
              type="bar"
              labels={['X', 'Y']}
              series={[{ label: 'v', data: [3, 7], color: 'brand' }]}
              height={180}
            />
          ),
        },
      ],
    },
    {
      id: 'page-hero',
      name: 'PageHero',
      description: 'Landing thesis hero.',
      importLine: "import { PageHero } from 'glt-ui';",
      examples: [
        {
          title: 'Hero',
          code: '<PageHero eyebrow="…" title="…" lead="…" />',
          render: (
            <PageHero
              title="Thesis line"
              lead="Short lede under the title."
            />
          ),
        },
      ],
    },
    {
      id: 'site-header',
      name: 'SiteHeader',
      description: 'Portal top chrome.',
      importLine: "import { SiteHeader } from 'glt-ui';",
      examples: [
        {
          title: 'Header',
          code: '<SiteHeader brand={…} actions={…} />',
          render: (
            <SiteHeader
              brand={<Text weight="semibold">GLT Research</Text>}
              actions={<Text size="sm">Theme</Text>}
            />
          ),
        },
      ],
    },
    {
      id: 'site-footer',
      name: 'SiteFooter',
      description: 'Portal footer.',
      importLine: "import { SiteFooter } from 'glt-ui';",
      examples: [
        {
          title: 'Footer',
          code: '<SiteFooter>…</SiteFooter>',
          render: <SiteFooter>powered by GLT-UI</SiteFooter>,
        },
      ],
    },
    {
      id: 'process-pipeline',
      name: 'ProcessPipeline',
      description: 'Horizontal process diagram with optional quality loop.',
      importLine: "import { ProcessPipeline } from 'glt-ui';",
      examples: [
        {
          title: 'Steps',
          code: `<ProcessPipeline
  nodes={[
    { id: 'signal', label: 'Signal', sublabel: 'Sources' },
    { id: 'ship', label: 'Ship', sublabel: 'Publish' },
  ]}
/>`,
          render: (
            <ProcessPipeline
              nodes={[
                { id: 'signal', label: 'Signal', sublabel: 'Sources' },
                { id: 'ship', label: 'Ship', sublabel: 'Publish' },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'section-intro',
      name: 'SectionIntro',
      description: 'Editorial section header: eyebrow, title, description, optional meta.',
      importLine: "import { SectionIntro } from 'glt-ui';",
      examples: [
        {
          title: 'Split layout',
          code: `<SectionIntro
  layout="split"
  eyebrow="Catalog"
  title="Active series"
  description="Open a topic for the full argument."
  meta={<Text size="sm" tone="secondary">2 topics</Text>}
/>`,
          render: (
            <SectionIntro
              layout="split"
              eyebrow="Catalog"
              title="Active series"
              description="Open a topic for the full argument."
              meta={
                <Text as="p" size="sm" tone="secondary" className="font-mono">
                  2 topics
                </Text>
              }
            />
          ),
        },
      ],
    },
    {
      id: 'hash-scroll-cta',
      name: 'HashScrollCta',
      description: 'In-page hash CTA with smooth scroll and URL sync.',
      importLine: "import { HashScrollCta } from 'glt-ui';",
      examples: [
        {
          title: 'Scroll target',
          code: `<HashScrollCta
  targetId="demo-catalog"
  className="font-semibold text-[var(--brand-primary)]"
>
  Browse catalog ↓
</HashScrollCta>`,
          render: (
            <div className="space-y-4">
              <HashScrollCta
                targetId="demo-catalog"
                className="inline-flex items-center gap-2 font-semibold text-[var(--brand-primary)] no-underline"
              >
                Browse catalog
                <span aria-hidden>↓</span>
              </HashScrollCta>
              <div
                id="demo-catalog"
                className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-color)] px-4 py-6 text-sm text-[var(--secondary-text-color)]"
              >
                Demo catalog target
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'catalog-list',
      name: 'CatalogList',
      description: 'Ordered linked catalog cards (topics, series, releases). Host maps domain data.',
      importLine: "import { CatalogList } from 'glt-ui';",
      examples: [
        {
          title: 'Sample items',
          code: `<CatalogList
  ctaLabel="Read the research"
  items={[
    {
      id: 'alpha',
      href: '#alpha',
      title: 'Sample research series',
      summary: 'A fictional topic for the design-system demo.',
      date: '2026-01',
      status: 'active',
      tags: ['demo', 'catalog'],
    },
  ]}
/>`,
          render: (
            <CatalogList
              ctaLabel="Read the research"
              items={[
                {
                  id: 'alpha',
                  href: '#alpha',
                  title: 'Sample research series',
                  summary:
                    'A fictional topic for the design-system demo — not portal registry data.',
                  date: '2026-01',
                  status: 'active',
                  tags: ['demo', 'catalog'],
                },
                {
                  id: 'beta',
                  href: '#beta',
                  title: 'Second sample series',
                  summary: 'Another placeholder card showing multi-item layout.',
                  date: '2026-03',
                  status: 'draft',
                  tags: ['demo'],
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'method-pillars',
      name: 'MethodPillars',
      description: 'Method band: section intro plus equal pillar cards.',
      importLine: "import { MethodPillars } from 'glt-ui';",
      examples: [
        {
          title: 'Three pillars',
          code: `<MethodPillars
  eyebrow="Method"
  title="Built for scrutiny."
  description="Short sample description for the demo."
  pillars={[
    { title: 'Claim', body: 'Open with a thesis.' },
    { title: 'Evidence', body: 'Cite primary sources.' },
    { title: 'Deck', body: 'Ship a walkthrough.' },
  ]}
/>`,
          render: (
            <MethodPillars
              eyebrow="Method"
              title="Built for scrutiny."
              description="Short sample description for the demo — host supplies all copy."
              pillars={[
                { title: 'Claim', body: 'Open with a thesis you can defend.' },
                { title: 'Evidence', body: 'Cite primary sources beside the argument.' },
                { title: 'Deck', body: 'Ship a presentation-ready walkthrough.' },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'process-band',
      name: 'ProcessBand',
      description: 'Authorship / process band: intro column, pipeline diagram, step cards.',
      importLine: "import { ProcessBand } from 'glt-ui';",
      examples: [
        {
          title: 'Sample pipeline',
          code: `<ProcessBand
  eyebrow="Authorship"
  title="How the work is made."
  description="Sample process copy for the design-system demo."
  nodes={[
    { id: 'observe', label: 'Observe', sublabel: 'Field' },
    { id: 'build', label: 'Build', sublabel: 'Harness' },
    { id: 'ship', label: 'Ship', sublabel: 'Publish' },
  ]}
  loop={{ from: 'build', to: 'ship', caption: 'QUALITY LOOP' }}
  steps={[
    { id: 'observe', short: 'Observe', title: 'Watch', body: 'Start from signals.' },
    { id: 'build', short: 'Build', title: 'Research', body: 'Harnessed investigation.' },
    { id: 'ship', short: 'Ship', title: 'Publish', body: 'Release the package.' },
  ]}
/>`,
          render: (
            <ProcessBand
              eyebrow="Authorship"
              title="How the work is made."
              description="Sample process copy for the design-system demo — not portal registry data."
              credit={
                <p className="m-0 font-mono text-sm text-[var(--brand-primary)]">
                  Demo · Co-authored sample
                </p>
              }
              nodes={[
                { id: 'observe', label: 'Observe', sublabel: 'Field' },
                { id: 'build', label: 'Build', sublabel: 'Harness' },
                { id: 'ship', label: 'Ship', sublabel: 'Publish' },
              ]}
              loop={{
                from: 'build',
                to: 'ship',
                caption: 'QUALITY LOOP',
                forwardLabel: 'refine →',
                backLabel: '← feedback',
              }}
              steps={[
                {
                  id: 'observe',
                  short: 'Observe',
                  title: 'Field signals',
                  body: 'Start from real industry signals in the domain of judgment.',
                },
                {
                  id: 'build',
                  short: 'Build',
                  title: 'Harnessed research',
                  body: 'Autonomous research through a multi-agent fact-check loop.',
                },
                {
                  id: 'ship',
                  short: 'Ship',
                  title: 'Publish',
                  body: 'Release a presentation-ready package on the portal.',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'attention-shift-bars',
      name: 'AttentionShiftBars',
      description:
        'Side-by-side horizontal bar charts for before/after attention share. Host supplies slices.',
      importLine: "import { AttentionShiftBars } from 'glt-ui';",
      examples: [
        {
          title: 'Sample slices',
          code: `<AttentionShiftBars
  slices={[
    { key: 'build', label: 'Build', before: 50, after: 18, color: 'brand' },
    { key: 'review', label: 'Review', before: 28, after: 42, color: 'warning' },
    { key: 'plan', label: 'Plan', before: 22, after: 40, color: 'info' },
  ]}
/>`,
          render: (
            <AttentionShiftBars
              slices={[
                {
                  key: 'build',
                  label: 'Build',
                  before: 50,
                  after: 18,
                  color: 'brand',
                },
                {
                  key: 'review',
                  label: 'Review',
                  before: 28,
                  after: 42,
                  color: 'warning',
                },
                {
                  key: 'plan',
                  label: 'Plan',
                  before: 22,
                  after: 40,
                  color: 'info',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'cost-score-scatter',
      name: 'CostScoreScatter',
      description:
        'Scatter of suite cost vs score. Points are host-supplied; no hardcoded models.',
      importLine: "import { CostScoreScatter } from 'glt-ui';",
      examples: [
        {
          title: 'Tiny sample series',
          code: `<CostScoreScatter
  points={[
    {
      model: 'Alpha',
      chartLabel: 'Alpha · high',
      effort: 'high',
      resolveRate: 72,
      costPerTest: 1.2,
      taskCount: 100,
      color: '#3b82f6',
    },
    {
      model: 'Beta',
      chartLabel: 'Beta · max',
      effort: 'max',
      resolveRate: 81,
      costPerTest: 2.5,
      taskCount: 100,
      color: '#22c55e',
    },
  ]}
  height={280}
/>`,
          render: (
            <CostScoreScatter
              points={[
                {
                  model: 'Alpha',
                  chartLabel: 'Alpha · high',
                  effort: 'high',
                  resolveRate: 72,
                  costPerTest: 1.2,
                  taskCount: 100,
                  color: '#3b82f6',
                },
                {
                  model: 'Beta',
                  chartLabel: 'Beta · max',
                  effort: 'max',
                  resolveRate: 81,
                  costPerTest: 2.5,
                  taskCount: 100,
                  color: '#22c55e',
                },
                {
                  model: 'Gamma',
                  chartLabel: 'Gamma · default',
                  effort: 'default',
                  resolveRate: 64,
                  costPerTest: 0.8,
                  taskCount: 100,
                  color: '#a855f7',
                },
              ]}
              height={280}
            />
          ),
        },
      ],
    },
    {
      id: 'cost-score-board',
      name: 'CostScoreBoard',
      description:
        'Filterable cost/score board: benchmark pills, model filter, scatter, optional data table.',
      importLine: "import { CostScoreBoard } from 'glt-ui';",
      examples: [
        {
          title: 'Fictional board',
          code: `<CostScoreBoard
  points={[
    {
      model: 'Alpha',
      chartLabel: 'Alpha · high',
      effort: 'high',
      harness: 'Demo harness',
      benchmark: 'suite-a',
      benchmarkLabel: 'Suite A',
      taskCount: 100,
      resolveRate: 72,
      costPerTest: 1.2,
      totalCost: 120,
      inputPerM: 3,
      outputPerM: 15,
      color: '#3b82f6',
      scoreSource: '#',
      priceSource: '#',
    },
  ]}
/>`,
          render: (
            <CostScoreBoard
              points={[
                {
                  model: 'Alpha',
                  chartLabel: 'Alpha · high',
                  effort: 'high',
                  harness: 'Demo harness',
                  benchmark: 'suite-a',
                  benchmarkLabel: 'Suite A',
                  taskCount: 100,
                  resolveRate: 72,
                  costPerTest: 1.2,
                  totalCost: 120,
                  inputPerM: 3,
                  outputPerM: 15,
                  color: '#3b82f6',
                  scoreSource: '#alpha',
                  priceSource: '#price',
                },
                {
                  model: 'Beta',
                  chartLabel: 'Beta · max',
                  effort: 'max',
                  harness: 'Demo harness',
                  benchmark: 'suite-a',
                  benchmarkLabel: 'Suite A',
                  taskCount: 100,
                  resolveRate: 81,
                  costPerTest: 2.5,
                  totalCost: 250,
                  inputPerM: 5,
                  outputPerM: 25,
                  color: '#22c55e',
                  scoreSource: '#beta',
                  priceSource: '#price',
                },
                {
                  model: 'Alpha',
                  chartLabel: 'Alpha · high',
                  effort: 'high',
                  harness: 'Alt harness',
                  benchmark: 'suite-b',
                  benchmarkLabel: 'Suite B',
                  taskCount: 50,
                  resolveRate: 68,
                  costPerTest: 0.9,
                  totalCost: 45,
                  inputPerM: 3,
                  outputPerM: 15,
                  color: '#3b82f6',
                  scoreSource: '#alpha-b',
                  priceSource: '#price',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'resolve-rate-trend',
      name: 'ResolveRateTrend',
      description:
        'Quarterly resolve-rate scatter with frontier envelope. Optional labelMap for short names.',
      importLine: "import { ResolveRateTrend } from 'glt-ui';",
      examples: [
        {
          title: 'Sample quarters',
          code: `<ResolveRateTrend
  points={[
    { period: '2025 Q1', model: 'Alpha-1', resolveRate: 42 },
    { period: '2025 Q2', model: 'Alpha-2', resolveRate: 55 },
    { period: '2025 Q3', model: 'Beta-1', resolveRate: 71 },
  ]}
  labelMap={{ 'Alpha-1': 'A1', 'Alpha-2': 'A2', 'Beta-1': 'B1' }}
  height={280}
/>`,
          render: (
            <ResolveRateTrend
              points={[
                { period: '2025 Q1', model: 'Alpha-1', resolveRate: 42 },
                { period: '2025 Q2', model: 'Alpha-2', resolveRate: 55 },
                { period: '2025 Q3', model: 'Beta-1', resolveRate: 71 },
              ]}
              labelMap={{
                'Alpha-1': 'A1',
                'Alpha-2': 'A2',
                'Beta-1': 'B1',
              }}
              height={280}
            />
          ),
        },
      ],
    },
  ],
};
