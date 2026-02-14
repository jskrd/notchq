import { createBasket } from "./basket.js";
import { faker } from "@faker-js/faker";
import { db } from "@repo/db/database";
import type { Booking, NewBooking } from "@repo/db/types";

export async function createBooking(
  overrides: Partial<NewBooking> = {},
): Promise<Booking> {
  return db()
    .insertInto("bookings")
    .values({
      basket_id: overrides.basket_id ?? (await createBasket()).id,
      reference: faker.string.alphanumeric(10),
      customer_name: faker.person.fullName(),
      customer_email: faker.internet.email(),
      customer_phone: faker.phone.number(),
      user_id: null,
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
