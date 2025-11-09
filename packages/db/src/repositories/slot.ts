import { db } from "@repo/db/database.js";
import type { NewSlot, Slot, SlotUpdate } from "@repo/db/types.js";
import { sql } from "kysely";

export async function findSlotById(id: number): Promise<Slot | undefined> {
	return await db
		.selectFrom("slots")
		.where("id", "=", id)
		.where("deleted_at", "is", null)
		.selectAll()
		.executeTakeFirst();
}

export async function findSlotsByOfferingId(
	offeringId: number,
): Promise<Slot[]> {
	return await db
		.selectFrom("slots")
		.where("offering_id", "=", offeringId)
		.where("deleted_at", "is", null)
		.selectAll()
		.execute();
}

export async function findPublishedSlotsByOfferingId(
	offeringId: number,
): Promise<Slot[]> {
	return await db
		.selectFrom("slots")
		.where("offering_id", "=", offeringId)
		.where("published_at", "is not", null)
		.where("deleted_at", "is", null)
		.selectAll()
		.execute();
}

export async function createSlot(slot: NewSlot): Promise<Slot> {
	return await db
		.insertInto("slots")
		.values(slot)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export async function updateSlot(
	id: number,
	updateWith: SlotUpdate,
): Promise<void> {
	await db
		.updateTable("slots")
		.set({
			...updateWith,
			updated_at: sql`now()`,
		})
		.where("id", "=", id)
		.where("deleted_at", "is", null)
		.execute();
}

export async function softDeleteSlot(id: number): Promise<Slot | undefined> {
	return await db
		.updateTable("slots")
		.set({ deleted_at: sql`now()` })
		.where("id", "=", id)
		.where("deleted_at", "is", null)
		.returningAll()
		.executeTakeFirst();
}
