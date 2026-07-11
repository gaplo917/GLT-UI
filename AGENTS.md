<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git commit conventions

Always include Grok as a co-author on every commit created or amended by an agent:

```
Co-Authored-By: Grok <noreply@x.ai>
```

Do not omit this trailer. Use it in addition to any other co-authors when relevant.

# glt-ui

The publishable UI package is **`glt-ui`** (`packages/glt-ui`). When building UI with
this library, follow `skills/glt-ui-skill/SKILL.md` (also linked at `.grok/skills/glt-ui`).

# CI / npm — do not reintroduce these failures

See also **RELEASE.md**. Hard rules from past Actions failures:

1. After any dependency change, **regenerate and commit `package-lock.json`** so
   `npm ci` works on Linux (CI). Prefer matching CI Node (22/24). Verify with
   `rm -rf node_modules && npm ci`.
2. Lockfile must include **platform optional natives** for Tailwind/lightningcss
   and `@emnapi/*` (not only macOS packages). Missing linux binaries break Pages builds.
3. **npm Trusted Publishing (OIDC):** needs npm ≥ 11.5.1, `permissions.id-token: write`,
   Trusted Publisher configured on npmjs.com (`gaplo917` / `GLT-UI` / `publish-npm.yml`).
   Do **not** inject a dummy `NODE_AUTH_TOKEN` via setup-node `registry-url` — that
   blocks OIDC and shows misleading **E404** / **ENEEDAUTH** on publish.
4. Tag releases as `glt-ui-v*`. First package create / OTP local publish may still be needed.
