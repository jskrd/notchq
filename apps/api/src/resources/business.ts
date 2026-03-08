import { z } from "@hono/zod-openapi";
import type { Business } from "@repo/db";

export const businessSchema = z
  .object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    created_at: z.string(),
  })
  .openapi("Business");

export function businessResource(
  business: Business,
): z.infer<typeof businessSchema> {
  return {
    id: business.id,
    slug: business.slug,
    name: business.name,
    created_at: business.created_at.toISOString(),
  };
}

export function businessCollection(businesses: Business[]) {
  return businesses.map(businessResource);
}
