'use client';
import * as React from 'react';
import {
  Accordion,
  Breadcrumb,
  Button,
  Navbar,
  NavbarBrand,
  NavbarBurger,
  NavbarDivider,
  NavbarDropdown,
  NavbarEnd,
  NavbarItem,
  NavbarMenu,
  NavbarStart,
  Pagination,
  Tabs,
  Text,
} from 'glt-ui';
import type { DocPropsTable, DocSection } from '../types';

export const navigationSection: DocSection = {
  id: 'navigation',
  title: 'Navigation',
  blurb: 'Breadcrumbs, nav bars, pagination, tabs, and accordions.',
  entries: [
    {
      id: 'breadcrumb',
      name: 'Breadcrumb',
      description:
        'A trail of links showing the current location within a hierarchy. Accepts an array of labels and an optional suffix slot.',
      importLine: "import { Breadcrumb } from 'glt-ui';",
      examples: [
        {
          title: 'Three-level trail',
          description: 'Pass an ordered array of labels from root to current page.',
          code: `<Breadcrumb items={['Home', 'Library', 'Data']} />`,
          render: <Breadcrumb items={['Home', 'Library', 'Data']} />,
        },
        {
          title: 'With suffix',
          description: 'Render trailing content, such as a badge, via the suffix prop.',
          code: `<Breadcrumb
  items={['Home', 'Projects', 'Design System']}
  suffix={<Text as="span" size="xs" tone="secondary">Draft</Text>}
/>`,
          render: (
            <Breadcrumb
              items={['Home', 'Projects', 'Design System']}
              suffix={<Text as="span" size="xs" tone="secondary">Draft</Text>}
            />
          ),
        },
        {
          title: 'Two-level trail',
          description: 'A minimal trail needs only two labels; the last is the current page.',
          code: `<Breadcrumb items={['Docs', 'Navigation']} />`,
          render: <Breadcrumb items={['Docs', 'Navigation']} />,
        },
      ],
      propsTables: [
        {
          title: 'Breadcrumb',
          props: [
            {
              name: 'items',
              type: 'string[]',
              required: true,
              description: 'Ordered labels from root to current page, joined by separators.',
            },
            {
              name: 'suffix',
              type: 'React.ReactNode',
              description: 'Optional trailing content rendered after the trail (e.g. a badge).',
            },
          ],
        },
      ],
    },
    {
      id: 'navbar',
      name: 'Navbar',
      description:
        'A responsive, composable horizontal navigation bar. Build it from a NavbarBrand (always visible, holds the logo + NavbarBurger) and a NavbarMenu split into NavbarStart / NavbarEnd. Items are links or plain cells (NavbarItem), and a NavbarDropdown adds a hover/tap menu with NavbarItems and NavbarDividers. Below the md breakpoint the menu collapses behind the burger — narrow this preview to see it.',
      importLine:
        "import { Navbar, NavbarBrand, NavbarBurger, NavbarMenu, NavbarStart, NavbarEnd, NavbarItem, NavbarDropdown, NavbarDivider } from 'glt-ui';",
      examples: [
        {
          title: 'Full composition',
          description:
            'Brand + burger, a start group with a dropdown, and an end group with a call-to-action. Resize down to mobile to reveal the burger toggle.',
          previewClassName: 'w-full',
          code: `<Navbar>
  <NavbarBrand>
    <NavbarItem href="#" className="font-semibold">
      <Text as="span" tone="brand">◆</Text> Acme Research
    </NavbarItem>
    <NavbarBurger />
  </NavbarBrand>
  <NavbarMenu>
    <NavbarStart>
      <NavbarItem href="#" active>Dashboard</NavbarItem>
      <NavbarItem href="#">Reports</NavbarItem>
      <NavbarDropdown label="More">
        <NavbarItem href="#">Team</NavbarItem>
        <NavbarItem href="#">Settings</NavbarItem>
        <NavbarDivider />
        <NavbarItem href="#">Sign out</NavbarItem>
      </NavbarDropdown>
    </NavbarStart>
    <NavbarEnd>
      <NavbarItem>
        <Button size="sm">Sign in</Button>
      </NavbarItem>
    </NavbarEnd>
  </NavbarMenu>
</Navbar>`,
          render: (
            <Navbar>
              <NavbarBrand>
                <NavbarItem href="#" className="font-semibold">
                  <Text as="span" tone="brand">◆</Text> Acme Research
                </NavbarItem>
                <NavbarBurger />
              </NavbarBrand>
              <NavbarMenu>
                <NavbarStart>
                  <NavbarItem href="#" active>
                    Dashboard
                  </NavbarItem>
                  <NavbarItem href="#">Reports</NavbarItem>
                  <NavbarDropdown label="More">
                    <NavbarItem href="#">Team</NavbarItem>
                    <NavbarItem href="#">Settings</NavbarItem>
                    <NavbarDivider />
                    <NavbarItem href="#">Sign out</NavbarItem>
                  </NavbarDropdown>
                </NavbarStart>
                <NavbarEnd>
                  <NavbarItem>
                    <Button size="sm">Sign in</Button>
                  </NavbarItem>
                </NavbarEnd>
              </NavbarMenu>
            </Navbar>
          ),
        },
        {
          title: 'Brand and actions only',
          description:
            'A minimal bar: a brand on the left and action links pinned to the end.',
          previewClassName: 'w-full',
          code: `<Navbar>
  <NavbarBrand>
    <NavbarItem href="#" className="font-semibold">Acme</NavbarItem>
    <NavbarBurger />
  </NavbarBrand>
  <NavbarMenu>
    <NavbarEnd>
      <NavbarItem href="#">Docs</NavbarItem>
      <NavbarItem href="#">Pricing</NavbarItem>
      <NavbarItem href="#">Blog</NavbarItem>
    </NavbarEnd>
  </NavbarMenu>
</Navbar>`,
          render: (
            <Navbar>
              <NavbarBrand>
                <NavbarItem href="#" className="font-semibold">
                  Acme
                </NavbarItem>
                <NavbarBurger />
              </NavbarBrand>
              <NavbarMenu>
                <NavbarEnd>
                  <NavbarItem href="#">Docs</NavbarItem>
                  <NavbarItem href="#">Pricing</NavbarItem>
                  <NavbarItem href="#">Blog</NavbarItem>
                </NavbarEnd>
              </NavbarMenu>
            </Navbar>
          ),
        },
        {
          title: 'End-aligned dropdown',
          description:
            'Pin an account menu to the far end with a right-aligned dropdown panel (align="end").',
          previewClassName: 'w-full',
          code: `<Navbar>
  <NavbarBrand>
    <NavbarItem href="#" className="font-semibold">Acme</NavbarItem>
    <NavbarBurger />
  </NavbarBrand>
  <NavbarMenu>
    <NavbarEnd>
      <NavbarDropdown label="Account" align="end">
        <NavbarItem href="#">Profile</NavbarItem>
        <NavbarItem href="#">Billing</NavbarItem>
        <NavbarDivider />
        <NavbarItem href="#">Sign out</NavbarItem>
      </NavbarDropdown>
    </NavbarEnd>
  </NavbarMenu>
</Navbar>`,
          render: (
            <Navbar>
              <NavbarBrand>
                <NavbarItem href="#" className="font-semibold">
                  Acme
                </NavbarItem>
                <NavbarBurger />
              </NavbarBrand>
              <NavbarMenu>
                <NavbarEnd>
                  <NavbarDropdown label="Account" align="end">
                    <NavbarItem href="#">Profile</NavbarItem>
                    <NavbarItem href="#">Billing</NavbarItem>
                    <NavbarDivider />
                    <NavbarItem href="#">Sign out</NavbarItem>
                  </NavbarDropdown>
                </NavbarEnd>
              </NavbarMenu>
            </Navbar>
          ),
        },
      ],
      propsTables: [
        {
          title: 'Navbar',
          props: [
            {
              name: 'label',
              type: 'string',
              default: "'Main navigation'",
              description: 'Accessible label applied to the <nav> landmark.',
            },
            {
              name: 'children',
              type: 'React.ReactNode',
              description: 'Typically a NavbarBrand followed by a NavbarMenu.',
            },
            {
              name: '…rest',
              type: 'React.HTMLAttributes<HTMLElement>',
              description: 'All other props (className, id, etc.) spread onto the <nav> element.',
            },
          ],
        },
        {
          title: 'NavbarItem',
          props: [
            {
              name: 'as',
              type: "'a' | 'div'",
              default: "href ? 'a' : 'div'",
              description: 'Element to render; defaults to a link when href is set, otherwise a div.',
            },
            {
              name: 'active',
              type: 'boolean',
              default: 'false',
              description: 'Marks the item as the current page (sets aria-current and active styling).',
            },
            {
              name: 'href',
              type: 'string',
              description: 'Link target. Its presence makes the item render as an interactive <a>.',
            },
            {
              name: '…rest',
              type: 'React.AnchorHTMLAttributes<HTMLAnchorElement>',
              description: 'Remaining anchor attributes (onClick, className, children, etc.) are spread on.',
            },
          ],
        },
        {
          title: 'NavbarLink',
          props: [
            {
              name: 'active',
              type: 'boolean',
              default: 'false',
              description: 'Applies the active/current styling to the trigger link.',
            },
            {
              name: 'open',
              type: 'boolean',
              default: 'false',
              description: 'Reflects dropdown open state; rotates the trailing chevron when true.',
            },
            {
              name: '…rest',
              type: 'React.AnchorHTMLAttributes<HTMLAnchorElement>',
              description: 'Anchor attributes (children, onClick, className, etc.) spread onto the <a>.',
            },
          ],
        },
        {
          title: 'NavbarDropdown',
          props: [
            {
              name: 'label',
              type: 'React.ReactNode',
              required: true,
              description: 'Trigger content rendered inside the NavbarLink.',
            },
            {
              name: 'active',
              type: 'boolean',
              default: 'false',
              description: 'Marks the trigger as active/current.',
            },
            {
              name: 'align',
              type: "'start' | 'end'",
              default: "'start'",
              description: 'Aligns the desktop panel to the start or end edge of the trigger.',
            },
            {
              name: '…rest',
              type: "Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>",
              description: 'Other div attributes (className, etc.) spread onto the dropdown container.',
            },
          ],
        },
        {
          title: 'NavbarBrand, NavbarBurger, NavbarMenu, NavbarStart, NavbarEnd, NavbarDivider',
          props: [
            {
              name: '…rest',
              type: 'React.HTMLAttributes<T>',
              description:
                'Structural pieces with no own props; they forward all attributes to their host element (div, button, or hr). NavbarBurger reads open state from context.',
            },
          ],
        },
      ],
    },
    {
      id: 'pagination',
      name: 'Pagination',
      description:
        'A row of page controls for navigating paged content. The active page is tracked internally, seeded by defaultPage.',
      importLine: "import { Pagination } from 'glt-ui';",
      examples: [
        {
          title: 'Basic',
          description: 'Pass the available page numbers; selection starts at page 1.',
          code: `<Pagination pages={[1, 2, 3, 4, 5]} />`,
          render: <Pagination pages={[1, 2, 3, 4, 5]} />,
        },
        {
          title: 'Default page',
          description: 'Use defaultPage to preselect a page on first render.',
          code: `<Pagination pages={[1, 2, 3, 4, 5]} defaultPage={3} />`,
          render: <Pagination pages={[1, 2, 3, 4, 5]} defaultPage={3} />,
        },
        {
          title: 'With suffix',
          description: 'Add trailing content, such as a page count summary.',
          code: `<Pagination
  pages={[1, 2, 3, 4, 5]}
  suffix={<Text as="span" size="xs" tone="secondary">of 5</Text>}
/>`,
          render: (
            <Pagination
              pages={[1, 2, 3, 4, 5]}
              suffix={<Text as="span" size="xs" tone="secondary">of 5</Text>}
            />
          ),
        },
        {
          title: 'Longer range',
          description: 'Any array of page numbers works, including non-contiguous ranges.',
          code: `<Pagination pages={[1, 2, 3, 8, 9, 10]} defaultPage={8} />`,
          render: <Pagination pages={[1, 2, 3, 8, 9, 10]} defaultPage={8} />,
        },
      ],
      propsTables: [
        {
          title: 'Pagination',
          props: [
            {
              name: 'pages',
              type: 'number[]',
              required: true,
              description: 'Page numbers to render as selectable controls.',
            },
            {
              name: 'defaultPage',
              type: 'number',
              default: '1',
              description: 'Page selected on first render (uncontrolled internal state).',
            },
            {
              name: 'suffix',
              type: 'React.ReactNode',
              description: 'Optional trailing content rendered after the controls (e.g. a summary).',
            },
          ],
        },
      ] satisfies DocPropsTable[],
    },
    {
      id: 'tabs',
      name: 'Tabs',
      description:
        'A set of togglable panels sharing the same space. The active panel is tracked internally, seeded by defaultId.',
      importLine: "import { Tabs } from 'glt-ui';",
      examples: [
        {
          title: 'Basic',
          description: 'Provide items with an id, label, and content for each tab.',
          code: `<Tabs
  items={[
    { id: 'overview', label: 'Overview', content: <Text as="span">Overview panel</Text> },
    { id: 'activity', label: 'Activity', content: <Text as="span">Activity panel</Text> },
    { id: 'settings', label: 'Settings', content: <Text as="span">Settings panel</Text> },
  ]}
/>`,
          render: (
            <Tabs
              items={[
                { id: 'overview', label: 'Overview', content: <Text as="span">Overview panel</Text> },
                { id: 'activity', label: 'Activity', content: <Text as="span">Activity panel</Text> },
                { id: 'settings', label: 'Settings', content: <Text as="span">Settings panel</Text> },
              ]}
            />
          ),
        },
        {
          title: 'Default tab',
          description: 'Use defaultId to open a specific tab on first render.',
          code: `<Tabs
  defaultId="activity"
  items={[
    { id: 'overview', label: 'Overview', content: <Text as="span">Overview panel</Text> },
    { id: 'activity', label: 'Activity', content: <Text as="span">Activity panel</Text> },
    { id: 'settings', label: 'Settings', content: <Text as="span">Settings panel</Text> },
  ]}
/>`,
          render: (
            <Tabs
              defaultId="activity"
              items={[
                { id: 'overview', label: 'Overview', content: <Text as="span">Overview panel</Text> },
                { id: 'activity', label: 'Activity', content: <Text as="span">Activity panel</Text> },
                { id: 'settings', label: 'Settings', content: <Text as="span">Settings panel</Text> },
              ]}
            />
          ),
        },
        {
          title: 'Rich labels and content',
          description: 'Labels and content accept any node, so tabs can hold richer markup.',
          code: `<Tabs
  items={[
    { id: 'summary', label: 'Summary', content: <Text as="p" size="sm">A concise overview of the dataset.</Text> },
    { id: 'details', label: <Text as="span" weight="medium">Details</Text>, content: <Text as="p" size="sm">Row-level details and metadata.</Text> },
  ]}
/>`,
          render: (
            <Tabs
              items={[
                { id: 'summary', label: 'Summary', content: <Text as="p" size="sm">A concise overview of the dataset.</Text> },
                { id: 'details', label: <Text as="span" weight="medium">Details</Text>, content: <Text as="p" size="sm">Row-level details and metadata.</Text> },
              ]}
            />
          ),
        },
        {
          title: 'Icon tabs',
          description:
            'Set an icon on a TabItem to render a leading Icon atom beside the Text label. Both inherit the active/inactive colour.',
          code: `<Tabs
  items={[
    { id: 'overview', icon: '📊', label: 'Overview', content: <Text as="span">Overview panel</Text> },
    { id: 'activity', icon: '⚡', label: 'Activity', content: <Text as="span">Activity panel</Text> },
    { id: 'settings', icon: '⚙️', label: 'Settings', content: <Text as="span">Settings panel</Text> },
  ]}
/>`,
          render: (
            <Tabs
              items={[
                { id: 'overview', icon: '📊', label: 'Overview', content: <Text as="span">Overview panel</Text> },
                { id: 'activity', icon: '⚡', label: 'Activity', content: <Text as="span">Activity panel</Text> },
                { id: 'settings', icon: '⚙️', label: 'Settings', content: <Text as="span">Settings panel</Text> },
              ]}
            />
          ),
        },
      ],
      propsTables: [
        {
          title: 'Tabs',
          props: [
            {
              name: 'items',
              type: 'TabItem[]',
              required: true,
              description: 'The tabs to render, each with an id, label, and panel content.',
            },
            {
              name: 'defaultId',
              type: 'string',
              default: 'items[0]?.id',
              description: 'Id of the tab open on first render; falls back to the first item.',
            },
            {
              name: 'onChange',
              type: '(id: string) => void',
              description: 'Called with the new tab id whenever the active tab changes.',
            },
            {
              name: 'className',
              type: 'string',
              description: 'Extra classes merged onto the root wrapper.',
            },
          ],
        },
        {
          title: 'TabItem',
          props: [
            {
              name: 'id',
              type: 'string',
              required: true,
              description: 'Unique identifier used to track and select the tab.',
            },
            {
              name: 'label',
              type: 'React.ReactNode',
              required: true,
              description: 'Label rendered (via the Text atom) inside the tab trigger button.',
            },
            {
              name: 'icon',
              type: 'React.ReactNode',
              description: 'Optional leading icon/glyph rendered before the label via the Icon atom.',
            },
            {
              name: 'content',
              type: 'React.ReactNode',
              required: true,
              description: 'Panel content shown when the tab is active.',
            },
          ],
        },
      ],
    },
    {
      id: 'accordion',
      name: 'Accordion',
      description:
        'A stack of collapsible sections. By default one panel opens at a time; enable multiple to allow several open at once.',
      importLine: "import { Accordion } from 'glt-ui';",
      examples: [
        {
          title: 'Single open',
          description:
            'The default behavior opens a single panel at a time as the user clicks headers.',
          code: `<Accordion
  items={[
    { id: 'shipping', title: 'Shipping', content: <Text as="span">Ships in 2-3 business days.</Text> },
    { id: 'returns', title: 'Returns', content: <Text as="span">Free returns within 30 days.</Text> },
    { id: 'warranty', title: 'Warranty', content: <Text as="span">Covered for one year.</Text> },
  ]}
/>`,
          render: (
            <Accordion
              items={[
                { id: 'shipping', title: 'Shipping', content: <Text as="span">Ships in 2-3 business days.</Text> },
                { id: 'returns', title: 'Returns', content: <Text as="span">Free returns within 30 days.</Text> },
                { id: 'warranty', title: 'Warranty', content: <Text as="span">Covered for one year.</Text> },
              ]}
            />
          ),
        },
        {
          title: 'Multiple open',
          description:
            'Set multiple and seed defaultOpen with ids to keep several panels expanded.',
          code: `<Accordion
  multiple
  defaultOpen={['shipping', 'warranty']}
  items={[
    { id: 'shipping', title: 'Shipping', content: <Text as="span">Ships in 2-3 business days.</Text> },
    { id: 'returns', title: 'Returns', content: <Text as="span">Free returns within 30 days.</Text> },
    { id: 'warranty', title: 'Warranty', content: <Text as="span">Covered for one year.</Text> },
  ]}
/>`,
          render: (
            <Accordion
              multiple
              defaultOpen={['shipping', 'warranty']}
              items={[
                { id: 'shipping', title: 'Shipping', content: <Text as="span">Ships in 2-3 business days.</Text> },
                { id: 'returns', title: 'Returns', content: <Text as="span">Free returns within 30 days.</Text> },
                { id: 'warranty', title: 'Warranty', content: <Text as="span">Covered for one year.</Text> },
              ]}
            />
          ),
        },
        {
          title: 'Preselected panel',
          description: 'In single-open mode, seed defaultOpen with one id to expand it initially.',
          code: `<Accordion
  defaultOpen={['returns']}
  items={[
    { id: 'shipping', title: 'Shipping', content: <Text as="span">Ships in 2-3 business days.</Text> },
    { id: 'returns', title: 'Returns', content: <Text as="span">Free returns within 30 days.</Text> },
    { id: 'warranty', title: 'Warranty', content: <Text as="span">Covered for one year.</Text> },
  ]}
/>`,
          render: (
            <Accordion
              defaultOpen={['returns']}
              items={[
                { id: 'shipping', title: 'Shipping', content: <Text as="span">Ships in 2-3 business days.</Text> },
                { id: 'returns', title: 'Returns', content: <Text as="span">Free returns within 30 days.</Text> },
                { id: 'warranty', title: 'Warranty', content: <Text as="span">Covered for one year.</Text> },
              ]}
            />
          ),
        },
      ],
      propsTables: [
        {
          title: 'Accordion',
          props: [
            {
              name: 'items',
              type: 'AccordionItem[]',
              required: true,
              description: 'The collapsible sections, each with an id, title, and content.',
            },
            {
              name: 'defaultOpen',
              type: 'string[]',
              default: '[]',
              description: 'Ids of the panels expanded on first render.',
            },
            {
              name: 'multiple',
              type: 'boolean',
              default: 'false',
              description: 'When true, allows several panels open at once; otherwise one at a time.',
            },
            {
              name: 'className',
              type: 'string',
              description: 'Extra classes merged onto the root wrapper.',
            },
          ],
        },
        {
          title: 'AccordionItem',
          props: [
            {
              name: 'id',
              type: 'string',
              required: true,
              description: 'Unique identifier used to track the open/closed state.',
            },
            {
              name: 'title',
              type: 'React.ReactNode',
              required: true,
              description: 'Content rendered in the section header button.',
            },
            {
              name: 'content',
              type: 'React.ReactNode',
              required: true,
              description: 'Body revealed when the section is expanded.',
            },
          ],
        },
      ],
    },
  ],
};
