import { db } from "../database.ts";
import type { Token } from "../types.ts";
import { createUser } from "./user.ts";
import {
  generateToken,
  hashValidator,
  parseToken,
  tokenExpiresAt,
} from "@repo/auth";

export async function createToken(
  overrides: { user_id?: number } = {},
): Promise<{ token: Token; rawToken: string }> {
  const userId = overrides.user_id ?? (await createUser()).id;

  const rawToken = generateToken();
  const parsed = parseToken(rawToken)!;

  const token = await db()
    .insertInto("tokens")
    .values({
      user_id: userId,
      selector: parsed.selector,
      validator_hash: hashValidator(parsed.validator),
      expires_at: tokenExpiresAt().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return { token, rawToken };
}
