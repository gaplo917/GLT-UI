---
name: glt-ui
description: >
  Build React UIs with the glt-ui component library (Atomic Design, SCSS brand
  tokens, Tailwind utilities). Use when scaffolding pages with glt-ui, installing
  or theming glt-ui, composing layout/forms/data/feedback components, or when the
  user mentions GLT UI, glt-ui, design system components, or runs /glt-ui.
metadata:
  short-description: "Build UIs with the glt-ui component library"
---

# GLT UI

Use **`glt-ui`** for production React UI. Prefer these primitives over raw HTML
and ad-hoc Tailwind when a matching component exists.

Live catalog (after GitHub Pages deploy): https://gaplo917.github.io/GLT-UI/

## When this skill applies

- Adding UI with `glt-ui` / GLT design system
- Setting up theme, dark mode, or Tailwind scanning for `glt-ui`
- Building research dashboards, forms, docs, or site chrome with GLT components

## Install (consumer app)

```bash
npm install glt-ui react react-dom
# Tailwind v4 + Sass recommended
npm install -D tailwindcss @tailwindcss/postcss sass
```

### Theme + Tailwind (once at app root)

```scss
// e.g. app/globals.scss
@use "glt-ui/theme/styles";
@use "tailwindcss";
// Scan compiled package so utility classes in components are kept
@source "../node_modules/glt-ui/dist";
```

### Dark mode

Set on `<html>` (and optionally mirror with class `dark`):

```html
<html data-theme="dark" class="dark">
```

Use a before-interactive script to avoid flash (see monorepo `app/layout.tsx`).

## Import rules

Always import from the package root barrel:

```tsx
import { Button, Card, Stack, FormField, TextInput, Text } from 'glt-ui';
```

Do **not** invent deep paths like `glt-ui/components/Button` unless you verified
exports — the public API is the root barrel + `glt-ui/theme/*`.

## Composition rules (Atomic Design)

1. **Atoms first** for text, controls, spacing: `Text`, `Title`, `Button`, `Stack`,
   `Grid`, `Icon`, `Badge`, `Code`, inputs, etc.
2. **Molecules** for labeled fields and small composites: `FormField`, `Callout`,
   `Alert`, `Message`, `StatMetric`, `Breadcrumb`.
3. **Organisms** for sections of a page: `Card`, `Modal`, `Navbar`, `DataTable`,
   `Chart`, `SiteHeader` / `SiteFooter`, `PageHero`.
4. **Templates** for page sections: `Section` + `SectionHeader` / `SectionTitle` / `SectionLead`.
5. Compose higher layers from lower ones — do not re-implement spacing with one-off
   wrappers when `Stack` / `Grid` / `Level` exist.
6. Prefer **props** (`variant`, `size`, `tone`) over `className` hacks. Use
   `className` only for layout escape hatches.

## Patterns

### Page chrome

```tsx
import { SiteHeader, SiteBrand, SiteNavLink, SiteFooter, Stack, Text } from 'glt-ui';

<SiteHeader
  brand={<SiteBrand title="Product" />}
  nav={
    <>
      <SiteNavLink href="#docs">Docs</SiteNavLink>
      <SiteNavLink href="#api">API</SiteNavLink>
    </>
  }
/>
// ...
<SiteFooter>
  <Text size="sm" muted>© 2026</Text>
</SiteFooter>
```

### Form field

```tsx
import { FormField, TextInput, Stack, Button } from 'glt-ui';

<Stack gap={4} as="form">
  <FormField label="Email" htmlFor="email" required>
    <TextInput id="email" type="email" placeholder="you@example.com" />
  </FormField>
  <Button type="submit">Continue</Button>
</Stack>
```

### Card + metrics

```tsx
import { Card, CardHeader, CardTitle, CardContent, StatGrid, StatMetric } from 'glt-ui';

<Card>
  <CardHeader>
    <CardTitle>Results</CardTitle>
  </CardHeader>
  <CardContent>
    <StatGrid>
      <StatMetric label="Accuracy" value="94.2%" />
      <StatMetric label="Latency" value="12" suffix="ms" />
    </StatGrid>
  </CardContent>
</Card>
```

### Feedback

```tsx
import { Callout, Alert, Message } from 'glt-ui';

<Callout variant="info" title="Note">Token-driven status colors.</Callout>
<Alert variant="warning">Check your inputs.</Alert>
```

### Data viz

```tsx
import { Chart, BenchmarkChart, Sparkline, CountUp, ProgressRing } from 'glt-ui';

// Prefer Chart (chart.js wrapper) for series; BenchmarkChart for method vs baselines.
```

## Component map (quick reference)

See [references/components.md](references/components.md) for the full inventory.

| Need | Prefer |
| --- | --- |
| Spacing / layout | `Stack`, `Grid`, `Container`, `Section`, `Level`, `Box`, `Surface` |
| Typography | `Text`, `Title`/`Subtitle`, `Heading`, `Code`, `Markdown`, `Quote` |
| Actions | `Button`, `DeleteButton`, `DropdownMenu` |
| Forms | `FormField`, `TextInput`, `TextArea`, `SelectField`, `Checkbox`, `Radio`, `Switch` |
| Feedback | `Callout`, `Alert`, `Message`, `Spinner`, `Skeleton`, `Tooltip`, `Modal` |
| Data | `Table`, `DataTable`, `StatGrid`/`StatMetric`, `Chart`, `Badge`, `TagGroup` |
| Nav | `Navbar`, `Breadcrumb`, `Tabs`, `Pagination`, `Accordion` |
| Site | `SiteHeader`, `SiteBrand`, `SiteNavLink`, `SiteFooter`, `PageHero` |

## Do / don't

**Do**

- Import theme SCSS once; set `data-theme` for light/dark
- Compose with `Stack`/`Grid` instead of nested div soup
- Match existing prop APIs (`variant`, `size`) before adding custom styles
- Keep motion reduced-motion safe (`Reveal`, modal/accordion already respect it)

**Don't**

- Bypass the library with unstyled `<button>` / `<p>` when `Button` / `Text` fit
- Hard-code brand colors; use tokens via components
- Forget Tailwind `@source` on `glt-ui/dist` (missing styles in production)
- Publish or bump versions unless the user asked

## Monorepo development (this repo)

```bash
npm install
npm run build:ui    # packages/glt-ui → dist/
npm run dev         # docs browser at localhost:3000
npm run build       # static export → ./out (local, no basePath)
npm run build:pages # static export with BASE_PATH=/GLT-UI
```

Package source: `packages/glt-ui/src/components/{atoms,molecules,organisms,templates}/`.
Docs registry: `components/docs/`.

## Agent checklist before finishing UI work

1. Imports from `glt-ui` only (no stale `glt-design-system` names)
2. Theme loaded; dark mode works if the app supports it
3. Layout uses Stack/Grid/Section where appropriate
4. Forms use FormField + control atoms
5. Lint/typecheck clean if the project has those scripts
