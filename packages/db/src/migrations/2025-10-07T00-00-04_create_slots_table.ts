import { type Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("slots")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("offering_id", "integer", (col) =>
      col.references("offerings.id").onDelete("cascade").notNull(),
    )
    .addColumn("date", "date", (col) => col.notNull())
    .addColumn("time", "time", (col) => col.notNull())
    .addColumn("duration", "integer", (col) => col.notNull())
    .addColumn("price", "integer", (col) => col.notNull())
    .addColumn("capacity", "integer")
    .addColumn("published_at", "timestamp")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("deleted_at", "timestamp")
    .execute();

  await db.schema
    .createIndex("slots_offering_id_date_time_published_at_deleted_at_index")
    .on("slots")
    .columns(["offering_id", "date", "time", "published_at", "deleted_at"])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex("slots_offering_id_date_time_published_at_deleted_at_index")
    .execute();
  await db.schema.dropTable("slots").execute();
}
