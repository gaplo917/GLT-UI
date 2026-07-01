# glt-ui

Production-oriented React UI components with SCSS brand theme tokens.
Organized with [Atomic Design](https://atomicdesign.bradfrost.com/) (atoms → molecules → organisms → templates).

**Docs (component browser):** https://gaplo917.github.io/GLT-UI/

## Install

```bash
npm install glt-ui
# peer deps
npm install react react-dom
```

Also ensure your app can process Tailwind CSS utility classes (components use them) and optionally Sass for the theme entry.

## Usage

```tsx
import { Button, Card, CardHeader, CardTitle, Stack } from 'glt-ui';

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <Stack gap={2}>
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
      </Stack>
    </Card>
  );
}
```

### Theme (required once)

Import brand tokens at the app root (Sass):

```scss
@use "glt-ui/theme/styles";
```

Or with a bundler that resolves package exports, load the same entry from your global stylesheet.

### Tailwind v4 content scanning

Components ship Tailwind utility class strings. Point Tailwind at the package so classes are not purged:

```scss
@use "tailwindcss";
@source "../node_modules/glt-ui/dist";
```

### Light / dark

Toggle on `<html>`:

```html
<html data-theme="dark" class="dark">
```

No per-component theme props required.

## Entry points

| Import | Contents |
| --- | --- |
| `glt-ui` | root barrel (all components + `cn` + motion helpers) |
| `glt-ui/components` | components barrel |
| `glt-ui/theme/styles` | full SCSS theme |
| `glt-ui/theme/css-vars` | CSS custom properties only |
| `glt-ui/theme/variables` | SCSS variables |
| `glt-ui/theme/components` | component SCSS helpers |

Prefer the root barrel import in application code.

## Theming tokens

Components use CSS custom properties (`var(--brand-primary)`, `var(--card-bg-color)`,
`var(--color-danger)`, …). Semantic status colors power variants on `Callout`, `Alert`,
`Badge`, `Button`, `ProgressBar`, etc.

## Build (this package)

```bash
npm run build   # tsc → dist/
```

## Publish

From the monorepo root (requires npm login):

```bash
npm run build:ui
npm publish -w glt-ui --access public
```

## License

[MIT](LICENSE) © 2026 Gary Lo
