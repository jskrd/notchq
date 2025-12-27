import { db } from "@repo/db/database";
import type { Business } from "@repo/db/types";
import { cache } from "react";

async function getBusiness(slug: string): Promise<Business | undefined> {
  return await db
    .selectFrom("businesses")
    .where("slug", "=", slug)
    .selectAll()
    .executeTakeFirst();
}

export default cache(getBusiness);
