import { createBusiness } from "./business.js";
import { createUser } from "./user.js";
import { db } from "@repo/db/database";
import type { BusinessUser, NewBusinessUser } from "@repo/db/types";

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
