import { db } from "@repo/db/database";
import { Offering } from "@repo/db/types";

export async function getOfferings(
  businessId: number,
  limit: number,
  offset: number,
): Promise<Offering[]> {
  return await db
    .selectFrom("offerings")
    .where("business_id", "=", businessId)
    .where("deleted_at", "is", null)
    .orderBy("name", "asc")
    .limit(limit)
    .offset(offset)
    .selectAll()
    .execute();
}
