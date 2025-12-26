import Card from "@repo/book/app/[business]/_components/card";
import { db } from "@repo/db/database";
import type { Business } from "@repo/db/types";
import type { Offering } from "@repo/db/types";
import type { ReactNode } from "react";

type Props = {
  business: Business;
};

export default async function Offerings({
  business,
}: Props): Promise<ReactNode> {
  const offerings = await getOfferings(business.id);

  return offerings.map((offering) => {
    return <Card key={offering.id} business={business} offering={offering} />;
  });
}

async function getOfferings(businessId: number): Promise<Offering[]> {
  return await db
    .selectFrom("offerings")
    .where("business_id", "=", businessId)
    .orderBy("name", "asc")
    .selectAll()
    .execute();
}
