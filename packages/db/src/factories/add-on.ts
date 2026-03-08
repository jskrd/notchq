import { db } from "../database.ts";
import type { AddOn, NewAddOn } from "../types.ts";
import { createOffering } from "./offering.js";
import { faker } from "@faker-js/faker";

export async function createAddOn(
  overrides: Partial<NewAddOn> = {},
): Promise<AddOn> {
  return db()
    .insertInto("add_ons")
    .values({
      offering_id: overrides.offering_id ?? (await createOffering()).id,
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: faker.number.int({ min: 100, max: 5000 }),
      quantity: null,
      published_at: null,
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
