import { db } from "@repo/db/database.js";
import type { AddOn, AddOnUpdate, NewAddOn } from "@repo/db/types.js";
import { sql } from "kysely";

export async function findAddOnById(id: number): Promise<AddOn | undefined> {
  return await db
    .selectFrom("add_ons")
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .selectAll()
    .executeTakeFirst();
}

export async function findAddOnsByOfferingId(
  offeringId: number,
): Promise<AddOn[]> {
  return await db
    .selectFrom("add_ons")
    .where("offering_id", "=", offeringId)
    .where("deleted_at", "is", null)
    .selectAll()
    .execute();
}

export async function findPublishedAddOnsByOfferingId(
  offeringId: number,
): Promise<AddOn[]> {
  return await db
    .selectFrom("add_ons")
    .where("offering_id", "=", offeringId)
    .where("published_at", "is not", null)
    .where("deleted_at", "is", null)
    .selectAll()
    .execute();
}

export async function createAddOn(addOn: NewAddOn): Promise<AddOn> {
  return await db
    .insertInto("add_ons")
    .values(addOn)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateAddOn(
  id: number,
  updateWith: AddOnUpdate,
): Promise<void> {
  await db
    .updateTable("add_ons")
    .set({
      ...updateWith,
      updated_at: sql`now()`,
    })
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .execute();
}

export async function softDeleteAddOn(id: number): Promise<AddOn | undefined> {
  return await db
    .updateTable("add_ons")
    .set({ deleted_at: sql`now()` })
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .returningAll()
    .executeTakeFirst();
}
