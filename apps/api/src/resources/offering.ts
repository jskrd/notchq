import type { Offering } from "@repo/rdb/types";

export function offeringResource(offering: Offering) {
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
    created_at: offering.created_at,
  };
}

export function offeringCollection(offerings: Offering[]) {
  return offerings.map(offeringResource);
}
