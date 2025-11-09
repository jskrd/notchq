import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
]);

export default eslintConfig;
