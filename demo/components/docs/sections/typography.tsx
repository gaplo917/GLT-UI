'use client';
import * as React from 'react';
import {
  Heading,
  Title,
  Subtitle,
  Text,
  Stack,
  Content,
  Code,
  Markdown,
  List,
  ListItem,
  Block,
  Surface,
  Icon,
  Label,
  ImagePlaceholder,
} from 'glt-ui';
import type { DocSection } from '../types';

export const typographySection: DocSection = {
  id: 'typography',
  title: 'Typography & Media',
  blurb: 'Headings, text, and inline media primitives.',
  entries: [
    {
      id: 'heading',
      name: 'Heading',
      description:
        'Semantic heading (h1–h6) with a visual size scale that can be decoupled from the semantic level.',
      importLine: "import { Heading } from 'glt-ui';",
      examples: [
        {
          title: 'Levels',
          description: 'Semantic levels 1–4, each with its matching default visual size.',
          code: `<Heading level={1}>Heading level 1</Heading>
<Heading level={2}>Heading level 2</Heading>
<Heading level={3}>Heading level 3</Heading>
<Heading level={4}>Heading level 4</Heading>`,
          render: (
            <Stack gap={2}>
              <Heading level={1}>Heading level 1</Heading>
              <Heading level={2}>Heading level 2</Heading>
              <Heading level={3}>Heading level 3</Heading>
              <Heading level={4}>Heading level 4</Heading>
            </Stack>
          ),
        },
        {
          title: 'Size override',
          description:
            'Keep the semantic level for accessibility while rendering a smaller visual size.',
          code: `<Heading level={2} size={4}>
  An h2 that looks like a level-4 heading
</Heading>`,
          render: (
            <Heading level={2} size={4}>
              An h2 that looks like a level-4 heading
            </Heading>
          ),
        },
      ],
    },
    {
      id: 'title',
      name: 'Title & Subtitle',
      description:
        'Simple, strong headings to add depth to a page. Both run a 1–6 size scale (1 largest); Title is bold and prominent, Subtitle is a lighter companion line. By default each renders the matching heading element — override with `as` to keep semantics independent of size.',
      importLine: "import { Title, Subtitle } from 'glt-ui';",
      examples: [
        {
          title: 'Title & Subtitle lockup',
          description: 'A Title followed directly by a Subtitle — the classic two-line heading.',
          code: `<Stack gap={1}>
  <Title size={2}>Model Evaluation</Title>
  <Subtitle size={4}>Rolling 24-hour window across all regions</Subtitle>
</Stack>`,
          render: (
            <Stack gap={1}>
              <Title size={2}>Model Evaluation</Title>
              <Subtitle size={4}>Rolling 24-hour window across all regions</Subtitle>
            </Stack>
          ),
        },
        {
          title: 'Title sizes 1–6',
          description: 'The full title scale, largest to smallest.',
          code: `<Stack gap={2}>
  <Title size={1}>Title 1</Title>
  <Title size={2}>Title 2</Title>
  <Title size={3}>Title 3</Title>
  <Title size={4}>Title 4</Title>
  <Title size={5}>Title 5</Title>
  <Title size={6}>Title 6</Title>
</Stack>`,
          render: (
            <Stack gap={2}>
              {([1, 2, 3, 4, 5, 6] as const).map((s) => (
                <Title key={s} size={s}>Title {s}</Title>
              ))}
            </Stack>
          ),
        },
        {
          title: 'Subtitle sizes 1–6',
          description: 'The matching subtitle scale, lighter in weight and colour.',
          code: `<Stack gap={2}>
  <Subtitle size={1}>Subtitle 1</Subtitle>
  <Subtitle size={2}>Subtitle 2</Subtitle>
  <Subtitle size={3}>Subtitle 3</Subtitle>
  <Subtitle size={4}>Subtitle 4</Subtitle>
  <Subtitle size={5}>Subtitle 5</Subtitle>
  <Subtitle size={6}>Subtitle 6</Subtitle>
</Stack>`,
          render: (
            <Stack gap={2}>
              {([1, 2, 3, 4, 5, 6] as const).map((s) => (
                <Subtitle key={s} size={s}>Subtitle {s}</Subtitle>
              ))}
            </Stack>
          ),
        },
      ],
    },
    {
      id: 'text',
      name: 'Text',
      description:
        'Token-driven body text with presets for element, size, tone, and weight.',
      importLine: "import { Text } from 'glt-ui';",
      examples: [
        {
          title: 'Tones',
          description: 'Semantic color tones drawn from theme tokens.',
          code: `<Text tone="default">Default tone</Text>
<Text tone="secondary">Secondary tone</Text>
<Text tone="strong">Strong tone</Text>
<Text tone="brand">Brand tone</Text>`,
          render: (
            <Stack gap={1}>
              <Text tone="default">Default tone</Text>
              <Text tone="secondary">Secondary tone</Text>
              <Text tone="strong">Strong tone</Text>
              <Text tone="brand">Brand tone</Text>
            </Stack>
          ),
        },
        {
          title: 'Sizes',
          description: 'Four size presets from extra-small to large.',
          code: `<Text size="xs">Extra small text</Text>
<Text size="sm">Small text</Text>
<Text size="base">Base text</Text>
<Text size="lg">Large text</Text>`,
          render: (
            <Stack gap={1}>
              <Text size="xs">Extra small text</Text>
              <Text size="sm">Small text</Text>
              <Text size="base">Base text</Text>
              <Text size="lg">Large text</Text>
            </Stack>
          ),
        },
        {
          title: 'Weights',
          description: 'Adjust emphasis with the weight preset.',
          code: `<Text weight="normal">Normal weight</Text>
<Text weight="medium">Medium weight</Text>
<Text weight="semibold">Semibold weight</Text>`,
          render: (
            <Stack gap={1}>
              <Text weight="normal">Normal weight</Text>
              <Text weight="medium">Medium weight</Text>
              <Text weight="semibold">Semibold weight</Text>
            </Stack>
          ),
        },
        {
          title: 'Inline element',
          description: 'Render as a span for inline emphasis within a sentence.',
          code: `<Text as="span" tone="brand" weight="semibold">
  inline brand text
</Text>`,
          render: (
            <Text as="span" tone="brand" weight="semibold">
              inline brand text
            </Text>
          ),
        },
        {
          title: 'Display scale',
          description:
            'Larger display sizes combined with bold weight, alignment, and brand tone.',
          code: `<Text size="3xl" weight="bold" tone="brand">
  Guided Latent Tuning
</Text>
<Text size="2xl" weight="bold">
  Refine internal representations
</Text>
<Text size="xl" align="center">
  Centered supporting line
</Text>`,
          render: (
            <Stack gap={2}>
              <Text size="3xl" weight="bold" tone="brand">
                Guided Latent Tuning
              </Text>
              <Text size="2xl" weight="bold">
                Refine internal representations
              </Text>
              <Text size="xl" align="center">
                Centered supporting line
              </Text>
            </Stack>
          ),
        },
      ],
    },
    {
      id: 'code',
      name: 'Code',
      description:
        'Inline monospace snippet for a token, path, or command woven into running text. For multi-line snippets, reach for CodeBlock instead.',
      importLine: "import { Code } from 'glt-ui';",
      examples: [
        {
          title: 'Inline in a sentence',
          description: 'Highlight a command inline within surrounding body text.',
          code: `<Text>
  Run <Code>npm run build</Code> to export the static site.
</Text>`,
          render: (
            <Text>
              Run <Code>npm run build</Code> to export the static site.
            </Text>
          ),
        },
        {
          title: 'Standalone token',
          description: 'A single design token referenced on its own.',
          code: `<Code>--brand-primary</Code>`,
          render: <Code>--brand-primary</Code>,
        },
      ],
    },
    {
      id: 'list',
      name: 'List',
      description:
        'Token-driven list with disc, decimal, or plain variants and adjustable spacing between items.',
      importLine: "import { List, ListItem } from 'glt-ui';",
      examples: [
        {
          title: 'Unordered',
          description: 'Default disc-marker list.',
          code: `<List>
  <ListItem>Collect and normalize activations</ListItem>
  <ListItem>Fit the steering vectors</ListItem>
  <ListItem>Evaluate against the baseline</ListItem>
</List>`,
          render: (
            <List>
              <ListItem>Collect and normalize activations</ListItem>
              <ListItem>Fit the steering vectors</ListItem>
              <ListItem>Evaluate against the baseline</ListItem>
            </List>
          ),
        },
        {
          title: 'Ordered',
          description: 'Numbered list via the decimal variant.',
          code: `<List variant="decimal">
  <ListItem>Prepare the dataset</ListItem>
  <ListItem>Train the steering vectors</ListItem>
  <ListItem>Publish the checkpoint</ListItem>
</List>`,
          render: (
            <List variant="decimal">
              <ListItem>Prepare the dataset</ListItem>
              <ListItem>Train the steering vectors</ListItem>
              <ListItem>Publish the checkpoint</ListItem>
            </List>
          ),
        },
        {
          title: 'Roomy spacing',
          description: 'Increase the vertical spacing between items.',
          code: `<List spacing={3}>
  <ListItem>First milestone</ListItem>
  <ListItem>Second milestone</ListItem>
  <ListItem>Third milestone</ListItem>
</List>`,
          render: (
            <List spacing={3}>
              <ListItem>First milestone</ListItem>
              <ListItem>Second milestone</ListItem>
              <ListItem>Third milestone</ListItem>
            </List>
          ),
        },
      ],
    },
    {
      id: 'markdown',
      name: 'Markdown',
      description:
        'A dependency-free Markdown renderer that composes the Text, Code, and List atoms. Supports headings, paragraphs, ordered/unordered lists, blockquotes, fenced code, and inline bold / italic / code / links. Pass tone="inherit" to render inside a coloured surface.',
      importLine: "import { Markdown } from 'glt-ui';",
      examples: [
        {
          title: 'Rich content',
          description: 'Headings, lists, inline emphasis, code, and links.',
          code: `<Markdown
  content={\`## Findings
The **cost of change** curve is now *flatter*.

- Feedback delay dominates, not \\\`dev effort\\\`
- See the [analysis](#) for details\`}
/>`,
          render: (
            <Markdown
              content={`## Findings
The **cost of change** curve is now *flatter*.

- Feedback delay dominates, not \`dev effort\`
- See the [analysis](#) for details`}
            />
          ),
        },
      ],
    },
    {
      id: 'content',
      name: 'Content',
      description:
        'Prose-width container for long-form body copy such as paragraphs and lists.',
      importLine: "import { Content } from 'glt-ui';",
      examples: [
        {
          title: 'Paragraph',
          description: 'A single block of prose body copy.',
          code: `<Content>
  <Text>
    Guided latent tuning refines a model's internal representations
    without retraining the full network, yielding faster iteration.
  </Text>
</Content>`,
          render: (
            <Content>
              <Text>
                Guided latent tuning refines a model&apos;s internal
                representations without retraining the full network, yielding
                faster iteration.
              </Text>
            </Content>
          ),
        },
        {
          title: 'Nested list',
          description: 'Prose content with a nested list of items.',
          code: `<Content>
  <Text>The pipeline runs in three stages:</Text>
  <List>
    <ListItem>Collect and normalize activations</ListItem>
    <ListItem>Fit the steering vectors</ListItem>
    <ListItem>Evaluate against the baseline</ListItem>
  </List>
</Content>`,
          render: (
            <Content>
              <Text>The pipeline runs in three stages:</Text>
              <List>
                <ListItem>Collect and normalize activations</ListItem>
                <ListItem>Fit the steering vectors</ListItem>
                <ListItem>Evaluate against the baseline</ListItem>
              </List>
            </Content>
          ),
        },
      ],
    },
    {
      id: 'block',
      name: 'Block',
      description:
        'The most basic spacer. Block inserts a consistent bottom margin between its direct children so stacked elements keep an even vertical rhythm — no bespoke margins per item. Unlike Stack (a flex column with gap), it spaces with plain margins, so it plays nicely with mixed block content and prose.',
      importLine: "import { Block } from 'glt-ui';",
      examples: [
        {
          title: 'Consistent spacing',
          description: 'Every child except the last gets the same bottom margin (default 6 ≈ 1.5rem).',
          code: `<Block>
  <Surface tone="muted" padding="md">First block</Surface>
  <Surface tone="muted" padding="md">Second block</Surface>
  <Surface tone="muted" padding="md">Third block</Surface>
</Block>`,
          render: (
            <Block>
              <Surface tone="muted" padding="md">First block</Surface>
              <Surface tone="muted" padding="md">Second block</Surface>
              <Surface tone="muted" padding="md">Third block</Surface>
            </Block>
          ),
        },
        {
          title: 'Tighter rhythm',
          description: 'Dial the gap down (or up) with the spacing prop.',
          code: `<Block spacing={2}>
  <Surface tone="muted" padding="sm">Row one</Surface>
  <Surface tone="muted" padding="sm">Row two</Surface>
  <Surface tone="muted" padding="sm">Row three</Surface>
</Block>`,
          render: (
            <Block spacing={2}>
              <Surface tone="muted" padding="sm">Row one</Surface>
              <Surface tone="muted" padding="sm">Row two</Surface>
              <Surface tone="muted" padding="sm">Row three</Surface>
            </Block>
          ),
        },
      ],
    },
    {
      id: 'icon',
      name: 'Icon',
      description:
        'Inline glyph paired with a text label; defaults to a star glyph.',
      importLine: "import { Icon } from 'glt-ui';",
      examples: [
        {
          title: 'Default star',
          description: 'Uses the built-in star glyph when no icon is provided.',
          code: `<Icon label="Featured" />`,
          render: <Icon label="Featured" />,
        },
        {
          title: 'Custom icon',
          description: 'Pass any node as the icon glyph.',
          code: `<Icon icon="⚡" label="Fast inference" />`,
          render: <Icon icon="⚡" label="Fast inference" />,
        },
      ],
    },
    {
      id: 'label',
      name: 'Label',
      description:
        'Form field label with an optional required marker, tied to a control via htmlFor.',
      importLine: "import { Label } from 'glt-ui';",
      examples: [
        {
          title: 'Default',
          description: 'A standard field label.',
          code: `<Label htmlFor="field">Display name</Label>`,
          render: <Label htmlFor="field">Display name</Label>,
        },
        {
          title: 'Required',
          description: 'Adds an asterisk marker after the label text.',
          code: `<Label htmlFor="field" required>
  Display name
</Label>`,
          render: (
            <Label htmlFor="field" required>
              Display name
            </Label>
          ),
        },
      ],
    },
    {
      id: 'image-placeholder',
      name: 'ImagePlaceholder',
      description:
        'Dashed placeholder frame that stands in for an image or media cover.',
      importLine: "import { ImagePlaceholder } from 'glt-ui';",
      examples: [
        {
          title: 'Basic',
          description: 'A labeled placeholder frame.',
          code: `<ImagePlaceholder label="Cover image" />`,
          render: <ImagePlaceholder label="Cover image" />,
        },
      ],
    },
  ],
};
