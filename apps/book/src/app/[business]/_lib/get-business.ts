import { apiClient } from "@repo/api-client/client";

export interface Business {
  id: number;
  slug: string;
  name: string;
  created_at: Date;
}

export async function getBusiness(slug: string): Promise<Business | undefined> {
  const { data, error } = await apiClient().GET("/businesses", {
    params: { query: { slug } },
    next: { revalidate: 60 },
  });

  if (error) {
    throw new Error(`Failed to fetch business`);
  }

  const business = data.data[0];
  if (!business) {
    return undefined;
  }

  return {
    ...business,
    created_at: new Date(business.created_at),
  };
}
