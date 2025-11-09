import { db } from "@repo/db/database.js";
import type { NewPayment, Payment, PaymentUpdate } from "@repo/db/types.js";
import { sql } from "kysely";

export async function findPaymentById(
  id: number,
): Promise<Payment | undefined> {
  return await db
    .selectFrom("payments")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findPaymentsByBookingId(
  bookingId: number,
): Promise<Payment[]> {
  return await db
    .selectFrom("payments")
    .where("booking_id", "=", bookingId)
    .selectAll()
    .execute();
}

export async function findPaymentByStripeIntentId(
  stripePaymentIntentId: string,
): Promise<Payment | undefined> {
  return await db
    .selectFrom("payments")
    .where("stripe_payment_intent_id", "=", stripePaymentIntentId)
    .selectAll()
    .executeTakeFirst();
}

export async function createPayment(payment: NewPayment): Promise<Payment> {
  return await db
    .insertInto("payments")
    .values(payment)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updatePayment(
  id: number,
  updateWith: PaymentUpdate,
): Promise<void> {
  await db
    .updateTable("payments")
    .set({
      ...updateWith,
      updated_at: sql`now()`,
    })
    .where("id", "=", id)
    .execute();
}
