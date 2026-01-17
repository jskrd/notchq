import { getDb } from "@repo/db/database";
import type { Offering } from "@repo/db/types";

export async function getOffering(
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
