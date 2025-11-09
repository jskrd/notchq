import { env } from "./src/env.js";
import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import Pool from "pg-pool";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
  }),
});

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: "./src/migrations",
  },
  seeds: {
    seedFolder: "./src/seeds",
  },
});
