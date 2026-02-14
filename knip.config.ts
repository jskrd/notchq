import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    "packages/db": {
      entry: ["kysely.config.ts"],
    },
  },
};

export default config;
