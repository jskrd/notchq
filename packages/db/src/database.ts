import { env } from "@repo/db/env";
import type { Database } from "@repo/db/types";
import { Kysely, PostgresDialect, sql } from "kysely";
import Pool from "pg-pool";

const dialect = new PostgresDialect({
  pool: new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_DATABASE,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});

export { sql };
