import {
  tokenResource,
  tokenSchema,
  userResource,
  userSchema,
} from "../resources/index.ts";
import { type RouteHandler, createRoute, z } from "@hono/zod-openapi";
import {
  generateToken,
  hashPassword,
  hashValidator,
  parseToken,
  tokenExpiresAt,
} from "@repo/auth";
import { db } from "@repo/db";

export const createUserRoute = createRoute({
  method: "post",
  path: "/users",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string(),
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
          schema: z.object({
            data: userSchema.extend({ token: tokenSchema }),
          }),
        },
      },
      description: "User",
    },
    409: {
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
      description: "Conflict",
    },
    422: {
      description: "Validation error",
    },
  },
});

export const createUserHandler: RouteHandler<typeof createUserRoute> = async (
  context,
) => {
  const { name, email, password } = context.req.valid("json");

  const existing = await db()
    .selectFrom("users")
    .where("email", "=", email)
    .select("id")
    .executeTakeFirst();
  if (existing) {
    return context.json({ error: "Conflict" }, 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await db()
    .insertInto("users")
    .values({ name, email, password: hashedPassword })
    .returningAll()
    .executeTakeFirstOrThrow();

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

  return context.json(
    {
      data: {
        ...userResource(user),
        token: tokenResource({ ...row, token }),
      },
    },
    201,
  );
};
