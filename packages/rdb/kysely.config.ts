import { env } from "@repo/rdb/env";
import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import Pool from "pg-pool";

const dialect = new PostgresDialect({
  pool: new Pool({
    host: env().RDB_HOST,
    port: env().RDB_PORT,
    database: env().RDB_DATABASE,
    user: env().RDB_USER,
    password: env().RDB_PASSWORD,
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
