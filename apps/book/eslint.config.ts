import nextjsConfig from "@repo/eslint-config/nextjs";
import { defineConfig } from "eslint/config";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  nextjsConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },
]);
