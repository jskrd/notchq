import OfferingsInfiniteScroll from "@repo/book/app/[business]/_components/offerings-infinite-scroll";
import { getOfferings } from "@repo/book/app/[business]/_lib/get-offerings";
import type { Business } from "@repo/db/types";
import type { ReactNode } from "react";

type Props = {
  business: Business;
};

export default async function Offerings({
  business,
}: Props): Promise<ReactNode> {
  const initialOfferings = await getOfferings(business.id, 12, 0);

  return (
    <OfferingsInfiniteScroll
      business={business}
      initialOfferings={initialOfferings}
      initialHasMore={initialOfferings.length === 12}
    />
  );
}
