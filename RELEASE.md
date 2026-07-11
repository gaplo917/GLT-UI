# Release

How to publish **`glt-ui`** to npm and the **Docs browser** to GitHub Pages.

## Prerequisites

- Repo: [gaplo917/GLT-UI](https://github.com/gaplo917/GLT-UI)
- Node ≥ 18 (CI uses 22)
- For npm Trusted Publishing: package `glt-ui` exists on [npmjs.com](https://www.npmjs.com) (one-time create)

## glt-ui → npm (Trusted Publishing / OIDC)

CI uses **npm Trusted Publishing** — short-lived OIDC, no long-lived `NPM_TOKEN` secret.

### One-time setup on npmjs.com

1. **Create the package once** (if it does not exist yet):

   ```bash
   npm login
   npm run build:ui
   npm run publish:ui
   ```

2. Open [npmjs.com/package/glt-ui](https://www.npmjs.com/package/glt-ui) → **Settings** → **Trusted Publisher** → GitHub Actions:

   | Field | Value |
   | --- | --- |
   | Organization or user | `gaplo917` |
   | Repository | `GLT-UI` (exact case) |
   | Workflow filename | `publish-npm.yml` (filename only) |
   | Environment name | *(leave empty unless you add a GitHub Environment)* |
   | Allowed actions | **npm publish** |

3. Optional hardening after a successful OIDC publish: package **Publishing access** →  
   “Require two-factor authentication and disallow tokens”.

Docs: [Trusted publishers](https://docs.npmjs.com/trusted-publishers/)

### Publish a version

1. Bump `version` in [`packages/glt-ui/package.json`](packages/glt-ui/package.json).
2. Commit on `main`.
3. Tag and push:

   ```bash
   git tag glt-ui-v0.1.0
   git push origin glt-ui-v0.1.0
   ```

   Tags matching `glt-ui-v*` trigger [`.github/workflows/publish-npm.yml`](.github/workflows/publish-npm.yml).

Or: **Actions → Publish glt-ui to npm → Run workflow** (uncheck **Dry run** to publish).

### Local publish (emergency / first create)

```bash
npm login
npm run build:ui
npm run publish:ui
```

## Docs browser → GitHub Pages

Next.js uses `output: 'export'`. Production build writes plain HTML/CSS/JS to `./out`.

### Local static export

```bash
npm install
npm run build          # ./out (no basePath)
npm run build:pages    # BASE_PATH=/GLT-UI (matches project Pages URL)
```

### CI deploy

On every push to `main`, [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml):

1. Builds with `BASE_PATH=/GLT-UI` (from the repository name).
2. Uploads `out/` as a Pages artifact.
3. Deploys via `actions/deploy-pages`.

**Site:** https://gaplo917.github.io/GLT-UI/

Hash routes (`#Button`, etc.) deep-link into the static export.

### Enable Pages (one-time)

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**  
   (or create via API: `build_type=workflow`).
2. Push to `main` (or re-run the **Deploy Docs to GitHub Pages** workflow).

### CI note: native optional deps

`package-lock.json` must include **all** platform optional packages for Tailwind/lightningcss
(e.g. `lightningcss-linux-x64-gnu`). Regenerating the lockfile only on macOS can omit Linux
binaries and break the Pages build with:

```text
Cannot find module '../lightningcss.linux-x64-gnu.node'
```

After changing Tailwind-related deps, regenerate the lockfile so multi-platform optionals resolve
(e.g. delete `package-lock.json` + `node_modules` and run `npm install`, then verify
`lightningcss-linux-x64-gnu` appears in the lockfile).

## Workflows

| Workflow | File | Trigger |
| --- | --- | --- |
| Deploy Docs to GitHub Pages | `.github/workflows/deploy-pages.yml` | Push to `main`, `workflow_dispatch` |
| Publish glt-ui to npm | `.github/workflows/publish-npm.yml` | Tag `glt-ui-v*`, `workflow_dispatch` |
