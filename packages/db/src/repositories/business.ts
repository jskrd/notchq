import { db } from "@repo/db/database";
import type { Business, BusinessUpdate, NewBusiness } from "@repo/db/types";
import { sql } from "kysely";

export async function findBusinessById(
  id: number,
): Promise<Business | undefined> {
  return await db()
    .selectFrom("businesses")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findBusinessBySlug(
  slug: string,
): Promise<Business | undefined> {
  return await db()
    .selectFrom("businesses")
    .where("slug", "=", slug)
    .selectAll()
    .executeTakeFirst();
}

export async function findBusinessesByUserId(
  userId: number,
): Promise<Business[]> {
  return await db()
    .selectFrom("businesses")
    .innerJoin("business_users", "business_users.business_id", "businesses.id")
    .where("business_users.user_id", "=", userId)
    .selectAll("businesses")
    .execute();
}

export async function createBusiness(business: NewBusiness): Promise<Business> {
  return await db()
    .insertInto("businesses")
    .values(business)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateBusiness(
  id: number,
  updateWith: BusinessUpdate,
): Promise<void> {
  await db()
    .updateTable("businesses")
    .set({
      ...updateWith,
      updated_at: sql`now()`,
    })
    .where("id", "=", id)
    .execute();
}

export async function deleteBusiness(
  id: number,
): Promise<Business | undefined> {
  return await db()
    .deleteFrom("businesses")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
