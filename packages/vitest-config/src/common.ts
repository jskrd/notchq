import { defineConfig } from "vitest/config";

export const commonConfig = defineConfig({
  test: {
    coverage: {
      reporter: ["text"],
    },
    include: ["src/**/*.test.ts"],
  },
});
