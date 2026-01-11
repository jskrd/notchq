import InfiniteScroll from "@repo/book/app/[business]/_components/infinite-scroll";
import { getBusiness } from "@repo/book/app/[business]/_lib/get-business";
import { getOfferings } from "@repo/book/app/[business]/_lib/get-offerings";
import { slugSchema } from "@repo/book/lib/slug";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { z } from "zod";

type Props = {
  params: Promise<unknown>;
};

export default async function Page({ params }: Props): Promise<ReactNode> {
  const { success, data } = z
    .object({ business: slugSchema })
    .safeParse(await params);
  if (!success) {
    notFound();
  }

  const business = await getBusiness(data.business);
  if (!business) {
    notFound();
  }

  const initialOfferings = await getOfferings(business.id, 12, 0);

  return (
    <InfiniteScroll
      business={business}
      initialOfferings={initialOfferings}
      initialHasMore={initialOfferings.length === 12}
    />
  );
}
