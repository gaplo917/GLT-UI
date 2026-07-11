'use client';
import * as React from 'react';
import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardFooterItem,
  CardHeader,
  CardHeaderIcon,
  CardHeaderTitle,
  CardImage,
  CardTitle,
  Chart,
  BenchmarkChart,
  ComparisonSlider,
  CountUp,
  DataHighlight,
  DataTable,
  Figure,
  ProgressRing,
  Sparkline,
  DerivedMetric,
  Grid,
  ImagePlaceholder,
  ProgressBar,
  StatGrid,
  StatMetric,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow,
  TagGroup,
  Text,
  TechniqueGrid,
} from 'glt-ui';
import type { DocSection } from '../types';

/** Local demo: removable chips backed by component state. */
function ChipsDemo() {
  const [tags, setTags] = React.useState(['latency', 'agents', 'scaling']);
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {tags.map((t) => (
        <Badge
          key={t}
          variant="outline"
          removable
          onRemove={() => setTags((xs) => xs.filter((x) => x !== t))}
        >
          {t}
        </Badge>
      ))}
    </div>
  );
}

const tableRows = [
  { model: 'Atlas-7B', tokens: '7.0B', latency: '120ms' },
  { model: 'Atlas-13B', tokens: '13.0B', latency: '210ms' },
  { model: 'Atlas-70B', tokens: '70.0B', latency: '640ms' },
];

const techniqueItems = [
  {
    id: 'speculative-decoding',
    org: 'Anthropic',
    title: 'Speculative Decoding',
    summary: 'Draft-and-verify token generation to cut wall-clock latency.',
    impact: '2.1x faster',
  },
  {
    id: 'kv-cache-reuse',
    org: 'GLT Labs',
    title: 'KV-Cache Reuse',
    summary: 'Share prefix caches across sibling requests in a batch.',
    impact: '35% cheaper',
  },
  {
    id: 'mixture-of-experts',
    org: 'OpenResearch',
    title: 'Mixture of Experts',
    summary: 'Route each token to a sparse subset of expert layers.',
    impact: '4x capacity',
  },
];

