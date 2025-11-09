import { type Kysely, sql } from "kysely";

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("add_ons")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("offering_id", "integer", (col) =>
			col.references("offerings.id").onDelete("cascade").notNull(),
		)
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("description", "text", (col) => col.notNull())
		.addColumn("price", "integer", (col) => col.notNull())
		.addColumn("quantity", "integer")
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
		.createIndex("add_ons_published_at_index")
		.on("add_ons")
		.column("published_at")
		.execute();

	await db.schema
		.createIndex("add_ons_deleted_at_index")
		.on("add_ons")
		.column("deleted_at")
		.execute();
}

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex("add_ons_deleted_at_index").execute();
	await db.schema.dropIndex("add_ons_published_at_index").execute();
	await db.schema.dropTable("add_ons").execute();
}
