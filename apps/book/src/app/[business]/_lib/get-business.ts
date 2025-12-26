import { db } from "@repo/db/database";
import type { Business } from "@repo/db/types";
import { cache } from "react";
import { z } from "zod";

async function getBusiness(slug: string): Promise<Business | undefined> {
  const slugSchema = z
    .string()
    .min(1)
    .max(255)
    .regex(/^[-0-9a-z]+$/);

  const isValid = slugSchema.safeParse(slug);
  if (!isValid.success) {
    return undefined;
  }

  return await db
    .selectFrom("businesses")
    .where("slug", "=", slug)
    .selectAll()
    .executeTakeFirst();
}

export default cache(getBusiness);
