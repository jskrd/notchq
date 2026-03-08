import { apiClient } from "@repo/api-client";
import type { Offering } from "@repo/book/app/[business]/_lib/get-offerings";

export async function getOffering(
  businessId: number,
  offeringSlug: string,
): Promise<Offering | undefined> {
  const { data, error } = await apiClient().GET("/businesses/{id}/offerings", {
    params: { path: { id: businessId }, query: { slug: offeringSlug } },
    next: { revalidate: 60 },
  });

  if (error) {
    return undefined;
  }

  const offering = data.data[0];
  if (!offering) {
    return undefined;
  }

  return {
    ...offering,
    created_at: new Date(offering.created_at),
  };
}
