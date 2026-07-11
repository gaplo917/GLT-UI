'use client';
import * as React from 'react';
import { Button, DeleteButton, DropdownMenu, Stack, Text } from 'glt-ui';
import type { DocPropsTable, DocSection } from '../types';

function LoadingDemo() {
  const [loading, setLoading] = React.useState(false);
  return (
    <Stack direction="row" wrap align="center" gap={3}>
      <Button
        variant="primary"
        loading={loading}
        onClick={() => setLoading((v) => !v)}
      >
        Save changes
      </Button>
      <Button variant="outline" onClick={() => setLoading((v) => !v)}>
        Toggle loading
      </Button>
    </Stack>
  );
}

export const actionsSection: DocSection = {
  id: 'actions',
  title: 'Actions',
  blurb: 'Buttons and action menus.',
  entries: [
    {
      id: 'button',
      name: 'Button',
      description:
        'The primary interactive control for triggering actions. Supports seven visual variants, five sizes, icons, loading, and full-width layouts.',
      importLine: "import { Button } from 'glt-ui';",
      propsTables: [
        {
          title: 'Button',
          props: [
            {
              name: 'variant',
              type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'success'",
              default: "'primary'",
              description: 'Visual style controlling color and emphasis.',
            },
            {
              name: 'size',
              type: "'xs' | 'sm' | 'md' | 'lg' | 'icon'",
              default: "'md'",
              description:
                'Height, padding, and font size. "icon" renders a square button (needs an aria-label).',
            },
            {
              name: 'fullWidth',
              type: 'boolean',
              description: 'Stretch the button to fill the width of its container.',
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description:
                'Show a leading spinner and disable interaction while an action is pending.',
            },
            {
              name: 'leftIcon',
              type: 'React.ReactNode',
              description: 'Element rendered before the children (leading icon).',
            },
            {
              name: 'rightIcon',
              type: 'React.ReactNode',
              description: 'Element rendered after the children (trailing icon).',
            },
            {
              name: 'disabled',
              type: 'boolean',
              description:
                'Disable the button. Also applied automatically while loading is true.',
            },
            {
              name: 'children',
              type: 'React.ReactNode',
              description: 'Button label / content.',
            },
            {
              name: 'className',
              type: 'string',
              description: 'Additional classes merged onto the root button element.',
            },
            {
              name: '…rest',
              type: 'React.ButtonHTMLAttributes<HTMLButtonElement>',
              description:
                'All native button attributes (onClick, type, aria-*, form, name, …) are forwarded, and ref is attached to the button.',
            },
          ],
        },
      ] satisfies DocPropsTable[],
      examples: [
        {
          title: 'Variants',
          description: 'All seven visual styles for different levels of emphasis.',
          code: `<Stack direction="row" wrap align="center" gap={3}>
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
  <Button variant="danger">Danger</Button>
  <Button variant="success">Success</Button>
</Stack>`,
          render: (
            <Stack direction="row" wrap align="center" gap={3}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
            </Stack>
          ),
        },
        {
          title: 'Sizes',
          description:
            'From xs to lg, plus a square icon size that requires an aria-label.',
          code: `<Stack direction="row" wrap align="center" gap={3}>
  <Button size="xs">Extra small</Button>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
  <Button size="icon" aria-label="Add item">+</Button>
</Stack>`,
          render: (
            <Stack direction="row" wrap align="center" gap={3}>
              <Button size="xs">Extra small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Add item">
                +
              </Button>
            </Stack>
          ),
        },
        {
          title: 'With icons',
          description: 'Attach leading or trailing icons via leftIcon and rightIcon.',
          code: `<Stack direction="row" wrap align="center" gap={3}>
  <Button variant="primary" leftIcon={<Text as="span" aria-hidden>↓</Text>}>
    Download
  </Button>
  <Button variant="outline" rightIcon={<Text as="span" aria-hidden>→</Text>}>
    Continue
  </Button>
</Stack>`,
          render: (
            <Stack direction="row" wrap align="center" gap={3}>
              <Button variant="primary" leftIcon={<Text as="span" aria-hidden>↓</Text>}>
                Download
              </Button>
              <Button variant="outline" rightIcon={<Text as="span" aria-hidden>→</Text>}>
                Continue
              </Button>
            </Stack>
          ),
        },
        {
          title: 'Link variant',
          description:
            'The link variant drops the button chrome and height, sitting inline like an anchor — useful for low-emphasis inline actions.',
          code: `<Text>
  Need to make changes?{' '}
  <Button variant="link" onClick={() => alert('Editing')}>
    Edit your profile
  </Button>{' '}
  at any time.
</Text>`,
          render: (
            <Text>
              Need to make changes?{' '}
              <Button variant="link" onClick={() => alert('Editing')}>
                Edit your profile
              </Button>{' '}
              at any time.
            </Text>
          ),
        },
        {
          title: 'Loading',
          description:
            'Toggle the loading prop to show a spinner and disable the button. Click either button to flip the state.',
          code: `function LoadingDemo() {
  const [loading, setLoading] = React.useState(false);
  return (
    <Stack direction="row" wrap align="center" gap={3}>
      <Button
        variant="primary"
        loading={loading}
        onClick={() => setLoading((v) => !v)}
      >
        Save changes
      </Button>
      <Button variant="outline" onClick={() => setLoading((v) => !v)}>
        Toggle loading
      </Button>
    </Stack>
  );
}`,
          render: <LoadingDemo />,
        },
        {
          title: 'Full width & disabled',
          description:
            'Stretch a button to fill its container, and disable it to block interaction.',
          previewClassName: 'max-w-sm',
          code: `<Stack direction="column" gap={3}>
  <Button variant="primary" fullWidth>
    Full width
  </Button>
  <Button variant="primary" fullWidth disabled>
    Disabled
  </Button>
</Stack>`,
          render: (
            <Stack direction="column" gap={3}>
              <Button variant="primary" fullWidth>
                Full width
              </Button>
              <Button variant="primary" fullWidth disabled>
                Disabled
              </Button>
            </Stack>
          ),
        },
      ],
    },
    {
      id: 'delete-button',
      name: 'DeleteButton',
      description:
        'A compact ghost button that pairs a leading × with a label, for removing or dismissing an item.',
      importLine: "import { DeleteButton } from 'glt-ui';",
      propsTables: [
        {
          title: 'DeleteButton',
          props: [
            {
              name: 'label',
              type: 'React.ReactNode',
              required: true,
              description: 'Text (or node) shown after the leading × glyph.',
            },
            {
              name: 'onDelete',
              type: '() => void',
              description: 'Called when the button is clicked.',
            },
          ],
        },
      ],
      examples: [
        {
          title: 'Basic',
          description: 'Provide a label and an onDelete handler.',
          code: `<DeleteButton label="Remove tag" onDelete={() => alert('Deleted')} />`,
          render: (
            <DeleteButton label="Remove tag" onDelete={() => alert('Deleted')} />
          ),
        },
        {
          title: 'In a list of items',
          description:
            'A compact ghost button, well suited to dismissing chips or rows without stealing emphasis.',
          code: `<Stack direction="column" align="start" gap={2}>
  <DeleteButton label="design-system.fig" onDelete={() => alert('Removed file')} />
  <DeleteButton label="brand-guidelines.pdf" onDelete={() => alert('Removed file')} />
  <DeleteButton label="logo-final-v3.svg" onDelete={() => alert('Removed file')} />
</Stack>`,
          render: (
            <Stack direction="column" align="start" gap={2}>
              <DeleteButton label="design-system.fig" onDelete={() => alert('Removed file')} />
              <DeleteButton label="brand-guidelines.pdf" onDelete={() => alert('Removed file')} />
              <DeleteButton label="logo-final-v3.svg" onDelete={() => alert('Removed file')} />
            </Stack>
          ),
        },
      ],
    },
    {
      id: 'dropdown-menu',
      name: 'DropdownMenu',
      description:
        'A trigger button with a rotating chevron that reveals a rounded, shadowed menu of actions. Items support icons and danger/disabled states; the menu closes on select, click-outside, or Escape, and supports arrow-key navigation.',
      importLine: "import { DropdownMenu } from 'glt-ui';",
      propsTables: [
        {
          title: 'DropdownMenu',
          props: [
            {
              name: 'triggerLabel',
              type: 'React.ReactNode',
              required: true,
              description: 'Content of the trigger button that opens the menu.',
            },
            {
              name: 'items',
              type: 'DropdownMenuItem[]',
              required: true,
              description: 'The list of actions rendered inside the menu surface.',
            },
            {
              name: 'defaultOpen',
              type: 'boolean',
              default: 'false',
              description: 'Whether the menu is open on first render (uncontrolled).',
            },
            {
              name: 'align',
              type: "'start' | 'end'",
              default: "'start'",
              description: "Which edge the menu aligns to under the trigger.",
            },
            {
              name: 'onSelect',
              type: '(item: DropdownMenuItem) => void',
              description: 'Fired with the chosen item when any enabled item is selected.',
            },
            {
              name: 'className',
              type: 'string',
              description: 'Additional classes merged onto the root wrapper.',
            },
          ],
        },
        {
          title: 'DropdownMenuItem',
          props: [
            {
              name: 'id',
              type: 'string',
              required: true,
              description: 'Stable identifier for the item (also used as the React key).',
            },
            {
              name: 'label',
              type: 'React.ReactNode',
              required: true,
              description: 'Visible item text / content.',
            },
            {
              name: 'icon',
              type: 'React.ReactNode',
              description: 'Optional leading icon or glyph.',
            },
            {
              name: 'danger',
              type: 'boolean',
              description: 'Render the item in the danger tone (e.g. destructive actions).',
            },
            {
              name: 'disabled',
              type: 'boolean',
              description: 'Prevent selection and dim the item.',
            },
            {
              name: 'onSelect',
              type: '() => void',
              description: 'Per-item handler, called in addition to the menu-level onSelect.',
            },
          ],
        },
      ],
      examples: [
        {
          title: 'With icons',
          description: 'Click the trigger to reveal the menu. onSelect fires with the chosen item.',
          code: `<DropdownMenu
  triggerLabel="Options"
  onSelect={(item) => alert(item.id)}
  items={[
    { id: 'edit', label: 'Edit', icon: '✎' },
    { id: 'duplicate', label: 'Duplicate', icon: '⧉' },
    { id: 'archive', label: 'Archive', icon: '🗄' },
  ]}
/>`,
          render: (
            <DropdownMenu
              triggerLabel="Options"
              onSelect={(item) => alert(item.id)}
              items={[
                { id: 'edit', label: 'Edit', icon: '✎' },
                { id: 'duplicate', label: 'Duplicate', icon: '⧉' },
                { id: 'archive', label: 'Archive', icon: '🗄' },
              ]}
            />
          ),
        },
        {
          title: 'Danger & disabled items, open by default',
          description: 'Items can be flagged danger or disabled; defaultOpen shows the surface on first render.',
          previewClassName: 'min-h-52',
          code: `<DropdownMenu
  triggerLabel="Actions"
  defaultOpen
  items={[
    { id: 'rename', label: 'Rename', icon: '✎' },
    { id: 'move', label: 'Move to…', icon: '↪' },
    { id: 'share', label: 'Share (coming soon)', icon: '↗', disabled: true },
    { id: 'delete', label: 'Delete', icon: '🗑', danger: true },
  ]}
/>`,
          render: (
            <DropdownMenu
              triggerLabel="Actions"
              defaultOpen
              items={[
                { id: 'rename', label: 'Rename', icon: '✎' },
                { id: 'move', label: 'Move to…', icon: '↪' },
                { id: 'share', label: 'Share (coming soon)', icon: '↗', disabled: true },
                { id: 'delete', label: 'Delete', icon: '🗑', danger: true },
              ]}
            />
          ),
        },
        {
          title: 'Start-aligned (default)',
          description: 'By default align="start" anchors the menu to the trigger’s left edge, and onSelect reports the chosen item.',
          previewClassName: 'min-h-44',
          code: `<DropdownMenu
  triggerLabel="Sort by"
  align="start"
  defaultOpen
  onSelect={(item) => alert(item.id)}
  items={[
    { id: 'name', label: 'Name', icon: 'A' },
    { id: 'date', label: 'Date modified', icon: '◷' },
    { id: 'size', label: 'Size', icon: '⤢' },
  ]}
/>`,
          render: (
            <DropdownMenu
              triggerLabel="Sort by"
              align="start"
              defaultOpen
              onSelect={(item) => alert(item.id)}
              items={[
                { id: 'name', label: 'Name', icon: 'A' },
                { id: 'date', label: 'Date modified', icon: '◷' },
                { id: 'size', label: 'Size', icon: '⤢' },
              ]}
            />
          ),
        },
        {
          title: 'End-aligned',
          description: 'Set align="end" to pin the menu to the trigger’s right edge (e.g. in toolbars).',
          previewClassName: 'flex w-full min-h-44 justify-end',
          code: `<DropdownMenu
  triggerLabel="More"
  align="end"
  items={[
    { id: 'export', label: 'Export', icon: '↧' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ]}
/>`,
          render: (
            <DropdownMenu
              triggerLabel="More"
              align="end"
              items={[
                { id: 'export', label: 'Export', icon: '↧' },
                { id: 'settings', label: 'Settings', icon: '⚙' },
              ]}
            />
          ),
        },
      ],
    },
  ],
};
