import { type Kysely, sql } from "kysely";

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("offerings")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("business_id", "integer", (col) =>
			col.references("businesses.id").onDelete("cascade").notNull(),
		)
		.addColumn("slug", "text", (col) => col.notNull())
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("description", "text", (col) => col.notNull())
		.addColumn("timezone", "text", (col) => col.notNull())
		.addColumn("currency", "text", (col) => col.notNull())
		.addColumn("add_on_min_selections", "integer", (col) =>
			col.notNull().defaultTo(0),
		)
		.addColumn("add_on_max_selections", "integer")
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn("deleted_at", "timestamp")
		.execute();

	await db.schema
		.createIndex("offerings_deleted_at_index")
		.on("offerings")
		.column("deleted_at")
		.execute();
}

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex("offerings_deleted_at_index").execute();
	await db.schema.dropTable("offerings").execute();
}
