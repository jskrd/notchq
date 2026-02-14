import { createBasket } from "./basket.js";
import { createSlot } from "./slot.js";
import { faker } from "@faker-js/faker";
import { db } from "@repo/db/database";
import type { BasketSlot, NewBasketSlot } from "@repo/db/types";

export async function createBasketSlot(
  overrides: Partial<NewBasketSlot> = {},
): Promise<BasketSlot> {
  return db()
    .insertInto("basket_slots")
    .values({
      basket_id: overrides.basket_id ?? (await createBasket()).id,
      slot_id: overrides.slot_id ?? (await createSlot()).id,
      price: faker.number.int({ min: 500, max: 10000 }),
      quantity: faker.number.int({ min: 1, max: 5 }),
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
