import { type Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("payments")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("booking_id", "integer", (col) =>
			col.references("bookings.id").onDelete("cascade").notNull().unique(),
		)
		.addColumn("stripe_payment_intent_id", "text", (col) =>
			col.notNull().unique(),
		)
		.addColumn("status", "text", (col) => col.notNull())
		.addColumn("amount", "integer", (col) => col.notNull())
		.addColumn("currency", "text", (col) => col.notNull())
		.addColumn("method", "text", (col) => col.notNull())
		.addColumn("last4", "text")
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute();

	await db.schema
		.createIndex("payments_status_index")
		.on("payments")
		.column("status")
		.execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex("payments_status_index").execute();
	await db.schema.dropTable("payments").execute();
}
