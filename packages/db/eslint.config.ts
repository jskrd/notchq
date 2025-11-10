import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.ts"],
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
]);

export default eslintConfig;
