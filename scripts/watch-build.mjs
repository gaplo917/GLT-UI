/**
 * Watch packages/glt-ui/src and rebuild via atomic staging publish (build-once.mjs).
 * Avoids Next seeing half-written dist with unresolved `@/*` aliases.
 */
import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildOnce } from "./build-once.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

let timer = null;
let building = false;
let pending = false;

async function build() {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  try {
    const stamp = new Date().toLocaleTimeString();
    console.log(`[glt-ui watch] ${stamp} building…`);
    await buildOnce();
    console.log(`[glt-ui watch] ${stamp} done`);
  } catch (err) {
    console.error("[glt-ui watch] build failed:", err?.message ?? err);
  } finally {
    building = false;
    if (pending) {
      pending = false;
      void build();
    }
  }
}

void build();

watch(srcDir, { recursive: true }, (_event, filename) => {
  if (!filename) return;
  if (!/\.(tsx?|jsx?|json)$/.test(filename)) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    void build();
  }, 250);
});

console.log(`[glt-ui watch] watching ${srcDir}`);
