import { getDb } from "@repo/db/database";
import type { NewPayment, Payment, PaymentUpdate } from "@repo/db/types";
import { sql } from "kysely";

export async function findPaymentById(
  id: number,
): Promise<Payment | undefined> {
  return await getDb()
    .selectFrom("payments")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findPaymentsByBookingId(
  bookingId: number,
): Promise<Payment[]> {
  return await getDb()
    .selectFrom("payments")
    .where("booking_id", "=", bookingId)
    .selectAll()
    .execute();
}

export async function findPaymentByStripeIntentId(
  stripePaymentIntentId: string,
): Promise<Payment | undefined> {
  return await getDb()
    .selectFrom("payments")
    .where("stripe_payment_intent_id", "=", stripePaymentIntentId)
    .selectAll()
    .executeTakeFirst();
}

export async function createPayment(payment: NewPayment): Promise<Payment> {
  return await getDb()
    .insertInto("payments")
    .values(payment)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updatePayment(
  id: number,
  updateWith: PaymentUpdate,
): Promise<void> {
  await getDb()
    .updateTable("payments")
    .set({
      ...updateWith,
      updated_at: sql`now()`,
    })
    .where("id", "=", id)
    .execute();
}
