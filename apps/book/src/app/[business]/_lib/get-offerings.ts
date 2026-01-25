import { env } from "@repo/book/lib/env";
import { extractImageColorAccent } from "@repo/book/lib/extract-image-accent-color";
import { unstable_cache } from "next/cache";

export interface Offering {
  id: number;
  business_id: number;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  accent_color: string | null;
  timezone: string;
  currency: string;
  created_at: Date;
}

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

const getCachedImageAccentColor = unstable_cache(
  async (url: string) => extractImageColorAccent(url),
  ["image-accent-color"],
  {
    revalidate: false, // Never revalidate since image URLs are deterministic
    tags: ["image-colors"],
  },
);

export async function getOfferings(
  businessId: number,
  limit: number,
  offset: number,
): Promise<Offering[]> {
  const response = await fetch(
    `${env().API_URL}/v1/businesses/${businessId}/offerings?limit=${limit}&offset=${offset}`,
    { next: { revalidate: 60 } },
  );

  if (!response.ok) {
    return [];
  }

  const json = (await response.json()) as { data: ApiOffering[] };
  const offerings: Offering[] = json.data.map((offering) => ({
    ...offering,
    created_at: new Date(offering.created_at),
  }));

  await Promise.all(
    offerings.map(async (offering) => {
      offering.image_url = `https://picsum.photos/seed/${offering.id}/1024/1024`;
      offering.accent_color = offering.image_url
        ? await getCachedImageAccentColor(offering.image_url)
        : null;
    }),
  );

  return offerings;
}
