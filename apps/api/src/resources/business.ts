import type { Business } from "@repo/rdb/types";

export function businessResource(business: Business) {
  return {
    id: business.id,
    slug: business.slug,
    name: business.name,
    created_at: business.created_at,
  };
}

export function businessCollection(businesses: Business[]) {
  return businesses.map(businessResource);
}
