import { faker } from "@faker-js/faker";
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
      password: faker.string.alphanumeric(60),
      email_verified_at: null,
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
