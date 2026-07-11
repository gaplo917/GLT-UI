import type { NextConfig } from "next";
import path from "path";

// next runs with cwd = demo/
const repoRoot = path.join(process.cwd(), "..");

/**
 * GitHub Pages project sites live at https://<user>.github.io/<repo>/.
 * Set BASE_PATH=/GLT-UI (or your repo name) in CI; leave unset for local dev.
 */
const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  transpilePackages: ["glt-ui"],
  logging: {
    browserToTerminal: true,
  },
  sassOptions: {
    loadPaths: [
      path.join(repoRoot, "node_modules"),
      path.join(repoRoot, "theme"),
      path.join(process.cwd(), "node_modules"),
    ],
    silenceDeprecations: ["import"],
  },
  outputFileTracingRoot: repoRoot,
};

export default nextConfig;
