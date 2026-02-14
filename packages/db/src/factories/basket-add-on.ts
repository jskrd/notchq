import { createAddOn } from "./add-on.js";
import { createBasket } from "./basket.js";
import { faker } from "@faker-js/faker";
import { db } from "@repo/db/database";
import type { BasketAddOn, NewBasketAddOn } from "@repo/db/types";

export async function createBasketAddOn(
  overrides: Partial<NewBasketAddOn> = {},
): Promise<BasketAddOn> {
  return db()
    .insertInto("basket_add_ons")
    .values({
      basket_id: overrides.basket_id ?? (await createBasket()).id,
      add_on_id: overrides.add_on_id ?? (await createAddOn()).id,
      price: faker.number.int({ min: 100, max: 5000 }),
      quantity: faker.number.int({ min: 1, max: 5 }),
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
