import { env } from "@repo/db/env.js";
import type { Database } from "@repo/db/types.js";
import { Kysely, PostgresDialect } from "kysely";
import Pool from "pg-pool";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
