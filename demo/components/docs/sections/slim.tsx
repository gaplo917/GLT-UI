'use client';

import * as React from 'react';
import {
  AgentHarnessDiagram,
  AttentionShiftBars,
  Badge,
  Button,
  Callout,
  Card,
  CardContent,
  CatalogList,
  CausalShiftDiagram,
  Chart,
  Checkbox,
  Cite,
  Container,
  CostScoreBoard,
  CostScoreScatter,
  Divider,
  ExecBriefListItem,
  ExecBriefSheet,
  FeedbackLoopsDiagram,
  FigureDataTableToggle,
  FitContain,
  FullBleedFigure,
  Grid,
  H2,
  HashScrollCta,
  Icon,
  Infographic,
  KnowledgeTreeMap,
  List,
  ListItem,
  MethodPillars,
  MetricSparkBoard,
  P,
  PageHero,
  PresentationBulletList,
  Prose,
  PresentationDecisionCallout,
  PresentationFigureKeypoints,
  PresentationMythGrid,
  PresentationSlideBoard,
  PresentationSlideFrame,
  PresentationStrip,
  PresentationTitlePage,
  ProcessBand,
  ProcessPipeline,
  Quote,
  RefCite,
  ResolveRateTrend,
  SectionIntro,
  SiteFooter,
  SiteHeader,
  Spinner,
  StepLoopFlow,
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
  type PresentationThumb,
  type RefCiteItem,
} from 'glt-ui';
import type { DocSection } from '../types';

/** Compact figure stand-in for presentation demos (not a real chart). */
function DemoFigurePlaceholder({ label = 'Sample figure' }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[100px] w-full items-center justify-center rounded-md border border-dashed border-[var(--brand-primary)]/35 bg-[var(--brand-primary)]/10 px-3 text-center text-xs font-semibold text-[var(--strong-text-color)]">
      {label}
    </div>
  );
}

/** Fictional deck for PresentationStrip demo — no portal product copy. */
const DEMO_PRESENTATION_SLIDES: readonly PresentationThumb[] = [
  { id: 'title', num: '01', label: 'Title' },
  { id: 'plan', num: '02', label: 'Plan' },
  { id: 'close', num: '03', label: 'Close' },
] as const;

const DEMO_SLIDE_COPY: Record<
  string,
  { kicker: string; title: string; bullets: readonly string[]; hideHeader?: boolean }
> = {
  title: {
    kicker: '01 · Sample deck',
    title: 'Northstar toolkit walkthrough',
    bullets: [],
    hideHeader: true,
  },
  plan: {
    kicker: '02 · Plan',
    title: 'Ship the first slice',
    bullets: [
      'Define the success metric before building.',
      'Keep the harness thin until the loop is honest.',
      'Review the high-risk path first.',
    ],
  },
  close: {
    kicker: '03 · Close',
    title: 'What to do next',
    bullets: [
      'Pick one metric the team already owns.',
      'Instrument the review loop this week.',
      'Retire one low-signal status meeting.',
    ],
  },
};

