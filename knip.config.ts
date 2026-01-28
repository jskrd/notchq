import type { KnipConfig } from "knip";

const config: KnipConfig = {
  eslint: false,
  vitest: false,
  ignoreDependencies: ["@vitest/coverage-v8"],
  workspaces: {
    "apps/api": {
      entry: ["src/**/*.test.ts", "eslint.config.ts", "vitest.config.ts"],
    },
    "apps/book": {
      entry: [
        "src/app/**/*.{ts,tsx}",
        "src/components/**/*.{ts,tsx}",
        "eslint.config.ts",
      ],
      project: ["src/**/*.{ts,tsx}"],
      ignoreBinaries: ["next"],
      ignoreDependencies: [
        "@types/react-dom",
        "postcss",
        "react-dom",
        "tailwindcss",
      ],
    },
    "packages/db": {
      entry: ["eslint.config.ts", "kysely.config.ts"],
      ignoreDependencies: ["@faker-js/faker", "@types/pg", "pg"],
    },
    "packages/eslint-config": {
      entry: ["src/*.ts"],
      project: ["src/**/*.ts"],
    },
    "packages/typescript-config": {
      entry: ["*.json"],
      ignoreDependencies: [
        "@tsconfig/next",
        "@tsconfig/node24",
        "@tsconfig/strictest",
        "typescript-eslint",
      ],
    },
    "packages/vitest-config": {
      entry: ["src/*.ts", "eslint.config.ts"],
      project: ["src/**/*.ts"],
    },
  },
};

export default config;
