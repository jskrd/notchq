import { type Kysely, sql } from "kysely";

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("business_users")
		.addColumn("business_id", "integer", (col) =>
			col.references("businesses.id").onDelete("cascade").notNull(),
		)
		.addColumn("user_id", "integer", (col) =>
			col.references("users.id").onDelete("cascade").notNull(),
		)
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addPrimaryKeyConstraint("business_users_pkey", ["business_id", "user_id"])
		.execute();
}

// biome-ignore lint/suspicious/noExplicitAny: Kysely requires Kysely<any> in migrations
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("business_users").execute();
}
