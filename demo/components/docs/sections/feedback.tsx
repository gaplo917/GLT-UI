'use client';
import * as React from 'react';
import {
  Alert,
  Avatar,
  Button,
  Callout,
  Grid,
  ImagePlaceholder,
  Message,
  Modal,
  Quote,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Tooltip,
} from 'glt-ui';
import type { DocSection } from '../types';

export const feedbackSection: DocSection = {
  id: 'feedback',
  title: 'Feedback & Overlays',
  blurb: 'Alerts, callouts, quotes, loaders, tooltips, and modals.',
  entries: [
    {
      id: 'callout',
      name: 'Callout',
      description:
        'A block for highlighting supporting information with a semantic accent. Supports seven variants, four appearances, three sizes, an optional overline label, and dismissal.',
      importLine: "import { Callout } from 'glt-ui';",
      examples: [
        {
          title: 'Variants',
          description: 'All seven semantic variants in the default soft appearance.',
          code: `<Grid gap={3} className="sm:grid-cols-2">
  <Callout variant="info" title="Information">Neutral, factual context.</Callout>
  <Callout variant="success" title="Success">The operation completed.</Callout>
  <Callout variant="warning" title="Warning">Double-check before continuing.</Callout>
  <Callout variant="danger" title="Danger">This action cannot be undone.</Callout>
  <Callout variant="tip" title="Tip">A helpful shortcut worth knowing.</Callout>
  <Callout variant="note" title="Note">A small aside to keep in mind.</Callout>
  <Callout variant="fact" title="Fact">A noteworthy detail to remember.</Callout>
</Grid>`,
          render: (
            <Grid gap={3} className="sm:grid-cols-2">
              <Callout variant="info" title="Information">
                Neutral, factual context.
              </Callout>
              <Callout variant="success" title="Success">
                The operation completed.
              </Callout>
              <Callout variant="warning" title="Warning">
                Double-check before continuing.
              </Callout>
              <Callout variant="danger" title="Danger">
                This action cannot be undone.
              </Callout>
              <Callout variant="tip" title="Tip">
                A helpful shortcut worth knowing.
              </Callout>
              <Callout variant="note" title="Note">
                A small aside to keep in mind.
              </Callout>
              <Callout variant="fact" title="Fact">
                A noteworthy detail to remember.
              </Callout>
            </Grid>
          ),
        },
        {
          title: 'Appearances',
          description:
            'The same variant rendered with each of the four accent treatments.',
          code: `<Stack gap={3}>
  <Callout variant="info" appearance="soft" title="Soft">Tinted background.</Callout>
  <Callout variant="info" appearance="outline" title="Outline">Bordered, transparent fill.</Callout>
  <Callout variant="info" appearance="solid" title="Solid">Filled accent surface.</Callout>
  <Callout variant="info" appearance="plain" title="Plain">Minimal, borderless.</Callout>
</Stack>`,
          render: (
            <Stack gap={3}>
              <Callout variant="info" appearance="soft" title="Soft">
                Tinted background.
              </Callout>
              <Callout variant="info" appearance="outline" title="Outline">
                Bordered, transparent fill.
              </Callout>
              <Callout variant="info" appearance="solid" title="Solid">
                Filled accent surface.
              </Callout>
              <Callout variant="info" appearance="plain" title="Plain">
                Minimal, borderless.
              </Callout>
            </Stack>
          ),
        },
        {
          title: 'Label & title',
          description: 'Add an overline label above the title for extra categorisation.',
          code: `<Callout variant="tip" label="Pro tip" title="Batch your requests">
  Group related calls together to reduce round trips and latency.
</Callout>`,
          render: (
            <Callout variant="tip" label="Pro tip" title="Batch your requests">
              Group related calls together to reduce round trips and latency.
            </Callout>
          ),
        },
        {
          title: 'Dismissible',
          description: 'Set dismissible to render a close control and handle onDismiss.',
          code: `<Callout
  variant="danger"
  title="Quota exceeded"
  dismissible
  onDismiss={() => alert('Dismissed')}
>
  You have reached your monthly limit. Upgrade to continue.
</Callout>`,
          render: (
            <Callout
              variant="danger"
              title="Quota exceeded"
              dismissible
              onDismiss={() => alert('Dismissed')}
            >
              You have reached your monthly limit. Upgrade to continue.
            </Callout>
          ),
        },
        {
          title: 'Sizes',
          description: 'Compact sm through roomy lg for different densities.',
          code: `<Stack gap={3}>
  <Callout variant="note" size="sm" title="Small">Tight spacing for dense layouts.</Callout>
  <Callout variant="note" size="lg" title="Large">Generous spacing for emphasis.</Callout>
</Stack>`,
          render: (
            <Stack gap={3}>
              <Callout variant="note" size="sm" title="Small">
                Tight spacing for dense layouts.
              </Callout>
              <Callout variant="note" size="lg" title="Large">
                Generous spacing for emphasis.
              </Callout>
            </Stack>
          ),
        },
      ],
    },
    {
      id: 'alert',
      name: 'Alert',
      description:
        'A notification-style status message: a filled circular icon badge, a soft all-round border with a subtle shadow, and an optional actions row. Use it for UI feedback — distinct from Callout, which is an editorial in-prose block with a left accent stripe.',
      importLine: "import { Alert } from 'glt-ui';",
      examples: [
        {
          title: 'Variants',
          description: 'Four semantic variants; each shows its default icon badge.',
          code: `<Stack gap={3}>
  <Alert variant="info" title="Heads up">A new version is available.</Alert>
  <Alert variant="success" title="Saved">Your changes have been stored.</Alert>
  <Alert variant="warning" title="Careful">Your session expires soon.</Alert>
  <Alert variant="danger" title="Failed">We could not process the request.</Alert>
</Stack>`,
          render: (
            <Stack gap={3}>
              <Alert variant="info" title="Heads up">A new version is available.</Alert>
              <Alert variant="success" title="Saved">Your changes have been stored.</Alert>
              <Alert variant="warning" title="Careful">Your session expires soon.</Alert>
              <Alert variant="danger" title="Failed">We could not process the request.</Alert>
            </Stack>
          ),
        },
        {
          title: 'Appearances',
          description: 'soft (default), solid, and outline.',
          code: `<Stack gap={3}>
  <Alert variant="success" title="Soft">Tinted surface with a colored badge.</Alert>
  <Alert variant="success" appearance="solid" title="Solid">Filled, high-contrast banner.</Alert>
  <Alert variant="success" appearance="outline" title="Outline">Bordered, transparent banner.</Alert>
</Stack>`,
          render: (
            <Stack gap={3}>
              <Alert variant="success" title="Soft">Tinted surface with a colored badge.</Alert>
              <Alert variant="success" appearance="solid" title="Solid">Filled, high-contrast banner.</Alert>
              <Alert variant="success" appearance="outline" title="Outline">Bordered, transparent banner.</Alert>
            </Stack>
          ),
        },
        {
          title: 'With actions',
          description: 'Pass an actions node (buttons or links) to prompt a response.',
          code: `<Alert
  variant="warning"
  title="Unsaved changes"
  actions={
    <>
      <Button size="sm" variant="outline">Discard</Button>
      <Button size="sm">Save now</Button>
    </>
  }
>
  You have edits that haven’t been saved yet.
</Alert>`,
          render: (
            <Alert
              variant="warning"
              title="Unsaved changes"
              actions={
                <>
                  <Button size="sm" variant="outline">Discard</Button>
                  <Button size="sm">Save now</Button>
                </>
              }
            >
              You have edits that haven’t been saved yet.
            </Alert>
          ),
        },
        {
          title: 'Dismissible',
          description: 'Add dismissible with an onDismiss handler to let users close it.',
          code: `<Alert variant="info" title="Maintenance window" dismissible onDismiss={() => alert('Dismissed')}>
  Service may be briefly unavailable tonight.
</Alert>`,
          render: (
            <Alert
              variant="info"
              title="Maintenance window"
              dismissible
              onDismiss={() => alert('Dismissed')}
            >
              Service may be briefly unavailable tonight.
            </Alert>
          ),
        },
      ],
    },
    {
      id: 'message',
      name: 'Message',
      description:
        'A chat bubble for illustrating a conversation. Place bubbles on the left (them) or right (me); attach an avatar, an in-bubble image, a Markdown body, and a row of action buttons. Composes the Surface, Text, and Markdown atoms.',
      importLine: "import { Message } from 'glt-ui';",
      examples: [
        {
          title: 'A conversation',
          description:
            'Left and right bubbles with avatars, timestamps, and Markdown bodies form a thread.',
          previewClassName: 'w-full max-w-xl',
          code: `<Stack gap={4}>
  <Message
    side="left"
    author="Ava"
    timestamp="09:41"
    avatar={<Avatar initials="AV" />}
    markdown="Morning! The **latency** report is in — p95 dropped to \`120ms\`."
  />
  <Message
    side="right"
    author="You"
    timestamp="09:42"
    avatar={<Avatar initials="ME" />}
    markdown="Nice. Can you share the *breakdown* by region?"
  />
</Stack>`,
          render: (
            <Stack gap={4}>
              <Message
                side="left"
                author="Ava"
                timestamp="09:41"
                avatar={<Avatar initials="AV" />}
                markdown="Morning! The **latency** report is in — p95 dropped to `120ms`."
              />
              <Message
                side="right"
                author="You"
                timestamp="09:42"
                avatar={<Avatar initials="ME" />}
                markdown="Nice. Can you share the *breakdown* by region?"
              />
            </Stack>
          ),
        },
        {
          title: 'Markdown body',
          description:
            'The markdown prop renders headings, lists, links, and inline code via the Markdown atom.',
          previewClassName: 'w-full max-w-xl',
          code: `<Message
  side="left"
  author="Ava"
  avatar={<Avatar initials="AV" />}
  markdown={\`### Regional breakdown
- **us-east** — 120ms
- **eu-west** — 180ms

See the [full dashboard](#) for details.\`}
/>`,
          render: (
            <Message
              side="left"
              author="Ava"
              avatar={<Avatar initials="AV" />}
              markdown={`### Regional breakdown
- **us-east** — 120ms
- **eu-west** — 180ms

See the [full dashboard](#) for details.`}
            />
          ),
        },
        {
          title: 'Image and actions',
          description:
            'Attach an image to the bubble and a row of action buttons beneath it.',
          previewClassName: 'w-full max-w-xl',
          code: `<Message
  side="left"
  author="Ava"
  avatar={<Avatar initials="AV" />}
  image={<ImagePlaceholder label="chart.png" ratio="video" />}
  markdown="Here's the throughput chart for the last 24h."
  actions={
    <>
      <Button size="sm" variant="secondary">Download</Button>
      <Button size="sm" variant="ghost">Reply</Button>
    </>
  }
/>`,
          render: (
            <Message
              side="left"
              author="Ava"
              avatar={<Avatar initials="AV" />}
              image={<ImagePlaceholder label="chart.png" ratio="video" />}
              markdown="Here's the throughput chart for the last 24h."
              actions={
                <>
                  <Button size="sm" variant="secondary">Download</Button>
                  <Button size="sm" variant="ghost">Reply</Button>
                </>
              }
            />
          ),
        },
      ],
      propsTables: [
        {
          title: 'Message',
          props: [
            { name: 'side', type: "'left' | 'right'", default: "'left'", description: 'Which side of the conversation the bubble sits on (right reads as "me").' },
            { name: 'author', type: 'React.ReactNode', description: 'Author name shown above the bubble.' },
            { name: 'timestamp', type: 'React.ReactNode', description: 'Timestamp shown beside the author.' },
            { name: 'avatar', type: 'React.ReactNode', description: 'Avatar node rendered beside the bubble.' },
            { name: 'image', type: 'React.ReactNode', description: 'Media rendered at the top of the bubble.' },
            { name: 'markdown', type: 'string', description: 'Markdown body (rendered via the Markdown atom); falls back to children.' },
            { name: 'actions', type: 'React.ReactNode', description: 'Action buttons rendered in a row beneath the bubble.' },
            { name: '…rest', type: 'React.HTMLAttributes<HTMLDivElement>', description: 'Forwarded to the row wrapper.' },
          ],
        },
      ],
    },
    {
      id: 'quote',
      name: 'Quote',
      description:
        'A styled blockquote with optional citation and source attribution, in three visual variants and two sizes.',
      importLine: "import { Quote } from 'glt-ui';",
      examples: [
        {
          title: 'Highlight',
          description: 'The default highlight variant with a citation and source line.',
          code: `<Quote cite="Antoine de Saint-Exupéry" source="Terre des Hommes, 1939">
  Perfection is achieved, not when there is nothing more to add, but when there
  is nothing left to take away.
</Quote>`,
          render: (
            <Quote cite="Antoine de Saint-Exupéry" source="Terre des Hommes, 1939">
              Perfection is achieved, not when there is nothing more to add, but when
              there is nothing left to take away.
            </Quote>
          ),
        },
        {
          title: 'Bordered',
          description: 'A bordered variant at the more compact md size.',
          code: `<Quote variant="bordered" size="md" cite="Alan Kay">
  The best way to predict the future is to invent it.
</Quote>`,
          render: (
            <Quote variant="bordered" size="md" cite="Alan Kay">
              The best way to predict the future is to invent it.
            </Quote>
          ),
        },
        {
          title: 'Plain',
          description: 'A minimal, unadorned variant for subtle emphasis.',
          code: `<Quote variant="plain">
  Simplicity is the ultimate sophistication.
</Quote>`,
          render: (
            <Quote variant="plain">Simplicity is the ultimate sophistication.</Quote>
          ),
        },
      ],
    },
    {
      id: 'spinner',
      name: 'Spinner',
      description:
        'An indeterminate loading indicator with six colour intents and three sizes.',
      importLine: "import { Spinner } from 'glt-ui';",
      examples: [
        {
          title: 'Intents',
          description: 'Each semantic colour intent applied to the spinner.',
          code: `<Stack direction="row" gap={4} align="center" wrap>
  <Spinner intent="brand" label="Loading" />
  <Spinner intent="info" label="Loading" />
  <Spinner intent="success" label="Loading" />
  <Spinner intent="warning" label="Loading" />
  <Spinner intent="danger" label="Loading" />
  <Spinner intent="current" label="Loading" />
</Stack>`,
          render: (
            <Stack direction="row" gap={4} align="center" wrap>
              <Spinner intent="brand" label="Loading" />
              <Spinner intent="info" label="Loading" />
              <Spinner intent="success" label="Loading" />
              <Spinner intent="warning" label="Loading" />
              <Spinner intent="danger" label="Loading" />
              <Spinner intent="current" label="Loading" />
            </Stack>
          ),
        },
        {
          title: 'Sizes',
          description: 'From sm to lg for different contexts.',
          code: `<Stack direction="row" gap={4} align="center" wrap>
  <Spinner size="sm" label="Loading" />
  <Spinner size="md" label="Loading" />
  <Spinner size="lg" label="Loading" />
</Stack>`,
          render: (
            <Stack direction="row" gap={4} align="center" wrap>
              <Spinner size="sm" label="Loading" />
              <Spinner size="md" label="Loading" />
              <Spinner size="lg" label="Loading" />
            </Stack>
          ),
        },
      ],
    },
    {
      id: 'skeleton',
      name: 'Skeleton',
      description:
        'A placeholder shimmer for content that is still loading, in line, block, and circle shapes.',
      importLine: "import { Skeleton } from 'glt-ui';",
      examples: [
        {
          title: 'Lines',
          description: 'Render several text lines with the lines prop.',
          code: `<Skeleton shape="line" lines={3} />`,
          render: <Skeleton shape="line" lines={3} />,
        },
        {
          title: 'Block',
          description: 'A solid block placeholder for cards, media, or thumbnails.',
          code: `<Skeleton shape="block" height={96} />`,
          render: <Skeleton shape="block" height={96} />,
        },
        {
          title: 'Circle',
          description: 'A circular placeholder for avatars or icons.',
          code: `<Skeleton shape="circle" width={48} height={48} />`,
          render: <Skeleton shape="circle" width={48} height={48} />,
        },
      ],
    },
    {
      id: 'tooltip',
      name: 'Tooltip',
      description:
        'A hover- and focus-triggered popup that reveals supplementary content beside its child, positionable on any side.',
      importLine: "import { Tooltip } from 'glt-ui';",
      examples: [
        {
          title: 'Basic',
          description: 'Wrap any element; here the tooltip opens to the right of a button.',
          previewClassName: 'min-h-24',
          code: `<Tooltip content="Saves without leaving the page" side="right">
  <Button variant="primary">Save</Button>
</Tooltip>`,
          render: (
            <Tooltip content="Saves without leaving the page" side="right">
              <Button variant="primary">Save</Button>
            </Tooltip>
          ),
        },
      ],
    },
    {
      id: 'modal',
      name: 'Modal',
      description:
        'A self-contained dialog with a built-in trigger; the trigger opens an overlay rendering the provided body content.',
      importLine: "import { Modal } from 'glt-ui';",
      examples: [
        {
          title: 'Trigger',
          description: 'Click the trigger label to open the modal body.',
          code: `<Modal triggerLabel="Open dialog">
  <Text>This content lives inside the modal. Click outside or the close control to dismiss it.</Text>
</Modal>`,
          render: (
            <Modal triggerLabel="Open dialog">
              <Text>
                This content lives inside the modal. Click outside or the close control
                to dismiss it.
              </Text>
            </Modal>
          ),
        },
      ],
    },
  ],
};
