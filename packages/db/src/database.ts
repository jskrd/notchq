import { getEnv } from "@repo/db/env";
import type { Database } from "@repo/db/types";
import { Kysely, PostgresDialect, sql } from "kysely";
import Pool from "pg-pool";

let _db: Kysely<Database> | null = null;

export function getDb(): Kysely<Database> {
  if (!_db) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        host: getEnv().DB_HOST,
        port: getEnv().DB_PORT,
        database: getEnv().DB_DATABASE,
        user: getEnv().DB_USER,
        password: getEnv().DB_PASSWORD,
      }),
    });
    _db = new Kysely<Database>({ dialect });
  }
  return _db;
}

export { sql };
