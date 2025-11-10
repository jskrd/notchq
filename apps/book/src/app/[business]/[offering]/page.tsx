import SlotPicker from "@repo/book/app/[business]/[offering]/_components/slot-picker";
import { slugSchema } from "@repo/book/lib/schema/slug";
import { findBusinessBySlug } from "@repo/db/repositories/business";
import { findOfferingBySlug } from "@repo/db/repositories/offering";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { z } from "zod";

const paramsSchema = z.object({
  business: slugSchema,
  offering: slugSchema,
});

type Props = {
  params: Promise<z.infer<typeof paramsSchema>>;
};

export default async function Offering({ params }: Props): Promise<ReactNode> {
  const { business: businessSlug, offering: offeringSlug } =
    await validateParams(params);

  const business = await findBusinessBySlug(businessSlug);
  if (!business) {
    notFound();
  }

  const offering = await findOfferingBySlug(business.id, offeringSlug);
  if (!offering) {
    notFound();
  }

  return (
    <div className="container mx-auto px-21 py-55">
      <div className="h-34">
        <Image
          src="/toyota.png"
          alt={business.name}
          width={205.5}
          height={34}
          priority
        />
      </div>
      <h1 className="mt-55 font-bold text-34 leading-34">{offering.name}</h1>
      <p className="mt-21 text-21 leading-34">{offering.description}</p>
      <div className="mt-55 w-full">
        <SlotPicker offeringId={offering.id} />
      </div>
    </div>
  );
}

async function validateParams(
  params: Props["params"],
): Promise<z.infer<typeof paramsSchema>> {
  const result = paramsSchema.safeParse(await params);
  if (!result.success) {
    notFound();
  }
  return result.data;
}
