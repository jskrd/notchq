import { createOffering } from "./offering.js";
import { faker } from "@faker-js/faker";
import { db } from "@repo/db/database";
import type { NewSlot, Slot } from "@repo/db/types";

export async function createSlot(
  overrides: Partial<NewSlot> = {},
): Promise<Slot> {
  return db()
    .insertInto("slots")
    .values({
      offering_id: overrides.offering_id ?? (await createOffering()).id,
      start: faker.date.future(),
      duration: faker.helpers.arrayElement([30, 60, 90, 120]),
      price: faker.number.int({ min: 500, max: 10000 }),
      capacity: faker.number.int({ min: 1, max: 50 }),
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
