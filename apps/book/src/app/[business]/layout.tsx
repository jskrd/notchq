import Footer from "@repo/book/app/[business]/_components/footer";
import Header from "@repo/book/app/[business]/_components/header";
import { getBusiness } from "@repo/book/app/[business]/_lib/get-business";
import { slugSchema } from "@repo/book/lib/slug";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { z } from "zod";

type Props = {
  children: ReactNode;
  params: Promise<unknown>;
};

export default async function Layout({
  children,
  params,
}: Props): Promise<ReactNode> {
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
    <>
      <Header business={business} />
      <main className="container mx-auto">{children}</main>
      <Footer />
    </>
  );
}
