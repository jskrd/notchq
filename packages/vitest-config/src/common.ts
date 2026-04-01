import { defineConfig } from "vitest/config";

export const commonConfig = defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts"],
      reporter: ["text"],
    },
    include: ["src/**/*.test.ts"],
    reporters: ["dot"],
  },
});
