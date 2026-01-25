import type { Slot } from "@repo/db/types";

export function slotResource(slot: Slot) {
  return {
    id: slot.id,
    offering_id: slot.offering_id,
    start: slot.start,
    duration: slot.duration,
    price: slot.price,
    capacity: slot.capacity,
    created_at: slot.created_at,
  };
}

export function slotCollection(slots: Slot[]) {
  return slots.map(slotResource);
}
