/**
 * One-shot glt-ui build: tsc → tsc-alias into staging, assert, atomic publish to dist/.
 * Used by `npm run build` and by watch-build.mjs.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const stagingDir = path.join(root, ".dist-staging");
const prevDir = path.join(root, ".dist-prev");

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

function rmrf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function publishStaging() {
  rmrf(prevDir);
  if (fs.existsSync(distDir)) {
    fs.renameSync(distDir, prevDir);
  }
  fs.renameSync(stagingDir, distDir);
  rmrf(prevDir);
}

export async function buildOnce() {
  rmrf(stagingDir);
  await run("npx", ["tsc", "-p", "tsconfig.build.json", "--outDir", stagingDir]);
  await run("npx", [
    "tsc-alias",
    "-p",
    "tsconfig.build.json",
    "--outDir",
    stagingDir,
  ]);
  await run("node", ["scripts/assert-dist-no-at-alias.mjs", stagingDir]);
  publishStaging();
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  buildOnce()
    .then(() => {
      console.log("[glt-ui build] ok");
    })
    .catch((err) => {
      console.error("[glt-ui build] failed:", err?.message ?? err);
      rmrf(stagingDir);
      process.exit(1);
    });
}
