import { z } from "@hono/zod-openapi";
import type { User } from "@repo/db";

export const userSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .openapi("User");

export function userResource(user: User): z.infer<typeof userSchema> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  };
}
