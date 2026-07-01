import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Compiled design-system output — lint source, not build artifacts.
    "**/dist/**",
    // Claude Code worktrees/jobs (may contain nested builds) — never lint.
    ".claude/**",
    "**/.next/**",
  ]),
]);

export default eslintConfig;
