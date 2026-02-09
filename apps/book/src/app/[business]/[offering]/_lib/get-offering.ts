import type { Offering } from "@repo/book/app/[business]/_lib/get-offerings";
import { env } from "@repo/book/lib/env";

interface ApiOffering {
  id: number;
  business_id: number;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  accent_color: string | null;
  timezone: string;
  currency: string;
  created_at: string;
}

export async function getOffering(
  businessId: number,
  offeringSlug: string,
): Promise<Offering | undefined> {
  const response = await fetch(
    `${env().API_URL}/v1/businesses/${businessId}/offerings?slug=${encodeURIComponent(offeringSlug)}`,
    { next: { revalidate: 60 } },
  );

  if (!response.ok) {
    return undefined;
  }

  const json = (await response.json()) as { data: ApiOffering[] };
  const offering = json.data[0];
  if (!offering) {
    return undefined;
  }

  return {
    ...offering,
    created_at: new Date(offering.created_at),
  };
}
