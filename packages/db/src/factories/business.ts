import { db } from "../database.ts";
import type { Business, NewBusiness } from "../types.ts";
import { faker } from "@faker-js/faker";

export async function createBusiness(
  overrides: Partial<NewBusiness> = {},
): Promise<Business> {
  return db()
    .insertInto("businesses")
    .values({
      slug: faker.lorem.slug(),
      name: faker.company.name(),
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
