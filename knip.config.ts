import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Plugins disabled - can't load configs with workspace imports
  eslint: false,
  vitest: false,
  // Used via --coverage flag
  ignoreDependencies: ["@vitest/coverage-v8"],
  // Config-only packages
  ignoreWorkspaces: [
    "packages/eslint-config",
    "packages/typescript-config",
    "packages/vitest-config",
  ],
  workspaces: {
    "apps/api": {
      entry: ["eslint.config.ts", "vitest.config.ts", "**/*.test.ts"],
    },
    "apps/book": {
      entry: ["eslint.config.ts"],
      // Indirect deps (Next.js peer/plugins)
      ignoreBinaries: ["next"],
      ignoreDependencies: ["@types/react-dom", "postcss", "react-dom"],
    },
    "packages/db": {
      entry: ["eslint.config.ts", "kysely.config.ts"],
    },
  },
};

export default config;
