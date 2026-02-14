import { createBusiness } from "./business.js";
import { faker } from "@faker-js/faker";
import { db } from "@repo/db/database";
import type { NewOffering, Offering } from "@repo/db/types";

export async function createOffering(
  overrides: Partial<NewOffering> = {},
): Promise<Offering> {
  return db()
    .insertInto("offerings")
    .values({
      business_id: overrides.business_id ?? (await createBusiness()).id,
      slug: faker.lorem.slug(),
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      timezone: faker.location.timeZone(),
      currency: faker.finance.currencyCode(),
      image_url: faker.image.url(),
      accent_color: faker.color.rgb(),
      add_on_max_selections: null,
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
