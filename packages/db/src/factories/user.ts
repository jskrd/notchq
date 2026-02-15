import { faker } from "@faker-js/faker";
import { hashPassword } from "@repo/auth/password";
import { db } from "@repo/db/database";
import type { NewUser, User } from "@repo/db/types";

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
