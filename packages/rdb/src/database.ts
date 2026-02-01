import { env } from "@repo/rdb/env";
import type { Database } from "@repo/rdb/types";
import { Kysely, PostgresDialect, sql } from "kysely";
import Pool from "pg-pool";

let _rdb: Kysely<Database> | null = null;

export function rdb(): Kysely<Database> {
  if (!_rdb) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        host: env().RDB_HOST,
        port: env().RDB_PORT,
        database: env().RDB_DATABASE,
        user: env().RDB_USER,
        password: env().RDB_PASSWORD,
      }),
    });
    _rdb = new Kysely<Database>({ dialect });
  }
  return _rdb;
}

export { sql };
