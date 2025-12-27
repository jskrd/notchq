import SlotPicker from "@repo/book/app/[business]/[offering]/_components/slot-picker";
import { getOffering } from "@repo/book/app/[business]/[offering]/_lib/get-offering";
import { getBusiness } from "@repo/book/app/[business]/_lib/get-business";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  params: Promise<{ business: string; offering: string }>;
};

export default async function Offering({ params }: Props): Promise<ReactNode> {
  const { business: businessSlug, offering: offeringSlug } = await params;

  const business = await getBusiness(businessSlug);
  if (!business) {
    notFound();
  }

  const offering = await getOffering(business.id, offeringSlug);
  if (!offering) {
    notFound();
  }

  return (
    <div className="container mx-auto px-21">
      <h1 className="text-34 leading-34 font-bold">{offering.name}</h1>
      <p className="text-21 mt-21 leading-34">{offering.description}</p>
      <div className="mt-55 w-full">
        <SlotPicker offeringId={offering.id} />
      </div>
    </div>
  );
}
