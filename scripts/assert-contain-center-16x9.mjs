/**
 * Drive the shipped containCenter16x9 export used by present mode.
 * Usage: node scripts/assert-contain-center-16x9.mjs
 * Prerequisite: npm run build
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');
const distHelper = path.join(
  pkgRoot,
  'dist/components/molecules/FitContain/containCenter16x9.js',
);
const stripSrc = path.join(
  pkgRoot,
  'src/components/organisms/PresentationStrip/PresentationStrip.tsx',
);

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    process.exit(1);
  }
  console.log('PASS:', msg);
}

if (!existsSync(distHelper)) {
  console.error('FAIL: shipped containCenter16x9.js missing — run npm run build first');
  process.exit(2);
}

const { containCenter16x9 } = await import(pathToFileURL(distHelper).href);

assert(typeof containCenter16x9 === 'function', 'shipped containCenter16x9 is a function');

const strip = readFileSync(stripSrc, 'utf8');
assert(
  strip.includes('containCenter16x9'),
  'PresentationStrip present mode calls containCenter16x9',
);
assert(
  /data-present-aspect=["']16\/9["']/.test(strip) || strip.includes("aspectRatio: '16 / 9'"),
  'present-mode stage is specified as 16:9',
);

function checkViewport(vw, vh) {
  const box = containCenter16x9(vw, vh);
  const ratio = box.width / box.height;
  const expected = 16 / 9;
  assert(
    Math.abs(ratio - expected) < 1e-12,
    `${vw}×${vh}: width/height === 16/9 (got ${ratio})`,
  );
  assert(box.width <= vw + 1e-9, `${vw}×${vh}: width ≤ vw (${box.width} ≤ ${vw})`);
  assert(box.height <= vh + 1e-9, `${vw}×${vh}: height ≤ vh (${box.height} ≤ ${vh})`);
  assert(
    Math.abs(box.x - (vw - box.width) / 2) <= 1,
    `${vw}×${vh}: x is centered (x=${box.x})`,
  );
  assert(
    Math.abs(box.y - (vh - box.height) / 2) <= 1,
    `${vw}×${vh}: y is centered (y=${box.y})`,
  );
  console.log(
    `  box ${vw}×${vh} → ${JSON.stringify({
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    })}`,
  );
}

checkViewport(1920, 1080);
checkViewport(1280, 800);
checkViewport(390, 844);

console.log('\ncontainCenter16x9 shipped checks passed.');
