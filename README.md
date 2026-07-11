# GLT Research

Monorepo for **`glt-ui`** — a production React component library (Atomic Design + SCSS
brand tokens) — and a **static Next.js component browser** that doubles as live docs.

| Deliverable | Where | Publish target |
| --- | --- | --- |
| **glt-ui** package | `packages/glt-ui` | [npm](https://www.npmjs.com/package/glt-ui) (`npm publish -w glt-ui`) |
| **Docs browser** | `app/` + `components/docs/` | [GitHub Pages](https://gaplo917.github.io/GLT-UI/) (static `out/`) |
| **Agent skill** | `skills/glt-ui-skill/` | Ship with the repo; copy into agent skill dirs as needed |

> The library is the product. The app is a living catalog that proves the system works.

## Repository layout

```
glt-research/
├── packages/
│   └── glt-ui/                   # publishable npm package
│       ├── src/components/       # atoms / molecules / organisms / templates
│       ├── theme/                # SCSS brand tokens (light/dark)
│       └── dist/                 # tsc output (gitignored)
├── app/                          # Next.js static export (DocsBrowser)
├── components/docs/              # catalog registry + examples
├── skills/glt-ui-skill/          # AgentSkill for building with glt-ui
└── .github/workflows/            # Pages deploy + npm publish
```

## glt-ui (npm)

```bash
npm install glt-ui
```

```tsx
import { Button, Card, Stack, FormField, TextInput } from 'glt-ui';
```

```scss
@use "glt-ui/theme/styles";
@use "tailwindcss";
@source "../node_modules/glt-ui/dist";
```

Toggle light/dark with `data-theme="light" | "dark"` on `<html>`.

See [`packages/glt-ui/README.md`](packages/glt-ui/README.md) and the agent skill under
[`skills/glt-ui-skill/`](skills/glt-ui-skill/).

### Publish to npm (Trusted Publishing / OIDC)

CI publishes with **npm Trusted Publishing** — short-lived OIDC, no `NPM_TOKEN` secret.

1. **First-time only:** create the package once so npm has package settings
   (e.g. local `npm login` + `npm run publish:ui`), **or** publish `0.1.0` once
   from the CLI if the name is free.
2. On [npmjs.com](https://www.npmjs.com) → package **glt-ui** → **Settings** →
   **Trusted Publisher** → GitHub Actions:
   - Organization or user: `gaplo917`
   - Repository: `GLT-UI` (exact case)
   - Workflow filename: `publish-npm.yml` (filename only)
   - Environment: leave empty (unless you add a GitHub Environment)
   - Allowed actions: **npm publish**
3. Bump version in `packages/glt-ui/package.json`, commit, then:

```bash
git tag glt-ui-v0.1.0
git push origin glt-ui-v0.1.0
```

Or **Actions → Publish glt-ui to npm → Run workflow** (uncheck dry run to publish).

Optional hardening after OIDC works: package **Publishing access** →
“Require two-factor authentication and disallow tokens”.

Workflow: [`.github/workflows/publish-npm.yml`](.github/workflows/publish-npm.yml).  
Docs: https://docs.npmjs.com/trusted-publishers/

## Docs browser (GitHub Pages)

Next.js is configured with `output: 'export'`. Production build writes plain HTML/CSS/JS
to `./out`.

```bash
npm install
npm run dev            # http://localhost:3000 (builds glt-ui first via predev)
npm run build          # local static export → ./out (no basePath)
npm run build:pages    # Pages export with BASE_PATH=/GLT-UI
```

### Enable GitHub Pages

1. Push to GitHub remote `origin` → `gaplo917/GLT-UI`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. On every push to `main`, [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
   builds with `BASE_PATH=/GLT-UI` and deploys `out/`.
4. Site URL: https://gaplo917.github.io/GLT-UI/

Hash routes (`#Button`, etc.) work on the static export for deep links.

## Agent skill

[`skills/glt-ui-skill/SKILL.md`](skills/glt-ui-skill/SKILL.md) teaches agents how to install,
theme, and compose `glt-ui`.

**Grok (project):** copy or symlink into `.grok/skills/glt-ui/`:

```bash
mkdir -p .grok/skills
ln -sfn ../../skills/glt-ui-skill .grok/skills/glt-ui
```

**Claude Code / other agents:** point project instructions at `skills/glt-ui-skill/SKILL.md`,
or copy the folder into the tool’s skills directory.

## Getting started (local)

```bash
npm install
npm run dev            # http://localhost:3000
npm run build:ui       # rebuild library after editing packages/glt-ui
npm run lint
```

## Notes

- Next.js in this repo has breaking changes vs. older docs — see `AGENTS.md`.
- Package name is **`glt-ui`** (formerly `glt-design-system`).
- GitHub repo: [gaplo917/GLT-UI](https://github.com/gaplo917/GLT-UI).

## License

[MIT](LICENSE) © 2026 Gary Lo

The same license covers the monorepo and the publishable `glt-ui` package
([`packages/glt-ui/LICENSE`](packages/glt-ui/LICENSE)).
