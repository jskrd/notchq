import { env } from "@repo/rdb/env";
import type { Database } from "@repo/rdb/types";
import { Kysely, PostgresDialect, sql } from "kysely";
import Pool from "pg-pool";

let db: Kysely<Database> | null = null;

export function rdb(): Kysely<Database> {
  if (!db) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        connectionString: env().RDB_URL,
      }),
    });
    db = new Kysely<Database>({ dialect });
  }
  return db;
}

export function destroyRdb(): void {
  db?.destroy();
  db = null;
}

export { sql };
