"use server";

import { getDb } from "@repo/db/database";
import { Slot } from "@repo/db/types";
import z from "zod";

const schema = z.object({
  id: z.number().int().positive(),
});

export async function getSlot(data: unknown): Promise<Slot | null> {
  const { id } = schema.parse(data);

  const slot = await getDb()
    .selectFrom("slots")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  return slot ?? null;
}
