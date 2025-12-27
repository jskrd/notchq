import Offerings from "./_components/offerings";
import Container from "@repo/book/app/[business]/_components/container";
import Skeleton from "@repo/book/app/[business]/_components/skeleton";
import getBusiness from "@repo/book/app/[business]/_lib/get-business";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";

type Props = {
  params: Promise<{ business: string }>;
};

export default async function Page({ params }: Props): Promise<ReactNode> {
  const { business: businessSlug } = await params;

  const business = await getBusiness(businessSlug);
  if (!business) {
    notFound();
  }

  return (
    <Container>
      <Suspense fallback={<Skeleton />}>
        <Offerings business={business} />
      </Suspense>
    </Container>
  );
}
