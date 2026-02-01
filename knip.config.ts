import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    "packages/rdb": {
      entry: ["kysely.config.ts"],
    },
  },
};

export default config;