export const dataSection: DocSection = {
  id: 'data-display',
  title: 'Data Display',
  blurb: 'Cards, tables, metrics, and status chips.',
  entries: [
    {
      id: 'card',
      name: 'Card',
      description:
        'An all-around flexible, composable surface. Mix and match a header bar (CardHeader with CardHeaderTitle / CardHeaderIcon), a full-bleed CardImage, a padded CardContent, and a CardFooter of evenly-divided CardFooterItem controls — in any order.',
      importLine:
        "import { Card, CardHeader, CardHeaderTitle, CardHeaderIcon, CardImage, CardContent, CardFooter, CardFooterItem } from 'glt-ui';",
      examples: [
        {
          title: 'Composed',
          description:
            'The full composition: a header bar with a title and an icon action, a body, and a footer split into evenly-divided controls.',
          previewClassName: 'max-w-md',
          code: `<Card variant="research">
  <CardHeader>
    <CardHeaderTitle>Throughput report</CardHeaderTitle>
    <CardHeaderIcon aria-label="More options">⋯</CardHeaderIcon>
  </CardHeader>
  <CardContent>
    <Text>Requests are trending 12% above the previous period, with stable p95 latency.</Text>
  </CardContent>
  <CardFooter>
    <CardFooterItem>View</CardFooterItem>
    <CardFooterItem>Export</CardFooterItem>
  </CardFooter>
</Card>`,
          render: (
            <Card variant="research">
              <CardHeader>
                <CardHeaderTitle>Throughput report</CardHeaderTitle>
                <CardHeaderIcon aria-label="More options">
                  <Text as="span" size="lg" aria-hidden="true">⋯</Text>
                </CardHeaderIcon>
              </CardHeader>
              <CardContent>
                <Text>
                  Requests are trending 12% above the previous period, with stable p95
                  latency.
                </Text>
              </CardContent>
              <CardFooter>
                <CardFooterItem>View</CardFooterItem>
                <CardFooterItem>Export</CardFooterItem>
              </CardFooter>
            </Card>
          ),
        },
        {
          title: 'With image',
          description:
            'CardImage is a full-width, edge-to-edge media slot clipped to the rounded corners. Pass src/alt for a responsive image, or drop in your own placeholder.',
          previewClassName: 'max-w-sm',
          code: `<Card variant="elevated">
  <CardImage>
    <ImagePlaceholder label="16 : 9 cover image" ratio="video" />
  </CardImage>
  <CardContent>
    <CardTitle>Model release</CardTitle>
    <CardDescription>Checkpoint 42 is now serving production traffic.</CardDescription>
  </CardContent>
</Card>`,
          render: (
            <Card variant="elevated">
              <CardImage>
                <ImagePlaceholder label="16 : 9 cover image" ratio="video" />
              </CardImage>
              <CardContent>
                <CardTitle>Model release</CardTitle>
                <CardDescription>
                  Checkpoint 42 is now serving production traffic.
                </CardDescription>
              </CardContent>
            </Card>
          ),
        },
        {
          title: 'Centered header',
          description:
            'Center the header title by setting centered on CardHeaderTitle.',
          previewClassName: 'max-w-md',
          code: `<Card>
  <CardHeader>
    <CardHeaderTitle centered>Weekly summary</CardHeaderTitle>
  </CardHeader>
  <CardContent>
    <Text align="center">Everything nominal across all regions.</Text>
  </CardContent>
</Card>`,
          render: (
            <Card>
              <CardHeader>
                <CardHeaderTitle centered>Weekly summary</CardHeaderTitle>
              </CardHeader>
              <CardContent>
                <Text align="center">Everything nominal across all regions.</Text>
              </CardContent>
            </Card>
          ),
        },
        {
          title: 'Variants',
          description:
            'Six surface treatments. Content is wrapped in CardContent so the padding-free container can host flush headers and images.',
          code: `<Grid columns={1} gap={3} className="sm:grid-cols-2 lg:grid-cols-3">
  <Card variant="default"><CardContent><CardTitle>Default</CardTitle><CardDescription>Standard surface.</CardDescription></CardContent></Card>
  <Card variant="research"><CardContent><CardTitle>Research</CardTitle><CardDescription>For findings.</CardDescription></CardContent></Card>
  <Card variant="stat"><CardContent><CardTitle>Stat</CardTitle><CardDescription>For metrics.</CardDescription></CardContent></Card>
  <Card variant="tech"><CardContent><CardTitle>Tech</CardTitle><CardDescription>For techniques.</CardDescription></CardContent></Card>
  <Card variant="outline"><CardContent><CardTitle>Outline</CardTitle><CardDescription>Bordered, flat.</CardDescription></CardContent></Card>
  <Card variant="elevated"><CardContent><CardTitle>Elevated</CardTitle><CardDescription>Raised shadow.</CardDescription></CardContent></Card>
</Grid>`,
          render: (
            <Grid columns={1} gap={3} className="sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ['default', 'Default', 'Standard surface.'],
                  ['research', 'Research', 'For findings.'],
                  ['stat', 'Stat', 'For metrics.'],
                  ['tech', 'Tech', 'For techniques.'],
                  ['outline', 'Outline', 'Bordered, flat.'],
                  ['elevated', 'Elevated', 'Raised shadow.'],
                ] as const
              ).map(([variant, title, desc]) => (
                <Card key={variant} variant={variant}>
                  <CardContent>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          ),
        },
        {
          title: 'Interactive',
          description:
            'Set interactive for a hover lift and attach a native onClick handler.',
          previewClassName: 'max-w-md',
          code: `<Card interactive variant="tech" onClick={() => alert('clicked')}>
  <CardContent>
    <CardTitle>Open dashboard</CardTitle>
    <CardDescription>Click anywhere on this card to drill in.</CardDescription>
  </CardContent>
</Card>`,
          render: (
            <Card interactive variant="tech" onClick={() => alert('clicked')}>
              <CardContent>
                <CardTitle>Open dashboard</CardTitle>
                <CardDescription>
                  Click anywhere on this card to drill in.
                </CardDescription>
              </CardContent>
            </Card>
          ),
        },
      ],
    },
    {
      id: 'data-table',
      name: 'DataTable',
      description:
        "A typed, column-driven table built on the composable Table organism. Each column's align is applied to both its header and body cells so they always line up. Supports custom cell rendering, a highlight column, and bordered / borderless / striped / hoverable / compact styles.",
      importLine: "import { DataTable } from 'glt-ui';",
      examples: [
        {
          title: 'Highlighted column',
          description:
            'Three columns where the latency column is emphasised via highlight.',
          code: `const rows = [
  { model: 'Atlas-7B', tokens: '7.0B', latency: '120ms' },
  { model: 'Atlas-13B', tokens: '13.0B', latency: '210ms' },
  { model: 'Atlas-70B', tokens: '70.0B', latency: '640ms' },
];

<DataTable
  columns={[
    { key: 'model', header: 'Model' },
    { key: 'tokens', header: 'Parameters', align: 'right' },
    { key: 'latency', header: 'p95 latency', align: 'right', highlight: true },
  ]}
  rows={rows}
/>`,
          render: (
            <DataTable
              columns={[
                { key: 'model', header: 'Model' },
                { key: 'tokens', header: 'Parameters', align: 'right' },
                {
                  key: 'latency',
                  header: 'p95 latency',
                  align: 'right',
                  highlight: true,
                },
              ]}
              rows={tableRows}
            />
          ),
        },
        {
          title: 'Bordered',
          description: 'Set bordered to draw a rule around every cell.',
          code: `<DataTable
  bordered
  columns={[
    { key: 'model', header: 'Model' },
    { key: 'tokens', header: 'Parameters', align: 'right' },
    { key: 'latency', header: 'p95 latency', align: 'right' },
  ]}
  rows={rows}
/>`,
          render: (
            <DataTable
              bordered
              columns={[
                { key: 'model', header: 'Model' },
                { key: 'tokens', header: 'Parameters', align: 'right' },
                { key: 'latency', header: 'p95 latency', align: 'right' },
              ]}
              rows={tableRows}
            />
          ),
        },
        {
          title: 'Striped & hoverable',
          description: 'Zebra-stripe body rows and highlight the row under the cursor.',
          code: `<DataTable
  striped
  hoverable
  columns={[
    { key: 'model', header: 'Model' },
    { key: 'tokens', header: 'Parameters', align: 'right' },
    { key: 'latency', header: 'p95 latency', align: 'right' },
  ]}
  rows={rows}
/>`,
          render: (
            <DataTable
              striped
              hoverable
              columns={[
                { key: 'model', header: 'Model' },
                { key: 'tokens', header: 'Parameters', align: 'right' },
                { key: 'latency', header: 'p95 latency', align: 'right' },
              ]}
              rows={tableRows}
            />
          ),
        },
        {
          title: 'Borderless & compact',
          description: 'Drop all rules with borderless and tighten padding with compact.',
          code: `<DataTable
  borderless
  compact
  headed={false}
  columns={[
    { key: 'model', header: 'Model' },
    { key: 'tokens', header: 'Parameters', align: 'right' },
    { key: 'latency', header: 'p95 latency', align: 'right' },
  ]}
  rows={rows}
/>`,
          render: (
            <DataTable
              borderless
              compact
              headed={false}
              columns={[
                { key: 'model', header: 'Model' },
                { key: 'tokens', header: 'Parameters', align: 'right' },
                { key: 'latency', header: 'p95 latency', align: 'right' },
              ]}
              rows={tableRows}
            />
          ),
        },
      ],
      propsTables: [
        {
          title: 'DataTable',
          props: [
            { name: 'columns', type: 'DataTableColumn<T>[]', required: true, description: 'Column definitions, in display order.' },
            { name: 'rows', type: 'T[]', required: true, description: 'Row data objects rendered into the body.' },
            { name: 'bordered', type: 'boolean', default: 'false', description: 'Draw a border around every cell.' },
            { name: 'borderless', type: 'boolean', default: 'false', description: 'Remove borders and row dividers.' },
            { name: 'striped', type: 'boolean', default: 'false', description: 'Zebra-stripe body rows.' },
            { name: 'hoverable', type: 'boolean', default: 'false', description: 'Highlight body rows on hover.' },
            { name: 'compact', type: 'boolean', default: 'false', description: 'Tighter cell padding.' },
            { name: 'headed', type: 'boolean', default: 'true', description: 'Shade the header row.' },
            { name: 'className', type: 'string', description: 'Extra classes merged onto the <table>.' },
          ],
        },
        {
          title: 'DataTableColumn<T>',
          props: [
            { name: 'key', type: 'keyof T | string', required: true, description: 'Row property to read, and the cell key.' },
            { name: 'header', type: 'React.ReactNode', required: true, description: 'Header cell content.' },
            { name: 'align', type: "'left' | 'center' | 'right'", description: 'Alignment applied to the header AND body cells.' },
            { name: 'render', type: '(row: T) => React.ReactNode', description: 'Custom cell renderer; overrides the raw key value.' },
            { name: 'highlight', type: 'boolean', description: 'Emphasise this column in the brand colour.' },
          ],
        },
      ],
    },
    {
      id: 'table',
      name: 'Table',
      description:
        'A generic, composable HTML table. Assemble it from TableHead / TableBody / TableFoot, TableRow, TableHeaderCell, and TableCell. Cell padding, borders, striping, and hover are driven by props on Table; per-cell alignment lives on the cells via align (keep a header and its column cells identical so they line up).',
      importLine:
        "import { Table, TableHead, TableBody, TableFoot, TableRow, TableHeaderCell, TableCell } from 'glt-ui';",
      examples: [
        {
          title: 'Composed table',
          description:
            'Header, body, and a footer row. Right-aligned columns align header and cells together.',
          code: `<Table>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Region</TableHeaderCell>
      <TableHeaderCell align="right">Requests</TableHeaderCell>
      <TableHeaderCell align="right">Error rate</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>us-east</TableCell>
      <TableCell align="right">1,204,882</TableCell>
      <TableCell align="right">0.02%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>eu-west</TableCell>
      <TableCell align="right">842,113</TableCell>
      <TableCell align="right">0.05%</TableCell>
    </TableRow>
  </TableBody>
  <TableFoot>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell align="right">2,046,995</TableCell>
      <TableCell align="right">0.03%</TableCell>
    </TableRow>
  </TableFoot>
</Table>`,
          render: (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Region</TableHeaderCell>
                  <TableHeaderCell align="right">Requests</TableHeaderCell>
                  <TableHeaderCell align="right">Error rate</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>us-east</TableCell>
                  <TableCell align="right">1,204,882</TableCell>
                  <TableCell align="right">0.02%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>eu-west</TableCell>
                  <TableCell align="right">842,113</TableCell>
                  <TableCell align="right">0.05%</TableCell>
                </TableRow>
              </TableBody>
              <TableFoot>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">2,046,995</TableCell>
                  <TableCell align="right">0.03%</TableCell>
                </TableRow>
              </TableFoot>
            </Table>
          ),
        },
        {
          title: 'Bordered & compact',
          description: 'Every cell gets a border; compact tightens the padding.',
          code: `<Table bordered compact>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Key</TableHeaderCell>
      <TableHeaderCell>Value</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Growth rate</TableCell>
      <TableCell>3.2%</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Horizon</TableCell>
      <TableCell>10 years</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
          render: (
            <Table bordered compact>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Key</TableHeaderCell>
                  <TableHeaderCell>Value</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Growth rate</TableCell>
                  <TableCell>3.2%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Horizon</TableCell>
                  <TableCell>10 years</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ),
        },
        {
          title: 'Rich cells: images & long text',
          description:
            'Cells accept any content — an Avatar, an ImagePlaceholder, or a wrapping paragraph. Set valign="top" so tall rows keep their columns aligned to the first line. A TableCaption titles the table for assistive tech.',
          code: `<Table hoverable>
  <TableCaption>Featured inference models — updated hourly</TableCaption>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Model</TableHeaderCell>
      <TableHeaderCell>Summary</TableHeaderCell>
      <TableHeaderCell align="right">Latency</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell valign="top">
        <div className="flex flex-row gap-2 items-center">
          <Avatar initials="A7" size="sm" />
          <Text weight="semibold">Atlas-7B</Text>
        </div>
      </TableCell>
      <TableCell valign="top">
        <Text>
          A compact draft model tuned for speculative decoding. Handles
          short-context chat and classification with a small memory
          footprint, making it a strong default for edge deployments.
        </Text>
      </TableCell>
      <TableCell align="right" valign="top">120ms</TableCell>
    </TableRow>
    <TableRow>
      <TableCell valign="top">
        <div className="flex flex-col gap-2">
          <ImagePlaceholder label="Preview" ratio="video" className="w-32" />
          <Text weight="semibold">Atlas-70B</Text>
        </div>
      </TableCell>
      <TableCell valign="top">
        <Text>
          The flagship dense model. Prioritises reasoning quality over raw
          throughput and pairs well with KV-cache reuse across sibling
          requests in a batch.
        </Text>
      </TableCell>
      <TableCell align="right" valign="top">640ms</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
          render: (
            <Table hoverable>
              <TableCaption>Featured inference models — updated hourly</TableCaption>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Model</TableHeaderCell>
                  <TableHeaderCell>Summary</TableHeaderCell>
                  <TableHeaderCell align="right">Latency</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell valign="top">
                    <div className="flex flex-row gap-2 items-center">
                      <Avatar initials="A7" size="sm" />
                      <Text weight="semibold">Atlas-7B</Text>
                    </div>
                  </TableCell>
                  <TableCell valign="top">
                    <Text>
                      A compact draft model tuned for speculative decoding. Handles
                      short-context chat and classification with a small memory
                      footprint, making it a strong default for edge deployments.
                    </Text>
                  </TableCell>
                  <TableCell align="right" valign="top">
                    120ms
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell valign="top">
                    <div className="flex flex-col gap-2">
                      <ImagePlaceholder label="Preview" ratio="video" className="w-32" />
                      <Text weight="semibold">Atlas-70B</Text>
                    </div>
                  </TableCell>
                  <TableCell valign="top">
                    <Text>
                      The flagship dense model. Prioritises reasoning quality over raw
                      throughput and pairs well with KV-cache reuse across sibling
                      requests in a batch.
                    </Text>
                  </TableCell>
                  <TableCell align="right" valign="top">
                    640ms
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ),
        },
        {
          title: 'Striped & hoverable',
          description: 'Zebra-striped body rows with a hover highlight — good for dense, scannable lists.',
          code: `<Table striped hoverable>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Model</TableHeaderCell>
      <TableHeaderCell align="right">Params</TableHeaderCell>
      <TableHeaderCell align="right">Latency</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Atlas-7B</TableCell>
      <TableCell align="right">7.0B</TableCell>
      <TableCell align="right">120ms</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Atlas-13B</TableCell>
      <TableCell align="right">13.0B</TableCell>
      <TableCell align="right">210ms</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Atlas-70B</TableCell>
      <TableCell align="right">70.0B</TableCell>
      <TableCell align="right">640ms</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
          render: (
            <Table striped hoverable>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Model</TableHeaderCell>
                  <TableHeaderCell align="right">Params</TableHeaderCell>
                  <TableHeaderCell align="right">Latency</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((r) => (
                  <TableRow key={r.model}>
                    <TableCell>{r.model}</TableCell>
                    <TableCell align="right">{r.tokens}</TableCell>
                    <TableCell align="right">{r.latency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ),
        },
      ],
      propsTables: [
        {
          title: 'Table',
          props: [
            { name: 'bordered', type: 'boolean', default: 'false', description: 'Draw a border around every cell.' },
            { name: 'borderless', type: 'boolean', default: 'false', description: 'Remove all borders and row dividers.' },
            { name: 'striped', type: 'boolean', default: 'false', description: 'Zebra-stripe body rows.' },
            { name: 'hoverable', type: 'boolean', default: 'false', description: 'Highlight body rows on hover.' },
            { name: 'compact', type: 'boolean', default: 'false', description: 'Tighter cell padding.' },
            { name: 'fullWidth', type: 'boolean', default: 'true', description: 'Stretch to the container width.' },
            { name: '…rest', type: 'React.TableHTMLAttributes<HTMLTableElement>', description: 'Forwarded to the underlying <table>.' },
          ],
        },
        {
          title: 'TableHeaderCell / TableCell',
          props: [
            { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Horizontal alignment; keep a header and its column cells identical.' },
            { name: 'valign', type: "'top' | 'middle' | 'bottom'", default: "'middle'", description: 'Vertical alignment; use top for image or long-paragraph rows.' },
            { name: '…rest', type: 'React.Th/TdHTMLAttributes<HTMLTableCellElement>', description: 'Forwarded to the underlying <th> / <td>.' },
          ],
        },
        {
          title: 'TableCaption / TableHead / TableBody / TableFoot / TableRow',
          props: [
            { name: '…rest', type: 'React.HTMLAttributes<HTMLElement>', description: 'Structural sub-parts. TableCaption renders a <caption>; the rest render <thead> / <tbody> / <tfoot> / <tr> and forward all attributes.' },
          ],
        },
      ],
    },
    {
      id: 'chart',
      name: 'Chart',
      description:
        "A themed wrapper around chart.js. Feed it labels + series for the common case — palette, fonts, grid, tooltip, and legend are all pulled from theme tokens and re-read automatically when the theme switches between light and dark. By default, pie/doughnut slices and single-series bars use a different palette color per category; multi-series and stacked charts use one color per series. Category label + numeric value are drawn on every bar, slice, and point (dataLabels={false} to hide). Colors accept palette tokens ('brand', 'success', …), CSS custom-property names, or raw CSS colors. Drop down to raw chart.js any time via the data, options, and plugins escape hatches. type=\"area\" is sugar for a filled line chart.",
      importLine: "import { Chart } from 'glt-ui';",
      examples: [
        {
          title: 'Line chart',
          description:
            'Two series with the default token palette. Each series is a { label, data, color? } object — colors default to palette slots by index.',
          code: `<Chart
  type="line"
  height={240}
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  series={[
    { label: 'Requests', data: [120, 190, 170, 250, 220, 310], color: 'brand' },
    { label: 'Errors', data: [8, 12, 6, 14, 9, 11], color: 'danger' },
  ]}
/>`,
          render: (
            <Chart
              type="line"
              height={240}
              labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
              series={[
                { label: 'Requests', data: [120, 190, 170, 250, 220, 310], color: 'brand' },
                { label: 'Errors', data: [8, 12, 6, 14, 9, 11], color: 'danger' },
              ]}
            />
          ),
        },
        {
          title: 'Stacked area',
          description:
            'type="area" fills under the line; stacked layers the series. Legend moved to the bottom.',
          code: `<Chart
  type="area"
  stacked
  legend="bottom"
  height={240}
  labels={['Q1', 'Q2', 'Q3', 'Q4']}
  series={[
    { label: 'Cache hits', data: [40, 55, 60, 75], color: 'success' },
    { label: 'Cache misses', data: [20, 18, 15, 12], color: 'warning' },
  ]}
/>`,
          render: (
            <Chart
              type="area"
              stacked
              legend="bottom"
              height={240}
              labels={['Q1', 'Q2', 'Q3', 'Q4']}
              series={[
                { label: 'Cache hits', data: [40, 55, 60, 75], color: 'success' },
                { label: 'Cache misses', data: [20, 18, 15, 12], color: 'warning' },
              ]}
            />
          ),
        },
        {
          title: 'Categorical bar (multi-color)',
          description:
            'A single bar series without color paints each category from the default palette (brand, info, success, …) — the same pattern as pie slices. Set series[].color for monochrome bars; multi-series / stacked charts keep one color per series.',
          code: `<Chart
  type="bar"
  height={260}
  legend={false}
  title="Human-first (pre-agent)"
  labels={[
    'Implementation / coding',
    'Review & verification',
    'Specification & design',
    'Coordination & orchestration',
    'Coherence, architecture & harness',
  ]}
  series={[{ data: [48, 15, 14, 13, 10] }]}
  options={{
    indexAxis: 'y',
    scales: { x: { max: 55, ticks: { callback: (v) => \`\${v}%\` } } },
  }}
/>`,
          render: (
            <Chart
              type="bar"
              height={260}
              legend={false}
              title="Human-first (pre-agent)"
              labels={[
                'Implementation / coding',
                'Review & verification',
                'Specification & design',
                'Coordination & orchestration',
                'Coherence, architecture & harness',
              ]}
              series={[{ data: [48, 15, 14, 13, 10] }]}
              options={{
                indexAxis: 'y',
                scales: { x: { max: 55, ticks: { callback: (v) => `${v}%` } } },
              }}
            />
          ),
        },
        {
          title: 'Stacked bar',
          description:
            'stacked stacks series on the category axis; each series still takes a different palette slot by index when color is omitted.',
          code: `<Chart
  type="bar"
  stacked
  height={240}
  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
  series={[
    { label: 'Build', data: [12, 15, 11, 14, 13] },
    { label: 'Test', data: [8, 7, 9, 6, 8] },
    { label: 'Review', data: [5, 6, 4, 7, 5] },
  ]}
/>`,
          render: (
            <Chart
              type="bar"
              stacked
              height={240}
              labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
              series={[
                { label: 'Build', data: [12, 15, 11, 14, 13] },
                { label: 'Test', data: [8, 7, 9, 6, 8] },
                { label: 'Review', data: [5, 6, 4, 7, 5] },
              ]}
            />
          ),
        },
        {
          title: 'Doughnut',
          description:
            'Circular charts (pie / doughnut / polarArea) colour each slice from the palette automatically. A title and caption render via the Text atom.',
          code: `<Chart
  type="doughnut"
  height={260}
  legend="right"
  title="Traffic by region"
  caption="Share of total requests, last 24h"
  labels={['us-east', 'eu-west', 'ap-south', 'sa-east']}
  series={[{ label: 'Requests', data: [52, 24, 16, 8] }]}
/>`,
          render: (
            <Chart
              type="doughnut"
              height={260}
              legend="right"
              title="Traffic by region"
              caption="Share of total requests, last 24h"
              labels={['us-east', 'eu-west', 'ap-south', 'sa-east']}
              series={[{ label: 'Requests', data: [52, 24, 16, 8] }]}
            />
          ),
        },
        {
          title: 'Mixed bar + line',
          description:
            'Set type on a single series to override it — here a line rides on top of bars. The chart-level type is the default for the rest. Explicit color keeps the bar series monochrome.',
          code: `<Chart
  type="bar"
  height={240}
  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
  series={[
    { label: 'Throughput', data: [820, 910, 870, 1020, 990], color: 'info' },
    { label: 'Target', type: 'line', data: [900, 900, 900, 900, 900], color: 'danger' },
  ]}
/>`,
          render: (
            <Chart
              type="bar"
              height={240}
              labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
              series={[
                { label: 'Throughput', data: [820, 910, 870, 1020, 990], color: 'info' },
                { label: 'Target', type: 'line', data: [900, 900, 900, 900, 900], color: 'danger' },
              ]}
            />
          ),
        },
        {
          title: 'Escape hatch: raw options',
          description:
            'options is deep-merged over the themed defaults, so you keep the theme and override only what you name — here a percentage y-axis tick callback and a hidden legend.',
          code: `<Chart
  type="line"
  height={240}
  legend={false}
  labels={['v1', 'v2', 'v3', 'v4', 'v5']}
  series={[{ label: 'Utilisation', data: [0.42, 0.55, 0.61, 0.58, 0.73], color: 'brand', fill: true }]}
  options={{
    scales: { y: { ticks: { callback: (v) => \`\${Math.round(Number(v) * 100)}%\` } } },
  }}
/>`,
          render: (
            <Chart
              type="line"
              height={240}
              legend={false}
              labels={['v1', 'v2', 'v3', 'v4', 'v5']}
              series={[
                { label: 'Utilisation', data: [0.42, 0.55, 0.61, 0.58, 0.73], color: 'brand', fill: true },
              ]}
              options={{
                scales: { y: { ticks: { callback: (v) => `${Math.round(Number(v) * 100)}%` } } },
              }}
            />
          ),
        },
      ],
      propsTables: [
        {
          title: 'Chart',
          props: [
            { name: 'type', type: "'line' | 'area' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'scatter' | 'bubble'", required: true, description: "Chart type. 'area' renders a filled line chart." },
            { name: 'labels', type: 'Array<string | number>', description: 'Category labels shared across series.' },
            { name: 'series', type: 'ChartSeries[]', description: 'Themed series. Ignored when data is provided.' },
            { name: 'data', type: 'ChartData', description: 'Escape hatch: full chart.js data. Takes precedence over labels/series.' },
            { name: 'options', type: 'ChartOptions', description: 'Escape hatch: chart.js options, deep-merged over the themed defaults.' },
            { name: 'palette', type: 'Array<ChartColorToken | string>', default: "['brand','info','success','warning','danger','neutral']", description: 'Ordered palette for series without color, and for per-category bars / pie slices.' },
            { name: 'legend', type: "boolean | 'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Legend visibility/position (hidden by default for scatter/bubble).' },
            { name: 'title', type: 'React.ReactNode', description: 'Heading rendered above the canvas via the Text atom.' },
            { name: 'caption', type: 'React.ReactNode', description: 'Caption rendered below the canvas via the Text atom.' },
            { name: 'stacked', type: 'boolean', default: 'false', description: 'Stack bar/area series.' },
            { name: 'showGrid', type: 'boolean', default: 'true', description: 'Show axis grid lines.' },
            { name: 'height', type: 'number', description: 'Fixed pixel height. When omitted the chart keeps aspectRatio.' },
            { name: 'aspectRatio', type: 'number', default: '2', description: 'Width ÷ height ratio when height is not set.' },
            { name: 'ariaLabel', type: 'string', description: 'Accessible label for the canvas image; falls back to title.' },
            { name: 'dataLabels', type: 'boolean', default: 'true', description: 'Draw category/series label + numeric value on each bar, slice, and point.' },
            { name: 'plugins', type: 'Plugin[]', description: 'Extra chart.js plugins.' },
          ],
        },
        {
          title: 'ChartSeries',
          props: [
            { name: 'label', type: 'string', description: 'Legend label for the series.' },
            { name: 'data', type: 'Array<number | { x; y; r? }>', required: true, description: 'Y-values, or {x, y, r?} points for scatter/bubble.' },
            { name: 'color', type: 'ChartColorToken | string', description: 'Palette token, CSS var name, or CSS color. Defaults to the palette slot at this index. Omit on a single-series bar to multi-color each category.' },
            { name: 'fill', type: 'boolean', description: "Fill under a line. Defaults to true for type='area'." },
            { name: 'type', type: "'line' | 'bar'", description: 'Override the rendered type for this series (mixed charts).' },
            { name: 'dataset', type: 'Partial<ChartDataset>', description: 'Escape hatch: raw chart.js dataset options, deep-merged last.' },
          ],
        },
      ],
    },
    {
      id: 'count-up',
      name: 'CountUp',
      description:
        'An animated number that ramps from a start value to the target with an ease-out curve when it scrolls into view — the house way to make a headline result feel alive. Formats with decimals, a thousands separator, prefix, and suffix, and jumps straight to the final value under prefers-reduced-motion.',
      importLine: "import { CountUp } from 'glt-ui';",
      examples: [
        {
          title: 'Counting metrics',
          description: 'Each value counts up once on scroll. Supports decimals, separators, prefixes, and suffixes.',
          code: `<div className="flex flex-row gap-8 flex-wrap">
  <Text size="5xl" weight="semibold" tone="strong"><CountUp to={128500} separator="," /></Text>
  <Text size="5xl" weight="semibold" tone="brand"><CountUp to={99.4} decimals={1} suffix="%" /></Text>
  <Text size="5xl" weight="semibold" tone="strong"><CountUp to={2.1} decimals={1} prefix="×" /></Text>
</div>`,
          render: (
            <div className="flex flex-row gap-8 flex-wrap">
              <Text size="5xl" weight="semibold" tone="strong">
                <CountUp to={128500} separator="," />
              </Text>
              <Text size="5xl" weight="semibold" tone="brand">
                <CountUp to={99.4} decimals={1} suffix="%" />
              </Text>
              <Text size="5xl" weight="semibold" tone="strong">
                <CountUp to={2.1} decimals={1} prefix="×" />
              </Text>
            </div>
          ),
        },
      ],
      propsTables: [
        {
          title: 'CountUp',
          props: [
            { name: 'to', type: 'number', required: true, description: 'Target value to count to.' },
            { name: 'from', type: 'number', default: '0', description: 'Starting value.' },
            { name: 'duration', type: 'number', default: '1200', description: 'Animation duration in ms.' },
            { name: 'decimals', type: 'number', default: '0', description: 'Decimal places to show.' },
            { name: 'prefix', type: 'string', description: 'Text before the number (e.g. "$").' },
            { name: 'suffix', type: 'string', description: 'Text after the number (e.g. "%").' },
            { name: 'separator', type: 'string', description: 'Thousands separator (e.g. ",").' },
            { name: 'startOnView', type: 'boolean', default: 'true', description: 'Start only once scrolled into view.' },
            { name: 'format', type: '(value: number) => string', description: 'Custom formatter; overrides the others.' },
          ],
        },
      ],
    },
    {
      id: 'sparkline',
      name: 'Sparkline',
      description:
        'A dependency-free inline trend chart small enough to live in a table cell, a stat, or a sentence. Renders as an SVG using currentColor, so it inherits its intent token. Line and area draws animate in on scroll; bars grow from the baseline. Skips the draw animation under prefers-reduced-motion.',
      importLine: "import { Sparkline } from 'glt-ui';",
      examples: [
        {
          title: 'Shapes & intents',
          description: 'The same series as area, line, and bars, each in a different intent color.',
          code: `<div className="flex flex-row gap-6 flex-wrap items-center">
  <Sparkline data={[4, 6, 5, 8, 7, 11, 13]} shape="area" intent="brand" />
  <Sparkline data={[4, 6, 5, 8, 7, 11, 13]} shape="line" intent="success" />
  <Sparkline data={[4, 6, 5, 8, 7, 11, 13]} shape="bar" intent="info" />
</div>`,
          render: (
            <div className="flex flex-row gap-6 flex-wrap items-center">
              <Sparkline data={[4, 6, 5, 8, 7, 11, 13]} shape="area" intent="brand" />
              <Sparkline data={[4, 6, 5, 8, 7, 11, 13]} shape="line" intent="success" />
              <Sparkline data={[4, 6, 5, 8, 7, 11, 13]} shape="bar" intent="info" />
            </div>
          ),
        },
        {
          title: 'Inline in text',
          description: 'Because it sizes to the line and uses currentColor, a Sparkline drops straight into prose.',
          code: `<Text>
  p95 latency held steady{' '}
  <Sparkline data={[20, 18, 19, 17, 16, 16]} shape="line" intent="success" width={64} height={18} showLastDot={false} />{' '}
  across the release.
</Text>`,
          render: (
            <Text>
              p95 latency held steady{' '}
              <Sparkline data={[20, 18, 19, 17, 16, 16]} shape="line" intent="success" width={64} height={18} showLastDot={false} />{' '}
              across the release.
            </Text>
          ),
        },
      ],
      propsTables: [
        {
          title: 'Sparkline',
          props: [
            { name: 'data', type: 'number[]', required: true, description: 'The series to plot.' },
            { name: 'shape', type: "'line' | 'area' | 'bar'", default: "'area'", description: 'Rendering style.' },
            { name: 'intent', type: "'brand' | 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'current'", default: "'brand'", description: 'Color token driving stroke/fill.' },
            { name: 'width', type: 'number', default: '96', description: 'Pixel width.' },
            { name: 'height', type: 'number', default: '28', description: 'Pixel height.' },
            { name: 'strokeWidth', type: 'number', default: '2', description: 'Stroke width for line/area.' },
            { name: 'showLastDot', type: 'boolean', default: 'true', description: 'Mark the final point with a dot.' },
            { name: 'animate', type: 'boolean', default: 'true', description: 'Animate the draw on scroll into view.' },
            { name: 'min / max', type: 'number', description: 'Fixed value range; defaults to the data min/max.' },
          ],
        },
      ],
    },
    {
      id: 'progress-ring',
      name: 'ProgressRing',
      description:
        'A circular percentage indicator. The arc sweeps in and the center value counts up when scrolled into view (both settle instantly under prefers-reduced-motion). Composes the CountUp and Text atoms.',
      importLine: "import { ProgressRing } from 'glt-ui';",
      examples: [
        {
          title: 'Ring gallery',
          description: 'Different values, intents, and an optional caption label.',
          code: `<div className="flex flex-row gap-6 flex-wrap">
  <ProgressRing value={72} intent="brand" label="Coverage" />
  <ProgressRing value={94} intent="success" label="Uptime" />
  <ProgressRing value={38} intent="warning" label="Budget" />
</div>`,
          render: (
            <div className="flex flex-row gap-6 flex-wrap">
              <ProgressRing value={72} intent="brand" label="Coverage" />
              <ProgressRing value={94} intent="success" label="Uptime" />
              <ProgressRing value={38} intent="warning" label="Budget" />
            </div>
          ),
        },
      ],
      propsTables: [
        {
          title: 'ProgressRing',
          props: [
            { name: 'value', type: 'number', required: true, description: 'Current value.' },
            { name: 'max', type: 'number', default: '100', description: 'Value that represents a full ring.' },
            { name: 'size', type: 'number', default: '96', description: 'Diameter in px.' },
            { name: 'thickness', type: 'number', default: '8', description: 'Ring thickness in px.' },
            { name: 'intent', type: "'brand' | 'info' | 'success' | 'warning' | 'danger'", default: "'brand'", description: 'Arc color token.' },
            { name: 'showValue', type: 'boolean', default: 'true', description: 'Show the numeric value in the center.' },
            { name: 'suffix', type: 'string', default: "'%'", description: 'Suffix for the center value.' },
            { name: 'decimals', type: 'number', default: '0', description: 'Decimal places for the center value.' },
            { name: 'label', type: 'React.ReactNode', description: 'Small caption under the value.' },
            { name: 'animate', type: 'boolean', default: 'true', description: 'Animate arc + count on scroll into view.' },
          ],
        },
      ],
    },
    {
      id: 'benchmark-chart',
      name: 'BenchmarkChart',
      description:
        'A horizontal bar comparison built for research results — "our method vs. the baselines". Bars grow from zero and values count up when scrolled into view; the winning row is highlighted automatically (or force it per row) with a brand bar and a badge. Set betterIs="lower" for latency-style metrics. Composes the Text, Badge, and CountUp atoms.',
      importLine: "import { BenchmarkChart } from 'glt-ui';",
      examples: [
        {
          title: 'Accuracy leaderboard',
          description: 'Higher is better, so the top scorer is highlighted. Rows are sorted best-first.',
          code: `<BenchmarkChart
  title="MMLU accuracy"
  unit="%"
  sort
  caption="Reported on the held-out test split."
  items={[
    { label: 'Atlas-70B (ours)', value: 82.4 },
    { label: 'Baseline-A', value: 78.1 },
    { label: 'Baseline-B', value: 74.6 },
    { label: 'Baseline-C', value: 69.0 },
  ]}
/>`,
          render: (
            <BenchmarkChart
              title="MMLU accuracy"
              unit="%"
              sort
              caption="Reported on the held-out test split."
              items={[
                { label: 'Atlas-70B (ours)', value: 82.4 },
                { label: 'Baseline-A', value: 78.1 },
                { label: 'Baseline-B', value: 74.6 },
                { label: 'Baseline-C', value: 69.0 },
              ]}
            />
          ),
        },
        {
          title: 'Lower-is-better metric',
          description: 'betterIs="lower" highlights the smallest value — here p95 latency in milliseconds.',
          code: `<BenchmarkChart
  title="p95 latency"
  unit="ms"
  decimals={0}
  betterIs="lower"
  items={[
    { label: 'Atlas-7B (ours)', value: 120, note: 'speculative decoding' },
    { label: 'Baseline-A', value: 210 },
    { label: 'Baseline-B', value: 340 },
  ]}
/>`,
          render: (
            <BenchmarkChart
              title="p95 latency"
              unit="ms"
              decimals={0}
              betterIs="lower"
              items={[
                { label: 'Atlas-7B (ours)', value: 120, note: 'speculative decoding' },
                { label: 'Baseline-A', value: 210 },
                { label: 'Baseline-B', value: 340 },
              ]}
            />
          ),
        },
      ],
      propsTables: [
        {
          title: 'BenchmarkChart',
          props: [
            { name: 'items', type: 'BenchmarkItem[]', required: true, description: 'Rows to compare ({ label, value, intent?, highlight?, note? }).' },
            { name: 'max', type: 'number', description: 'Full-bar value. Defaults to the largest value × 1.05.' },
            { name: 'unit', type: 'string', description: 'Suffix appended to every value (e.g. "%").' },
            { name: 'decimals', type: 'number', default: '1', description: 'Decimal places for values.' },
            { name: 'betterIs', type: "'higher' | 'lower'", default: "'higher'", description: 'Which direction wins; drives auto-highlight.' },
            { name: 'sort', type: 'boolean', default: 'false', description: 'Sort rows best-first.' },
            { name: 'bestLabel', type: 'string', default: "'Best'", description: 'Badge text on the winning row.' },
            { name: 'title', type: 'React.ReactNode', description: 'Heading above the chart.' },
            { name: 'caption', type: 'React.ReactNode', description: 'Caption below the chart.' },
            { name: 'animate', type: 'boolean', default: 'true', description: 'Animate bars + values on scroll into view.' },
          ],
        },
      ],
    },
    {
      id: 'comparison-slider',
      name: 'ComparisonSlider',
      description:
        'A draggable before/after comparison — grab the divider with the mouse, touch, or arrow keys to wipe between two panels. Built to put a baseline and a result side by side (denoised output, upscaled image, model A vs. model B). Both panels fill the same frame, so keep them the same size.',
      importLine: "import { ComparisonSlider } from 'glt-ui';",
      examples: [
        {
          title: 'Baseline vs. result',
          description: 'Drag the handle (or focus it and use ← / →) to reveal each side. Corner labels tag the panels.',
          code: `<ComparisonSlider
  height={220}
  beforeLabel="Baseline"
  afterLabel="Ours"
  before={
    <div className="flex h-full w-full items-center justify-center bg-[var(--border-color)] text-[var(--secondary-text-color)]">
      Noisy sample
    </div>
  }
  after={
    <div className="flex h-full w-full items-center justify-center bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
      Denoised result
    </div>
  }
/>`,
          render: (
            <ComparisonSlider
              height={220}
              beforeLabel="Baseline"
              afterLabel="Ours"
              before={
                <div className="flex h-full w-full items-center justify-center bg-[var(--border-color)] text-[var(--secondary-text-color)]">
                  Noisy sample
                </div>
              }
              after={
                <div className="flex h-full w-full items-center justify-center bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
                  Denoised result
                </div>
              }
            />
          ),
        },
      ],
      propsTables: [
        {
          title: 'ComparisonSlider',
          props: [
            { name: 'before', type: 'React.ReactNode', required: true, description: 'Panel revealed on the left of the divider.' },
            { name: 'after', type: 'React.ReactNode', required: true, description: 'Panel revealed on the right of the divider.' },
            { name: 'beforeLabel', type: 'React.ReactNode', description: 'Corner label for the before panel.' },
            { name: 'afterLabel', type: 'React.ReactNode', description: 'Corner label for the after panel.' },
            { name: 'defaultPosition', type: 'number', default: '50', description: 'Initial divider position (0–100).' },
            { name: 'height', type: 'number', description: 'Fixed frame height in px. Overrides aspectRatio.' },
            { name: 'aspectRatio', type: 'number', default: '16 / 9', description: 'Width ÷ height ratio when height is unset.' },
          ],
        },
      ],
    },
    {
      id: 'figure',
      name: 'Figure',
      description:
        'A numbered figure with a caption, styled after a research paper. Pairs any visual (a Chart, image, or table) with a "Figure N." caption via the Text atom and frames it on a Surface. Renders semantic <figure> / <figcaption>.',
      importLine: "import { Figure } from 'glt-ui';",
      examples: [
        {
          title: 'Figure with a chart',
          description: 'A numbered, captioned frame around any visual.',
          code: `<Figure
  index={1}
  caption="Throughput scales near-linearly with batch size up to 32 requests."
>
  <Chart
    type="line"
    height={220}
    labels={['1', '2', '4', '8', '16', '32']}
    series={[{ label: 'tok/s', data: [120, 230, 440, 820, 1500, 2600], color: 'brand', fill: true }]}
  />
</Figure>`,
          render: (
            <Figure
              index={1}
              caption="Throughput scales near-linearly with batch size up to 32 requests."
            >
              <Chart
                type="line"
                height={220}
                labels={['1', '2', '4', '8', '16', '32']}
                series={[{ label: 'tok/s', data: [120, 230, 440, 820, 1500, 2600], color: 'brand', fill: true }]}
              />
            </Figure>
          ),
        },
      ],
      propsTables: [
        {
          title: 'Figure',
          props: [
            { name: 'children', type: 'React.ReactNode', required: true, description: 'The visual — a Chart, image, table, or diagram.' },
            { name: 'index', type: 'number | string', description: 'Figure number/identifier, e.g. 1 or "3a".' },
            { name: 'label', type: 'string', default: "'Figure'", description: 'The word before the number.' },
            { name: 'caption', type: 'React.ReactNode', description: 'Caption text.' },
            { name: 'captionPlacement', type: "'top' | 'bottom'", default: "'bottom'", description: 'Where the caption sits.' },
            { name: 'framed', type: 'boolean', default: 'true', description: 'Wrap the visual in a bordered Surface.' },
          ],
        },
      ],
    },
    {
      id: 'stat-grid',
      name: 'StatGrid & StatMetric',
      description:
        'A responsive grid of headline metrics; each StatMetric pairs a label with a value and optional suffix, hint, and interactivity. Pass countTo to animate the value up on scroll (via CountUp) and trend to draw a Sparkline beneath it.',
      importLine: "import { StatGrid, StatMetric } from 'glt-ui';",
      examples: [
        {
          title: 'Metric grid',
          description:
            'Three metrics in a grid, with the last one interactive and firing an onClick.',
          code: `<StatGrid columns={3}>
  <StatMetric label="Requests" value="1.2M" suffix="/day" hint="Last 24h" />
  <StatMetric label="Error rate" value="0.03" suffix="%" />
  <StatMetric
    label="Active nodes"
    value="48"
    interactive
    onClick={() => alert('View nodes')}
  />
</StatGrid>`,
          render: (
            <StatGrid columns={3}>
              <StatMetric label="Requests" value="1.2M" suffix="/day" hint="Last 24h" />
              <StatMetric label="Error rate" value="0.03" suffix="%" />
              <StatMetric
                label="Active nodes"
                value="48"
                interactive
                onClick={() => alert('View nodes')}
              />
            </StatGrid>
          ),
        },
        {
          title: 'Animated: count-up + trend',
          description:
            'countTo ramps the value on scroll; trend draws a Sparkline of the recent history beneath it.',
          code: `<StatGrid columns={3}>
  <StatMetric label="Throughput" countTo={2600} suffix=" tok/s" trend={[820, 1100, 1500, 1900, 2600]} />
  <StatMetric label="Accuracy" countTo={82.4} decimals={1} suffix="%" trend={[69, 74.6, 78.1, 82.4]} trendIntent="success" />
  <StatMetric label="Requests" countTo={128500} separator="," hint="Last 24h" trend={[90, 102, 98, 121, 128]} trendIntent="info" />
</StatGrid>`,
          render: (
            <StatGrid columns={3}>
              <StatMetric label="Throughput" countTo={2600} suffix=" tok/s" trend={[820, 1100, 1500, 1900, 2600]} />
              <StatMetric label="Accuracy" countTo={82.4} decimals={1} suffix="%" trend={[69, 74.6, 78.1, 82.4]} trendIntent="success" />
              <StatMetric label="Requests" countTo={128500} separator="," hint="Last 24h" trend={[90, 102, 98, 121, 128]} trendIntent="info" />
            </StatGrid>
          ),
        },
      ],
      propsTables: [
        {
          title: 'StatMetric',
          props: [
            { name: 'label', type: 'string', required: true, description: 'Uppercase caption above the value.' },
            { name: 'value', type: 'React.ReactNode', description: 'The headline value (used when countTo is not set).' },
            { name: 'countTo', type: 'number', description: 'Animate the value up to this number on scroll (overrides value).' },
            { name: 'decimals', type: 'number', default: '0', description: 'Decimals for countTo.' },
            { name: 'separator', type: 'string', description: 'Thousands separator for countTo.' },
            { name: 'suffix', type: 'React.ReactNode', description: 'Small unit rendered after the value.' },
            { name: 'trend', type: 'number[]', description: 'Series drawn as a Sparkline beneath the value.' },
            { name: 'trendIntent', type: "'brand' | 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'current'", default: "'brand'", description: 'Color of the trend Sparkline.' },
            { name: 'hint', type: 'string', description: 'Muted helper line under the value.' },
            { name: 'interactive', type: 'boolean', default: 'false', description: 'Add hover lift + pointer cursor.' },
            { name: 'onClick', type: '() => void', description: 'Click handler (with interactive).' },
          ],
        },
      ],
    },
    {
      id: 'data-highlight',
      name: 'DataHighlight',
      description:
        'A large stat callout for a single headline number, with optional prefix, suffix, and a small change indicator.',
      importLine: "import { DataHighlight } from 'glt-ui';",
      examples: [
        {
          title: 'Headline numbers',
          description: 'A row of highlights combining prefixes, suffixes, and change deltas.',
          code: `<div className="flex flex-row gap-6 flex-wrap">
  <DataHighlight value={42} label="Productivity" suffix="%" change="+8% MoM" />
  <DataHighlight value="1.9" label="Cost per 1M tokens" prefix="$" change="-12%" />
  <DataHighlight value={99.98} label="Uptime" suffix="%" change="stable" />
</div>`,
          render: (
            <div className="flex flex-row gap-6 flex-wrap">
              <DataHighlight value={42} label="Productivity" suffix="%" change="+8% MoM" />
              <DataHighlight
                value="1.9"
                label="Cost per 1M tokens"
                prefix="$"
                change="-12%"
              />
              <DataHighlight value={99.98} label="Uptime" suffix="%" change="stable" />
            </div>
          ),
        },
      ],
    },
    {
      id: 'derived-metric',
      name: 'DerivedMetric',
      description:
        'A compact label-and-value pair for a computed or secondary metric shown inline.',
      importLine: "import { DerivedMetric } from 'glt-ui';",
      examples: [
        {
          title: 'Basic',
          description: 'A single derived metric.',
          code: `<DerivedMetric label="Tokens / second" value="1,240" />`,
          render: <DerivedMetric label="Tokens / second" value="1,240" />,
        },
      ],
    },
    {
      id: 'progress-bar',
      name: 'ProgressBar',
      description:
        'A horizontal progress indicator with five semantic intents, three sizes, and an optional value readout.',
      importLine: "import { ProgressBar } from 'glt-ui';",
      examples: [
        {
          title: 'Intents',
          description: 'All five semantic intents stacked with labels and a value readout.',
          code: `<div className="flex flex-col gap-3">
  <ProgressBar intent="brand" label="Brand" value={72} suffix="%" />
  <ProgressBar intent="info" label="Info" value={54} suffix="%" />
  <ProgressBar intent="success" label="Success" value={88} suffix="%" />
  <ProgressBar intent="warning" label="Warning" value={40} suffix="%" />
  <ProgressBar intent="danger" label="Danger" value={18} suffix="%" />
</div>`,
          render: (
            <div className="flex flex-col gap-3">
              <ProgressBar intent="brand" label="Brand" value={72} suffix="%" />
              <ProgressBar intent="info" label="Info" value={54} suffix="%" />
              <ProgressBar intent="success" label="Success" value={88} suffix="%" />
              <ProgressBar intent="warning" label="Warning" value={40} suffix="%" />
              <ProgressBar intent="danger" label="Danger" value={18} suffix="%" />
            </div>
          ),
        },
        {
          title: 'Sizes',
          description: 'The three track sizes from sm to lg.',
          code: `<div className="flex flex-col gap-3">
  <ProgressBar size="sm" label="Small" value={60} suffix="%" />
  <ProgressBar size="md" label="Medium" value={60} suffix="%" />
  <ProgressBar size="lg" label="Large" value={60} suffix="%" />
</div>`,
          render: (
            <div className="flex flex-col gap-3">
              <ProgressBar size="sm" label="Small" value={60} suffix="%" />
              <ProgressBar size="md" label="Medium" value={60} suffix="%" />
              <ProgressBar size="lg" label="Large" value={60} suffix="%" />
            </div>
          ),
        },
      ],
    },
    {
      id: 'tag-group',
      name: 'TagGroup',
      description:
        'A horizontal list of string tags with an optional leading prefix label.',
      importLine: "import { TagGroup } from 'glt-ui';",
      examples: [
        {
          title: 'With prefix',
          description: 'A prefixed group of topic tags.',
          code: `<TagGroup prefix="Topics" tags={['inference', 'batching', 'quantization']} />`,
          render: (
            <TagGroup prefix="Topics" tags={['inference', 'batching', 'quantization']} />
          ),
        },
      ],
    },
    {
      id: 'badge',
      name: 'Badge',
      description:
        'A small pill for labels, statuses, and counts, with nine variants, two sizes, an optional leading dot, and a removable trailing control.',
      importLine: "import { Badge } from 'glt-ui';",
      examples: [
        {
          title: 'Semantic variants',
          description: 'The semantic variants, each with a leading status dot.',
          code: `<div className="flex flex-row gap-2 flex-wrap">
  <Badge variant="info" dot>Info</Badge>
  <Badge variant="success" dot>Success</Badge>
  <Badge variant="warning" dot>Warning</Badge>
  <Badge variant="danger" dot>Danger</Badge>
  <Badge variant="neutral" dot>Neutral</Badge>
</div>`,
          render: (
            <div className="flex flex-row gap-2 flex-wrap">
              <Badge variant="info" dot>
                Info
              </Badge>
              <Badge variant="success" dot>
                Success
              </Badge>
              <Badge variant="warning" dot>
                Warning
              </Badge>
              <Badge variant="danger" dot>
                Danger
              </Badge>
              <Badge variant="neutral" dot>
                Neutral
              </Badge>
            </div>
          ),
        },
        {
          title: 'Sizes',
          description: 'The two badge sizes side by side.',
          code: `<div className="flex flex-row gap-2 items-center flex-wrap">
  <Badge size="sm">Small</Badge>
  <Badge size="md">Medium</Badge>
</div>`,
          render: (
            <div className="flex flex-row gap-2 items-center flex-wrap">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
            </div>
          ),
        },
        {
          title: 'Removable chips',
          description: 'Outline badges with a remove control backed by local state.',
          code: `function ChipsDemo() {
  const [tags, setTags] = React.useState(['latency', 'agents', 'scaling']);
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {tags.map((t) => (
        <Badge
          key={t}
          variant="outline"
          removable
          onRemove={() => setTags((xs) => xs.filter((x) => x !== t))}
        >
          {t}
        </Badge>
      ))}
    </div>
  );
}`,
          render: <ChipsDemo />,
        },
      ],
    },
    {
      id: 'avatar',
      name: 'Avatar',
      description:
        'A user or org avatar rendering an image or initials fallback, in four sizes, two shapes, and with an optional presence status dot.',
      importLine: "import { Avatar } from 'glt-ui';",
      examples: [
        {
          title: 'Statuses',
          description: 'Initials avatars carrying each of the four presence states.',
          code: `<div className="flex flex-row gap-4 items-center flex-wrap">
  <Avatar initials="ON" status="online" />
  <Avatar initials="OF" status="offline" />
  <Avatar initials="BS" status="busy" />
  <Avatar initials="AW" status="away" />
</div>`,
          render: (
            <div className="flex flex-row gap-4 items-center flex-wrap">
              <Avatar initials="ON" status="online" />
              <Avatar initials="OF" status="offline" />
              <Avatar initials="BS" status="busy" />
              <Avatar initials="AW" status="away" />
            </div>
          ),
        },
        {
          title: 'Shapes & sizes',
          description: 'Circle and square shapes across the sm through xl size scale.',
          code: `<div className="flex flex-row gap-4 items-center flex-wrap">
  <Avatar initials="SM" size="sm" />
  <Avatar initials="MD" size="md" />
  <Avatar initials="LG" size="lg" />
  <Avatar initials="XL" size="xl" shape="square" />
</div>`,
          render: (
            <div className="flex flex-row gap-4 items-center flex-wrap">
              <Avatar initials="SM" size="sm" />
              <Avatar initials="MD" size="md" />
              <Avatar initials="LG" size="lg" />
              <Avatar initials="XL" size="xl" shape="square" />
            </div>
          ),
        },
      ],
    },
    {
      id: 'technique-grid',
      name: 'TechniqueGrid',
      description:
        'A grid of research technique cards, each summarising an organisation, title, and impact, with an optional select handler.',
      importLine: "import { TechniqueGrid } from 'glt-ui';",
      examples: [
        {
          title: 'Selectable grid',
          description: 'Three techniques; clicking a card fires onSelect.',
          code: `const items = [
  {
    id: 'speculative-decoding',
    org: 'Anthropic',
    title: 'Speculative Decoding',
    summary: 'Draft-and-verify token generation to cut wall-clock latency.',
    impact: '2.1x faster',
  },
  {
    id: 'kv-cache-reuse',
    org: 'GLT Labs',
    title: 'KV-Cache Reuse',
    summary: 'Share prefix caches across sibling requests in a batch.',
    impact: '35% cheaper',
  },
  {
    id: 'mixture-of-experts',
    org: 'OpenResearch',
    title: 'Mixture of Experts',
    summary: 'Route each token to a sparse subset of expert layers.',
    impact: '4x capacity',
  },
];

<TechniqueGrid items={items} onSelect={() => alert('selected')} />`,
          render: (
            <TechniqueGrid items={techniqueItems} onSelect={() => alert('selected')} />
          ),
        },
      ],
    },
  ],
};
