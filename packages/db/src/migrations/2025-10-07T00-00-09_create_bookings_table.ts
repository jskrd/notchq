import { type Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("bookings")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("basket_id", "integer", (col) =>
      col.references("baskets.id").onDelete("cascade").notNull().unique(),
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").onDelete("set null"),
    )
    .addColumn("reference", "text", (col) => col.notNull().unique())
    .addColumn("customer_name", "text", (col) => col.notNull())
    .addColumn("customer_email", "text", (col) => col.notNull())
    .addColumn("customer_phone", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("bookings").execute();
}
