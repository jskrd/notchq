import { env } from "@repo/env";
import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import Pool from "pg-pool";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env().DB_URL,
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
