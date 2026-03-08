import { slotCollection, slotResource } from "./slot.ts";
import { createSlot } from "@repo/db/factories";
import { describe, expect, it } from "vitest";

describe(slotResource.name, () => {
  it("returns the expected fields", async () => {
    const slot = await createSlot();

    expect(slotResource(slot)).toEqual({
      id: slot.id,
      offering_id: slot.offering_id,
      start: slot.start.toISOString(),
      duration: slot.duration,
      price: slot.price,
      capacity: slot.capacity,
      created_at: slot.created_at.toISOString(),
    });
  });
});

describe(slotCollection.name, () => {
  it("returns an array of slot resources", async () => {
    const slot = await createSlot();

    expect(slotCollection([slot])).toEqual([slotResource(slot)]);
  });
});
