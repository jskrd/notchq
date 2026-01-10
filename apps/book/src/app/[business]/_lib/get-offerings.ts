import { extractImageColorAccent } from "@repo/book/lib/extract-image-accent-color";
import { db } from "@repo/db/database";
import { Offering } from "@repo/db/types";
import { unstable_cache } from "next/cache";

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
  const offerings = await db
    .selectFrom("offerings")
    .where("business_id", "=", businessId)
    .where("deleted_at", "is", null)
    .orderBy("name", "asc")
    .limit(limit)
    .offset(offset)
    .selectAll()
    .execute();

  await Promise.all(
    offerings.map(async (offering) => {
      offering.image_url = `https://picsum.photos/seed/${offering.id}/1024/1024`;
      offering.image_accent_color = offering.image_url
        ? await getCachedImageAccentColor(offering.image_url)
        : null;
    }),
  );

  return offerings;
}
