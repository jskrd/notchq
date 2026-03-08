import { db } from "../database.ts";
import type { Basket, NewBasket } from "../types.ts";

export async function createBasket(
  overrides: Partial<NewBasket> = {},
): Promise<Basket> {
  return db()
    .insertInto("baskets")
    .values({
      user_id: null,
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
