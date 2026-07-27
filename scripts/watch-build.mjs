/**
 * Sequential tsc → tsc-alias on each change.
 * Concurrent `tsc -w` + `tsc-alias -w` races: tsc re-emits `@/*` into dist before
 * tsc-alias rewrites, and Next (transpilePackages) fails on unresolved `@/…`.
 */
import { spawn } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

let timer = null;
let building = false;
let pending = false;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}

async function build() {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  try {
    const stamp = new Date().toLocaleTimeString();
    console.log(`[glt-ui watch] ${stamp} building…`);
    await run("npx", ["tsc", "-p", "tsconfig.build.json"]);
    await run("npx", ["tsc-alias", "-p", "tsconfig.build.json"]);
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
