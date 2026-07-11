# GLT UI

**`glt-ui`** is a production-oriented React component library with SCSS brand tokens,
light/dark theming, and an Atomic Design layout. This repository is the publishable
package at the root, plus a **`demo/`** Next.js static component browser for live docs.

| Deliverable | Location | Where it ships |
| --- | --- | --- |
| **glt-ui** | repo root (`src/`, `theme/`) | [npm](https://www.npmjs.com/package/glt-ui) |
| **Docs browser** | `demo/` | [GitHub Pages](https://gaplo917.github.io/GLT-UI/) |
| **Agent skill** | `skills/glt-ui-skill/` | Copy into your agent skills dir |

> The library is the product. The demo app is a living catalog that proves the system works.

**Live catalog:** https://gaplo917.github.io/GLT-UI/  
**Release / publish steps:** [RELEASE.md](RELEASE.md)

---

## Repository layout

```
GLT-UI/
├── src/                          # glt-ui components (atoms → templates)
├── theme/                        # SCSS brand tokens
├── dist/                         # tsc output (gitignored; npm publish)
├── package.json                  # publishable glt-ui package
├── demo/                         # Next.js static docs browser
│   ├── app/
│   ├── components/docs/
│   └── package.json
├── skills/glt-ui-skill/          # agent skill
└── .github/workflows/            # Pages + npm publish
```

---

## Quick start (consumer app)

```bash
npm install glt-ui react react-dom
npm install -D tailwindcss @tailwindcss/postcss sass
```

```tsx
import { Button, Card, CardHeader, CardTitle, Stack } from 'glt-ui';
```

```scss
@use "glt-ui/theme/styles";
@use "tailwindcss";
@source "../node_modules/glt-ui/dist";
```

Toggle light/dark with `data-theme="light" | "dark"` on `<html>`.

---

## Develop this monorepo

```bash
npm install
npm run dev            # builds glt-ui, then demo at http://localhost:3000
npm run build          # library only → dist/
npm run build:demo     # library + demo static export → demo/out
npm run build:pages    # same with BASE_PATH=/GLT-UI
npm run lint
```

---

## Highlights

- **Token-driven UI** — CSS variables for brand, surfaces, and semantic status colors
- **Atomic Design** — atoms → molecules → organisms → templates
- **Tailwind utilities + brand theme** — scan package output with `@source`
- **CodeBlock** — Shiki + GapStyle VS theme (client-side, static-export friendly)
- **Charts & research widgets** — themed Chart.js, benchmarks, sparklines, motion
- **Static docs** — DocsBrowser with hash routing and theme toggle

### Light / dark (defaults)

| Token | Light | Dark |
| --- | --- | --- |
| `--brand-primary` | `#e65100` | `#FFA726` |
| `--bg-color` | `#fff` | `#1d232c` |
| `--text-color` | `#373737` | `#dadada` |

Status: `--color-info` / `success` / `warning` / `danger` (+ `--color-on-status`).

### Dependencies (`glt-ui`)

| Package | Role |
| --- | --- |
| **react** / **react-dom** ≥ 18 | Peers |
| **chart.js** | `Chart` organism |
| **shiki** | `CodeBlock` |
| **clsx** + **tailwind-merge** | `cn()` helper |

Demo app uses **Next.js 16**, **Tailwind 4**, **Sass**.

### Agent skill

```bash
mkdir -p .grok/skills
ln -sfn ../../skills/glt-ui-skill .grok/skills/glt-ui
```

---

## Notes

- Next.js lives only under **`demo/`** — see `demo/` configs and `AGENTS.md`.
- GitHub: [gaplo917/GLT-UI](https://github.com/gaplo917/GLT-UI)

## License

[MIT](LICENSE) © 2026 Gary Lo
