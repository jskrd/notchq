import { tokenResource, tokenSchema } from "../resources/index.ts";
import { type RouteHandler, createRoute, z } from "@hono/zod-openapi";
import {
  dummyVerifyPassword,
  generateToken,
  hashValidator,
  parseToken,
  tokenExpiresAt,
  verifyPassword,
} from "@repo/auth";
import { db } from "@repo/db";

export const createTokenRoute = createRoute({
  method: "post",
  path: "/tokens",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.email(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({ data: tokenSchema }),
        },
      },
      description: "Token",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
      description: "Unauthorized",
    },
    422: {
      description: "Validation error",
    },
  },
});

export const createTokenHandler: RouteHandler<typeof createTokenRoute> = async (
  c,
) => {
  const { email, password } = c.req.valid("json");

  const user = await db()
    .selectFrom("users")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();
  if (!user) {
    await dummyVerifyPassword();
    return c.json({ error: "Unauthorized" }, 401);
  }

  const valid = await verifyPassword(user.password, password);
  if (!valid) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = generateToken();

  const parsed = parseToken(token);
  if (!parsed) {
    throw new Error("Invalid token");
  }

  const row = await db()
    .insertInto("tokens")
    .values({
      user_id: user.id,
      selector: parsed.selector,
      validator_hash: hashValidator(parsed.validator),
      expires_at: tokenExpiresAt().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return c.json({ data: tokenResource({ ...row, token }) }, 201);
};
