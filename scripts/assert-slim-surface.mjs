/**
 * Structural gate: slim glt-ui public surface matches the research portal keep-set.
 * Run after `npm run build` in packages/glt-ui.
 *
 * Usage: node scripts/assert-slim-surface.mjs
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');
const distIndex = path.join(pkgRoot, 'dist', 'index.js');
const distComponents = path.join(pkgRoot, 'dist', 'components');

if (!fs.existsSync(distIndex)) {
  console.error('FAIL: dist/index.js missing — run npm run build first');
  process.exit(2);
}

const require = createRequire(import.meta.url);

// Portal direct symbols + known transitive public exports still on the barrel
const REQUIRED = [
  'Badge',
  'Button',
  'Callout',
  'Card',
  'CardContent',
  'Chart',
  'Checkbox',
  'Container',
  'Divider',
  'FigureDataTableToggle',
  'FullBleedFigure',
  'Grid',
  'Icon',
  'List',
  'ListItem',
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

const FORBIDDEN = [
  'Avatar',
  'Modal',
  'Navbar',
  'CodeBlock',
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
  'Markdown',
  'FigureObservation',
  'SimulationPanel',
  'BenchmarkChart',
  'TechniqueGrid',
  'Section',
  'useInView', // motion helpers removed with animation atoms
];

const mod = await import(pathToFileUrl(distIndex));

const missing = REQUIRED.filter((k) => !(k in mod));
const presentForbidden = FORBIDDEN.filter((k) => k in mod);

// Folder-level: removed atoms must not exist under dist/components
const forbiddenDirs = [
  'atoms/Avatar',
  'atoms/Modal',
  'molecules/CodeBlock',
  'organisms/Modal',
  'organisms/StatGrid',
  'templates/Section',
  'lib/motion',
];
const leftoverDirs = forbiddenDirs.filter((rel) => {
  const p = path.join(pkgRoot, 'dist', rel.includes('lib/') ? rel.replace('lib/', '../lib/').replace('..', 'dist') : path.join('components', rel));
  // check source too
  const src = path.join(pkgRoot, 'src', rel.startsWith('lib/') ? rel : path.join('components', rel));
  return fs.existsSync(src);
});

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

// Count atom/molecule/organism folders remaining
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
console.log('  layer folder counts:', counts);
console.log('  sample export Chart:', typeof mod.Chart);
console.log('  sample export FullBleedFigure:', typeof mod.FullBleedFigure);

if (failed) process.exit(1);

function pathToFileUrl(p) {
  const resolved = path.resolve(p);
  return 'file://' + resolved;
}
