import { db } from "@repo/db/database";
import type { NewSlot, Slot, SlotUpdate } from "@repo/db/types";
import { sql } from "kysely";

export async function findSlotById(id: number): Promise<Slot | undefined> {
  return await db
    .selectFrom("slots")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findSlotsByOfferingId(
  offeringId: number,
): Promise<Slot[]> {
  return await db
    .selectFrom("slots")
    .where("offering_id", "=", offeringId)
    .selectAll()
    .execute();
}

export async function findPublishedSlotsByOfferingId(
  offeringId: number,
): Promise<Slot[]> {
  return await db
    .selectFrom("slots")
    .where("offering_id", "=", offeringId)
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
    .execute();
}

export async function softDeleteSlot(id: number): Promise<Slot | undefined> {
  return await db
    .updateTable("slots")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
