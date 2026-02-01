import { env } from "@repo/rdb/env";
import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import Pool from "pg-pool";

const dialect = new PostgresDialect({
  pool: new Pool({
    host: env().DB_HOST,
    port: env().DB_PORT,
    database: env().DB_DATABASE,
    user: env().DB_USER,
    password: env().DB_PASSWORD,
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
