# Release

How to publish **`glt-ui`** (repo root) to npm and the **demo** Docs browser to GitHub Pages.

## Prerequisites

- Repo: [gaplo917/GLT-UI](https://github.com/gaplo917/GLT-UI)
- Node ≥ 18 (CI uses 24 for publish / Pages)
- Package `glt-ui` exists on npm; Trusted Publisher configured for this repo

## Layout reminder

| Path | Role |
| --- | --- |
| Repo root | Publishable **glt-ui** (`src/`, `theme/`, `dist/`) |
| `demo/` | Next.js static component browser → `demo/out` |

## glt-ui → npm (Trusted Publishing / OIDC)

### One-time setup on npmjs.com

1. Create the package once if needed (local + OTP):

   ```bash
   npm login
   npm run build
   npm publish --access public --otp=<code>
   ```

2. Package **Settings** → **Trusted Publisher** → GitHub Actions:

   | Field | Value |
   | --- | --- |
   | Organization or user | `gaplo917` |
   | Repository | `GLT-UI` (exact case) |
   | Workflow filename | `publish-npm.yml` |
   | Environment | *(empty)* |
   | Allowed actions | **npm publish** |

### Publish a version

1. Bump `version` in root `package.json`.
2. Commit on `main`.
3. Tag and push:

   ```bash
   git tag glt-ui-v0.1.2
   git push origin glt-ui-v0.1.2
   ```

Workflow: [`.github/workflows/publish-npm.yml`](.github/workflows/publish-npm.yml)  
Runs at **repo root**: `npm ci` → `npm run build` → `npm publish --provenance`.

## Docs browser → GitHub Pages

```bash
npm install
npm run build:pages    # library + demo with BASE_PATH=/GLT-UI → demo/out
```

CI ([`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)):

1. `npm ci`
2. `npm run build:pages`
3. Upload **`demo/out`** as Pages artifact

**Site:** https://gaplo917.github.io/GLT-UI/

### CI notes

- Lockfile must include multi-platform optional natives (lightningcss, `@emnapi/*`) for Linux.
- After dependency bumps: regenerate lock with CI-matching Node; verify `rm -rf node_modules && npm ci`.
