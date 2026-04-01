import { defineConfig } from "vitest/config";

export const commonConfig = defineConfig({
  test: {
    coverage: {
      all: true,
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts"],
      reporter: ["text"],
    },
    include: ["src/**/*.test.ts"],
  },
});
