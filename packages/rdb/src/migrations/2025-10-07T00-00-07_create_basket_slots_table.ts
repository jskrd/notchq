import { type Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("basket_slots")
    .addColumn("basket_id", "integer", (col) =>
      col.references("baskets.id").onDelete("cascade").notNull(),
    )
    .addColumn("slot_id", "integer", (col) =>
      col.references("slots.id").onDelete("restrict").notNull(),
    )
    .addColumn("price", "integer", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addPrimaryKeyConstraint("basket_slots_pkey", ["basket_id", "slot_id"])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("basket_slots").execute();
}
