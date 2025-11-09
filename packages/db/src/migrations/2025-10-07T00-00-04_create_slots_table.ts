import { type Kysely, sql } from "kysely";

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
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
		.createIndex("slots_date_index")
		.on("slots")
		.column("date")
		.execute();

	await db.schema
		.createIndex("slots_published_at_index")
		.on("slots")
		.column("published_at")
		.execute();

	await db.schema
		.createIndex("slots_deleted_at_index")
		.on("slots")
		.column("deleted_at")
		.execute();
}

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex("slots_deleted_at_index").execute();
	await db.schema.dropIndex("slots_published_at_index").execute();
	await db.schema.dropIndex("slots_date_index").execute();
	await db.schema.dropTable("slots").execute();
}
