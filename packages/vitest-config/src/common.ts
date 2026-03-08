import { defineConfig } from "vitest/config";

export const commonConfig = defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});
