import { z } from "@hono/zod-openapi";
import type { Offering } from "@repo/db";

export const offeringSchema = z
  .object({
    id: z.number(),
    business_id: z.number(),
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    image_url: z.string().nullable(),
    accent_color: z.string().nullable(),
    timezone: z.string(),
    currency: z.string(),
    created_at: z.string(),
  })
  .openapi("Offering");

export function offeringResource(
  offering: Offering,
): z.infer<typeof offeringSchema> {
  return {
    id: offering.id,
    business_id: offering.business_id,
    slug: offering.slug,
    name: offering.name,
    description: offering.description,
    image_url: offering.image_url,
    accent_color: offering.accent_color,
    timezone: offering.timezone,
    currency: offering.currency,
    created_at: offering.created_at.toISOString(),
  };
}

export function offeringCollection(offerings: Offering[]) {
  return offerings.map(offeringResource);
}
