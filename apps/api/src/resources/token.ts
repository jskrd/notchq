import { z } from "@hono/zod-openapi";
import type { Token } from "@repo/db";

export const tokenSchema = z
  .object({
    token: z.string().optional(),
    created_at: z.string(),
    expires_at: z.string(),
    last_used_at: z.string().nullable(),
  })
  .openapi("Token");

export function tokenResource(
  token: Token & { token?: string },
): z.infer<typeof tokenSchema> {
  return {
    token: token.token,
    created_at: token.created_at.toISOString(),
    expires_at: token.expires_at.toISOString(),
    last_used_at: token.last_used_at?.toISOString() ?? null,
  };
}
