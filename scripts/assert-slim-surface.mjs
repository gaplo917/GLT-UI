/**
 * Structural gate: slim glt-ui public surface matches the research portal keep-set.
 * Run after `npm run build` in packages/glt-ui.
 *
 * Usage: node scripts/assert-slim-surface.mjs
 */
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');
const distIndex = path.join(pkgRoot, 'dist', 'index.js');

if (!fs.existsSync(distIndex)) {
  console.error('FAIL: dist/index.js missing — run npm run build first');
  process.exit(2);
}

/** Portal direct symbols + transitive public keepers still on the barrel. */
const REQUIRED = [
  'Badge',
  'Button',
  'Callout',
  'Card',
  'CardContent',
  'Chart',
  'Checkbox',
  'Code',
  'CodeBlock',
  'Container',
  'Divider',
  'FigureDataTableToggle',
  'FullBleedFigure',
  'Grid',
  'Icon',
  'List',
  'ListItem',
  'Markdown',
  'PageHero',
  'ProcessPipeline',
  'Quote',
  'SiteFooter',
  'SiteHeader',
  'Spinner',
  'Table',
  'TableBody',
  'TableCell',
  'TableHead',
  'TableHeaderCell',
  'TableRow',
  'Text',
  'Title',
  'Tooltip',
  'cn',
];

/**
 * Must NOT appear on the public export surface (removed folders OR stripped
 * co-exports inside kept modules).
 */
const FORBIDDEN = [
  // Removed component folders
  'Avatar',
  'Modal',
  'Navbar',
  'StatGrid',
  'StatMetric',
  'DataTable',
  'Accordion',
  'Tabs',
  'FormField',
  'TextInput',
  'TextArea',
  'SelectField',
  'Radio',
  'Switch',
  'Breadcrumb',
  'Pagination',
  'FigureObservation',
  'SimulationPanel',
  'BenchmarkChart',
  'TechniqueGrid',
  'Section',
  'useInView',
  // Stripped co-exports (skeptic AC1)
  'CardHeader',
  'CardHeaderTitle',
  'CardHeaderIcon',
  'CardImage',
  'CardFooter',
  'CardFooterItem',
  'CardTitle',
  'CardDescription',
  'TableCaption',
  'TableFoot',
  'Subtitle',
  'GridItem',
];

const forbiddenSourceDirs = [
  'src/components/atoms/Avatar',
  'src/components/organisms/Modal',
  'src/components/organisms/StatGrid',
  'src/components/templates/Section',
  'src/lib/motion.ts',
];

const mod = await import(pathToFileUrl(distIndex));

const missing = REQUIRED.filter((k) => !(k in mod));
const presentForbidden = FORBIDDEN.filter((k) => k in mod);
const leftoverDirs = forbiddenSourceDirs.filter((rel) =>
  fs.existsSync(path.join(pkgRoot, rel)),
);

// Source-level: co-exports must not reappear in keep modules
const coExportSources = {
  'src/components/organisms/Card/Card.tsx': [
    'CardHeader',
    'CardHeaderTitle',
    'CardHeaderIcon',
    'CardImage',
    'CardFooter',
    'CardFooterItem',
    'CardTitle',
    'CardDescription',
  ],
  'src/components/organisms/Table/Table.tsx': ['TableCaption', 'TableFoot'],
  'src/components/atoms/Title/Title.tsx': ['Subtitle'],
  'src/components/atoms/Grid/Grid.tsx': ['GridItem'],
};

const sourceHits = [];
for (const [rel, names] of Object.entries(coExportSources)) {
  const abs = path.join(pkgRoot, rel);
  if (!fs.existsSync(abs)) {
    sourceHits.push(`${rel} (missing file)`);
    continue;
  }
  const text = fs.readFileSync(abs, 'utf8');
  for (const name of names) {
    if (new RegExp(`export\\s+(const|function|type|interface|class)\\s+${name}\\b`).test(text)) {
      sourceHits.push(`${rel} still exports ${name}`);
    }
  }
}

let failed = false;
if (missing.length) {
  console.error('FAIL: required exports missing:', missing.join(', '));
  failed = true;
}
if (presentForbidden.length) {
  console.error('FAIL: forbidden exports still public:', presentForbidden.join(', '));
  failed = true;
}
if (leftoverDirs.length) {
  console.error('FAIL: removed source paths still exist:', leftoverDirs.join(', '));
  failed = true;
}
if (sourceHits.length) {
  console.error('FAIL: stripped co-exports still in source:\n ', sourceHits.join('\n  '));
  failed = true;
}

function countLayer(layer) {
  const d = path.join(pkgRoot, 'src/components', layer);
  if (!fs.existsSync(d)) return 0;
  return fs.readdirSync(d).filter((n) => fs.statSync(path.join(d, n)).isDirectory()).length;
}

const counts = {
  atoms: countLayer('atoms'),
  molecules: countLayer('molecules'),
  organisms: countLayer('organisms'),
  templates: countLayer('templates'),
};

console.log('OK slim surface');
console.log('  required exports:', REQUIRED.length - missing.length, '/', REQUIRED.length);
console.log('  forbidden exports present:', presentForbidden.length);
console.log('  co-export source hits:', sourceHits.length);
console.log('  layer folder counts:', counts);
console.log('  sample export Chart:', typeof mod.Chart);
console.log('  sample export CardContent:', typeof mod.CardContent);
console.log('  CardHeader present?:', 'CardHeader' in mod);
console.log('  Subtitle present?:', 'Subtitle' in mod);
console.log('  GridItem present?:', 'GridItem' in mod);
console.log('  TableFoot present?:', 'TableFoot' in mod);

if (failed) process.exit(1);

function pathToFileUrl(p) {
  return 'file://' + path.resolve(p);
}
