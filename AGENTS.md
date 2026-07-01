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
