import { type Kysely, sql } from "kysely";

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("basket_add_ons")
		.addColumn("basket_id", "integer", (col) =>
			col.references("baskets.id").onDelete("cascade").notNull(),
		)
		.addColumn("add_on_id", "integer", (col) =>
			col.references("add_ons.id").onDelete("restrict").notNull(),
		)
		.addColumn("price", "integer", (col) => col.notNull())
		.addColumn("quantity", "integer", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addPrimaryKeyConstraint("basket_add_ons_pkey", ["basket_id", "add_on_id"])
		.execute();
}

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("basket_add_ons").execute();
}
