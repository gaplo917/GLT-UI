/**
 * Inventory: public component-API props vs demo usage in slim.tsx.
 * Usage: node scripts/props-demo-coverage.mjs [outDir]
 *
 * Excludes pure HTMLAttributes passthrough (className, style, events, …).
 * Nested option fields on host-owned data objects are covered when demos pass them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');
/** Optional output dir for markdown/json inventory. Omit to print only. */
const outDir = process.argv[2] ? path.resolve(process.argv[2]) : null;

const HTML_EXCLUDE = new Set([
  'className',
  'style',
  'id',
  'role',
  'key',
  'ref',
  'onClick',
  'onChange',
  'onFocus',
  'onBlur',
  'onMouseEnter',
  'onMouseLeave',
  'onKeyDown',
  'onSubmit',
  'tabIndex',
  'dangerouslySetInnerHTML',
  'suppressHydrationWarning',
]);

/** Walk brace-balanced block starting after opening `{`. */
function extractBlock(text, openBraceIdx) {
  let depth = 0;
  let i = openBraceIdx;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return text.slice(openBraceIdx + 1, i);
    }
  }
  return '';
}

function propNamesFromBody(body) {
  const props = new Set();
  // strip block comments
  const cleaned = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  for (const m of cleaned.matchAll(/^\s*(?:readonly\s+)?([A-Za-z_][\w]*)\s*\??\s*:/gm)) {
    const name = m[1];
    if (!['export', 'interface', 'type', 'extends', 'readonly', 'import'].includes(name)) {
      props.add(name);
    }
  }
  return props;
}

function findPropsTypes(fileText) {
  /** @type {Map<string, Set<string>>} */
  const map = new Map();
  const re = /export\s+(?:interface|type)\s+(\w+Props)\b/g;
  let m;
  while ((m = re.exec(fileText))) {
    const typeName = m[1];
    const after = fileText.slice(m.index);
    const brace = after.indexOf('{');
    if (brace < 0) continue;
    // only if this is the type body (not extends clause only)
    const abs = m.index + brace;
    const body = extractBlock(fileText, abs);
    const props = propNamesFromBody(body);
    for (const p of HTML_EXCLUDE) props.delete(p);
    if (props.size) map.set(typeName, props);
  }
  return map;
}

function walkTsx(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) walkTsx(abs, files);
    else if (name.endsWith('.tsx') || name.endsWith('.ts')) files.push(abs);
  }
  return files;
}

const srcFiles = walkTsx(path.join(pkgRoot, 'src/components'));
/** ComponentName -> Set of API props */
const compApi = new Map();

for (const file of srcFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const types = findPropsTypes(text);
  // map CompProps -> Comp via export function Comp
  for (const [typeName, props] of types) {
    const base = typeName.replace(/Props$/, '');
    const existing = compApi.get(base) || new Set();
    for (const p of props) existing.add(p);
    compApi.set(base, existing);
  }
  // export function X({ a, b }: { a: …, b: … })
  for (const m of text.matchAll(
    /export\s+function\s+(\w+)\s*\(\s*\{([^}]*)\}\s*:\s*\{([^}]*)\}/g,
  )) {
    const comp = m[1];
    if (compApi.has(comp)) continue;
    const typed = propNamesFromBody(m[3]);
    for (const p of HTML_EXCLUDE) typed.delete(p);
    if (typed.size) compApi.set(comp, typed);
  }
}

// Registry entry ids
const registryText = fs.readFileSync(
  path.join(pkgRoot, 'demo/components/docs/registry.tsx'),
  'utf8',
);
const layerIds = [
  ...registryText.matchAll(/'([a-z][a-z0-9-]*)'/g),
].map((x) => x[1]);
const registrySet = new Set(layerIds);

const slimPath = path.join(pkgRoot, 'demo/components/docs/sections/slim.tsx');
const slim = fs.readFileSync(slimPath, 'utf8');

