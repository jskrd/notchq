import type { Database } from "./types.ts";
import { env } from "@repo/env";
import { Kysely, PostgresDialect, sql } from "kysely";
import Pool from "pg-pool";

let _db: Kysely<Database> | null = null;

export function db(): Kysely<Database> {
  if (!_db) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        connectionString: env().DB_URL,
      }),
    });
    _db = new Kysely<Database>({ dialect });
  }
  return _db;
}

export function destroyDb(): void {
  _db?.destroy();
  _db = null;
}

export { sql };
