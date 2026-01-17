import { getDb } from "@repo/db/database";
import type { NewSlot, Slot, SlotUpdate } from "@repo/db/types";
import { sql } from "kysely";

export async function findSlotById(id: number): Promise<Slot | undefined> {
  return await getDb()
    .selectFrom("slots")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findSlotsByOfferingId(
  offeringId: number,
): Promise<Slot[]> {
  return await getDb()
    .selectFrom("slots")
    .where("offering_id", "=", offeringId)
    .selectAll()
    .execute();
}

export async function findPublishedSlotsByOfferingId(
  offeringId: number,
): Promise<Slot[]> {
  return await getDb()
    .selectFrom("slots")
    .where("offering_id", "=", offeringId)
    .selectAll()
    .execute();
}

export async function createSlot(slot: NewSlot): Promise<Slot> {
  return await getDb()
    .insertInto("slots")
    .values(slot)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateSlot(
  id: number,
  updateWith: SlotUpdate,
): Promise<void> {
  await getDb()
    .updateTable("slots")
    .set({
      ...updateWith,
      updated_at: sql`now()`,
    })
    .where("id", "=", id)
    .execute();
}

export async function softDeleteSlot(id: number): Promise<Slot | undefined> {
  return await getDb()
    .updateTable("slots")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
