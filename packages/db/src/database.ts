import { env } from "@repo/db/env";
import type { Database } from "@repo/db/types";
import { Kysely, PostgresDialect, sql } from "kysely";
import Pool from "pg-pool";

let _db: Kysely<Database> | null = null;

export function getDb(): Kysely<Database> {
  if (!_db) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        host: env().DB_HOST,
        port: env().DB_PORT,
        database: env().DB_DATABASE,
        user: env().DB_USER,
        password: env().DB_PASSWORD,
      }),
    });
    _db = new Kysely<Database>({ dialect });
  }
  return _db;
}

export { sql };
