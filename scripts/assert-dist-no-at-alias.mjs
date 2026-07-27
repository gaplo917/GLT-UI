/**
 * Fail the build if emit still contains unresolved TypeScript path aliases.
 * Next.js cannot resolve `@/*` from packages/glt-ui/dist (portal `@/*` is repo root).
 *
 * Usage: node scripts/assert-dist-no-at-alias.mjs [dir]
 * Default dir: ../dist relative to this script.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultDist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);
const dist = path.resolve(process.argv[2] || defaultDist);
const re = /from\s+['"]@\//;
const hits = [];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(js|d\.ts|mjs|cjs)$/.test(ent.name)) {
      const text = fs.readFileSync(p, "utf8");
      if (re.test(text)) hits.push(path.relative(dist, p));
    }
  }
}

if (!fs.existsSync(dist)) {
  console.error(`[assert-dist-no-at-alias] ${dist} missing`);
  process.exit(1);
}

walk(dist);

if (hits.length) {
  console.error(
    `[assert-dist-no-at-alias] ${hits.length} file(s) still import @/ — tsc-alias failed:`,
  );
  for (const h of hits.slice(0, 20)) console.error("  ", h);
  process.exit(1);
}

console.log(
  `[assert-dist-no-at-alias] ok — no @/ imports in ${path.basename(dist)}`,
);
