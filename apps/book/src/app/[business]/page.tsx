import Offerings from "@repo/book/app/[business]/_components/offerings";
import Skeleton from "@repo/book/app/[business]/_components/skeleton";
import { getBusiness } from "@repo/book/app/[business]/_lib/get-business";
import { slugSchema } from "@repo/book/lib/slug";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
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

  return (
    <Suspense fallback={<Skeleton />}>
      <Offerings business={business} />
    </Suspense>
  );
}
