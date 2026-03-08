import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    "packages/db": {
      entry: ["kysely.config.ts", "src/migrations/*.ts", "src/seeds/*.ts"],
    },
  },
};

export default config;