function DemoPresentationSlide({
  slide,
  naturalW = 960,
  naturalH = 540,
}: {
  slide: PresentationThumb;
  naturalW?: number;
  naturalH?: number;
}) {
  const copy = DEMO_SLIDE_COPY[slide.id] ?? DEMO_SLIDE_COPY.plan;
  if (copy.hideHeader) {
    return (
      <PresentationSlideFrame
        slideId={slide.id}
        slideNum={slide.num}
        naturalW={naturalW}
        naturalH={naturalH}
        hideHeader
        className="shadow-sm"
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-10 text-center">
          <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            {copy.kicker}
          </p>
          <h2 className="m-0 mt-5 max-w-[34rem] text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--strong-text-color)]">
            {copy.title}
          </h2>
          <p className="m-0 mt-8 text-[13px] text-[var(--secondary-text-color)]">
            Sample kit demo · host supplies brand meta
          </p>
        </div>
      </PresentationSlideFrame>
    );
  }
  return (
    <PresentationSlideFrame
      slideId={slide.id}
      slideNum={slide.num}
      naturalW={naturalW}
      naturalH={naturalH}
      kicker={copy.kicker}
      title={copy.title}
      brandMeta={
        <>
          kit.demo
          <br />
          <span className="font-normal normal-case tracking-normal">Sample deck</span>
        </>
      }
      className="shadow-sm"
    >
      <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-snug text-[var(--text-color)]">
        {copy.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </PresentationSlideFrame>
  );
}

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
      description: 'Body copy with size, tone, weight, align, as, and truncate props.',
      importLine: "import { Text } from 'glt-ui';",
      examples: [
        {
          title: 'Sizes',
          code: `<div className="space-y-1">
  <Text size="lg">Lead</Text>
  <Text>Body</Text>
  <Text size="sm" tone="secondary">
    Meta
  </Text>
</div>`,
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
        {
          title: 'Tones',
          code: `<div className="space-y-1">
  <Text tone="default">Default</Text>
  <Text tone="secondary">Secondary</Text>
  <Text tone="strong">Strong</Text>
  <Text tone="brand">Brand</Text>
  <Text tone="danger">Danger</Text>
  <Text tone="success">Success</Text>
</div>`,
          render: (
            <div className="space-y-1">
              <Text tone="default">Default</Text>
              <Text tone="secondary">Secondary</Text>
              <Text tone="strong">Strong</Text>
              <Text tone="brand">Brand</Text>
              <Text tone="danger">Danger</Text>
              <Text tone="success">Success</Text>
            </div>
          ),
        },
        {
          title: 'Weights',
          code: `<div className="space-y-1">
  <Text weight="normal">Normal</Text>
  <Text weight="medium">Medium</Text>
  <Text weight="semibold">Semibold</Text>
  <Text weight="bold">Bold</Text>
</div>`,
          render: (
            <div className="space-y-1">
              <Text weight="normal">Normal</Text>
              <Text weight="medium">Medium</Text>
              <Text weight="semibold">Semibold</Text>
              <Text weight="bold">Bold</Text>
            </div>
          ),
        },
        {
          title: 'Align',
          code: `<div className="space-y-1">
  <Text align="left">Left aligned</Text>
  <Text align="center">Center aligned</Text>
  <Text align="right">Right aligned</Text>
</div>`,
          render: (
            <div className="space-y-1">
              <Text align="left">Left aligned</Text>
              <Text align="center">Center aligned</Text>
              <Text align="right">Right aligned</Text>
            </div>
          ),
        },
        {
          title: 'As element',
          code: `<div>
  <Text as="span" size="sm">
    Inline span
  </Text>
  {' · '}
  <Text as="span" size="sm" tone="brand">
    paired span
  </Text>
</div>`,
          render: (
            <div>
              <Text as="span" size="sm">
                Inline span
              </Text>
              {' · '}
              <Text as="span" size="sm" tone="brand">
                paired span
              </Text>
            </div>
          ),
        },
        {
          title: 'Truncate',
          code: `<div className="max-w-[12rem]">
  <Text truncate>
    Long kit label that should ellipsize at the edge of the box
  </Text>
</div>`,
          render: (
            <div className="max-w-[12rem]">
              <Text truncate>
                Long kit label that should ellipsize at the edge of the box
              </Text>
            </div>
          ),
        },
      ],
    },
    {
      id: 'title',
      name: 'Title',
      description: 'Display headings with size and as props.',
      importLine: "import { Title } from 'glt-ui';",
      examples: [
        {
          title: 'Sizes',
          code: `<div className="space-y-2">
  <Title size={2}>Section</Title>
  <Title size={4}>Card</Title>
  <Title size={6}>Eyebrow</Title>
</div>`,
          render: (
            <div className="space-y-2">
              <Title size={2}>Section</Title>
              <Title size={4}>Card</Title>
              <Title size={6}>Eyebrow</Title>
            </div>
          ),
        },
        {
          title: 'As element',
          code: `<div className="space-y-2">
  <Title as="h2" size={3}>
    Semantic h2
  </Title>
  <Title as="p" size={5}>
    Styled as p
  </Title>
</div>`,
          render: (
            <div className="space-y-2">
              <Title as="h2" size={3}>
                Semantic h2
              </Title>
              <Title as="p" size={5}>
                Styled as p
              </Title>
            </div>
          ),
        },
      ],
    },
    {
      id: 'icon',
      name: 'Icon',
      description: 'Glyph wrapper with icon, tone, and optional label.',
      importLine: "import { Icon } from 'glt-ui';",
      examples: [
        {
          title: 'Icon glyph',
          code: '<Icon icon="★" />',
          render: <Icon icon="★" />,
        },
        {
          title: 'Tones',
          code: `<div className="flex flex-wrap items-center gap-4">
  <Icon icon="★" tone="brand" />
  <Icon icon="★" tone="default" />
  <Icon icon="★" tone="secondary" />
  <Icon icon="★" tone="strong" />
</div>`,
          render: (
            <div className="flex flex-wrap items-center gap-4">
              <Icon icon="★" tone="brand" />
              <Icon icon="★" tone="default" />
              <Icon icon="★" tone="secondary" />
              <Icon icon="★" tone="strong" />
            </div>
          ),
        },
        {
          title: 'With label',
          code: '<Icon icon="★" label="Featured" tone="brand" />',
          render: <Icon icon="★" label="Featured" tone="brand" />,
        },
      ],
    },
    {
      id: 'list',
      name: 'List',
      description: 'Unordered or decimal lists with variant, spacing, and as.',
      importLine: "import { List, ListItem } from 'glt-ui';",
      examples: [
        {
          title: 'Disc',
          code: `<List>
  <ListItem>One</ListItem>
  <ListItem>Two</ListItem>
</List>`,
          render: (
            <List>
              <ListItem>One</ListItem>
              <ListItem>Two</ListItem>
            </List>
          ),
        },
        {
          title: 'Variants',
          code: `<div className="space-y-4">
  <List variant="decimal">
    <ListItem>First</ListItem>
    <ListItem>Second</ListItem>
  </List>
  <List variant="none" spacing={2}>
    <ListItem>· Plain</ListItem>
    <ListItem>· Plain</ListItem>
  </List>
</div>`,
          render: (
            <div className="space-y-4">
              <List variant="decimal">
                <ListItem>First</ListItem>
                <ListItem>Second</ListItem>
              </List>
              <List variant="none" spacing={2}>
                <ListItem>· Plain</ListItem>
                <ListItem>· Plain</ListItem>
              </List>
            </div>
          ),
        },
        {
          title: 'Spacing',
          code: `<div className="space-y-4">
  <List spacing={0}>
    <ListItem>Tight A</ListItem>
    <ListItem>Tight B</ListItem>
  </List>
  <List spacing={3}>
    <ListItem>Loose A</ListItem>
    <ListItem>Loose B</ListItem>
  </List>
</div>`,
          render: (
            <div className="space-y-4">
              <List spacing={0}>
                <ListItem>Tight A</ListItem>
                <ListItem>Tight B</ListItem>
              </List>
              <List spacing={3}>
                <ListItem>Loose A</ListItem>
                <ListItem>Loose B</ListItem>
              </List>
            </div>
          ),
        },
        {
          title: 'As element',
          code: `<List as="ol" variant="decimal">
  <ListItem>Explicit ol</ListItem>
  <ListItem>Second step</ListItem>
</List>`,
          render: (
            <List as="ol" variant="decimal">
              <ListItem>Explicit ol</ListItem>
              <ListItem>Second step</ListItem>
            </List>
          ),
        },
      ],
    },
    {
      id: 'container',
      name: 'Container',
      description: 'Centered page width constraint with max prop.',
      importLine: "import { Container } from 'glt-ui';",
      examples: [
        {
          title: 'Default',
          code: `<Container>
  <Text>Content in container</Text>
</Container>`,
          render: (
            <Container>
              <Text>Content in container</Text>
            </Container>
          ),
        },
        {
          title: 'Max widths',
          code: `<div>
  <Container max="sm" className="border border-dashed border-[var(--border-color)] py-2">
    <Text size="sm">max=sm</Text>
  </Container>
  <Container max="md" className="mt-2 border border-dashed border-[var(--border-color)] py-2">
    <Text size="sm">max=md</Text>
  </Container>
  <Container max="lg" className="mt-2 border border-dashed border-[var(--border-color)] py-2">
    <Text size="sm">max=lg</Text>
  </Container>
</div>`,
          render: (
            <div>
              <Container max="sm" className="border border-dashed border-[var(--border-color)] py-2">
                <Text size="sm">max=sm</Text>
              </Container>
              <Container max="md" className="mt-2 border border-dashed border-[var(--border-color)] py-2">
                <Text size="sm">max=md</Text>
              </Container>
              <Container max="lg" className="mt-2 border border-dashed border-[var(--border-color)] py-2">
                <Text size="sm">max=lg</Text>
              </Container>
            </div>
          ),
        },
      ],
    },
    {
      id: 'grid',
      name: 'Grid',
      description: 'Responsive CSS grid helper with columns, mdColumns, and gap.',
      importLine: "import { Grid } from 'glt-ui';",
      examples: [
        {
          title: 'Columns and gap',
          code: `<Grid columns={2} gap={4}>
  <Text>A</Text>
  <Text>B</Text>
</Grid>`,
          render: (
            <Grid columns={2} gap={4}>
              <Text>A</Text>
              <Text>B</Text>
            </Grid>
          ),
        },
        {
          title: 'Responsive mdColumns',
          code: `<Grid columns={1} mdColumns={3} gap={3}>
  <Text>One</Text>
  <Text>Two</Text>
  <Text>Three</Text>
</Grid>`,
          render: (
            <Grid columns={1} mdColumns={3} gap={3}>
              <Text>One</Text>
              <Text>Two</Text>
              <Text>Three</Text>
            </Grid>
          ),
        },
      ],
    },
    {
      id: 'divider',
      name: 'Divider',
      description: 'Horizontal or vertical rule with optional label.',
      importLine: "import { Divider } from 'glt-ui';",
      examples: [
        {
          title: 'Default',
          code: '<Divider />',
          render: <Divider />,
        },
        {
          title: 'Label',
          code: '<Divider label="Or continue" />',
          render: <Divider label="Or continue" />,
        },
        {
          title: 'Vertical',
          code: `<div className="flex h-10 items-stretch gap-3">
  <Text size="sm">Left</Text>
  <Divider orientation="vertical" />
  <Text size="sm">Right</Text>
</div>`,
          render: (
            <div className="flex h-10 items-stretch gap-3">
              <Text size="sm">Left</Text>
              <Divider orientation="vertical" />
              <Text size="sm">Right</Text>
            </div>
          ),
        },
      ],
    },
    {
      id: 'button',
      name: 'Button',
      description: 'Actions with variant, size, icons, loading, and fullWidth.',
      importLine: "import { Button } from 'glt-ui';",
      examples: [
        {
          title: 'Variants',
          code: `<div className="flex flex-wrap gap-2">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
  <Button variant="danger">Danger</Button>
  <Button variant="success">Success</Button>
</div>`,
          render: (
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
            </div>
          ),
        },
        {
          title: 'Sizes',
          code: `<div className="flex flex-wrap items-center gap-2">
  <Button size="xs">XS</Button>
  <Button size="sm">SM</Button>
  <Button size="md">MD</Button>
  <Button size="lg">LG</Button>
  <Button size="icon" aria-label="Star">
    ★
  </Button>
</div>`,
          render: (
            <div className="flex flex-wrap items-center gap-2">
              <Button size="xs">XS</Button>
              <Button size="sm">SM</Button>
              <Button size="md">MD</Button>
              <Button size="lg">LG</Button>
              <Button size="icon" aria-label="Star">
                ★
              </Button>
            </div>
          ),
        },
        {
          title: 'Icons and loading',
          code: `<div className="flex flex-wrap gap-2">
  <Button leftIcon="→">Next</Button>
  <Button rightIcon="↗">Open</Button>
  <Button loading>Saving</Button>
</div>`,
          render: (
            <div className="flex flex-wrap gap-2">
              <Button leftIcon="→">Next</Button>
              <Button rightIcon="↗">Open</Button>
              <Button loading>Saving</Button>
            </div>
          ),
        },
        {
          title: 'Full width',
          code: '<Button fullWidth>Full width action</Button>',
          render: <Button fullWidth>Full width action</Button>,
        },
      ],
    },
    {
      id: 'checkbox',
      name: 'Checkbox',
      description: 'Single checkbox with optional inline label.',
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
      description: 'Compact status chip with variant, size, dot, and removable.',
      importLine: "import { Badge } from 'glt-ui';",
      examples: [
        {
          title: 'Variants',
          code: `<div className="flex flex-wrap gap-2">
  <Badge variant="default">Default</Badge>
  <Badge variant="fact">Fact</Badge>
  <Badge variant="pill">Pill</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="info">Info</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="danger">Danger</Badge>
  <Badge variant="neutral">Neutral</Badge>
</div>`,
          render: (
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="fact">Fact</Badge>
              <Badge variant="pill">Pill</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>
          ),
        },
        {
          title: 'Sizes',
          code: `<div className="flex flex-wrap items-center gap-2">
  <Badge size="sm">Small</Badge>
  <Badge size="md">Medium</Badge>
  <Badge size="lg">Large</Badge>
</div>`,
          render: (
            <div className="flex flex-wrap items-center gap-2">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          ),
        },
        {
          title: 'Dot',
          code: `<Badge dot variant="success">
  Live
</Badge>`,
          render: (
            <Badge dot variant="success">
              Live
            </Badge>
          ),
        },
        {
          title: 'Removable',
          code: `<Badge removable onRemove={() => {}}>
  Filter tag
</Badge>`,
          render: (
            <Badge removable onRemove={() => {}}>
              Filter tag
            </Badge>
          ),
        },
      ],
    },
    {
      id: 'spinner',
      name: 'Spinner',
      description: 'Loading indicator with size, intent, and label.',
      importLine: "import { Spinner } from 'glt-ui';",
      examples: [
        {
          title: 'Sizes',
          code: `<div className="flex flex-wrap items-center gap-4">
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
</div>`,
          render: (
            <div className="flex flex-wrap items-center gap-4">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          ),
        },
        {
          title: 'Intents',
          code: `<div className="flex flex-wrap items-center gap-4">
  <Spinner intent="brand" />
  <Spinner intent="info" />
  <Spinner intent="success" />
  <Spinner intent="warning" />
  <Spinner intent="danger" />
  <span className="text-[var(--brand-primary)]">
    <Spinner intent="current" />
  </span>
</div>`,
          render: (
            <div className="flex flex-wrap items-center gap-4">
              <Spinner intent="brand" />
              <Spinner intent="info" />
              <Spinner intent="success" />
              <Spinner intent="warning" />
              <Spinner intent="danger" />
              <span className="text-[var(--brand-primary)]">
                <Spinner intent="current" />
              </span>
            </div>
          ),
        },
        {
          title: 'Label',
          code: '<Spinner label="Syncing kit" />',
          render: <Spinner label="Syncing kit" />,
        },
      ],
    },
    {
      id: 'tooltip',
      name: 'Tooltip',
      description: 'Hover preview with content and side placement.',
      importLine: "import { Tooltip } from 'glt-ui';",
      examples: [
        {
          title: 'Default side',
          code: `<Tooltip content="Reference preview">
  <a href="#ref" className="font-semibold text-[var(--brand-primary)]">
    [1]
  </a>
</Tooltip>`,
          render: (
            <Tooltip content="Reference preview">
              <a href="#ref" className="font-semibold text-[var(--brand-primary)]">
                [1]
              </a>
            </Tooltip>
          ),
        },
        {
          title: 'Sides',
          code: `<div className="flex flex-wrap gap-6 py-6">
  <Tooltip content="Top tip" side="top">
    <Button size="sm" variant="outline">
      Top
    </Button>
  </Tooltip>
  <Tooltip content="Bottom tip" side="bottom">
    <Button size="sm" variant="outline">
      Bottom
    </Button>
  </Tooltip>
  <Tooltip content="Left tip" side="left">
    <Button size="sm" variant="outline">
      Left
    </Button>
  </Tooltip>
  <Tooltip content="Right tip" side="right">
    <Button size="sm" variant="outline">
      Right
    </Button>
  </Tooltip>
</div>`,
          render: (
            <div className="flex flex-wrap gap-6 py-6">
              <Tooltip content="Top tip" side="top">
                <Button size="sm" variant="outline">
                  Top
                </Button>
              </Tooltip>
              <Tooltip content="Bottom tip" side="bottom">
                <Button size="sm" variant="outline">
                  Bottom
                </Button>
              </Tooltip>
              <Tooltip content="Left tip" side="left">
                <Button size="sm" variant="outline">
                  Left
                </Button>
              </Tooltip>
              <Tooltip content="Right tip" side="right">
                <Button size="sm" variant="outline">
                  Right
                </Button>
              </Tooltip>
            </div>
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
          title: 'Variants',
          description: 'Semantic intent: info, success, warning, tip.',
          code: `<div className="space-y-3">
  <Callout title="Info" variant="info">Throughput holds steady.</Callout>
  <Callout title="Success" variant="success">Harness landed in staging.</Callout>
  <Callout title="Warning" variant="warning">Review queue still open.</Callout>
  <Callout title="Tip" variant="tip">Pin the eval before the model swap.</Callout>
</div>`,
          render: (
            <div className="space-y-3">
              <Callout title="Info" variant="info">
                Throughput holds steady.
              </Callout>
              <Callout title="Success" variant="success">
                Harness landed in staging.
              </Callout>
              <Callout title="Warning" variant="warning">
                Review queue still open.
              </Callout>
              <Callout title="Tip" variant="tip">
                Pin the eval before the model swap.
              </Callout>
            </div>
          ),
        },
        {
          title: 'Appearances',
          description: 'soft, outline, solid, and plain accent treatments.',
          code: `<div className="space-y-3">
  <Callout appearance="soft" variant="info" title="Soft">
    Soft fill with left accent stripe.
  </Callout>
  <Callout appearance="outline" variant="info" title="Outline">
    Outline border only.
  </Callout>
  <Callout appearance="solid" variant="info" title="Solid">
    Solid accent fill.
  </Callout>
  <Callout appearance="plain" variant="info" title="Plain">
    Plain stripe, no fill.
  </Callout>
</div>`,
          render: (
            <div className="space-y-3">
              <Callout appearance="soft" variant="info" title="Soft">
                Soft fill with left accent stripe.
              </Callout>
              <Callout appearance="outline" variant="info" title="Outline">
                Outline border only.
              </Callout>
              <Callout appearance="solid" variant="info" title="Solid">
                Solid accent fill.
              </Callout>
              <Callout appearance="plain" variant="info" title="Plain">
                Plain stripe, no fill.
              </Callout>
            </div>
          ),
        },
        {
          title: 'Sizes',
          description: 'sm, md (default), and lg density.',
          code: `<div className="space-y-3">
  <Callout size="sm" title="Small" variant="note">
    Compact density for tight sidebars.
  </Callout>
  <Callout size="md" title="Medium" variant="note">
    Default body density.
  </Callout>
  <Callout size="lg" title="Large" variant="note">
    Roomier band for lead notes.
  </Callout>
</div>`,
          render: (
            <div className="space-y-3">
              <Callout size="sm" title="Small" variant="note">
                Compact density for tight sidebars.
              </Callout>
              <Callout size="md" title="Medium" variant="note">
                Default body density.
              </Callout>
              <Callout size="lg" title="Large" variant="note">
                Roomier band for lead notes.
              </Callout>
            </div>
          ),
        },
        {
          title: 'Label + custom icon',
          description: 'Uppercase overline label; override default glyph with icon.',
          code: `<Callout
  label="Field note"
  title="Review latency"
  variant="fact"
  icon="⏱"
>
  Teams that timed review gates cut release lag in half.
</Callout>`,
          render: (
            <Callout label="Field note" title="Review latency" variant="fact" icon="⏱">
              Teams that timed review gates cut release lag in half.
            </Callout>
          ),
        },
        {
          title: 'Icon hidden',
          description: 'Pass icon={false} to suppress the leading glyph.',
          code: `<Callout title="Quiet note" variant="note" icon={false}>
  Body only — no leading glyph.
</Callout>`,
          render: (
            <Callout title="Quiet note" variant="note" icon={false}>
              Body only — no leading glyph.
            </Callout>
          ),
        },
        {
          title: 'Dismissible',
          description: 'dismissible + onDismiss; the block removes itself on click.',
          code: `<Callout
  title="Closeable notice"
  variant="warning"
  dismissible
  onDismiss={() => {
    console.log('callout dismissed');
  }}
>
  Dismiss when the reader has absorbed the note.
</Callout>`,
          render: (
            <Callout
              title="Closeable notice"
              variant="warning"
              dismissible
              onDismiss={() => {
                console.log('callout dismissed');
              }}
            >
              Dismiss when the reader has absorbed the note.
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
          title: 'Attributed (highlight, lg)',
          description: 'Default highlight variant at large size with cite + source.',
          code: `<Quote
  cite="A. North, Lead@Northstar"
  source={<>Sample podcast, 2026</>}
  variant="highlight"
  size="lg"
>
  Ship the harness before the model.
</Quote>`,
          render: (
            <Quote
              cite="A. North, Lead@Northstar"
              source={<>Sample podcast, 2026</>}
              variant="highlight"
              size="lg"
            >
              Ship the harness before the model.
            </Quote>
          ),
        },
        {
          title: 'Bordered + md',
          description: 'Left-border variant at medium size.',
          code: `<Quote
  cite="B. Vale, Principal@Toolkit"
  source={<>Toolkit Journal, Nov 2024</>}
  variant="bordered"
  size="md"
>
  Keep the eval honest before you scale the loop.
</Quote>`,
          render: (
            <Quote
              cite="B. Vale, Principal@Toolkit"
              source={<>Toolkit Journal, Nov 2024</>}
              variant="bordered"
              size="md"
            >
              Keep the eval honest before you scale the loop.
            </Quote>
          ),
        },
        {
          title: 'Plain',
          description: 'Plain variant — serif quote without border or fill.',
          code: `<Quote
  cite="C. Reed, Editor@Sample Press"
  source={<>Sample Press, Mar 2025</>}
  variant="plain"
  size="md"
>
  Judgment stays limited; the harness carries the rest.
</Quote>`,
          render: (
            <Quote
              cite="C. Reed, Editor@Sample Press"
              source={<>Sample Press, Mar 2025</>}
              variant="plain"
              size="md"
            >
              Judgment stays limited; the harness carries the rest.
            </Quote>
          ),
        },
      ],
    },
    {
      id: 'cite',
      name: 'Cite',
      description:
        'In-prose external citation link (underlined brand). Distinct from RefCite [n] markers.',
      importLine: "import { Cite } from 'glt-ui';",
      examples: [
        {
          title: 'External link',
          description: 'href + children; external defaults to target blank + noreferrer.',
          code: `<P>
  See the{' '}
  <Cite href="https://example.com/paper">Northstar field note</Cite>
  {' '}for the full method.
</P>`,
          render: (
            <P>
              See the{' '}
              <Cite href="https://example.com/paper">Northstar field note</Cite>{' '}
              for the full method.
            </P>
          ),
        },
        {
          title: 'Same-tab link',
          description: 'external={false} keeps navigation in the current tab.',
          code: `<Cite href="#refs" external={false}>
  Jump to references
</Cite>`,
          render: (
            <Cite href="#refs" external={false}>
              Jump to references
            </Cite>
          ),
        },
      ],
    },
    {
      id: 'prose',
      name: 'Prose',
      description: 'Vertical stack for essay body blocks with fixed research rhythm.',
      importLine: "import { Prose, P, H2 } from 'glt-ui';",
      examples: [
        {
          title: 'Default gap',
          description: 'gap defaults to 5 (space-y-5).',
          code: `<Prose>
  <H2>Section</H2>
  <P>First body paragraph for the sample essay.</P>
  <P>Second paragraph sits on the research rhythm stack.</P>
</Prose>`,
          render: (
            <Prose>
              <H2>Section</H2>
              <P>First body paragraph for the sample essay.</P>
              <P>Second paragraph sits on the research rhythm stack.</P>
            </Prose>
          ),
        },
        {
          title: 'Tighter gap',
          description: 'gap={3} for denser stacks.',
          code: `<Prose gap={3}>
  <P>Compact first line.</P>
  <P>Compact second line.</P>
</Prose>`,
          render: (
            <Prose gap={3}>
              <P>Compact first line.</P>
              <P>Compact second line.</P>
            </Prose>
          ),
        },
      ],
    },
    {
      id: 'p',
      name: 'P',
      description: 'Research essay body paragraph (Text as p, size lg, leading 1.75).',
      importLine: "import { P } from 'glt-ui';",
      examples: [
        {
          title: 'Default body',
          code: `<P>
  Judgment stays limited when execution gets cheap.
</P>`,
          render: (
            <P>Judgment stays limited when execution gets cheap.</P>
          ),
        },
        {
          title: 'Size override + tone',
          description: 'size and tone passthrough to Text.',
          code: `<P size="base" tone="secondary">
  Smaller secondary paragraph for asides.
</P>`,
          render: (
            <P size="base" tone="secondary">
              Smaller secondary paragraph for asides.
            </P>
          ),
        },
      ],
    },
    {
      id: 'h2',
      name: 'H2',
      description: 'Research essay section heading (Title as h2, size 3, tight tracking).',
      importLine: "import { H2 } from 'glt-ui';",
      examples: [
        {
          title: 'Default section head',
          code: `<H2>1 · Leaving the coding bottleneck</H2>`,
          render: <H2>1 · Leaving the coding bottleneck</H2>,
        },
        {
          title: 'Size override',
          code: `<H2 size="2xl">Smaller section label</H2>`,
          render: <H2 size="2xl">Smaller section label</H2>,
        },
      ],
    },
    {
      id: 'infographic',
      name: 'Infographic',
      description:
        'Research figure shell — FullBleedFigure alias for essay authoring consistency.',
      importLine: "import { Infographic } from 'glt-ui';",
      examples: [
        {
          title: 'Figure shell',
          description: 'title, caption, children (same layout as FullBleedFigure).',
          code: `<Infographic
  title="Figure 1 · Sample"
  caption="Fictional demo caption under the figure title."
  maxWidth={720}
>
  <div className="flex h-24 items-center justify-center text-sm text-[var(--secondary-text-color)]">
    Chart region
  </div>
</Infographic>`,
          render: (
            <Infographic
              title="Figure 1 · Sample"
              caption="Fictional demo caption under the figure title."
              maxWidth={720}
            >
              <div className="flex h-24 items-center justify-center text-sm text-[var(--secondary-text-color)]">
                Chart region
              </div>
            </Infographic>
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
          title: 'Shell + data table',
          description: 'title, caption, children; FigureDataTableToggle with label + hint.',
          code: `<FullBleedFigure
  title="Figure 1 · Sample throughput"
  caption="Review latency vs release cadence for a fictional squad."
  maxWidth={720}
>
  <div className="flex h-24 items-center justify-center text-sm text-[var(--secondary-text-color)]">
    Chart region
  </div>
  <FigureDataTableToggle
    label="Row metrics"
    hint="Sample rows for the figure above — fictional demo data."
  >
    <Text size="sm">Hidden data table region</Text>
  </FigureDataTableToggle>
</FullBleedFigure>`,
          render: (
            <FullBleedFigure
              title="Figure 1 · Sample throughput"
              caption="Review latency vs release cadence for a fictional squad."
              maxWidth={720}
            >
              <div className="flex h-24 items-center justify-center text-sm text-[var(--secondary-text-color)]">
                Chart region
              </div>
              <FigureDataTableToggle
                label="Row metrics"
                hint="Sample rows for the figure above — fictional demo data."
              >
                <Text size="sm">Hidden data table region</Text>
              </FigureDataTableToggle>
            </FullBleedFigure>
          ),
        },
        {
          title: 'Wider maxWidth',
          description: 'maxWidth as a CSS length string for a broader frame.',
          code: `<FullBleedFigure
  title="Figure 2 · Wide frame"
  caption="Same shell with a wider max-width constraint."
  maxWidth="56rem"
>
  <div className="flex h-20 items-center justify-center text-sm text-[var(--secondary-text-color)]">
    Wide chart region
  </div>
</FullBleedFigure>`,
          render: (
            <FullBleedFigure
              title="Figure 2 · Wide frame"
              caption="Same shell with a wider max-width constraint."
              maxWidth="56rem"
            >
              <div className="flex h-20 items-center justify-center text-sm text-[var(--secondary-text-color)]">
                Wide chart region
              </div>
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
  <RefCite
    items={[
      {
        n: 1,
        author: 'A. North',
        date: '2025-03',
        dateLabel: 'Mar 2025',
        publisher: 'Sample Press',
        title: 'Measuring review throughput in small teams',
        summary: 'Field note on how review latency shapes release cadence.',
      },
    ]}
  />. Two sources can stack
  <RefCite
    items={[
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
    ]}
  /> when a claim needs dual backing.
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
          description: 'items, x, y, fontSize on a sample diagram.',
          code: `<svg
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
  <SvgRefCite
    items={[
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
    ]}
    x={160}
    y={64}
    fontSize={11}
  />
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
        {
          title: 'Wider gap',
          description: 'gap spreads multi-cite markers further apart in viewBox units.',
          code: `<svg
  viewBox="0 0 320 56"
  className="w-full max-w-md text-[var(--brand-primary)]"
  role="img"
  aria-label="Citation markers with wider gap"
>
  <SvgRefCite
    items={[
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
    ]}
    x={160}
    y={28}
    fontSize={12}
    gap={18}
  />
</svg>`,
          render: (
            <svg
              viewBox="0 0 320 56"
              className="w-full max-w-md text-[var(--brand-primary)]"
              role="img"
              aria-label="Citation markers with wider gap"
            >
              <SvgRefCite
                items={DEMO_REF_ITEMS}
                x={160}
                y={28}
                fontSize={12}
                gap={18}
              />
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
          title: 'Default + CardContent',
          description: 'Default surface; pad through CardContent.',
          code: `<Card>
  <CardContent className="p-4">
    <Title size={5}>Topic</Title>
    <Text size="sm" tone="secondary">
      Deck line
    </Text>
  </CardContent>
</Card>`,
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
        {
          title: 'Variants',
          description: 'research, elevated, outline, and stat surfaces.',
          code: `<div className="grid gap-3 sm:grid-cols-2">
  <Card variant="research" padding="md">
    <Title size={5}>Research</Title>
    <Text size="sm" tone="secondary">Soft shadow surface.</Text>
  </Card>
  <Card variant="elevated" padding="md">
    <Title size={5}>Elevated</Title>
    <Text size="sm" tone="secondary">Raised box shadow.</Text>
  </Card>
  <Card variant="outline" padding="md">
    <Title size={5}>Outline</Title>
    <Text size="sm" tone="secondary">Transparent fill.</Text>
  </Card>
  <Card variant="stat" padding="md">
    <Title size={5}>Stat</Title>
    <Text size="sm" tone="secondary">Centered metric card.</Text>
  </Card>
</div>`,
          render: (
            <div className="grid gap-3 sm:grid-cols-2">
              <Card variant="research" padding="md">
                <Title size={5}>Research</Title>
                <Text size="sm" tone="secondary">
                  Soft shadow surface.
                </Text>
              </Card>
              <Card variant="elevated" padding="md">
                <Title size={5}>Elevated</Title>
                <Text size="sm" tone="secondary">
                  Raised box shadow.
                </Text>
              </Card>
              <Card variant="outline" padding="md">
                <Title size={5}>Outline</Title>
                <Text size="sm" tone="secondary">
                  Transparent fill.
                </Text>
              </Card>
              <Card variant="stat" padding="md">
                <Title size={5}>Stat</Title>
                <Text size="sm" tone="secondary">
                  Centered metric card.
                </Text>
              </Card>
            </div>
          ),
        },
        {
          title: 'Padding ladder',
          description: 'Container padding when skipping CardContent: sm / md / lg.',
          code: `<div className="grid gap-3 sm:grid-cols-3">
  <Card variant="outline" padding="sm">
    <Text size="sm">padding=&quot;sm&quot;</Text>
  </Card>
  <Card variant="outline" padding="md">
    <Text size="sm">padding=&quot;md&quot;</Text>
  </Card>
  <Card variant="outline" padding="lg">
    <Text size="sm">padding=&quot;lg&quot;</Text>
  </Card>
</div>`,
          render: (
            <div className="grid gap-3 sm:grid-cols-3">
              <Card variant="outline" padding="sm">
                <Text size="sm">padding=&quot;sm&quot;</Text>
              </Card>
              <Card variant="outline" padding="md">
                <Text size="sm">padding=&quot;md&quot;</Text>
              </Card>
              <Card variant="outline" padding="lg">
                <Text size="sm">padding=&quot;lg&quot;</Text>
              </Card>
            </div>
          ),
        },
        {
          title: 'Interactive',
          description: 'Hover lift + pointer affordance for clickable cards.',
          code: `<Card variant="tech" interactive padding="md" role="button" tabIndex={0}>
  <Title size={5}>Open series</Title>
  <Text size="sm" tone="secondary">
    Hover for lift; host wires navigation.
  </Text>
</Card>`,
          render: (
            <Card variant="tech" interactive padding="md" role="button" tabIndex={0}>
              <Title size={5}>Open series</Title>
              <Text size="sm" tone="secondary">
                Hover for lift; host wires navigation.
              </Text>
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
          title: 'Basic (fullWidth)',
          description: 'Default fullWidth table with row dividers.',
          code: `<Table fullWidth>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Model</TableHeaderCell>
      <TableHeaderCell>Score</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Alpha</TableCell>
      <TableCell>90</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Beta</TableCell>
      <TableCell>84</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
          render: (
            <Table fullWidth>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Model</TableHeaderCell>
                  <TableHeaderCell>Score</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Alpha</TableCell>
                  <TableCell>90</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beta</TableCell>
                  <TableCell>84</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ),
        },
        {
          title: 'Striped + hoverable',
          description: 'Zebra body rows and hover highlight.',
          code: `<Table striped hoverable>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Squad</TableHeaderCell>
      <TableHeaderCell>Latency</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>North</TableCell>
      <TableCell>1.2d</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Vale</TableCell>
      <TableCell>0.8d</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Reed</TableCell>
      <TableCell>1.5d</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
          render: (
            <Table striped hoverable>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Squad</TableHeaderCell>
                  <TableHeaderCell>Latency</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>North</TableCell>
                  <TableCell>1.2d</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Vale</TableCell>
                  <TableCell>0.8d</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Reed</TableCell>
                  <TableCell>1.5d</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ),
        },
        {
          title: 'Bordered + compact',
          description: 'Cell borders with tighter padding.',
          code: `<Table bordered compact>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Metric</TableHeaderCell>
      <TableHeaderCell>Value</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Pass rate</TableCell>
      <TableCell>92%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Retries</TableCell>
      <TableCell>3</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
          render: (
            <Table bordered compact>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Metric</TableHeaderCell>
                  <TableHeaderCell>Value</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Pass rate</TableCell>
                  <TableCell>92%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Retries</TableCell>
                  <TableCell>3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ),
        },
        {
          title: 'Borderless + auto width',
          description: 'No borders; fullWidth={false} sizes to content.',
          code: `<Table borderless fullWidth={false}>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Key</TableHeaderCell>
      <TableHeaderCell>Flag</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>eval</TableCell>
      <TableCell>on</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>cache</TableCell>
      <TableCell>off</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
          render: (
            <Table borderless fullWidth={false}>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Key</TableHeaderCell>
                  <TableHeaderCell>Flag</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>eval</TableCell>
                  <TableCell>on</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>cache</TableCell>
                  <TableCell>off</TableCell>
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
          title: 'Bar (public props)',
          code: `<Chart
  type="bar"
  title="Sample throughput"
  caption="Fictional weekly tickets closed."
  ariaLabel="Bar chart of weekly tickets closed"
  labels={['Mon', 'Wed', 'Fri']}
  series={[{ label: 'Closed', data: [4, 7, 5], color: 'brand' }]}
  legend="top"
  showGrid
  dataLabels
  palette={['brand', 'info', 'success']}
  height={200}
/>`,
          render: (
            <Chart
              type="bar"
              title="Sample throughput"
              caption="Fictional weekly tickets closed."
              ariaLabel="Bar chart of weekly tickets closed"
              labels={['Mon', 'Wed', 'Fri']}
              series={[{ label: 'Closed', data: [4, 7, 5], color: 'brand' }]}
              legend="top"
              showGrid
              dataLabels
              palette={['brand', 'info', 'success']}
              height={200}
            />
          ),
        },
        {
          title: 'Stacked bar + options',
          code: `<Chart
  type="bar"
  title="Sample stacked load"
  caption="Plan vs review share — fictional."
  ariaLabel="Stacked bar of plan and review load"
  labels={['Sprint A', 'Sprint B']}
  series={[
    { label: 'Plan', data: [30, 22], color: 'info' },
    { label: 'Review', data: [40, 48], color: 'warning' },
  ]}
  stacked
  legend="bottom"
  showGrid={false}
  dataLabels
  height={220}
  options={{
    layout: { padding: { top: 8, right: 8, bottom: 4, left: 4 } },
  }}
/>`,
          render: (
            <Chart
              type="bar"
              title="Sample stacked load"
              caption="Plan vs review share — fictional."
              ariaLabel="Stacked bar of plan and review load"
              labels={['Sprint A', 'Sprint B']}
              series={[
                { label: 'Plan', data: [30, 22], color: 'info' },
                { label: 'Review', data: [40, 48], color: 'warning' },
              ]}
              stacked
              legend="bottom"
              showGrid={false}
              dataLabels
              height={220}
              options={{
                layout: { padding: { top: 8, right: 8, bottom: 4, left: 4 } },
              }}
            />
          ),
        },
        {
          title: 'Scatter (scatterFocus)',
          code: `<Chart
  type="scatter"
  title="Sample cost vs score"
  caption="Hover or click a point to pin focus."
  ariaLabel="Scatter of suite cost against resolve rate"
  series={[
    {
      label: 'Alpha',
      color: 'brand',
      data: [
        { x: 80, y: 62 },
        { x: 140, y: 74 },
      ],
    },
    {
      label: 'Beta',
      color: 'success',
      data: [
        { x: 120, y: 68 },
        { x: 210, y: 81 },
      ],
    },
  ]}
  legend="top"
  dataLabels
  scatterFocus
  aspectRatio={1.6}
/>`,
          render: (
            <Chart
              type="scatter"
              title="Sample cost vs score"
              caption="Hover or click a point to pin focus."
              ariaLabel="Scatter of suite cost against resolve rate"
              series={[
                {
                  label: 'Alpha',
                  color: 'brand',
                  data: [
                    { x: 80, y: 62 },
                    { x: 140, y: 74 },
                  ],
                },
                {
                  label: 'Beta',
                  color: 'success',
                  data: [
                    { x: 120, y: 68 },
                    { x: 210, y: 81 },
                  ],
                },
              ]}
              legend="top"
              dataLabels
              scatterFocus
              aspectRatio={1.6}
            />
          ),
        },
        {
          title: 'ChartData escape hatch + plugins + label wrap',
          description:
            'Raw `data` object, empty `plugins` array, and categoryLabelMaxChars for long labels.',
          code: `<Chart
  type="bar"
  title="Raw data prop"
  caption="Uses Chart.js data object instead of labels/series helpers."
  ariaLabel="Bar chart built from data prop"
  data={{
    labels: ['Very long category alpha', 'Very long category beta'],
    datasets: [
      {
        label: 'Volume',
        data: [12, 9],
        backgroundColor: 'var(--brand-primary)',
      },
    ],
  }}
  categoryLabelMaxChars={12}
  plugins={[]}
  legend="top"
  height={200}
/>`,
          render: (
            <Chart
              type="bar"
              title="Raw data prop"
              caption="Uses Chart.js data object instead of labels/series helpers."
              ariaLabel="Bar chart built from data prop"
              data={{
                labels: ['Very long category alpha', 'Very long category beta'],
                datasets: [
                  {
                    label: 'Volume',
                    data: [12, 9],
                    backgroundColor: 'var(--brand-primary)',
                  },
                ],
              }}
              categoryLabelMaxChars={12}
              plugins={[]}
              legend="top"
              height={200}
            />
          ),
        },
      ],
    },
    {
      id: 'page-hero',
      name: 'PageHero',
      description: 'Landing thesis hero with optional trust rail.',
      importLine: "import { PageHero } from 'glt-ui';",
      examples: [
        {
          title: 'Rail items + actions',
          code: `<PageHero
  badge={<Badge variant="fact" size="sm">Series</Badge>}
  title={
    <>
      Judgment stays limited.{' '}
      <span className="text-[var(--brand-primary)]">Harness the rest.</span>
    </>
  }
  lead="Sample hero for the design-system demo — host supplies all copy."
  actions={
    <Button size="sm" variant="primary">
      Browse catalog
    </Button>
  }
  meta={
    <Text as="span" size="sm" tone="secondary" className="font-mono">
      3 topics · demo
    </Text>
  }
  footnote="Updated quarterly from field notes."
  railTitle="On this page"
  railItems={[
    {
      index: '01',
      label: 'Thesis',
      description: 'What stays limited when tools get cheaper.',
    },
    {
      index: '02',
      label: 'Evidence',
      description: 'Figures and primary sources.',
    },
    {
      index: '03',
      label: 'Practice',
      description: 'What teams change on Monday.',
    },
  ]}
/>`,
          render: (
            <PageHero
              badge={
                <Badge variant="fact" size="sm">
                  Series
                </Badge>
              }
              title={
                <>
                  Judgment stays limited.{' '}
                  <span className="text-[var(--brand-primary)]">Harness the rest.</span>
                </>
              }
              lead="Sample hero for the design-system demo — host supplies all copy."
              actions={
                <Button size="sm" variant="primary">
                  Browse catalog
                </Button>
              }
              meta={
                <Text as="span" size="sm" tone="secondary" className="font-mono">
                  3 topics · demo
                </Text>
              }
              footnote="Updated quarterly from field notes."
              railTitle="On this page"
              railItems={[
                {
                  index: '01',
                  label: 'Thesis',
                  description: 'What stays limited when tools get cheaper.',
                },
                {
                  index: '02',
                  label: 'Evidence',
                  description: 'Figures and primary sources.',
                },
                {
                  index: '03',
                  label: 'Practice',
                  description: 'What teams change on Monday.',
                },
              ]}
            />
          ),
        },
        {
          title: 'Custom rail',
          code: `<PageHero
  title="Custom rail panel"
  lead="Pass rail when the right column is free-form content."
  rail={
    <div className="rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--card-bg-color)]/70 p-5">
      <Text as="p" size="xs" tone="secondary" weight="medium" className="mb-2 font-mono uppercase tracking-[0.16em]">
        Trust note
      </Text>
      <Text as="p" size="sm">
        Host-owned layout — badge stack, avatars, or a short quote.
      </Text>
    </div>
  }
/>`,
          render: (
            <PageHero
              title="Custom rail panel"
              lead="Pass rail when the right column is free-form content."
              rail={
                <div className="rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--card-bg-color)]/70 p-5">
                  <Text
                    as="p"
                    size="xs"
                    tone="secondary"
                    weight="medium"
                    className="mb-2 font-mono uppercase tracking-[0.16em]"
                  >
                    Trust note
                  </Text>
                  <Text as="p" size="sm">
                    Host-owned layout — badge stack, avatars, or a short quote.
                  </Text>
                </div>
              }
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
          title: 'Brand + actions',
          code: `<SiteHeader
  brand={<Text weight="semibold">Sample kit</Text>}
  actions={
    <>
      <Text size="sm" tone="secondary">
        Docs
      </Text>
      <Button size="sm" variant="secondary">
        Theme
      </Button>
    </>
  }
/>`,
          render: (
            <SiteHeader
              brand={<Text weight="semibold">Sample kit</Text>}
              actions={
                <>
                  <Text size="sm" tone="secondary">
                    Docs
                  </Text>
                  <Button size="sm" variant="secondary">
                    Theme
                  </Button>
                </>
              }
            />
          ),
        },
        {
          title: 'Brand only',
          code: `<SiteHeader brand={<Text weight="semibold">Sample kit</Text>} />`,
          render: <SiteHeader brand={<Text weight="semibold">Sample kit</Text>} />,
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
          title: 'Children row',
          code: `<SiteFooter>
  <span>© Sample kit</span>
  <span aria-hidden>·</span>
  <a href="#privacy" className="text-[var(--brand-primary)] no-underline">
    Privacy
  </a>
</SiteFooter>`,
          render: (
            <SiteFooter>
              <span>© Sample kit</span>
              <span aria-hidden>·</span>
              <a href="#privacy" className="text-[var(--brand-primary)] no-underline">
                Privacy
              </a>
            </SiteFooter>
          ),
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
          title: 'Quality loop (animated)',
          code: `<ProcessPipeline
  animated
  nodes={[
    { id: 'signal', label: 'Signal', sublabel: 'Sources' },
    { id: 'build', label: 'Build', sublabel: 'Harness' },
    { id: 'ship', label: 'Ship', sublabel: 'Publish' },
  ]}
  loop={{
    from: 'build',
    to: 'ship',
    caption: 'QUALITY LOOP · raise the bar',
    forwardLabel: 'refine →',
    backLabel: '← feedback',
  }}
/>`,
          render: (
            <ProcessPipeline
              animated
              nodes={[
                { id: 'signal', label: 'Signal', sublabel: 'Sources' },
                { id: 'build', label: 'Build', sublabel: 'Harness' },
                { id: 'ship', label: 'Ship', sublabel: 'Publish' },
              ]}
              loop={{
                from: 'build',
                to: 'ship',
                caption: 'QUALITY LOOP · raise the bar',
                forwardLabel: 'refine →',
                backLabel: '← feedback',
              }}
            />
          ),
        },
        {
          title: 'Static spine',
          code: `<ProcessPipeline
  animated={false}
  nodes={[
    { id: 'signal', label: 'Signal', sublabel: 'Sources' },
    { id: 'ship', label: 'Ship', sublabel: 'Publish' },
  ]}
/>`,
          render: (
            <ProcessPipeline
              animated={false}
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
          description: 'layout="split" with meta opposite the title on md+.',
          code: `<SectionIntro
  layout="split"
  eyebrow="Catalog"
  title="Active series"
  description="Open a topic for the full argument."
  headingId="demo-section-intro-split"
  titleSize={2}
  meta={
    <Text as="p" size="sm" tone="secondary" className="font-mono">
      2 topics
    </Text>
  }
/>`,
          render: (
            <SectionIntro
              layout="split"
              eyebrow="Catalog"
              title="Active series"
              description="Open a topic for the full argument."
              headingId="demo-section-intro-split"
              titleSize={2}
              meta={
                <Text as="p" size="sm" tone="secondary" className="font-mono">
                  2 topics
                </Text>
              }
            />
          ),
        },
        {
          title: 'Stack + smaller title',
          description: 'layout="stack" with titleSize={3} and headingId for aria wiring.',
          code: `<SectionIntro
  layout="stack"
  eyebrow="Method"
  title="How the band is built"
  description="Stacked column for compact section openers."
  headingId="demo-section-intro-stack"
  titleSize={3}
/>`,
          render: (
            <SectionIntro
              layout="stack"
              eyebrow="Method"
              title="How the band is built"
              description="Stacked column for compact section openers."
              headingId="demo-section-intro-stack"
              titleSize={3}
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
          code: `<div className="space-y-4">
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
</div>`,
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
          title: 'Sample items + maxTags',
          code: `<CatalogList
  ctaLabel="Read the research"
  maxTags={2}
  items={[
    {
      id: 'alpha',
      href: '#alpha',
      title: 'Sample research series',
      summary:
        'A fictional topic for the design-system demo — not portal registry data.',
      date: '2026-01',
      status: 'active',
      tags: ['demo', 'catalog', 'series', 'long-tag'],
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
/>`,
          render: (
            <CatalogList
              ctaLabel="Read the research"
              maxTags={2}
              items={[
                {
                  id: 'alpha',
                  href: '#alpha',
                  title: 'Sample research series',
                  summary:
                    'A fictional topic for the design-system demo — not portal registry data.',
                  date: '2026-01',
                  status: 'active',
                  tags: ['demo', 'catalog', 'series', 'long-tag'],
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
        {
          title: 'Empty state',
          code: `<CatalogList
  items={[]}
  emptyMessage="No sample series in this demo catalog."
/>`,
          render: (
            <CatalogList
              items={[]}
              emptyMessage="No sample series in this demo catalog."
            />
          ),
        },
        {
          title: 'Custom renderLink',
          code: `<CatalogList
  ctaLabel="Open"
  items={[
    {
      id: 'custom-link',
      href: '#custom-link',
      title: 'Custom link renderer',
      summary: 'Host can pass Next.js Link or any interactive wrapper.',
      date: '2026-06',
      tags: ['link'],
    },
  ]}
  renderLink={({ href, className, children, ...rest }) => (
    <a
      href={href}
      className={className}
      data-demo-custom-link="true"
      {...rest}
    >
      {children}
    </a>
  )}
/>`,
          render: (
            <CatalogList
              ctaLabel="Open"
              items={[
                {
                  id: 'custom-link',
                  href: '#custom-link',
                  title: 'Custom link renderer',
                  summary: 'Host can pass Next.js Link or any interactive wrapper.',
                  date: '2026-06',
                  tags: ['link'],
                },
              ]}
              renderLink={({ href, className, children, ...rest }) => (
                <a
                  href={href}
                  className={className}
                  data-demo-custom-link="true"
                  {...rest}
                >
                  {children}
                </a>
              )}
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
          description: 'eyebrow, title, description, pillars, and headingId for aria-labelledby.',
          code: `<MethodPillars
  eyebrow="Method"
  title="Built for scrutiny."
  description="Short sample description for the demo — host supplies all copy."
  headingId="demo-method-pillars-heading"
  pillars={[
    { title: 'Claim', body: 'Open with a thesis you can defend.' },
    { title: 'Evidence', body: 'Cite primary sources beside the argument.' },
    { title: 'Deck', body: 'Ship a presentation-ready walkthrough.' },
  ]}
/>`,
          render: (
            <MethodPillars
              eyebrow="Method"
              title="Built for scrutiny."
              description="Short sample description for the demo — host supplies all copy."
              headingId="demo-method-pillars-heading"
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
  headingId="demo-process-band-heading"
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
  pipelineProps={{
    animated: true,
    'data-demo-pipeline': 'process-band',
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
/>`,
          render: (
            <ProcessBand
              headingId="demo-process-band-heading"
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
              pipelineProps={{
                animated: true,
                'data-demo-pipeline': 'process-band',
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
  beforeTitle="Before automation"
  afterTitle="After automation"
  slices={[
    { key: 'build', label: 'Build', before: 50, after: 18, color: 'brand' },
    { key: 'review', label: 'Review', before: 28, after: 42, color: 'warning' },
    { key: 'plan', label: 'Plan', before: 22, after: 40, color: 'info' },
  ]}
/>`,
          render: (
            <AttentionShiftBars
              beforeTitle="Before automation"
              afterTitle="After automation"
              shareLabel="Share %"
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
        {
          title: 'Compact (slide chrome)',
          code: `<AttentionShiftBars
  beforeTitle="Before"
  afterTitle="After"
  compact
  slices={[
    { key: 'build', label: 'Build', before: 50, after: 18, color: 'brand' },
    { key: 'review', label: 'Review', before: 28, after: 42, color: 'warning' },
    { key: 'plan', label: 'Plan', before: 22, after: 40, color: 'info' },
  ]}
/>`,
          render: (
            <AttentionShiftBars
              beforeTitle="Before"
              afterTitle="After"
              compact
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
          code: `<div className="h-[280px] w-full min-h-0">
  <CostScoreScatter
    fill
    xAxisLabel="Total suite cost ($ · 100 tasks)"
    yAxisLabel="Demo suite score (%)"
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
  />
</div>`,
          render: (
            <div className="h-[280px] w-full min-h-0">
              <CostScoreScatter
                fill
                xAxisLabel="Total suite cost ($ · 100 tasks)"
                yAxisLabel="Demo suite score (%)"
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
              />
            </div>
          ),
        },
        {
          title: 'Fixed height',
          description: 'Use height instead of fill when the parent has no fixed size.',
          code: `<CostScoreScatter
  height={240}
  xAxisLabel="Suite cost ($)"
  yAxisLabel="Score (%)"
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
/>`,
          render: (
            <CostScoreScatter
              height={240}
              xAxisLabel="Suite cost ($)"
              yAxisLabel="Score (%)"
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
  chartHeight={260}
  suiteCites={{
    'suite-a': [
      {
        n: 1,
        author: 'A. North',
        date: '2025-03',
        dateLabel: 'Mar 2025',
        publisher: 'Sample Press',
        title: 'Measuring review throughput in small teams',
        summary: 'Field note on how review latency shapes release cadence.',
      },
    ],
    'suite-b': [
      {
        n: 2,
        author: 'B. Vale',
        date: '2024-11',
        dateLabel: 'Nov 2024',
        publisher: 'Toolkit Journal',
        title: 'Harness patterns for long-running agents',
        summary: 'Checklist of evals, hooks, and docs that keep agents honest.',
      },
    ],
  }}
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
/>`,
          render: (
            <CostScoreBoard
              chartHeight={260}
              dataTableLabel="Data table and sources"
              dataTableHint="Full row metrics and sources."
              showLabel="Show"
              hideLabel="Hide"
              labels={{ filter: 'Filter:' }}
              suiteCites={{
                'suite-a': DEMO_REF_ITEMS.slice(0, 1),
                'suite-b': DEMO_REF_ITEMS.slice(1, 2),
              }}
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
        {
          title: 'Compact (slide chrome)',
          code: `<CostScoreBoard
  compact
  chartHeight={220}
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
  ]}
/>`,
          render: (
            <CostScoreBoard
              compact
              chartHeight={220}
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
          code: `<div className="h-[280px] w-full min-h-0">
  <ResolveRateTrend
    fill
    compact
    points={[
      { period: '2025 Q1', model: 'Alpha-1', resolveRate: 42 },
      { period: '2025 Q2', model: 'Alpha-2', resolveRate: 55 },
      { period: '2025 Q3', model: 'Beta-1', resolveRate: 71 },
    ]}
    labelMap={{ 'Alpha-1': 'A1', 'Alpha-2': 'A2', 'Beta-1': 'B1' }}
  />
</div>`,
          render: (
            <div className="h-[280px] w-full min-h-0">
              <ResolveRateTrend
                fill
                compact
                labels={{
                  frontier: 'Frontier',
                  timeAxis: 'Time',
                  rateAxis: 'Resolve rate (%)',
                }}
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
              />
            </div>
          ),
        },
        {
          title: 'Fixed height',
          description: 'Explicit height when not filling a sized parent.',
          code: `<ResolveRateTrend
  height={240}
  points={[
    { period: '2025 Q1', model: 'Alpha-1', resolveRate: 42 },
    { period: '2025 Q2', model: 'Alpha-2', resolveRate: 55 },
    { period: '2025 Q3', model: 'Beta-1', resolveRate: 71 },
  ]}
  labelMap={{ 'Alpha-1': 'A1', 'Alpha-2': 'A2', 'Beta-1': 'B1' }}
/>`,
          render: (
            <ResolveRateTrend
              height={240}
              points={[
                { period: '2025 Q1', model: 'Alpha-1', resolveRate: 42 },
                { period: '2025 Q2', model: 'Alpha-2', resolveRate: 55 },
                { period: '2025 Q3', model: 'Beta-1', resolveRate: 71 },
              ]}
              labelMap={{ 'Alpha-1': 'A1', 'Alpha-2': 'A2', 'Beta-1': 'B1' }}
            />
          ),
        },
      ],
    },
    {
      id: 'metric-spark-board',
      name: 'MetricSparkBoard',
      description:
        'Fluid SVG metric tiles with sparklines. Host supplies metrics (and optional cites).',
      importLine: "import { MetricSparkBoard } from 'glt-ui';",
      examples: [
        {
          title: 'Sample fleet tiles',
          code: `<MetricSparkBoard
  title="Sample fleet metrics"
  description="Fictional cycle time and NPS tiles for the design-system demo."
  cites={{
    cycle: [
      {
        n: 1,
        author: 'A. North',
        date: '2025-03',
        dateLabel: 'Mar 2025',
        publisher: 'Sample Press',
        title: 'Measuring review throughput in small teams',
        summary: 'Field note on how review latency shapes release cadence.',
      },
    ],
    nps: [
      {
        n: 2,
        author: 'B. Vale',
        date: '2024-11',
        dateLabel: 'Nov 2024',
        publisher: 'Toolkit Journal',
        title: 'Harness patterns for long-running agents',
        summary: 'Checklist of evals, hooks, and docs that keep agents honest.',
      },
    ],
  }}
  metrics={[
    {
      id: 'cycle',
      label: 'Cycle time',
      value: '−40%',
      hint: 'Demo ops · Q2',
      citeKey: 'cycle',
      trend: [10, 9, 8, 7, 6.2, 5.8],
      trendIntent: 'success',
    },
    {
      id: 'nps',
      label: 'NPS',
      value: '+18',
      hint: 'Survey · n=120',
      citeKey: 'nps',
      trend: [20, 22, 28, 32, 35, 38],
      trendIntent: 'brand',
    },
    {
      id: 'uptime',
      label: 'Uptime',
      value: '99.9%',
      hint: 'Rolling 90d',
      trend: [99.2, 99.4, 99.5, 99.7, 99.8, 99.9],
      trendIntent: 'brand',
    },
    {
      id: 'cost',
      label: 'Unit cost',
      value: '−22%',
      hint: 'Infra · YoY',
      trend: [12, 11, 10.5, 10, 9.5, 9.4],
      trendIntent: 'success',
    },
  ]}
/>`,
          render: (
            <MetricSparkBoard
              title="Sample fleet metrics"
              description="Fictional cycle time and NPS tiles for the design-system demo."
              ariaLabel="Sample fleet metrics board"
              metricLabels={{
                cycle: { label: 'Cycle time', hint: 'Demo operations · Q2' },
              }}
              cites={{
                cycle: DEMO_REF_ITEMS.slice(0, 1),
                nps: DEMO_REF_ITEMS.slice(1, 2),
              }}
              metrics={[
                {
                  id: 'cycle',
                  label: 'Cycle time',
                  value: '−40%',
                  hint: 'Demo ops · Q2',
                  citeKey: 'cycle',
                  trend: [10, 9, 8, 7, 6.2, 5.8],
                  trendIntent: 'success',
                },
                {
                  id: 'nps',
                  label: 'NPS',
                  value: '+18',
                  hint: 'Survey · n=120',
                  citeKey: 'nps',
                  trend: [20, 22, 28, 32, 35, 38],
                  trendIntent: 'brand',
                },
                {
                  id: 'uptime',
                  label: 'Uptime',
                  value: '99.9%',
                  hint: 'Rolling 90d',
                  trend: [99.2, 99.4, 99.5, 99.7, 99.8, 99.9],
                  trendIntent: 'brand',
                },
                {
                  id: 'cost',
                  label: 'Unit cost',
                  value: '−22%',
                  hint: 'Infra · YoY',
                  trend: [12, 11, 10.5, 10, 9.5, 9.4],
                  trendIntent: 'success',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'causal-shift-diagram',
      name: 'CausalShiftDiagram',
      description:
        'Two causal chains with vertical link chips and a center flip. Host supplies cards and links.',
      importLine: "import { CausalShiftDiagram } from 'glt-ui';",
      examples: [
        {
          title: 'Sample before / after',
          code: `<CausalShiftDiagram
  title="Sample ops flip"
  description="Fictional before/after causal chains for the design-system demo."
  claim="Same backlog. Different bottleneck."
  claimSub="People bound intake first. Policy bounds it after automation."
  leftHeader="Before automation"
  rightHeader="After automation"
  footer="Intake got cheap. Policy still sets the pace."
  leftChain={[
    {
      id: 'l1',
      title: 'Manual intake',
      detail: 'Tickets wait on people',
      highlight: true,
    },
    {
      id: 'l2',
      title: 'Ad-hoc routing',
      detail: 'Experts re-sort the queue',
    },
    {
      id: 'l3',
      title: 'Late review',
      detail: 'QA sees work after ship pressure',
    },
  ]}
  rightChain={[
    {
      id: 'r1',
      title: 'Auto triage',
      detail: 'Queue sorts itself',
    },
    {
      id: 'r2',
      title: 'Policy is the bottleneck',
      detail: 'Rules and exceptions set the calendar',
      highlight: true,
    },
    {
      id: 'r3',
      title: 'Continuous review',
      detail: 'Checks run with every batch',
    },
  ]}
  leftLinks={['routing stays manual', 'review stays late']}
  rightLinks={['policy becomes the limit', 'review stays continuous']}
  cites={{
    l1: [
      {
        n: 1,
        author: 'A. North',
        date: '2025-03',
        dateLabel: 'Mar 2025',
        publisher: 'Sample Press',
        title: 'Measuring review throughput in small teams',
        summary: 'Field note on how review latency shapes release cadence.',
      },
    ],
    r2: [
      {
        n: 2,
        author: 'B. Vale',
        date: '2024-11',
        dateLabel: 'Nov 2024',
        publisher: 'Toolkit Journal',
        title: 'Harness patterns for long-running agents',
        summary: 'Checklist of evals, hooks, and docs that keep agents honest.',
      },
    ],
  }}
/>`,
          render: (
            <CausalShiftDiagram
              title="Sample ops flip"
              description="Fictional before/after causal chains for the design-system demo."
              claim="Same backlog. Different bottleneck."
              claimSub="People bound intake first. Policy bounds it after automation."
              leftHeader="Before automation"
              rightHeader="After automation"
              footer="Intake got cheap. Policy still sets the pace."
              leftChain={[
                {
                  id: 'l1',
                  title: 'Manual intake',
                  detail: 'Tickets wait on people',
                  highlight: true,
                },
                {
                  id: 'l2',
                  title: 'Ad-hoc routing',
                  detail: 'Experts re-sort the queue',
                },
                {
                  id: 'l3',
                  title: 'Late review',
                  detail: 'QA sees work after ship pressure',
                },
              ]}
              rightChain={[
                {
                  id: 'r1',
                  title: 'Auto triage',
                  detail: 'Queue sorts itself',
                },
                {
                  id: 'r2',
                  title: 'Policy is the bottleneck',
                  detail: 'Rules and exceptions set the calendar',
                  highlight: true,
                },
                {
                  id: 'r3',
                  title: 'Continuous review',
                  detail: 'Checks run with every batch',
                },
              ]}
              leftLinks={['routing stays manual', 'review stays late']}
              rightLinks={['policy becomes the limit', 'review stays continuous']}
              cites={{
                l1: DEMO_REF_ITEMS.slice(0, 1),
                r2: DEMO_REF_ITEMS.slice(1, 2),
              }}
            />
          ),
        },
      ],
    },
    {
      id: 'feedback-loops-diagram',
      name: 'FeedbackLoopsDiagram',
      description:
        'Animated multi-loop diagram with pace labels and interstitial nodes. Host supplies loops and nodes.',
      importLine: "import { FeedbackLoopsDiagram } from 'glt-ui';",
      examples: [
        {
          title: 'Three sample loops',
          code: `<FeedbackLoopsDiagram
  title="Sample product loops"
  description="Fictional three-loop diagram for the design-system demo."
  heading="3 product feedback loops"
  loops={[
    {
      id: 'inner',
      titleTop: 'Inner',
      titleBot: 'Build Loop',
      pace: '~minutes',
    },
    {
      id: 'team',
      titleTop: 'Team',
      titleBot: 'Review Loop',
      pace: '~hours',
    },
    {
      id: 'market',
      titleTop: 'Market',
      titleBot: 'Signal Loop',
      pace: '~days',
    },
  ]}
  nodes={[
    { lines: ['Builder', 'agent'] },
    { lines: ['Spec', 'suite'] },
    { lines: ['Team', 'vision'] },
    { lines: ['Market', 'signal'] },
  ]}
  cite={[
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
  ]}
/>`,
          render: (
            <FeedbackLoopsDiagram
              title="Sample product loops"
              description="Fictional three-loop diagram for the design-system demo."
              heading="3 product feedback loops"
              loops={[
                {
                  id: 'inner',
                  titleTop: 'Inner',
                  titleBot: 'Build Loop',
                  pace: '~minutes',
                },
                {
                  id: 'team',
                  titleTop: 'Team',
                  titleBot: 'Review Loop',
                  pace: '~hours',
                },
                {
                  id: 'market',
                  titleTop: 'Market',
                  titleBot: 'Signal Loop',
                  pace: '~days',
                },
              ]}
              nodes={[
                { lines: ['Builder', 'agent'] },
                { lines: ['Spec', 'suite'] },
                { lines: ['Team', 'vision'] },
                { lines: ['Market', 'signal'] },
              ]}
              cite={DEMO_REF_ITEMS}
            />
          ),
        },
      ],
    },
    {
      id: 'step-loop-flow',
      name: 'StepLoopFlow',
      description:
        'Closed step loop: top-row pipeline plus a return node underneath. Host supplies steps.',
      importLine: "import { StepLoopFlow } from 'glt-ui';",
      examples: [
        {
          title: 'Sample daily loop',
          code: `<StepLoopFlow
  title="Sample work loop"
  description="Fictional closed step loop for the design-system demo."
  returnLabel="↻ next ticket"
  steps={[
    { n: '01', label: 'Queue', detail: 'Pick work' },
    { n: '02', label: 'Branch', detail: 'Isolate' },
    { n: '03', label: 'Draft', detail: 'Propose', tone: 'brand' },
    { n: '04', label: 'Check', detail: 'Verify', tone: 'brand' },
    { n: '05', label: 'Ship', detail: 'Merge' },
    { n: '06', label: 'Owner', detail: 'Exceptions', tone: 'brand' },
  ]}
/>`,
          render: (
            <StepLoopFlow
              title="Sample work loop"
              description="Fictional closed step loop for the design-system demo."
              returnLabel="↻ next ticket"
              steps={[
                { n: '01', label: 'Queue', detail: 'Pick work' },
                { n: '02', label: 'Branch', detail: 'Isolate' },
                { n: '03', label: 'Draft', detail: 'Propose', tone: 'brand' },
                { n: '04', label: 'Check', detail: 'Verify', tone: 'brand' },
                { n: '05', label: 'Ship', detail: 'Merge' },
                { n: '06', label: 'Owner', detail: 'Exceptions', tone: 'brand' },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'agent-harness-diagram',
      name: 'AgentHarnessDiagram',
      description:
        'Harness architecture: guides, sensors, agent, durable state. Host supplies tile lists and labels.',
      importLine: "import { AgentHarnessDiagram } from 'glt-ui';",
      examples: [
        {
          title: 'Sample harness tiles',
          code: `<AgentHarnessDiagram
  title="Sample harness"
  description="Fictional agent harness architecture for the design-system demo."
  guideItems={[
    'Playbooks',
    'Templates',
    'Style rules',
    'API maps',
  ]}
  sensorItems={[
    'Lint gates',
    'Trace hooks',
    'Cost caps',
    'Retry policy',
  ]}
  labels={{
    diagramTitle: 'Runner = Model + Harness',
    human: 'Operator',
    humanSteering: 'Steering',
    humanGoals: 'Goals · ship',
    harness: 'Harness shell',
    guides: 'Guides',
    guidesSub: 'Feedforward · before the runner acts',
    sensors: 'Sensors',
    sensorsSub: 'Feedback · while the runner acts',
    feedforward: 'feedforward',
    feedback: 'feedback',
    agent: 'Task runner',
    agentSub: 'Model + tools',
    initialGen: 'Initial generation',
    initialGenLines: ['Model · skills · MCP', 'Tools · descriptions'],
    selfCorrecting: 'Self-correcting',
    selfCorrectingLines: [
      'Orchestration · handoffs',
      'Sandbox · browser',
      'Linters · types',
    ],
    store: 'store',
    retrieve: 'retrieve',
    durableState: 'Shared memory',
    durableStateSub: 'Lives outside the prompt',
    ratchet: 'Each miss becomes a permanent harness rule',
  }}
/>`,
          render: (
            <AgentHarnessDiagram
              title="Sample harness"
              description="Fictional agent harness architecture for the design-system demo."
              guideItems={[
                'Playbooks',
                'Templates',
                'Style rules',
                'API maps',
              ]}
              sensorItems={[
                'Lint gates',
                'Trace hooks',
                'Cost caps',
                'Retry policy',
              ]}
              labels={{
                diagramTitle: 'Runner = Model + Harness',
                human: 'Operator',
                humanSteering: 'Steering',
                humanGoals: 'Goals · ship',
                harness: 'Harness shell',
                guides: 'Guides',
                guidesSub: 'Feedforward · before the runner acts',
                sensors: 'Sensors',
                sensorsSub: 'Feedback · while the runner acts',
                feedforward: 'feedforward',
                feedback: 'feedback',
                agent: 'Task runner',
                agentSub: 'Model + tools',
                initialGen: 'Initial generation',
                initialGenLines: ['Model · skills · MCP', 'Tools · descriptions'],
                selfCorrecting: 'Self-correcting',
                selfCorrectingLines: [
                  'Orchestration · handoffs',
                  'Sandbox · browser',
                  'Linters · types',
                ],
                store: 'store',
                retrieve: 'retrieve',
                durableState: 'Shared memory',
                durableStateSub: 'Lives outside the prompt',
                ratchet: 'Each miss becomes a permanent harness rule',
              }}
            />
          ),
        },
      ],
    },
    {
      id: 'presentation-bullet-list',
      name: 'PresentationBulletList',
      description:
        'Compact brand-dot bullet list for presentation decks. Host supplies every item.',
      importLine: "import { PresentationBulletList } from 'glt-ui';",
      examples: [
        {
          title: 'Northstar plan bullets',
          description: 'items accepts strings or rich React nodes.',
          code: `<PresentationBulletList
  items={[
    'Define the Northstar metric before the first build slice.',
    <>
      Keep the harness <strong>thin</strong> until the review loop is honest.
    </>,
    <>
      Ship the <em>high-risk path</em> first, then expand coverage.
    </>,
  ]}
/>`,
          render: (
            <PresentationBulletList
              items={[
                'Define the Northstar metric before the first build slice.',
                <>
                  Keep the harness <strong>thin</strong> until the review loop is honest.
                </>,
                <>
                  Ship the <em>high-risk path</em> first, then expand coverage.
                </>,
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'presentation-decision-callout',
      name: 'PresentationDecisionCallout',
      description:
        'Impact · takeaways · next actions block for presentation decks. Row labels are optional overrides.',
      importLine: "import { PresentationDecisionCallout } from 'glt-ui';",
      examples: [
        {
          title: 'Custom row labels',
          description: 'All body props plus impactLabel / takeawaysLabel / nextActionsLabel.',
          code: `<PresentationDecisionCallout
  impact="Cycle time fell after the Northstar review gate landed."
  takeaways="Review latency was the hidden constraint, not model speed."
  nextActions="Pin one weekly review slot; retire two status meetings."
  impactLabel="Signal"
  takeawaysLabel="Read"
  nextActionsLabel="This week"
/>`,
          render: (
            <PresentationDecisionCallout
              impact="Cycle time fell after the Northstar review gate landed."
              takeaways="Review latency was the hidden constraint, not model speed."
              nextActions="Pin one weekly review slot; retire two status meetings."
              impactLabel="Signal"
              takeawaysLabel="Read"
              nextActionsLabel="This week"
            />
          ),
        },
      ],
    },
    {
      id: 'presentation-title-page',
      name: 'PresentationTitlePage',
      description:
        'Centered title-page body: kicker, title, optional credit lines. No product defaults.',
      importLine: "import { PresentationTitlePage } from 'glt-ui';",
      examples: [
        {
          title: 'Kicker, title, credits',
          code: `<div className="min-h-[280px] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-color)]">
  <PresentationTitlePage
    kicker="01 · Northstar kit"
    title="Toolkit walkthrough for the sample deck"
    credit="Northstar Labs"
    creditDetail="Demo series · Q2 sample"
  />
</div>`,
          render: (
            <div className="min-h-[280px] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-color)]">
              <PresentationTitlePage
                kicker="01 · Northstar kit"
                title="Toolkit walkthrough for the sample deck"
                credit="Northstar Labs"
                creditDetail="Demo series · Q2 sample"
              />
            </div>
          ),
        },
      ],
    },
    {
      id: 'presentation-myth-grid',
      name: 'PresentationMythGrid',
      description:
        'Two-column myth / watch card grid for close slides. Host supplies all titles and bodies.',
      importLine: "import { PresentationMythGrid } from 'glt-ui';",
      examples: [
        {
          title: 'Watch items',
          code: `<PresentationMythGrid
  cards={[
    {
      title: 'Myth · speed alone',
      body: 'Faster models do not fix a slow review gate.',
    },
    {
      title: 'Watch · shadow work',
      body: 'Unowned review queues hide the real cycle cost.',
    },
    {
      title: 'Debt · status theater',
      body: 'Meetings without a metric drift into noise.',
    },
    {
      title: 'Watch · thin harness',
      body: 'Evals and hooks land before the agent fleet grows.',
    },
  ]}
/>`,
          render: (
            <PresentationMythGrid
              cards={[
                {
                  title: 'Myth · speed alone',
                  body: 'Faster models do not fix a slow review gate.',
                },
                {
                  title: 'Watch · shadow work',
                  body: 'Unowned review queues hide the real cycle cost.',
                },
                {
                  title: 'Debt · status theater',
                  body: 'Meetings without a metric drift into noise.',
                },
                {
                  title: 'Watch · thin harness',
                  body: 'Evals and hooks land before the agent fleet grows.',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'presentation-figure-keypoints',
      name: 'PresentationFigureKeypoints',
      description:
        'Figure + keypoints layout. wide stacks figure over keypoints; side-by-side uses a column split.',
      importLine: "import { PresentationFigureKeypoints } from 'glt-ui';",
      examples: [
        {
          title: 'Wide + caption + callout labels',
          description: 'wide figure, caption, bullets, and callout with custom labels.',
          code: `<div className="min-h-[320px] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-color)] p-3">
  <PresentationFigureKeypoints
    wide
    caption="Fleet pulse · demo series"
    figure={
      <div className="flex h-full min-h-[100px] w-full items-center justify-center rounded-md border border-dashed border-[var(--brand-primary)]/35 bg-[var(--brand-primary)]/10 px-3 text-center text-xs font-semibold text-[var(--strong-text-color)]">
        Sample wide figure
      </div>
    }
    bullets={[
      'Envelope tightened after the Northstar gate.',
      'Unit cost tracked the review queue, not model price.',
    ]}
    callout={{
      impact: 'Lead time dropped once review owned a metric.',
      takeaways: 'Instrument the gate before scaling agents.',
      nextActions: 'Publish the queue dashboard this sprint.',
      impactLabel: 'Signal',
      takeawaysLabel: 'Read',
      nextActionsLabel: 'Next',
    }}
  />
</div>`,
          render: (
            <div className="min-h-[320px] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-color)] p-3">
              <PresentationFigureKeypoints
                wide
                caption="Fleet pulse · demo series"
                figure={<DemoFigurePlaceholder label="Sample wide figure" />}
                bullets={[
                  'Envelope tightened after the Northstar gate.',
                  'Unit cost tracked the review queue, not model price.',
                ]}
                callout={{
                  impact: 'Lead time dropped once review owned a metric.',
                  takeaways: 'Instrument the gate before scaling agents.',
                  nextActions: 'Publish the queue dashboard this sprint.',
                  impactLabel: 'Signal',
                  takeawaysLabel: 'Read',
                  nextActionsLabel: 'Next',
                }}
              />
            </div>
          ),
        },
        {
          title: 'Side-by-side (wide=false)',
          description: 'Taller/square figures keep keypoints in a right column.',
          code: `<div className="min-h-[280px] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-color)] p-3">
  <PresentationFigureKeypoints
    wide={false}
    figure={
      <div className="flex h-full min-h-[100px] w-full items-center justify-center rounded-md border border-dashed border-[var(--brand-primary)]/35 bg-[var(--brand-primary)]/10 px-3 text-center text-xs font-semibold text-[var(--strong-text-color)]">
        Sample side figure
      </div>
    }
    bullets={['Pin the eval suite.', 'Retire one low-signal meeting.']}
    callout={{
      impact: 'Review ownership cut rework.',
      takeaways: 'Harness depth follows honest loops.',
      nextActions: 'Name a single review owner.',
    }}
  />
</div>`,
          render: (
            <div className="min-h-[280px] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-color)] p-3">
              <PresentationFigureKeypoints
                wide={false}
                figure={<DemoFigurePlaceholder label="Sample side figure" />}
                bullets={['Pin the eval suite.', 'Retire one low-signal meeting.']}
                callout={{
                  impact: 'Review ownership cut rework.',
                  takeaways: 'Harness depth follows honest loops.',
                  nextActions: 'Name a single review owner.',
                }}
              />
            </div>
          ),
        },
      ],
    },
    {
      id: 'presentation-slide-board',
      name: 'PresentationSlideBoard',
      description:
        'Content-agnostic slide board: layout chrome via PresentationSlideFrame; body by layout (title, bullets, figure-wide, figure-side, close).',
      importLine: "import { PresentationSlideBoard } from 'glt-ui';",
      examples: [
        {
          title: 'layout="title"',
          description: 'Title page with credit lines; hideHeader is applied automatically.',
          code: `<div className="overflow-x-auto">
  <PresentationSlideBoard
    layout="title"
    naturalW={640}
    naturalH={360}
    slideId="ns-title"
    slideNum="01"
    kicker="01 · Northstar kit"
    title="Sample deck title page"
    credit="Northstar Labs"
    creditDetail="Demo series · host supplies brand"
    className="shadow-sm max-w-full"
  />
</div>`,
          render: (
            <div className="overflow-x-auto">
              <PresentationSlideBoard
                layout="title"
                naturalW={640}
                naturalH={360}
                slideId="ns-title"
                slideNum="01"
                kicker="01 · Northstar kit"
                title="Sample deck title page"
                credit="Northstar Labs"
                creditDetail="Demo series · host supplies brand"
                className="shadow-sm max-w-full"
              />
            </div>
          ),
        },
        {
          title: 'layout="bullets"',
          description: 'Header band + bullets + decision callout + brandMeta.',
          code: `<div className="overflow-x-auto">
  <PresentationSlideBoard
    layout="bullets"
    naturalW={640}
    naturalH={360}
    slideId="ns-plan"
    slideNum="02"
    kicker="02 · Plan"
    title="Ship the first slice"
    brandMeta={
      <>
        kit.demo
        <br />
        <span className="font-normal normal-case tracking-normal">Northstar</span>
      </>
    }
    bullets={[
      'Define the success metric before building.',
      'Keep the harness thin until the loop is honest.',
      'Review the high-risk path first.',
    ]}
    callout={{
      impact: 'A named metric keeps the slice honest.',
      takeaways: 'Thin harness beats early ceremony.',
      nextActions: 'Pick one metric the team already owns.',
    }}
    className="shadow-sm max-w-full"
  />
</div>`,
          render: (
            <div className="overflow-x-auto">
              <PresentationSlideBoard
                layout="bullets"
                naturalW={640}
                naturalH={360}
                slideId="ns-plan"
                slideNum="02"
                kicker="02 · Plan"
                title="Ship the first slice"
                brandMeta={
                  <>
                    kit.demo
                    <br />
                    <span className="font-normal normal-case tracking-normal">Northstar</span>
                  </>
                }
                bullets={[
                  'Define the success metric before building.',
                  'Keep the harness thin until the loop is honest.',
                  'Review the high-risk path first.',
                ]}
                callout={{
                  impact: 'A named metric keeps the slice honest.',
                  takeaways: 'Thin harness beats early ceremony.',
                  nextActions: 'Pick one metric the team already owns.',
                }}
                className="shadow-sm max-w-full"
              />
            </div>
          ),
        },
        {
          title: 'layout="figure-wide"',
          description: 'Wide figure stack with figureCaption, bullets, and callout.',
          code: `<div className="overflow-x-auto">
  <PresentationSlideBoard
    layout="figure-wide"
    naturalW={640}
    naturalH={360}
    slideId="ns-wide"
    slideNum="03"
    kicker="03 · Pulse"
    title="Fleet envelope"
    brandMeta={
      <>
        kit.demo
        <br />
        <span className="font-normal normal-case tracking-normal">Northstar</span>
      </>
    }
    figure={
      <div className="flex h-full min-h-[100px] w-full items-center justify-center rounded-md border border-dashed border-[var(--brand-primary)]/35 bg-[var(--brand-primary)]/10 px-3 text-center text-xs font-semibold text-[var(--strong-text-color)]">
        Sample wide figure
      </div>
    }
    figureCaption="Demo fleet · weekly"
    bullets={['Envelope tightened after the gate.', 'Cost tracked the queue depth.']}
    callout={{
      impact: 'Lead time followed review ownership.',
      takeaways: 'Instrument before scale.',
      nextActions: 'Publish the queue board.',
    }}
    className="shadow-sm max-w-full"
  />
</div>`,
          render: (
            <div className="overflow-x-auto">
              <PresentationSlideBoard
                layout="figure-wide"
                naturalW={640}
                naturalH={360}
                slideId="ns-wide"
                slideNum="03"
                kicker="03 · Pulse"
                title="Fleet envelope"
                brandMeta={
                  <>
                    kit.demo
                    <br />
                    <span className="font-normal normal-case tracking-normal">Northstar</span>
                  </>
                }
                figure={<DemoFigurePlaceholder label="Sample wide figure" />}
                figureCaption="Demo fleet · weekly"
                bullets={['Envelope tightened after the gate.', 'Cost tracked the queue depth.']}
                callout={{
                  impact: 'Lead time followed review ownership.',
                  takeaways: 'Instrument before scale.',
                  nextActions: 'Publish the queue board.',
                }}
                className="shadow-sm max-w-full"
              />
            </div>
          ),
        },
        {
          title: 'layout="figure-side"',
          description: 'Side-by-side figure + keypoints column.',
          code: `<div className="overflow-x-auto">
  <PresentationSlideBoard
    layout="figure-side"
    naturalW={640}
    naturalH={360}
    slideId="ns-side"
    slideNum="04"
    kicker="04 · Split"
    title="Side figure board"
    brandMeta={
      <>
        kit.demo
        <br />
        <span className="font-normal normal-case tracking-normal">Northstar</span>
      </>
    }
    figure={
      <div className="flex h-full min-h-[100px] w-full items-center justify-center rounded-md border border-dashed border-[var(--brand-primary)]/35 bg-[var(--brand-primary)]/10 px-3 text-center text-xs font-semibold text-[var(--strong-text-color)]">
        Sample side figure
      </div>
    }
    bullets={['Pin the eval suite.', 'Name one review owner.']}
    callout={{
      impact: 'Ownership cut rework.',
      takeaways: 'Harness follows honest loops.',
      nextActions: 'Retire one status meeting.',
    }}
    className="shadow-sm max-w-full"
  />
</div>`,
          render: (
            <div className="overflow-x-auto">
              <PresentationSlideBoard
                layout="figure-side"
                naturalW={640}
                naturalH={360}
                slideId="ns-side"
                slideNum="04"
                kicker="04 · Split"
                title="Side figure board"
                brandMeta={
                  <>
                    kit.demo
                    <br />
                    <span className="font-normal normal-case tracking-normal">Northstar</span>
                  </>
                }
                figure={<DemoFigurePlaceholder label="Sample side figure" />}
                bullets={['Pin the eval suite.', 'Name one review owner.']}
                callout={{
                  impact: 'Ownership cut rework.',
                  takeaways: 'Harness follows honest loops.',
                  nextActions: 'Retire one status meeting.',
                }}
                className="shadow-sm max-w-full"
              />
            </div>
          ),
        },
        {
          title: 'layout="close"',
          description: 'Close slide with bullets, myth cards, and callout.',
          code: `<div className="overflow-x-auto">
  <PresentationSlideBoard
    layout="close"
    naturalW={640}
    naturalH={360}
    slideId="ns-close"
    slideNum="05"
    kicker="05 · Close"
    title="What to do next"
    brandMeta={
      <>
        kit.demo
        <br />
        <span className="font-normal normal-case tracking-normal">Northstar</span>
      </>
    }
    bullets={[
      'Pick one metric the team already owns.',
      'Instrument the review loop this week.',
    ]}
    cards={[
      {
        title: 'Myth · speed alone',
        body: 'Faster models do not fix a slow review gate.',
      },
      {
        title: 'Watch · shadow work',
        body: 'Unowned queues hide the real cycle cost.',
      },
    ]}
    callout={{
      impact: 'A single owned metric beats a busy calendar.',
      takeaways: 'Close on habits, not more tooling.',
      nextActions: 'Retire one low-signal status meeting.',
    }}
    className="shadow-sm max-w-full"
  />
</div>`,
          render: (
            <div className="overflow-x-auto">
              <PresentationSlideBoard
                layout="close"
                naturalW={640}
                naturalH={360}
                slideId="ns-close"
                slideNum="05"
                kicker="05 · Close"
                title="What to do next"
                brandMeta={
                  <>
                    kit.demo
                    <br />
                    <span className="font-normal normal-case tracking-normal">Northstar</span>
                  </>
                }
                bullets={[
                  'Pick one metric the team already owns.',
                  'Instrument the review loop this week.',
                ]}
                cards={[
                  {
                    title: 'Myth · speed alone',
                    body: 'Faster models do not fix a slow review gate.',
                  },
                  {
                    title: 'Watch · shadow work',
                    body: 'Unowned queues hide the real cycle cost.',
                  },
                ]}
                callout={{
                  impact: 'A single owned metric beats a busy calendar.',
                  takeaways: 'Close on habits, not more tooling.',
                  nextActions: 'Retire one low-signal status meeting.',
                }}
                className="shadow-sm max-w-full"
              />
            </div>
          ),
        },
      ],
    },
    {
      id: 'exec-brief-sheet',
      name: 'ExecBriefSheet',
      description:
        'Dense A4-proportion executive brief. Free-form panels or composed attention / do-dont helpers. Host supplies all copy.',
      importLine:
        "import { ExecBriefSheet, ExecBriefListItem } from 'glt-ui';",
      examples: [
        {
          title: 'Full panels + footer (layout="sheet")',
          description:
            'eyebrow, title, subtitle, meta, panels (accents + takeaways), footer, layout="sheet".',
          code: `<div className="overflow-x-auto">
  <ExecBriefSheet
    layout="sheet"
    eyebrow="Northstar · sample brief"
    title="Fleet review brief"
    subtitle={
      <p className="m-0">
        Fictional weekly snapshot for the design-system demo. Host owns every panel.
      </p>
    }
    meta={
      <span className="rounded-full bg-[var(--brand-primary)]/12 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
        12 Jun
      </span>
    }
    panels={[
      {
        n: 1,
        title: 'Attention shift',
        accent: 'warning',
        body: (
          <p className="m-0 text-[0.62rem] leading-snug">
            Review ownership moved from rotating volunteers to a named gate owner.
          </p>
        ),
        takeaway: 'Name the gate before scaling agents.',
      },
      {
        n: 2,
        title: 'Loop health',
        accent: 'info',
        body: (
          <p className="m-0 text-[0.62rem] leading-snug">
            Cycle time fell after the Northstar metric landed on the team board.
          </p>
        ),
        takeaway: 'Instrument the queue the team already reads.',
      },
      {
        n: 3,
        title: 'Do',
        accent: 'success',
        body: (
          <ul className="m-0 list-none space-y-0.5 p-0">
            <ExecBriefListItem ok>Pin one weekly review slot.</ExecBriefListItem>
            <ExecBriefListItem ok>Publish the queue dashboard.</ExecBriefListItem>
          </ul>
        ),
      },
      {
        n: 4,
        title: "Don't",
        accent: 'brand',
        body: (
          <ul className="m-0 list-none space-y-0.5 p-0">
            <ExecBriefListItem ok={false}>Add meetings without a metric.</ExecBriefListItem>
            <ExecBriefListItem ok={false}>Grow the agent fleet on a thin harness.</ExecBriefListItem>
          </ul>
        ),
      },
    ]}
    footer={
      <p className="m-0 text-[0.62rem] leading-snug text-[var(--secondary-text-color)]">
        Watch · shadow queues · status theater · unowned evals
      </p>
    }
  />
</div>`,
          render: (
            <div className="overflow-x-auto">
              <ExecBriefSheet
                layout="sheet"
                eyebrow="Northstar · sample brief"
                title="Fleet review brief"
                subtitle={
                  <p className="m-0">
                    Fictional weekly snapshot for the design-system demo. Host owns every panel.
                  </p>
                }
                meta={
                  <span className="rounded-full bg-[var(--brand-primary)]/12 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
                    12 Jun
                  </span>
                }
                panels={[
                  {
                    n: 1,
                    title: 'Attention shift',
                    accent: 'warning',
                    body: (
                      <p className="m-0 text-[0.62rem] leading-snug">
                        Review ownership moved from rotating volunteers to a named gate owner.
                      </p>
                    ),
                    takeaway: 'Name the gate before scaling agents.',
                  },
                  {
                    n: 2,
                    title: 'Loop health',
                    accent: 'info',
                    body: (
                      <p className="m-0 text-[0.62rem] leading-snug">
                        Cycle time fell after the Northstar metric landed on the team board.
                      </p>
                    ),
                    takeaway: 'Instrument the queue the team already reads.',
                  },
                  {
                    n: 3,
                    title: 'Do',
                    accent: 'success',
                    body: (
                      <ul className="m-0 list-none space-y-0.5 p-0">
                        <ExecBriefListItem ok>Pin one weekly review slot.</ExecBriefListItem>
                        <ExecBriefListItem ok>Publish the queue dashboard.</ExecBriefListItem>
                      </ul>
                    ),
                  },
                  {
                    n: 4,
                    title: "Don't",
                    accent: 'brand',
                    body: (
                      <ul className="m-0 list-none space-y-0.5 p-0">
                        <ExecBriefListItem ok={false}>
                          Add meetings without a metric.
                        </ExecBriefListItem>
                        <ExecBriefListItem ok={false}>
                          Grow the agent fleet on a thin harness.
                        </ExecBriefListItem>
                      </ul>
                    ),
                  },
                ]}
                footer={
                  <p className="m-0 text-[0.62rem] leading-snug text-[var(--secondary-text-color)]">
                    Watch · shadow queues · status theater · unowned evals
                  </p>
                }
              />
            </div>
          ),
        },
        {
          title: 'Composed attention + do/dont (responsive)',
          description:
            'When panels is omitted, attentionRows and do/dont helpers compose panels. Covers all attention* and do/dont props.',
          code: `<ExecBriefSheet
  layout="responsive"
  title="Northstar attention brief"
  subtitle={
    <p className="m-0">
      Composed mode: attention table + do/dont checklists without free-form panels.
    </p>
  }
  attentionTitle="Attention reweight"
  attentionCaption="Share of weekly focus · fictional demo series"
  attentionTakeaway="Move hours toward review ownership and harness depth."
  attentionMax={50}
  attentionBeforeLabel="Before"
  attentionAfterLabel="After"
  attentionDeltaLabel="Δpp"
  attentionRows={[
    { label: 'Status meetings', before: 28, after: 12 },
    { label: 'Review gate', before: 10, after: 26 },
    { label: 'Harness evals', before: 8, after: 18 },
    { label: 'Ad-hoc firefight', before: 22, after: 14 },
  ]}
  doTitle="Invest"
  dontTitle="Cut"
  doItems={['Name a review owner', 'Publish queue latency', 'Pin weekly eval suite']}
  dontItems={['Grow agents without hooks', 'Add meetings without a metric']}
  footer={
    <p className="m-0 text-[0.62rem] leading-snug text-[var(--secondary-text-color)]">
      Sample kit · host supplies every row
    </p>
  }
/>`,
          render: (
            <ExecBriefSheet
              layout="responsive"
              title="Northstar attention brief"
              subtitle={
                <p className="m-0">
                  Composed mode: attention table + do/dont checklists without free-form panels.
                </p>
              }
              attentionTitle="Attention reweight"
              attentionCaption="Share of weekly focus · fictional demo series"
              attentionTakeaway="Move hours toward review ownership and harness depth."
              attentionMax={50}
              attentionBeforeLabel="Before"
              attentionAfterLabel="After"
              attentionDeltaLabel="Δpp"
              attentionRows={[
                { label: 'Status meetings', before: 28, after: 12 },
                { label: 'Review gate', before: 10, after: 26 },
                { label: 'Harness evals', before: 8, after: 18 },
                { label: 'Ad-hoc firefight', before: 22, after: 14 },
              ]}
              doTitle="Invest"
              dontTitle="Cut"
              doItems={[
                'Name a review owner',
                'Publish queue latency',
                'Pin weekly eval suite',
              ]}
              dontItems={['Grow agents without hooks', 'Add meetings without a metric']}
              footer={
                <p className="m-0 text-[0.62rem] leading-snug text-[var(--secondary-text-color)]">
                  Sample kit · host supplies every row
                </p>
              }
            />
          ),
        },
      ],
    },
    {
      id: 'presentation-strip',
      name: 'PresentationStrip',
      description:
        'Thumbnail strip + fullscreen present mode. Host supplies slides via renderSlide; FitContain / PresentationSlideFrame optional helpers.',
      importLine:
        "import { PresentationStrip, PresentationSlideFrame, FitContain } from 'glt-ui';",
      examples: [
        {
          title: 'Sample three-slide deck',
          code: `const slides = [
  { id: 'title', num: '01', label: 'Title' },
  { id: 'plan', num: '02', label: 'Plan' },
  { id: 'close', num: '03', label: 'Close' },
];

function renderSlide(_i, slide) {
  return (
    <PresentationSlideFrame
      slideId={slide.id}
      slideNum={slide.num}
      naturalW={960}
      naturalH={540}
      kicker={\`\${slide.num} · Sample\`}
      title={slide.label}
      brandMeta={
        <>
          kit.demo
          <br />
          <span className="font-normal normal-case tracking-normal">Sample deck</span>
        </>
      }
      hideHeader={slide.id === 'title'}
      className="shadow-sm"
    >
      {/* host body */}
    </PresentationSlideFrame>
  );
}

<PresentationStrip
  label="Presentation"
  title="Sample deck"
  description="Host-supplied slides for the design-system demo. Scroll thumbs, step, or open full screen."
  dialogTitle="Sample presentation"
  slideNaturalW={960}
  slideNaturalH={540}
  slides={slides}
  renderSlide={renderSlide}
/>`,
          render: (
            <PresentationStrip
              label="Presentation"
              title="Sample deck"
              description="Host-supplied slides for the design-system demo. Scroll thumbs, step, or open full screen."
              dialogTitle="Sample presentation"
              slideNaturalW={960}
              slideNaturalH={540}
              slides={DEMO_PRESENTATION_SLIDES}
              renderSlide={(_i, slide) => (
                <DemoPresentationSlide slide={slide} naturalW={960} naturalH={540} />
              )}
            />
          ),
        },
        {
          title: 'PresentationSlideFrame',
          code: `<PresentationSlideFrame
  slideId="frame-demo"
  slideNum="04"
  naturalW={640}
  naturalH={360}
  kicker="04 · Frame"
  title="Standalone board chrome"
  brandMeta={
    <>
      kit.demo
      <br />
      <span className="font-normal normal-case tracking-normal">Frame props</span>
    </>
  }
  className="shadow-sm max-w-full"
>
  <Text size="sm" tone="secondary">
    naturalW / naturalH set board size; kicker, title, brandMeta fill the header.
  </Text>
</PresentationSlideFrame>`,
          render: (
            <div className="overflow-x-auto">
              <PresentationSlideFrame
                slideId="frame-demo"
                slideNum="04"
                naturalW={640}
                naturalH={360}
                kicker="04 · Frame"
                title="Standalone board chrome"
                brandMeta={
                  <>
                    kit.demo
                    <br />
                    <span className="font-normal normal-case tracking-normal">Frame props</span>
                  </>
                }
                className="shadow-sm max-w-full"
              >
                <Text size="sm" tone="secondary">
                  naturalW / naturalH set board size; kicker, title, brandMeta fill the header.
                </Text>
              </PresentationSlideFrame>
            </div>
          ),
        },
        {
          title: 'FitContain (active + pad)',
          code: `<div className="h-40 w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg-color)]">
  <FitContain active naturalW={320} naturalH={180} pad={24}>
    <div
      className="flex items-center justify-center rounded-md border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/10 text-sm font-semibold text-[var(--strong-text-color)]"
      style={{ width: 320, height: 180 }}
    >
      320×180 board · pad 24 · active remeasure
    </div>
  </FitContain>
</div>`,
          render: (
            <div className="h-40 w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg-color)]">
              <FitContain active naturalW={320} naturalH={180} pad={24}>
                <div
                  className="flex items-center justify-center rounded-md border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/10 text-sm font-semibold text-[var(--strong-text-color)]"
                  style={{ width: 320, height: 180 }}
                >
                  320×180 board · pad 24 · active remeasure
                </div>
              </FitContain>
            </div>
          ),
        },
      ],
    },
    {
      id: 'knowledge-tree-map',
      name: 'KnowledgeTreeMap',
      description:
        'Map-in-context vs encyclopedia-on-disk tree. Host supplies the tree and chrome labels.',
      importLine: "import { KnowledgeTreeMap } from 'glt-ui';",
      examples: [
        {
          title: 'Sample knowledge tree',
          code: `<KnowledgeTreeMap
  title="Sample knowledge map"
  description="Fictional progressive-disclosure tree for the design-system demo."
  claim="Map in context · encyclopedia on disk"
  claimSub="Open only the branch needed"
  mapPanelKicker="Injected into context"
  mapName="MAP.md"
  mapMeta={['~80 lines', 'table of contents']}
  mapFoot="Stable prefix · cheap to re-read"
  storeKicker="System of record · knowledge store"
  tree={[
    { name: 'MAP.md', kind: 'map' },
    { name: 'OVERVIEW.md', kind: 'file' },
    {
      name: 'docs/',
      kind: 'folder',
      children: [
        {
          name: 'guides/',
          kind: 'folder',
          children: [
            { name: 'onboarding.md', kind: 'leaf' },
            { name: '…', kind: 'ellipsis' },
          ],
        },
        {
          name: 'runbooks/',
          kind: 'folder',
          children: [
            { name: 'deploy.md', kind: 'leaf' },
            { name: 'rollback.md', kind: 'leaf' },
          ],
        },
        { name: 'GLOSSARY.md', kind: 'leaf' },
      ],
    },
  ]}
/>`,
          render: (
            <KnowledgeTreeMap
              title="Sample knowledge map"
              description="Fictional progressive-disclosure tree for the design-system demo."
              claim="Map in context · encyclopedia on disk"
              claimSub="Open only the branch needed"
              mapPanelKicker="Injected into context"
              mapName="MAP.md"
              mapMeta={['~80 lines', 'table of contents']}
              mapFoot="Stable prefix · cheap to re-read"
              storeKicker="System of record · knowledge store"
              tree={[
                { name: 'MAP.md', kind: 'map' },
                { name: 'OVERVIEW.md', kind: 'file' },
                {
                  name: 'docs/',
                  kind: 'folder',
                  children: [
                    {
                      name: 'guides/',
                      kind: 'folder',
                      children: [
                        { name: 'onboarding.md', kind: 'leaf' },
                        { name: '…', kind: 'ellipsis' },
                      ],
                    },
                    {
                      name: 'runbooks/',
                      kind: 'folder',
                      children: [
                        { name: 'deploy.md', kind: 'leaf' },
                        { name: 'rollback.md', kind: 'leaf' },
                      ],
                    },
                    { name: 'GLOSSARY.md', kind: 'leaf' },
                  ],
                },
              ]}
            />
          ),
        },
      ],
    },
  ],
};