// Split top-level doc entries: `    {\n      id: '…',\n      name: '…',`
// Do not use bare `],` lookbehinds — code templates often contain `    ],`.
const entryStarts = [
  ...slim.matchAll(/\n {4}\{\n {6}id: '([^']+)',\n {6}name: '([^']+)',/g),
];
const entries = [];
for (let i = 0; i < entryStarts.length; i++) {
  const cur = entryStarts[i];
  const id = cur[1];
  const name = cur[2];
  const bodyStart = cur.index + cur[0].length;
  const bodyEnd =
    i + 1 < entryStarts.length ? entryStarts[i + 1].index : slim.length;
  entries.push({ id, name, body: slim.slice(bodyStart, bodyEnd) });
}

function usedPropsInBody(body) {
  const used = new Set();
  // prop={…} / prop="…" / prop={true} / prop={12}
  for (const m of body.matchAll(/\b([A-Za-z_][\w]*)\s*=\s*(?:\{|["'`]|true|false|\d)/g)) {
    used.add(m[1]);
  }
  // JSX boolean shorthand before another prop or tag end:
  // <Button loading>  <Table striped hoverable>  <Chart stacked />
  for (const m of body.matchAll(
    /(?:<\w+|\s)([a-z][A-Za-z0-9]*)(?=\s+[a-zA-Z_/=]|\/?>)/g,
  )) {
    used.add(m[1]);
  }
  return used;
}

// Map name -> component API (handle FullBleedFigure + FigureDataTableToggle)
function apiForEntry(name) {
  if (name === 'FullBleedFigure') {
    const s = new Set([
      ...(compApi.get('FullBleedFigure') || []),
      ...(compApi.get('FigureDataTableToggle') || []),
    ]);
    return s;
  }
  if (name === 'PresentationStrip') {
    const s = new Set([
      ...(compApi.get('PresentationStrip') || []),
      ...(compApi.get('FitContain') || []),
      ...(compApi.get('PresentationSlideFrame') || []),
    ]);
    return s;
  }
  return new Set(compApi.get(name) || []);
}

const inventory = [];
for (const e of entries) {
  if (!registrySet.has(e.id) && !e.body.includes('importLine')) continue;
  const api = apiForEntry(e.name);
  const used = usedPropsInBody(e.body);
  // children covered if nested JSX content present
  if (api.has('children')) {
    if (/<[A-Za-z][\s\S]*?>[\s\S]+<\//.test(e.body) || e.body.includes('children=')) {
      used.add('children');
    }
  }
  const missing = [...api].filter((p) => !used.has(p) && !HTML_EXCLUDE.has(p)).sort();
  const covered = [...api].filter((p) => used.has(p)).sort();
  inventory.push({
    id: e.id,
    name: e.name,
    api_props: [...api].sort(),
    used_in_demo: covered,
    missing,
    missing_count: missing.length,
  });
}

inventory.sort((a, b) => b.missing_count - a.missing_count);

const gaps = inventory.filter((x) => x.missing_count > 0);
const covered = inventory.filter((x) => x.missing_count === 0 && x.api_props.length);

const md = [
  '# Props vs demo coverage inventory',
  '',
  'Component-API props only. Excludes HTML passthrough: `' +
    [...HTML_EXCLUDE].sort().join('`, `') +
    '`.',
  '',
  `- Entries audited: **${inventory.length}**`,
  `- Entries with gaps: **${gaps.length}**`,
  `- Fully covered (with parsed API): **${covered.length}**`,
  '',
  '## Gaps by entry',
  '',
];

for (const x of gaps) {
  md.push(`### \`${x.id}\` (${x.name})`);
  md.push(`- API: ${x.api_props.join(', ') || '(none parsed)'}`);
  md.push(`- Used: ${x.used_in_demo.join(', ') || '—'}`);
  md.push(`- **Missing:** ${x.missing.join(', ')}`);
  md.push('');
}

md.push('## Fully covered');
md.push('');
for (const x of covered) {
  md.push(`- \`${x.id}\`: ${x.api_props.join(', ')}`);
}

md.push('');
md.push('## Parsed component APIs');
md.push('');
for (const [k, v] of [...compApi.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  md.push(`- **${k}**: ${[...v].sort().join(', ')}`);
}

console.log(md.join('\n'));

if (outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const mdPath = path.join(outDir, 'props-coverage.md');
  const jsonPath = path.join(outDir, 'props-coverage.json');
  fs.writeFileSync(mdPath, md.join('\n') + '\n');
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        html_exclude: [...HTML_EXCLUDE],
        inventory,
        gaps,
        component_apis: Object.fromEntries(
          [...compApi.entries()].map(([k, v]) => [k, [...v].sort()]),
        ),
      },
      null,
      2,
    ),
  );
  console.log(`\nWrote ${mdPath}`);
  console.log(`Wrote ${jsonPath}`);
}

console.log(`GAPS=${gaps.length}`);
process.exitCode = gaps.length > 0 ? 1 : 0;
