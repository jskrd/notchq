"use server";

import { db } from "@repo/db/database";
import { Slot } from "@repo/db/types";
import z from "zod";

export type AvailableSlot = Pick<Slot, "id" | "start" | "duration">;

const schema = z.object({
  offeringId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function getAvailableSlots(
  data: unknown,
): Promise<AvailableSlot[]> {
  const { offeringId, date } = schema.parse(data);

  const startOfDay = new Date(date);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const slots = await db()
    .selectFrom("slots")
    .select(["id", "start", "duration"])
    .where("offering_id", "=", offeringId)
    .where("start", ">=", startOfDay)
    .where("start", "<", endOfDay)
    .orderBy("start", "asc")
    .execute();

  return slots;
}
