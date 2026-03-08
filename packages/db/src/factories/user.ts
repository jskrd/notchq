import { db } from "../database.ts";
import type { NewUser, User } from "../types.ts";
import { faker } from "@faker-js/faker";
import { hashPassword } from "@repo/auth";

export async function createUser(
  overrides: Partial<NewUser> = {},
): Promise<User> {
  return db()
    .insertInto("users")
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      email_verified_at: null,
      ...overrides,
      password: await hashPassword(overrides.password ?? "password"),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
