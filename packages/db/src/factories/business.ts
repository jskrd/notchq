import { faker } from "@faker-js/faker";
import { db } from "@repo/db/database";
import type { Business, NewBusiness } from "@repo/db/types";

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
