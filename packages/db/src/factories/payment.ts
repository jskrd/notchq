import { db } from "../database.ts";
import type { NewPayment, Payment } from "../types.ts";
import { createBooking } from "./booking.js";
import { faker } from "@faker-js/faker";

export async function createPayment(
  overrides: Partial<NewPayment> = {},
): Promise<Payment> {
  return db()
    .insertInto("payments")
    .values({
      booking_id: overrides.booking_id ?? (await createBooking()).id,
      stripe_payment_intent_id: `pi_${faker.string.alphanumeric(24)}`,
      status: "succeeded",
      amount: faker.number.int({ min: 500, max: 50000 }),
      currency: faker.finance.currencyCode(),
      method: "card",
      last4: faker.finance.creditCardNumber("####"),
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
