"use server";

import type { ServerActionResult } from "@repo/book/lib/types/server-action-result";
import { db } from "@repo/db/database";
import type { Slot } from "@repo/db/types";
import { z } from "zod";

const schema = z.object({
  offeringId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function getSlots(
  data: unknown,
): Promise<
  ServerActionResult<Pick<Slot, "id" | "date" | "time" | "duration">[]>
> {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      message: result.error.message,
      errors: z.treeifyError(result.error).errors,
    };
  }

  const results = await db
    .selectFrom("slots")
    .select(["id", "date", "time", "duration"])
    .where("offering_id", "=", result.data.offeringId)
    .where("date", "=", new Date(result.data.date))
    .where("published_at", "is not", null)
    .where("deleted_at", "is", null)
    .orderBy("time", "asc")
    .execute();

  return { success: true, data: results };
}
