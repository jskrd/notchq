import { z } from "@hono/zod-openapi";
import type { Slot } from "@repo/db/types";

export const slotSchema = z
  .object({
    id: z.number(),
    offering_id: z.number(),
    start: z.string(),
    duration: z.number(),
    price: z.number(),
    capacity: z.number().nullable(),
    created_at: z.string(),
  })
  .openapi("Slot");

export function slotResource(slot: Slot): z.infer<typeof slotSchema> {
  return {
    id: slot.id,
    offering_id: slot.offering_id,
    start: slot.start.toISOString(),
    duration: slot.duration,
    price: slot.price,
    capacity: slot.capacity,
    created_at: slot.created_at.toISOString(),
  };
}

export function slotCollection(slots: Slot[]) {
  return slots.map(slotResource);
}
