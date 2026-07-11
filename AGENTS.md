<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Next.js for this project lives only under **`demo/`**.
<!-- END:nextjs-agent-rules -->

# Git commit conventions

Always include Grok as a co-author on every commit created or amended by an agent:

```
Co-Authored-By: Grok <noreply@x.ai>
```

Do not omit this trailer. Use it in addition to any other co-authors when relevant.

# glt-ui layout

- **Publishable package** is the **repo root** (`src/`, `theme/`, root `package.json` → npm `glt-ui`).
- **Next.js docs browser** is only under **`demo/`**.
- When building UI with this library, follow `skills/glt-ui-skill/SKILL.md`.

# CI / npm — do not reintroduce these failures

See also **RELEASE.md**. Hard rules from past Actions failures:

1. After any dependency change, **regenerate and commit `package-lock.json`** so
   `npm ci` works on Linux (CI). Prefer matching CI Node (24). Verify with
   `rm -rf node_modules && npm ci`.
2. Lockfile must include **platform optional natives** for Tailwind/lightningcss
   and `@emnapi/*` (not only macOS packages). Missing linux binaries break Pages builds.
3. **npm Trusted Publishing (OIDC):** follow official recipe (`id-token: write`, Node 24,
   Trusted Publisher on npmjs.com for `gaplo917` / `GLT-UI` / `publish-npm.yml`).
   Publish from **repo root** with `npm publish --provenance`.
4. Pages artifact path is **`demo/out`**. Tag releases as `glt-ui-v*`.
