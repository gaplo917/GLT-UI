'use client';
import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Container,
  Section,
  SectionHeader,
  SectionTitle,
  SectionLead,
  Grid,
  GridItem,
  Divider,
  Level,
  LevelLeft,
  LevelRight,
  LevelItem,
  Panel,
  PanelHeading,
  PanelTabs,
  PanelTab,
  PanelBlock,
  PanelIcon,
  Box,
  MediaObject,
  TextInput,
  Text,
  Surface,
  Checkbox,
  Reveal,
  Card,
  CardContent,
} from 'glt-ui';
import type { DocSection, DocPropsTable } from '../types';

export const layoutSection: DocSection = {
  id: 'layout',
  title: 'Layout',
  blurb: 'Structural primitives for page and content composition.',
  entries: [
    {
      id: 'container',
      name: 'Container',
      description:
        'Centered max-width wrapper that constrains content to a comfortable reading measure.',
      importLine: "import { Container } from 'glt-ui';",
      propsTables: [
        {
          title: 'Container',
          props: [
            {
              name: 'max',
              type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
              default: "'xl'",
              description: 'Max-width constraint applied to the centered wrapper.',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div>.',
            },
          ],
        },
      ] satisfies DocPropsTable[],
      examples: [
        {
          title: 'Default width',
          description: 'The default xl max-width, centered horizontally.',
          code: `<Container>
  <Surface radius="md" padding="md" align="center">
    Bounded content
  </Surface>
</Container>`,
          render: (
            <Container>
              <Surface radius="md" padding="md" align="center">
                Bounded content
              </Surface>
            </Container>
          ),
        },
        {
          title: 'Narrow width',
          description: 'A tighter sm max-width for focused, single-column content.',
          code: `<Container max="sm">
  <Surface radius="md" padding="md" align="center">
    Bounded content
  </Surface>
</Container>`,
          render: (
            <Container max="sm">
              <Surface radius="md" padding="md" align="center">
                Bounded content
              </Surface>
            </Container>
          ),
        },
        {
          title: 'Medium & large widths',
          description: 'md and lg sit between the narrow sm and the default xl cap.',
          code: `<div className="flex flex-col gap-3 w-full">
  <Container max="md">
    <Surface tone="brand" radius="md" padding="sm" align="center">max="md"</Surface>
  </Container>
  <Container max="lg">
    <Surface tone="brand" radius="md" padding="sm" align="center">max="lg"</Surface>
  </Container>
</div>`,
          render: (
            <div className="flex flex-col gap-3 w-full">
              <Container max="md">
                <Surface tone="brand" radius="md" padding="sm" align="center">max=&quot;md&quot;</Surface>
              </Container>
              <Container max="lg">
                <Surface tone="brand" radius="md" padding="sm" align="center">max=&quot;lg&quot;</Surface>
              </Container>
            </div>
          ),
        },
        {
          title: 'Full width',
          description: 'Removes the max-width cap so content spans the full parent.',
          code: `<Container max="full">
  <Surface radius="md" padding="md" align="center">
    Bounded content
  </Surface>
</Container>`,
          render: (
            <Container max="full">
              <Surface radius="md" padding="md" align="center">
                Bounded content
              </Surface>
            </Container>
          ),
        },
      ],
    },
    {
      id: 'section',
      name: 'Section',
      description:
        'A vertically-spaced page region with a centered inner container, composed with SectionHeader, SectionTitle, and SectionLead. spacing sets vertical rhythm; containerMax constrains and centers the content width.',
      importLine:
        "import { Section, SectionHeader, SectionTitle, SectionLead } from 'glt-ui';",
      propsTables: [
        {
          title: 'Section',
          props: [
            {
              name: 'id',
              type: 'string',
              description: 'Section id for deep-link navigation (e.g. #thesis).',
            },
            {
              name: 'containerMax',
              type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
              default: "'xl'",
              description: 'Max width of the inner centered Container.',
            },
            {
              name: 'spacing',
              type: "'tight' | 'normal' | 'loose'",
              default: "'normal'",
              description: 'Vertical padding rhythm above and below the region.',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLElement>',
              description: 'Forwarded to the underlying <section>.',
            },
          ],
        },
        {
          title: 'SectionHeader',
          props: [
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div>.',
            },
          ],
        },
        {
          title: 'SectionTitle',
          props: [
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLHeadingElement>',
              description: 'Forwarded to the underlying <h2> title.',
            },
          ],
        },
        {
          title: 'SectionLead',
          props: [
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLElement>',
              description: 'Forwarded to the underlying <p> lead text.',
            },
          ],
        },
      ],
      examples: [
        {
          title: 'Composed header',
          description: 'A title and supporting lead inside a section region (outlined here to show its bounds).',
          code: `<Section id="thesis">
  <SectionHeader>
    <SectionTitle>Research Thesis</SectionTitle>
    <SectionLead>
      Guided latent tuning steers model behavior without full retraining.
    </SectionLead>
  </SectionHeader>
</Section>`,
          render: (
            <Section id="thesis" className="rounded-lg border border-dashed border-[var(--border-color)]">
              <SectionHeader>
                <SectionTitle>Research Thesis</SectionTitle>
                <SectionLead>
                  Guided latent tuning steers model behavior without full retraining.
                </SectionLead>
              </SectionHeader>
            </Section>
          ),
        },
        {
          title: 'Vertical spacing',
          description: 'tight · normal · loose control the top/bottom padding. The dashed outline reveals how each region grows.',
          code: `<Section spacing="tight">…</Section>
<Section spacing="normal">…</Section>
<Section spacing="loose">…</Section>`,
          render: (
            <div className="flex flex-col gap-3 w-full">
              {(['tight', 'normal', 'loose'] as const).map((s) => (
                <Section
                  key={s}
                  spacing={s}
                  className="rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--card-bg-color)]"
                >
                  <Surface tone="plain" radius="sm" padding="none" align="center" className="py-2">
                    <Text size="sm" tone="secondary">spacing=&quot;{s}&quot;</Text>
                  </Surface>
                </Section>
              ))}
            </div>
          ),
        },
        {
          title: 'Container width',
          description: 'containerMax constrains and centers the content relative to the available width — sm is narrower and centered, full runs edge-to-edge.',
          code: `<Section containerMax="sm">…</Section>
<Section containerMax="full">…</Section>`,
          render: (
            <div className="flex flex-col gap-3 w-full">
              <Section containerMax="sm" spacing="tight" className="rounded-lg bg-[var(--card-bg-color)]">
                <Surface tone="brand" radius="sm" padding="none" align="center" className="py-2">
                  <Text size="sm" weight="medium" tone="strong">containerMax=&quot;sm&quot;</Text>
                </Surface>
              </Section>
              <Section containerMax="full" spacing="tight" className="rounded-lg bg-[var(--card-bg-color)]">
                <Surface tone="brand" radius="sm" padding="none" align="center" className="py-2">
                  <Text size="sm" weight="medium" tone="strong">containerMax=&quot;full&quot;</Text>
                </Surface>
              </Section>
            </div>
          ),
        },
      ],
    },
    {
      id: 'grid',
      name: 'Grid',
      description:
        'Responsive CSS grid primitive with token gaps, an optional md breakpoint, and GridItem children that span columns of a 12-column track.',
      importLine: "import { Grid, GridItem } from 'glt-ui';",
      propsTables: [
        {
          title: 'Grid',
          props: [
            {
              name: 'columns',
              type: '1 | 2 | 3 | 4 | 6 | 12',
              default: '1',
              description: 'Base column count of the track.',
            },
            {
              name: 'mdColumns',
              type: '1 | 2 | 3 | 4 | 6 | 12',
              description: 'Column count applied from the md breakpoint up.',
            },
            {
              name: 'gap',
              type: '0 | 1 | 2 | 3 | 4 | 6 | 8',
              default: '4',
              description: 'Token gap between cells (row and column).',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div>.',
            },
          ],
        },
        {
          title: 'GridItem',
          props: [
            {
              name: 'span',
              type: 'number',
              description: 'Number of 12-column tracks this cell spans.',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div>.',
            },
          ],
        },
      ],
      examples: [
        {
          title: 'Fixed column counts',
          description: 'columns accepts 1, 2, 3, 4, 6, and 12 for even fixed tracks.',
          code: `<div className="flex flex-col gap-3 w-full">
  <Grid columns={2} gap={3}>
    <Surface radius="md" padding="sm" align="center">1</Surface>
    <Surface radius="md" padding="sm" align="center">2</Surface>
  </Grid>
  <Grid columns={4} gap={3}>
    <Surface radius="md" padding="sm" align="center">1</Surface>
    <Surface radius="md" padding="sm" align="center">2</Surface>
    <Surface radius="md" padding="sm" align="center">3</Surface>
    <Surface radius="md" padding="sm" align="center">4</Surface>
  </Grid>
  <Grid columns={6} gap={3}>
    <Surface radius="md" padding="sm" align="center">1</Surface>
    <Surface radius="md" padding="sm" align="center">2</Surface>
    <Surface radius="md" padding="sm" align="center">3</Surface>
    <Surface radius="md" padding="sm" align="center">4</Surface>
    <Surface radius="md" padding="sm" align="center">5</Surface>
    <Surface radius="md" padding="sm" align="center">6</Surface>
  </Grid>
</div>`,
          render: (
            <div className="flex flex-col gap-3 w-full">
              <Grid columns={2} gap={3}>
                <Surface radius="md" padding="sm" align="center">1</Surface>
                <Surface radius="md" padding="sm" align="center">2</Surface>
              </Grid>
              <Grid columns={4} gap={3}>
                <Surface radius="md" padding="sm" align="center">1</Surface>
                <Surface radius="md" padding="sm" align="center">2</Surface>
                <Surface radius="md" padding="sm" align="center">3</Surface>
                <Surface radius="md" padding="sm" align="center">4</Surface>
              </Grid>
              <Grid columns={6} gap={3}>
                <Surface radius="md" padding="sm" align="center">1</Surface>
                <Surface radius="md" padding="sm" align="center">2</Surface>
                <Surface radius="md" padding="sm" align="center">3</Surface>
                <Surface radius="md" padding="sm" align="center">4</Surface>
                <Surface radius="md" padding="sm" align="center">5</Surface>
                <Surface radius="md" padding="sm" align="center">6</Surface>
              </Grid>
            </div>
          ),
        },
        {
          title: 'Twelve-column layout',
          description: 'A full 12-column track with GridItems spanning uneven widths.',
          code: `<Grid columns={12} gap={3}>
  <GridItem span={3}>
    <Surface radius="md" padding="sm" align="center">3</Surface>
  </GridItem>
  <GridItem span={6}>
    <Surface radius="md" padding="sm" align="center">6</Surface>
  </GridItem>
  <GridItem span={3}>
    <Surface radius="md" padding="sm" align="center">3</Surface>
  </GridItem>
</Grid>`,
          render: (
            <Grid columns={12} gap={3}>
              <GridItem span={3}>
                <Surface radius="md" padding="sm" align="center">3</Surface>
              </GridItem>
              <GridItem span={6}>
                <Surface radius="md" padding="sm" align="center">6</Surface>
              </GridItem>
              <GridItem span={3}>
                <Surface radius="md" padding="sm" align="center">3</Surface>
              </GridItem>
            </Grid>
          ),
        },
        {
          title: 'Responsive columns',
          description: 'One column on small screens, three from the md breakpoint up.',
          code: `<Grid columns={1} mdColumns={3} gap={4}>
  <Surface radius="md" padding="md" align="center">1</Surface>
  <Surface radius="md" padding="md" align="center">2</Surface>
  <Surface radius="md" padding="md" align="center">3</Surface>
</Grid>`,
          render: (
            <Grid columns={1} mdColumns={3} gap={4}>
              <Surface radius="md" padding="md" align="center">
                1
              </Surface>
              <Surface radius="md" padding="md" align="center">
                2
              </Surface>
              <Surface radius="md" padding="md" align="center">
                3
              </Surface>
            </Grid>
          ),
        },
        {
          title: 'Spanning items',
          description: 'A 12-column grid where GridItem controls each cell span.',
          code: `<Grid columns={12} gap={4}>
  <GridItem span={8}>
    <Surface radius="md" padding="md" align="center">span 8</Surface>
  </GridItem>
  <GridItem span={4}>
    <Surface radius="md" padding="md" align="center">span 4</Surface>
  </GridItem>
</Grid>`,
          render: (
            <Grid columns={12} gap={4}>
              <GridItem span={8}>
                <Surface radius="md" padding="md" align="center">
                  span 8
                </Surface>
              </GridItem>
              <GridItem span={4}>
                <Surface radius="md" padding="md" align="center">
                  span 4
                </Surface>
              </GridItem>
            </Grid>
          ),
        },
        {
          title: 'Wider gap',
          description: 'A two-column grid with a larger token gap between cells.',
          code: `<Grid columns={2} gap={8}>
  <Surface radius="md" padding="md" align="center">1</Surface>
  <Surface radius="md" padding="md" align="center">2</Surface>
</Grid>`,
          render: (
            <Grid columns={2} gap={8}>
              <Surface radius="md" padding="md" align="center">
                1
              </Surface>
              <Surface radius="md" padding="md" align="center">
                2
              </Surface>
            </Grid>
          ),
        },
      ],
    },
    {
      id: 'divider',
      name: 'Divider',
      description:
        'Thin token-driven separator that can run horizontally or vertically, with an optional inline label.',
      importLine: "import { Divider } from 'glt-ui';",
      propsTables: [
        {
          title: 'Divider',
          props: [
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description: 'Direction the rule runs.',
            },
            {
              name: 'label',
              type: 'React.ReactNode',
              description: 'Optional inline label centered on a horizontal rule.',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div> (role defaults to "separator").',
            },
          ],
        },
      ],
      examples: [
        {
          title: 'Default',
          description: 'A plain horizontal rule between blocks of content.',
          code: `<Divider />`,
          render: <Divider />,
        },
        {
          title: 'With label',
          description: 'Centers an inline label on the horizontal rule.',
          code: `<Divider label="OR" />`,
          render: <Divider label="OR" />,
        },
        {
          title: 'Vertical',
          description: 'A vertical rule separating inline items.',
          code: `<div className="flex flex-row gap-4 items-center h-12">
  A<Divider orientation="vertical" />B
</div>`,
          render: (
            <div className="flex flex-row gap-4 items-center h-12">
              A<Divider orientation="vertical" />B
            </div>
          ),
        },
      ],
    },
    {
      id: 'level',
      name: 'Level',
      description:
        'A multi-purpose horizontal level that can hold almost any element. Compose it from LevelLeft / LevelRight groups and LevelItem cells — or drop LevelItems straight in for an evenly-spread row. Everything inside stays vertically centered; the two groups stack on mobile.',
      importLine: "import { Level, LevelLeft, LevelRight, LevelItem } from 'glt-ui';",
      propsTables: [
        {
          title: 'Level',
          props: [
            {
              name: 'mobile',
              type: 'boolean',
              default: 'false',
              description: 'Keep the row horizontal on mobile instead of stacking the groups.',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div>.',
            },
          ],
        },
        {
          title: 'LevelLeft',
          props: [
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div>.',
            },
          ],
        },
        {
          title: 'LevelRight',
          props: [
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div>.',
            },
          ],
        },
        {
          title: 'LevelItem',
          props: [
            {
              name: 'grow',
              type: 'boolean',
              default: 'false',
              description: 'Let the item grow to fill free space (e.g. a search field).',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div>.',
            },
          ],
        },
      ],
      examples: [
        {
          title: 'Toolbar (left / right groups)',
          description: 'LevelLeft and LevelRight pin groups to each edge; LevelItems keep their natural size.',
          code: `<Level>
  <LevelLeft>
    <LevelItem>
      <Text as="span" weight="semibold" tone="strong">Checkpoints</Text>
    </LevelItem>
    <LevelItem>
      <Badge variant="neutral">42</Badge>
    </LevelItem>
  </LevelLeft>
  <LevelRight>
    <LevelItem>
      <Button size="sm" variant="outline">Filter</Button>
    </LevelItem>
    <LevelItem>
      <Button size="sm">New run</Button>
    </LevelItem>
  </LevelRight>
</Level>`,
          render: (
            <Level>
              <LevelLeft>
                <LevelItem>
                  <Text as="span" weight="semibold" tone="strong">Checkpoints</Text>
                </LevelItem>
                <LevelItem>
                  <Badge variant="neutral">42</Badge>
                </LevelItem>
              </LevelLeft>
              <LevelRight>
                <LevelItem>
                  <Button size="sm" variant="outline">Filter</Button>
                </LevelItem>
                <LevelItem>
                  <Button size="sm">New run</Button>
                </LevelItem>
              </LevelRight>
            </Level>
          ),
        },
        {
          title: 'Any elements, always centered',
          description: 'A title, a badge, a text input, and a button — different heights, all vertically centered.',
          code: `<Level>
  <LevelLeft>
    <LevelItem>
      <Text as="span" size="lg" weight="semibold" tone="strong">Runs</Text>
    </LevelItem>
    <LevelItem>
      <Badge variant="success" dot>live</Badge>
    </LevelItem>
  </LevelLeft>
  <LevelRight>
    <LevelItem>
      <TextInput inputSize="sm" placeholder="Search runs…" />
    </LevelItem>
    <LevelItem>
      <Button size="sm">Add</Button>
    </LevelItem>
  </LevelRight>
</Level>`,
          render: (
            <Level>
              <LevelLeft>
                <LevelItem>
                  <Text as="span" size="lg" weight="semibold" tone="strong">Runs</Text>
                </LevelItem>
                <LevelItem>
                  <Badge variant="success" dot>live</Badge>
                </LevelItem>
              </LevelLeft>
              <LevelRight>
                <LevelItem>
                  <TextInput inputSize="sm" placeholder="Search runs…" />
                </LevelItem>
                <LevelItem>
                  <Button size="sm">Add</Button>
                </LevelItem>
              </LevelRight>
            </Level>
          ),
        },
        {
          title: 'Centered items (no groups)',
          description: 'Place LevelItems directly in Level for an evenly-spread, centered row — e.g. a stats bar.',
          code: `<Level>
  <LevelItem className="flex-col gap-0.5">
    <Text as="span" size="2xl" weight="bold" tone="strong">3.2k</Text>
    <Text as="span" size="sm" tone="secondary">Runs</Text>
  </LevelItem>
  <LevelItem className="flex-col gap-0.5">
    <Text as="span" size="2xl" weight="bold" tone="strong">128</Text>
    <Text as="span" size="sm" tone="secondary">Active</Text>
  </LevelItem>
  <LevelItem className="flex-col gap-0.5">
    <Text as="span" size="2xl" weight="bold" tone="strong">98.6%</Text>
    <Text as="span" size="sm" tone="secondary">Uptime</Text>
  </LevelItem>
</Level>`,
          render: (
            <Level>
              <LevelItem className="flex-col gap-0.5">
                <Text as="span" size="2xl" weight="bold" tone="strong">3.2k</Text>
                <Text as="span" size="sm" tone="secondary">Runs</Text>
              </LevelItem>
              <LevelItem className="flex-col gap-0.5">
                <Text as="span" size="2xl" weight="bold" tone="strong">128</Text>
                <Text as="span" size="sm" tone="secondary">Active</Text>
              </LevelItem>
              <LevelItem className="flex-col gap-0.5">
                <Text as="span" size="2xl" weight="bold" tone="strong">98.6%</Text>
                <Text as="span" size="sm" tone="secondary">Uptime</Text>
              </LevelItem>
            </Level>
          ),
        },
        {
          title: 'Growing item & mobile',
          description: 'grow lets one item fill the free space; mobile keeps the groups side by side on small screens.',
          code: `<Level mobile>
  <LevelLeft className="flex-1">
    <LevelItem grow>
      <TextInput inputSize="sm" placeholder="Search runs…" className="w-full" />
    </LevelItem>
  </LevelLeft>
  <LevelRight>
    <LevelItem>
      <Button size="sm">Go</Button>
    </LevelItem>
  </LevelRight>
</Level>`,
          render: (
            <Level mobile>
              <LevelLeft className="flex-1">
                <LevelItem grow>
                  <TextInput inputSize="sm" placeholder="Search runs…" className="w-full" />
                </LevelItem>
              </LevelLeft>
              <LevelRight>
                <LevelItem>
                  <Button size="sm">Go</Button>
                </LevelItem>
              </LevelRight>
            </Level>
          ),
        },
      ],
    },
    {
      id: 'panel',
      name: 'Panel',
      description:
        'A composable container for compact controls and grouped lists. Build it from PanelHeading, PanelTabs / PanelTab, and PanelBlock rows — render a block as a div, a link, or a label with a checkbox — with an optional leading PanelIcon.',
      importLine:
        "import { Panel, PanelHeading, PanelTabs, PanelTab, PanelBlock, PanelIcon } from 'glt-ui';",
      propsTables: [
        {
          title: 'Panel',
          props: [
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div> wrapper.',
            },
          ],
        },
        {
          title: 'PanelHeading',
          props: [
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying heading <div>.',
            },
          ],
        },
        {
          title: 'PanelTabs',
          props: [
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div> tab bar.',
            },
          ],
        },
        {
          title: 'PanelTab',
          props: [
            {
              name: 'active',
              type: 'boolean',
              default: 'false',
              description: 'Highlight the tab as the current selection.',
            },
            {
              name: '…rest',
              type: 'React.AnchorHTMLAttributes<HTMLAnchorElement>',
              description: 'Forwarded to the underlying <a>.',
            },
          ],
        },
        {
          title: 'PanelBlock',
          props: [
            {
              name: 'as',
              type: "'div' | 'a' | 'label'",
              default: "'div'",
              description: 'Element to render — a plain row, a link, or a label for a checkbox.',
            },
            {
              name: 'active',
              type: 'boolean',
              default: 'false',
              description: 'Highlight the block as the current/active selection.',
            },
            {
              name: 'href',
              type: 'string',
              description: 'Link target when rendered as an anchor.',
            },
            {
              name: 'htmlFor',
              type: 'string',
              description: 'Associated control id when rendered as a label.',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLElement>',
              description: 'Forwarded to the underlying element chosen by `as`.',
            },
          ],
        },
        {
          title: 'PanelIcon',
          props: [
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLSpanElement>',
              description: 'Forwarded to the underlying <span>.',
            },
          ],
        },
      ],
      examples: [
        {
          title: 'Heading & blocks',
          description: 'A heading bar followed by full-width rows.',
          code: `<Panel>
  <PanelHeading>Runs</PanelHeading>
  <PanelBlock>All checkpoints</PanelBlock>
  <PanelBlock>Failed only</PanelBlock>
</Panel>`,
          render: (
            <Panel>
              <PanelHeading>Runs</PanelHeading>
              <PanelBlock>All checkpoints</PanelBlock>
              <PanelBlock>Failed only</PanelBlock>
            </Panel>
          ),
        },
        {
          title: 'Compact controls',
          description: 'The full pattern: a search input, tabs, active link rows with icons, a label + checkbox, and a footer action.',
          code: `<Panel>
  <PanelHeading>Repositories</PanelHeading>
  <PanelBlock>
    <TextInput inputSize="sm" placeholder="Search" className="w-full" />
  </PanelBlock>
  <PanelTabs>
    <PanelTab active>All</PanelTab>
    <PanelTab>Public</PanelTab>
    <PanelTab>Private</PanelTab>
  </PanelTabs>
  <PanelBlock as="a" active>
    <PanelIcon>★</PanelIcon>
    glt-ui
  </PanelBlock>
  <PanelBlock as="a">
    <PanelIcon>★</PanelIcon>
    research-notes
  </PanelBlock>
  <PanelBlock as="label">
    <Checkbox defaultChecked />
    <Text as="span">Only starred</Text>
  </PanelBlock>
  <PanelBlock>
    <Button size="sm" fullWidth>Reset all filters</Button>
  </PanelBlock>
</Panel>`,
          render: (
            <Panel>
              <PanelHeading>Repositories</PanelHeading>
              <PanelBlock>
                <TextInput inputSize="sm" placeholder="Search" className="w-full" />
              </PanelBlock>
              <PanelTabs>
                <PanelTab active>All</PanelTab>
                <PanelTab>Public</PanelTab>
                <PanelTab>Private</PanelTab>
              </PanelTabs>
              <PanelBlock as="a" active>
                <PanelIcon>★</PanelIcon>
                glt-ui
              </PanelBlock>
              <PanelBlock as="a">
                <PanelIcon>★</PanelIcon>
                research-notes
              </PanelBlock>
              <PanelBlock as="label">
                <Checkbox defaultChecked />
                <Text as="span">Only starred</Text>
              </PanelBlock>
              <PanelBlock>
                <Button size="sm" fullWidth>Reset all filters</Button>
              </PanelBlock>
            </Panel>
          ),
        },
      ],
    },
    {
      id: 'box',
      name: 'Box',
      description:
        'A simple bordered, padded surface for grouping content without full card emphasis.',
      importLine: "import { Box } from 'glt-ui';",
      propsTables: [
        {
          title: 'Box',
          props: [
            {
              name: 'children',
              type: 'React.ReactNode',
              required: true,
              description: 'Content rendered inside the bordered surface.',
            },
            {
              name: 'padding',
              type: "'none' | 'sm' | 'md' | 'lg'",
              default: "'sm'",
              description: 'Inner padding of the box.',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying surface element.',
            },
          ],
        },
      ],
      examples: [
        {
          title: 'Default',
          description: 'A bordered container around its children.',
          code: `<Box>
  <Text align="center">Boxed content</Text>
</Box>`,
          render: (
            <Box>
              <Text align="center">Boxed content</Text>
            </Box>
          ),
        },
        {
          title: 'Padding',
          description: 'Control the inner padding with the padding prop (defaults to sm).',
          code: `<div className="flex flex-col gap-3">
  <Box padding="none"><Text align="center">none</Text></Box>
  <Box padding="sm"><Text align="center">sm (default)</Text></Box>
  <Box padding="md"><Text align="center">md</Text></Box>
  <Box padding="lg"><Text align="center">lg</Text></Box>
</div>`,
          render: (
            <div className="flex flex-col gap-3">
              <Box padding="none"><Text align="center">none</Text></Box>
              <Box padding="sm"><Text align="center">sm (default)</Text></Box>
              <Box padding="md"><Text align="center">md</Text></Box>
              <Box padding="lg"><Text align="center">lg</Text></Box>
            </div>
          ),
        },
      ],
    },
    {
      id: 'surface',
      name: 'Surface',
      description:
        'A token-filled surface — the general-purpose colored, rounded box behind cells, tiles, and grouped content. Flexible tone, padding, radius, and border controls.',
      importLine: "import { Surface } from 'glt-ui';",
      propsTables: [
        {
          title: 'Surface',
          props: [
            {
              name: 'tone',
              type: "'card' | 'muted' | 'brand' | 'plain'",
              default: "'card'",
              description: 'Background (and text) color token.',
            },
            {
              name: 'padding',
              type: "'none' | 'sm' | 'md' | 'lg'",
              default: "'md'",
              description: 'Inner padding size.',
            },
            {
              name: 'radius',
              type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'",
              default: "'md'",
              description: 'Corner rounding.',
            },
            {
              name: 'bordered',
              type: 'boolean',
              default: 'false',
              description: 'Add a token border.',
            },
            {
              name: 'align',
              type: "'left' | 'center' | 'right'",
              description: 'Text alignment inside the surface.',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div>.',
            },
          ],
        },
      ],
      examples: [
        {
          title: 'Tones',
          description: 'card · muted · brand · plain background tokens side by side.',
          code: `<div className="flex flex-row gap-3">
  <Surface tone="card" align="center" className="flex-1"><Text size="sm">card</Text></Surface>
  <Surface tone="muted" align="center" className="flex-1"><Text size="sm">muted</Text></Surface>
  <Surface tone="brand" align="center" className="flex-1"><Text size="sm">brand</Text></Surface>
  <Surface tone="plain" align="center" className="flex-1"><Text size="sm">plain</Text></Surface>
</div>`,
          render: (
            <div className="flex flex-row gap-3">
              <Surface tone="card" align="center" className="flex-1"><Text size="sm">card</Text></Surface>
              <Surface tone="muted" align="center" className="flex-1"><Text size="sm">muted</Text></Surface>
              <Surface tone="brand" align="center" className="flex-1"><Text size="sm">brand</Text></Surface>
              <Surface tone="plain" align="center" className="flex-1"><Text size="sm">plain</Text></Surface>
            </div>
          ),
        },
        {
          title: 'Padding & radius',
          description: 'padding sizes the inset (sm · md · lg); radius sets the corner rounding (none · md · xl · full).',
          code: `<div className="flex flex-col gap-3">
  <div className="flex flex-row gap-3">
    <Surface padding="sm" align="center" className="flex-1"><Text size="sm">sm</Text></Surface>
    <Surface padding="md" align="center" className="flex-1"><Text size="sm">md</Text></Surface>
    <Surface padding="lg" align="center" className="flex-1"><Text size="sm">lg</Text></Surface>
  </div>
  <div className="flex flex-row gap-3">
    <Surface radius="none" align="center" className="flex-1"><Text size="sm">none</Text></Surface>
    <Surface radius="md" align="center" className="flex-1"><Text size="sm">md</Text></Surface>
    <Surface radius="xl" align="center" className="flex-1"><Text size="sm">xl</Text></Surface>
    <Surface radius="full" align="center" className="flex-1"><Text size="sm">full</Text></Surface>
  </div>
</div>`,
          render: (
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-3">
                <Surface padding="sm" align="center" className="flex-1"><Text size="sm">sm</Text></Surface>
                <Surface padding="md" align="center" className="flex-1"><Text size="sm">md</Text></Surface>
                <Surface padding="lg" align="center" className="flex-1"><Text size="sm">lg</Text></Surface>
              </div>
              <div className="flex flex-row gap-3">
                <Surface radius="none" align="center" className="flex-1"><Text size="sm">none</Text></Surface>
                <Surface radius="md" align="center" className="flex-1"><Text size="sm">md</Text></Surface>
                <Surface radius="xl" align="center" className="flex-1"><Text size="sm">xl</Text></Surface>
                <Surface radius="full" align="center" className="flex-1"><Text size="sm">full</Text></Surface>
              </div>
            </div>
          ),
        },
        {
          title: 'Bordered',
          description: 'Add a token border with the bordered flag — works with any tone.',
          code: `<div className="flex flex-row gap-3">
  <Surface bordered align="center" className="flex-1"><Text size="sm">bordered</Text></Surface>
  <Surface bordered tone="plain" align="center" className="flex-1"><Text size="sm">plain + border</Text></Surface>
</div>`,
          render: (
            <div className="flex flex-row gap-3">
              <Surface bordered align="center" className="flex-1"><Text size="sm">bordered</Text></Surface>
              <Surface bordered tone="plain" align="center" className="flex-1"><Text size="sm">plain + border</Text></Surface>
            </div>
          ),
        },
        {
          title: 'Text alignment',
          description: 'align controls how text sits inside the surface — left · center · right.',
          code: `<div className="flex flex-col gap-3 w-full">
  <Surface tone="muted" align="left"><Text size="sm">left</Text></Surface>
  <Surface tone="muted" align="center"><Text size="sm">center</Text></Surface>
  <Surface tone="muted" align="right"><Text size="sm">right</Text></Surface>
</div>`,
          render: (
            <div className="flex flex-col gap-3 w-full">
              <Surface tone="muted" align="left"><Text size="sm">left</Text></Surface>
              <Surface tone="muted" align="center"><Text size="sm">center</Text></Surface>
              <Surface tone="muted" align="right"><Text size="sm">right</Text></Surface>
            </div>
          ),
        },
      ],
    },
    {
      id: 'media-object',
      name: 'MediaObject',
      description:
        'The classic media object: a fixed media element (avatar, image, icon) beside a flexible content body. The workhorse of social feeds, comments, notifications, and list rows — an unstyled layout primitive that drops into any surface.',
      importLine: "import { MediaObject } from 'glt-ui';",
      propsTables: [
        {
          title: 'MediaObject',
          props: [
            {
              name: 'media',
              type: 'React.ReactNode',
              description: 'Fixed-size media element beside the content — avatar, image, icon.',
            },
            {
              name: 'thumbnail',
              type: 'React.ReactNode',
              description: 'Deprecated alias for `media`, kept for backwards compatibility.',
            },
            {
              name: 'side',
              type: "'left' | 'right'",
              default: "'left'",
              description: 'Which side the media sits on.',
            },
            {
              name: 'align',
              type: "'start' | 'center' | 'end'",
              default: "'start'",
              description: 'Vertical alignment of the media against the content block.',
            },
            {
              name: 'gap',
              type: '0 | 1 | 2 | 3 | 4 | 6',
              default: '3',
              description: 'Spacing between the media and the content.',
            },
            {
              name: 'actions',
              type: 'React.ReactNode',
              description: 'Trailing slot pinned to the far end — actions, timestamp, menu.',
            },
            {
              name: 'children',
              type: 'React.ReactNode',
              required: true,
              description: 'The flexible content body (uses min-w-0 to truncate/wrap).',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLDivElement>',
              description: 'Forwarded to the underlying <div>.',
            },
          ],
        },
      ],
      examples: [
        {
          title: 'Comment / feed item',
          description: 'Avatar on the left, flexible text body, timestamp pinned to the trailing edge.',
          code: `<MediaObject
  media={<Avatar initials="AN" status="online" />}
  actions={<Text as="span" size="sm" tone="secondary">2h</Text>}
>
  <Text weight="semibold" tone="strong">
    Anthropic Research{' '}
    <Text as="span" weight="normal" tone="secondary">@anthropic</Text>
  </Text>
  <Text tone="default">
    Feedback delay — not development effort — is now the dominant cost of change.
  </Text>
</MediaObject>`,
          render: (
            <MediaObject
              media={<Avatar initials="AN" status="online" />}
              actions={<Text as="span" size="sm" tone="secondary">2h</Text>}
            >
              <Text weight="semibold" tone="strong">
                Anthropic Research{' '}
                <Text as="span" weight="normal" tone="secondary">@anthropic</Text>
              </Text>
              <Text tone="default">
                Feedback delay — not development effort — is now the dominant cost of change.
              </Text>
            </MediaObject>
          ),
        },
        {
          title: 'Notification row',
          description: 'Center-aligned media; the min-w-0 body truncates long content instead of overflowing.',
          code: `<MediaObject
  align="center"
  media={
    <Surface tone="card" radius="full" padding="none" align="center" className="flex h-9 w-9 items-center justify-center">
      🔔
    </Surface>
  }
>
  <Text truncate tone="default">
    Your static export finished — 4 pages generated in 151ms and copied to out/.
  </Text>
</MediaObject>`,
          render: (
            <MediaObject
              align="center"
              media={
                <Surface tone="card" radius="full" padding="none" align="center" className="flex h-9 w-9 items-center justify-center">
                  🔔
                </Surface>
              }
            >
              <Text truncate tone="default">
                Your static export finished — 4 pages generated in 151ms and copied to out/.
              </Text>
            </MediaObject>
          ),
        },
        {
          title: 'Media on the right',
          description: 'Flip the media to the trailing edge with side="right" — e.g. an outgoing chat row.',
          code: `<MediaObject side="right" media={<Avatar initials="ME" shape="square" />}>
  <Text weight="semibold" tone="strong">You</Text>
  <Text tone="default">Shipping the redesigned media object now.</Text>
</MediaObject>`,
          render: (
            <MediaObject side="right" media={<Avatar initials="ME" shape="square" />}>
              <Text weight="semibold" tone="strong">You</Text>
              <Text tone="default">Shipping the redesigned media object now.</Text>
            </MediaObject>
          ),
        },
        {
          title: 'Center-aligned with wide gap',
          description: 'align="center" vertically centers the media; gap widens the space to the body.',
          code: `<MediaObject
  align="center"
  gap={6}
  media={<Avatar initials="GL" />}
  actions={<Button size="sm" variant="outline">Follow</Button>}
>
  <Text weight="semibold" tone="strong">Guided Latent Tuning</Text>
  <Text size="sm" tone="secondary">Steer behavior without full retraining.</Text>
</MediaObject>`,
          render: (
            <MediaObject
              align="center"
              gap={6}
              media={<Avatar initials="GL" />}
              actions={<Button size="sm" variant="outline">Follow</Button>}
            >
              <Text weight="semibold" tone="strong">Guided Latent Tuning</Text>
              <Text size="sm" tone="secondary">Steer behavior without full retraining.</Text>
            </MediaObject>
          ),
        },
      ],
    },
    {
      id: 'reveal',
      name: 'Reveal',
      description:
        'A scroll-triggered entrance wrapper. Children start hidden and offset, then ease into place the first time they enter the viewport (IntersectionObserver). Stagger a list by passing an increasing delay per item. Honors prefers-reduced-motion by rendering fully visible with no transition. Works the same on desktop and mobile.',
      importLine: "import { Reveal } from 'glt-ui';",
      examples: [
        {
          title: 'Staggered reveal',
          description:
            'Scroll this into view: each card fades and slides up, offset by 120ms from the last. Try different animations via the animation prop.',
          code: `<Grid columns={1} mdColumns={3} gap={4}>
  {['Design', 'Build', 'Measure'].map((t, i) => (
    <Reveal key={t} animation="fade-up" delay={i * 120}>
      <Card>
        <CardContent>
          <Text weight="semibold" tone="strong">{t}</Text>
          <Text size="sm" tone="secondary">Step {i + 1}</Text>
        </CardContent>
      </Card>
    </Reveal>
  ))}
</Grid>`,
          render: (
            <Grid columns={1} mdColumns={3} gap={4}>
              {['Design', 'Build', 'Measure'].map((t, i) => (
                <Reveal key={t} animation="fade-up" delay={i * 120}>
                  <Card>
                    <CardContent>
                      <Text weight="semibold" tone="strong">
                        {t}
                      </Text>
                      <Text size="sm" tone="secondary">
                        Step {i + 1}
                      </Text>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </Grid>
          ),
        },
      ],
      propsTables: [
        {
          title: 'Reveal',
          props: [
            { name: 'animation', type: "'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom'", default: "'fade-up'", description: 'Entrance style.' },
            { name: 'delay', type: 'number', default: '0', description: 'Delay before animating in (ms); stagger siblings with increasing values.' },
            { name: 'duration', type: 'number', default: '600', description: 'Animation duration in ms.' },
            { name: 'repeat', type: 'boolean', default: 'false', description: 'Re-animate every time it re-enters the viewport.' },
            { name: '…rest', type: 'React.HTMLAttributes<HTMLDivElement>', description: 'Forwarded to the wrapper <div>.' },
          ],
        },
      ],
    },
  ],
};
