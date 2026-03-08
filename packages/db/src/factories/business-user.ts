import { db } from "../database.ts";
import type { BusinessUser, NewBusinessUser } from "../types.ts";
import { createBusiness } from "./business.js";
import { createUser } from "./user.js";

export async function createBusinessUser(
  overrides: Partial<NewBusinessUser> = {},
): Promise<BusinessUser> {
  return db()
    .insertInto("business_users")
    .values({
      business_id: overrides.business_id ?? (await createBusiness()).id,
      user_id: overrides.user_id ?? (await createUser()).id,
      ...overrides,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
