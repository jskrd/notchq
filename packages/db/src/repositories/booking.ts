import { db } from "@repo/db/database";
import type { Booking, BookingUpdate, NewBooking } from "@repo/db/types";
import { sql } from "kysely";

export async function findBookingById(
  id: number,
): Promise<Booking | undefined> {
  return await db
    .selectFrom("bookings")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findBookingByReference(
  reference: string,
): Promise<Booking | undefined> {
  return await db
    .selectFrom("bookings")
    .where("reference", "=", reference)
    .selectAll()
    .executeTakeFirst();
}

export async function findBookingsByUserId(userId: number): Promise<Booking[]> {
  return await db
    .selectFrom("bookings")
    .where("user_id", "=", userId)
    .selectAll()
    .execute();
}

export async function findBookingsByEmail(email: string): Promise<Booking[]> {
  return await db
    .selectFrom("bookings")
    .where("customer_email", "=", email)
    .selectAll()
    .execute();
}

export async function createBooking(booking: NewBooking): Promise<Booking> {
  return await db
    .insertInto("bookings")
    .values(booking)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateBooking(
  id: number,
  updateWith: BookingUpdate,
): Promise<void> {
  await db
    .updateTable("bookings")
    .set({
      ...updateWith,
      updated_at: sql`now()`,
    })
    .where("id", "=", id)
    .execute();
}
