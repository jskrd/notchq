import getBusiness from "@repo/book/app/[business]/_lib/get-business";
import { slugSchema } from "@repo/book/lib/slug";
import { Business } from "@repo/db/types";
import Image from "next/image";
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

  const image = getBusinessImage(business);
  if (!image) {
    throw new Error(`No image found for business ${business.slug}`);
  }

  return (
    <>
      <header className="container mx-auto flex items-center justify-center px-21 py-55">
        <Image
          src={image.src}
          alt={business.name}
          width={image.width}
          height={image.height}
        />
      </header>
      {children}
    </>
  );
}

function getBusinessImage(business: Business): {
  src: string;
  width: number;
  height: number;
} | null {
  if (business.slug === "lba") {
    return { src: "/lba.png", width: 283, height: 55 };
  }

  if (business.slug === "pooch-parks") {
    return { src: "/pooch-parks.png", width: 197, height: 55 };
  }

  if (business.slug.startsWith("true-")) {
    return { src: "/true.png", width: 133, height: 55 };
  }

  return null;
}
