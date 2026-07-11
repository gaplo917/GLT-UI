# GLT UI

**`glt-ui`** is a production-oriented React component library with SCSS brand tokens,
light/dark theming, and an Atomic Design layout. This monorepo also ships a **static
Next.js component browser** (live docs) and an **agent skill** for AI-assisted UI work.

| Deliverable | Location | Where it ships |
| --- | --- | --- |
| **glt-ui** | `packages/glt-ui` | [npm](https://www.npmjs.com/package/glt-ui) |
| **Docs browser** | `app/` + `components/docs/` | [GitHub Pages](https://gaplo917.github.io/GLT-UI/) |
| **Agent skill** | `skills/glt-ui-skill/` | Copy into your agent skills dir |

> The library is the product. The app is a living catalog that proves the system works.

**Live catalog:** https://gaplo917.github.io/GLT-UI/  
**Release / publish steps:** [RELEASE.md](RELEASE.md)

---

## Highlights

- **Token-driven UI** — components use CSS variables (`var(--brand-primary)`,
  `var(--card-bg-color)`, status colors, …) defined once in SCSS for light and dark.
- **Atomic Design** — atoms → molecules → organisms → templates; compose higher layers
  from lower ones (`Stack`, `Text`, `Button` before one-off markup).
- **Tailwind utilities + brand theme** — styling is utility classes referencing tokens;
  consumers scan package output with Tailwind v4 `@source`.
- **Code blocks** — `CodeBlock` highlights with [Shiki](https://shiki.style/) and the
  custom **GapStyle VS** theme (client-side; static-export friendly).
- **Charts & research widgets** — themed [Chart.js](https://www.chartjs.org/) wrapper,
  benchmark bars, sparklines, comparison slider, count-up metrics.
- **Motion that respects reduced motion** — `Reveal`, modal/accordion transitions,
  `prefers-reduced-motion` safe.
- **Static docs** — single-page DocsBrowser with hash routing, search, and theme toggle;
  exported as plain HTML/CSS/JS for GitHub Pages.

---

## Quick start (consumer app)

```bash
npm install glt-ui react react-dom
# Tailwind v4 + Sass recommended in the host app
npm install -D tailwindcss @tailwindcss/postcss sass
```

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

```scss
// app globals (once)
@use "glt-ui/theme/styles";
@use "tailwindcss";
// Keep utility classes used inside glt-ui from being purged
@source "../node_modules/glt-ui/dist";
```

More API detail: [`packages/glt-ui/README.md`](packages/glt-ui/README.md) · agent guide:
[`skills/glt-ui-skill/SKILL.md`](skills/glt-ui-skill/SKILL.md)

---

## Light / dark theme

Themes are pure **CSS custom properties** in
[`packages/glt-ui/theme/scss/`](packages/glt-ui/theme/scss/).

| Mode | How it activates |
| --- | --- |
| Light | Default / `data-theme="light"` on `<html>` |
| Dark | `data-theme="dark"` on `<html>` (optionally also class `dark`) |
| System | If no `data-theme` is set, `prefers-color-scheme: dark` applies dark tokens |

Toggle at runtime (docs browser does this):

```js
document.documentElement.setAttribute('data-theme', 'dark'); // or 'light'
document.documentElement.classList.toggle('dark', true);
localStorage.setItem('theme', 'dark');
```

A small before-interactive script in the demo app avoids a flash of the wrong theme
(see `app/layout.tsx`).

### Brand & surface tokens (defaults)

| Token | Light | Dark |
| --- | --- | --- |
| `--brand-primary` | `#e65100` (deep orange) | `#FFA726` (amber) |
| `--bg-color` | `#fff` | `#1d232c` |
| `--text-color` | `#373737` | `#dadada` |
| `--strong-text-color` | `#000` | `#fff` |
| `--card-bg-color` | slightly off-white | slightly lifted dark |
| `--border-color` | black @ 10% | white @ 10% |
| `--nav-bar-bg-color` | `#fff` | `#222831` |
| `--code-bg-color` | `#282c34` | navbar dark |

### Semantic status colors

Used by `Button`, `Badge`, `Callout`, `Alert`, `ProgressBar`, etc.

| Token | Light | Dark |
| --- | --- | --- |
| `--color-info` | `#2563eb` | `#3b82f6` |
| `--color-success` | `#15803d` | `#16a34a` |
| `--color-warning` | `#b45309` | `#d97706` |
| `--color-danger` | `#dc2626` | `#ef4444` |
| `--color-on-status` | white | white |

Override tokens in your app after importing the theme if you need a different brand.

---

## Code block renderer

`CodeBlock` (`packages/glt-ui/src/components/molecules/CodeBlock/`) is the syntax
highlighter used in the docs browser and available to consumers.

| Detail | Value |
| --- | --- |
| Engine | [Shiki](https://shiki.style/) (`shiki` dependency) |
| Theme | **GapStyle VS** — embedded TextMate theme (`gapstyle-theme.ts`), dark editor chrome |
| Fallback | `#282c34` / `#abb2bf` until highlight resolves (no white flash) |
| Runtime | Client-side highlighter (works with static export; no Node at request time) |
| Languages (bundled) | `tsx`, `ts`, `jsx`, `js`, `bash`, `json`, `scss`, `css`, `html`, `markdown` |
| UX | Optional title bar + copy-to-clipboard |

```tsx
import { CodeBlock } from 'glt-ui';

<CodeBlock
  lang="tsx"
  title="Button.tsx"
  code={`import { Button } from 'glt-ui';\n\nexport const Ok = () => <Button>Save</Button>;`}
/>
```

Inline code uses the `Code` atom and theme tokens
(`--inline-code-text-color` / `--inline-code-bg-color`).

---

## Dependencies

### `glt-ui` (published package)

| Package | Role |
| --- | --- |
| **react** / **react-dom** ≥ 18 | Peer dependencies |
| **chart.js** ^4.5 | Powering the themed `Chart` organism |
| **shiki** ^4 | `CodeBlock` syntax highlighting |
| **clsx** ^2 + **tailwind-merge** ^3 | `cn()` class merging helper |

Host apps should also provide **Tailwind CSS v4** (utilities in components) and
typically **Sass** to `@use "glt-ui/theme/styles"`.

### Monorepo demo / docs app

| Package | Role |
| --- | --- |
| **next** ^16.2 | App Router, `output: 'export'` static site |
| **react** / **react-dom** ^19.2 | Demo app runtime |
| **tailwindcss** ^4 + **@tailwindcss/postcss** | App styling pipeline |
| **sass** | Theme SCSS load |
| **typescript** 5.x / **eslint** 9.x | Tooling (eslint 10 blocked by `eslint-config-next` peers) |

---

## Component map

Rough inventory (all imported from `glt-ui`):

| Layer | Examples |
| --- | --- |
| **Atoms** | `Button`, `Text`, `Title`, `Stack`, `Grid`, `Icon`, `Badge`, `Code`, inputs, `Sparkline`, `CountUp`, `Reveal` |
| **Molecules** | `FormField`, `Callout`, `Alert`, `Message`, `CodeBlock`, `StatMetric`, `Breadcrumb`, `Quote` |
| **Organisms** | `Card`, `Modal`, `Navbar`, `DataTable`, `Table`, `Chart`, `BenchmarkChart`, `SiteHeader` / `SiteFooter`, `PageHero`, `Accordion`, `Tabs` |
| **Templates** | `Section` (+ header / title / lead) |

Full lists: [`skills/glt-ui-skill/references/components.md`](skills/glt-ui-skill/references/components.md)

---

## Repository layout

```
GLT-UI/  (local: glt-research/)
├── packages/glt-ui/              # npm package
│   ├── src/components/           # atoms / molecules / organisms / templates
│   ├── theme/                    # SCSS tokens + styles entry
│   └── dist/                     # tsc output (gitignored)
├── app/                          # Next.js static export (DocsBrowser host)
├── components/docs/              # catalog registry, examples, PracticalDemo
├── skills/glt-ui-skill/          # agent skill for building with glt-ui
├── .github/workflows/            # Pages + npm publish
├── RELEASE.md                    # publish & deploy runbook
└── LICENSE
```

---

## Develop this monorepo

```bash
npm install
npm run dev            # http://localhost:3000 (predev builds glt-ui)
npm run build:ui       # rebuild library after editing packages/glt-ui
npm run build          # static export → ./out
npm run lint
```

Publishing npm packages and GitHub Pages is documented in **[RELEASE.md](RELEASE.md)**.

### Agent skill

[`skills/glt-ui-skill/SKILL.md`](skills/glt-ui-skill/SKILL.md) teaches install, theming, and
composition. For Grok project skills:

```bash
mkdir -p .grok/skills
ln -sfn ../../skills/glt-ui-skill .grok/skills/glt-ui
```

---

## Notes

- Next.js in this repo may differ from older docs — see [`AGENTS.md`](AGENTS.md).
- Package name is **`glt-ui`** (formerly `glt-design-system`).
- Source: [github.com/gaplo917/GLT-UI](https://github.com/gaplo917/GLT-UI)

## License

[MIT](LICENSE) © 2026 Gary Lo

The same license covers the monorepo and the publishable package
([`packages/glt-ui/LICENSE`](packages/glt-ui/LICENSE)).
