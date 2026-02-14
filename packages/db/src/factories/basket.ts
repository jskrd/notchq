import { db } from "@repo/db/database";
import type { Basket, NewBasket } from "@repo/db/types";

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
