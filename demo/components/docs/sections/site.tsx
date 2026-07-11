'use client';
import * as React from 'react';
import {
  SiteBrand,
  SiteHeader,
  SiteNavLink,
  SiteFooter,
  PageHero,
  SimulationPanel,
  CodeBlock,
  Badge,
  Button,
  Panel,
  PanelHeading,
  PanelBlock,
  Callout,
  Text,
} from 'glt-ui';
import type { DocSection } from '../types';

const tsxSample = `export function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}`;

const bashSample = `npm install glt-ui
npm run build`;

const scssSample = `.button {
  color: var(--brand-primary);
  &:hover {
    opacity: 0.85;
  }
}`;

export const siteSection: DocSection = {
  id: 'site',
  title: 'Page Chrome & Code',
  blurb: 'Headers, hero, footer, simulation layout, and code blocks.',
  entries: [
    {
      id: 'site-brand',
      name: 'SiteBrand',
      description:
        'The product wordmark shown in headers and footers, optionally with a subtitle and a leading mark.',
      importLine: "import { SiteBrand } from 'glt-ui';",
      examples: [
        {
          title: 'With subtitle',
          description: 'A title paired with a supporting subtitle line.',
          code: `<SiteBrand title="GLT Research" subtitle="Design System" />`,
          render: <SiteBrand title="GLT Research" subtitle="Design System" />,
        },
        {
          title: 'Without mark',
          description: 'Hide the leading brand mark with showMark={false}.',
          code: `<SiteBrand title="GLT Research" subtitle="Docs" showMark={false} />`,
          render: (
            <SiteBrand title="GLT Research" subtitle="Docs" showMark={false} />
          ),
        },
      ],
    },
    {
      id: 'site-header',
      name: 'SiteHeader',
      description:
        'The top-of-page chrome bar. Takes a brand node on the left and an actions node on the right.',
      importLine: "import { SiteHeader } from 'glt-ui';",
      examples: [
        {
          title: 'Brand with actions',
          description:
            'Compose a SiteBrand as the brand and nav links plus a button as the actions.',
          code: `<SiteHeader
  brand={<SiteBrand title="GLT Research" subtitle="Design System" />}
  actions={
    <>
      <SiteNavLink href="#">Docs</SiteNavLink>
      <SiteNavLink href="#">Components</SiteNavLink>
      <Button variant="primary" size="sm">
        Sign in
      </Button>
    </>
  }
/>`,
          render: (
            <SiteHeader
              brand={<SiteBrand title="GLT Research" subtitle="Design System" />}
              actions={
                <>
                  <SiteNavLink href="#">Docs</SiteNavLink>
                  <SiteNavLink href="#">Components</SiteNavLink>
                  <Button variant="primary" size="sm">
                    Sign in
                  </Button>
                </>
              }
            />
          ),
        },
      ],
    },
    {
      id: 'site-nav-link',
      name: 'SiteNavLink',
      description:
        'A styled anchor for header and footer navigation. Accepts all standard anchor attributes.',
      importLine: "import { SiteNavLink } from 'glt-ui';",
      examples: [
        {
          title: 'Nav row',
          description: 'A horizontal row of navigation links.',
          code: `<div className="flex flex-row gap-4 items-center">
  <SiteNavLink href="#">Overview</SiteNavLink>
  <SiteNavLink href="#">Components</SiteNavLink>
  <SiteNavLink href="#">Changelog</SiteNavLink>
</div>`,
          render: (
            <div className="flex flex-row gap-4 items-center">
              <SiteNavLink href="#">Overview</SiteNavLink>
              <SiteNavLink href="#">Components</SiteNavLink>
              <SiteNavLink href="#">Changelog</SiteNavLink>
            </div>
          ),
        },
      ],
    },
    {
      id: 'site-footer',
      name: 'SiteFooter',
      description:
        'The bottom-of-page chrome band for copyright, secondary links, and fine print.',
      importLine: "import { SiteFooter } from 'glt-ui';",
      examples: [
        {
          title: 'Basic',
          description: 'A single footer line with a copyright note and links.',
          code: `<SiteFooter>
  <Text as="span">© 2026 GLT Research</Text>
  <SiteNavLink href="#">Privacy</SiteNavLink>
  <SiteNavLink href="#">Terms</SiteNavLink>
</SiteFooter>`,
          render: (
            <SiteFooter>
              <Text as="span">© 2026 GLT Research</Text>
              <SiteNavLink href="#">Privacy</SiteNavLink>
              <SiteNavLink href="#">Terms</SiteNavLink>
            </SiteFooter>
          ),
        },
      ],
    },
    {
      id: 'page-hero',
      name: 'PageHero',
      description:
        'The marquee section at the top of a landing page, composing a badge, title, lead, actions, and footnote.',
      importLine: "import { PageHero } from 'glt-ui';",
      examples: [
        {
          title: 'Composed hero',
          description:
            'A full hero with a badge overline, headline, lead paragraph, action buttons, and a footnote.',
          code: `<PageHero
  badge={<Badge variant="info">v2.0</Badge>}
  title="Research faster with a shared design system"
  lead="Reusable components, documented and ready to compose into simulations and reports."
  actions={
    <>
      <Button variant="primary">Get started</Button>
      <Button variant="outline">View components</Button>
    </>
  }
  footnote="No configuration required — import and go."
/>`,
          render: (
            <PageHero
              badge={<Badge variant="info">v2.0</Badge>}
              title="Research faster with a shared design system"
              lead="Reusable components, documented and ready to compose into simulations and reports."
              actions={
                <>
                  <Button variant="primary">Get started</Button>
                  <Button variant="outline">View components</Button>
                </>
              }
              footnote="No configuration required — import and go."
            />
          ),
        },
      ],
    },
    {
      id: 'simulation-panel',
      name: 'SimulationPanel',
      description:
        'A two-pane layout pairing a controls surface with a narrative surface, for interactive simulations.',
      importLine: "import { SimulationPanel } from 'glt-ui';",
      examples: [
        {
          title: 'Controls and narrative',
          description:
            'Controls hold a small Panel of inputs; narrative explains the current state with a Callout.',
          code: `<SimulationPanel
  controls={
    <Panel>
      <PanelHeading>Parameters</PanelHeading>
      <PanelBlock>Growth rate: 3.2%</PanelBlock>
      <PanelBlock>Horizon: 10 years</PanelBlock>
    </Panel>
  }
  narrative={
    <Callout variant="info" title="Projection">
      At the current growth rate, the value doubles in roughly 22 years.
    </Callout>
  }
/>`,
          render: (
            <SimulationPanel
              controls={
                <Panel>
                  <PanelHeading>Parameters</PanelHeading>
                  <PanelBlock>Growth rate: 3.2%</PanelBlock>
                  <PanelBlock>Horizon: 10 years</PanelBlock>
                </Panel>
              }
              narrative={
                <Callout variant="info" title="Projection">
                  At the current growth rate, the value doubles in roughly 22
                  years.
                </Callout>
              }
            />
          ),
        },
      ],
    },
    {
      id: 'code-block',
      name: 'CodeBlock',
      description:
        'A syntax-highlighted code surface with an optional title, language label, and copy button.',
      importLine: "import { CodeBlock } from 'glt-ui';",
      examples: [
        {
          title: 'TSX with title',
          description: 'A titled TSX snippet with the default copy button.',
          code:
            "<CodeBlock\n" +
            '  lang="tsx"\n' +
            '  title="Greeting.tsx"\n' +
            "  code={'export function Greeting({ name }: { name: string }) {\\n  return <p>Hello, {name}!</p>;\\n}'}\n" +
            '/>',
          render: (
            <CodeBlock lang="tsx" title="Greeting.tsx" code={tsxSample} />
          ),
        },
        {
          title: 'Bash',
          description: 'A shell snippet using the bash language.',
          code:
            "<CodeBlock\n" +
            '  lang="bash"\n' +
            "  code={'npm install glt-ui\\nnpm run build'}\n" +
            '/>',
          render: <CodeBlock lang="bash" code={bashSample} />,
        },
        {
          title: 'SCSS',
          description: 'A stylesheet snippet using the scss language.',
          code:
            "<CodeBlock\n" +
            '  lang="scss"\n' +
            "  code={'.button {\\n  color: var(--brand-primary);\\n  &:hover {\\n    opacity: 0.85;\\n  }\\n}'}\n" +
            '/>',
          render: <CodeBlock lang="scss" code={scssSample} />,
        },
      ],
    },
  ],
};
