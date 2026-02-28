import { env } from "@repo/book/lib/env";

export interface Business {
  id: number;
  slug: string;
  name: string;
  created_at: Date;
}

interface ApiBusiness {
  id: number;
  slug: string;
  name: string;
  created_at: string;
}

export async function getBusiness(slug: string): Promise<Business | undefined> {
  const response = await fetch(
    `${env().API_URL}/businesses?slug=${encodeURIComponent(slug)}`,
    { next: { revalidate: 60 } },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch business: ${response.status}`);
  }

  const json = (await response.json()) as { data: ApiBusiness[] };

  const business = json.data[0];
  if (!business) {
    return undefined;
  }

  return {
    ...business,
    created_at: new Date(business.created_at),
  };
}
