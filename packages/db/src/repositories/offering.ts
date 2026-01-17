import { getDb } from "@repo/db/database";
import type { NewOffering, Offering, OfferingUpdate } from "@repo/db/types";
import { sql } from "kysely";

export async function findOfferingById(
  id: number,
): Promise<Offering | undefined> {
  return await getDb()
    .selectFrom("offerings")
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .selectAll()
    .executeTakeFirst();
}

export async function findOfferingBySlug(
  businessId: number,
  slug: string,
): Promise<Offering | undefined> {
  return await getDb()
    .selectFrom("offerings")
    .where("business_id", "=", businessId)
    .where("slug", "=", slug)
    .where("deleted_at", "is", null)
    .selectAll()
    .executeTakeFirst();
}

export async function findOfferingsByBusinessId(
  businessId: number,
): Promise<Offering[]> {
  return await getDb()
    .selectFrom("offerings")
    .where("business_id", "=", businessId)
    .where("deleted_at", "is", null)
    .selectAll()
    .execute();
}

export async function createOffering(offering: NewOffering): Promise<Offering> {
  return await getDb()
    .insertInto("offerings")
    .values(offering)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateOffering(
  id: number,
  updateWith: OfferingUpdate,
): Promise<void> {
  await getDb()
    .updateTable("offerings")
    .set({
      ...updateWith,
      updated_at: sql`now()`,
    })
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .execute();
}

export async function softDeleteOffering(
  id: number,
): Promise<Offering | undefined> {
  return await getDb()
    .updateTable("offerings")
    .set({ deleted_at: sql`now()` })
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .returningAll()
    .executeTakeFirst();
}
