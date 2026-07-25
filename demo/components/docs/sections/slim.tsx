'use client';

import * as React from 'react';
import {
  Badge,
  Button,
  Callout,
  Card,
  CardContent,
  Chart,
  Checkbox,
  Container,
  Divider,
  FigureDataTableToggle,
  FullBleedFigure,
  Grid,
  Icon,
  List,
  ListItem,
  PageHero,
  ProcessPipeline,
  Quote,
  SiteFooter,
  SiteHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
  Tooltip,
} from 'glt-ui';
import type { DocSection } from '../types';

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
      description: 'Landing process steps.',
      importLine: "import { ProcessPipeline } from 'glt-ui';",
      examples: [
        {
          title: 'Steps',
          code: '<ProcessPipeline steps={[…]} />',
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
  ],
};
