"use server";

import type { ServerActionResult } from "@repo/book/lib/server-action-result";
import { db } from "@repo/db/database";
import type { Slot } from "@repo/db/types";
import { z } from "zod";

const schema = z.object({
  offeringId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function getSlots(
  data: unknown,
): Promise<ServerActionResult<Pick<Slot, "id" | "start" | "duration">[]>> {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      message: result.error.message,
      errors: z.treeifyError(result.error).errors,
    };
  }

  const startOfDay = new Date(result.data.date);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const results = await db
    .selectFrom("slots")
    .select(["id", "start", "duration"])
    .where("offering_id", "=", result.data.offeringId)
    .where("start", ">=", startOfDay)
    .where("start", "<", endOfDay)
    .orderBy("start", "asc")
    .execute();

  return { success: true, data: results };
}
