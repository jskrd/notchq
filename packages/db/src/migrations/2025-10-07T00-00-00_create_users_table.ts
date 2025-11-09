import { type Kysely, sql } from "kysely";

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("users")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("email", "text", (col) => col.notNull().unique())
		.addColumn("password", "text", (col) => col.notNull())
		.addColumn("email_verified_at", "timestamp")
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute();
}

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("users").execute();
}
