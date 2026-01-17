import { getDb } from "@repo/db/database";
import type { NewUser, User, UserUpdate } from "@repo/db/types";
import { sql } from "kysely";

export async function findUserById(id: number): Promise<User | undefined> {
  return await getDb()
    .selectFrom("users")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findUserByEmail(
  email: string,
): Promise<User | undefined> {
  return await getDb()
    .selectFrom("users")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();
}

export async function createUser(user: NewUser): Promise<User> {
  return await getDb()
    .insertInto("users")
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateUser(
  id: number,
  updateWith: UserUpdate,
): Promise<void> {
  await getDb()
    .updateTable("users")
    .set({
      ...updateWith,
      updated_at: sql`now()`,
    })
    .where("id", "=", id)
    .execute();
}

export async function deleteUser(id: number): Promise<User | undefined> {
  return await getDb()
    .deleteFrom("users")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
