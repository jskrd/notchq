import type { Business } from "@repo/book/app/[business]/_lib/get-business";
import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  business: Business;
};

export default async function Header({ business }: Props): Promise<ReactNode> {
  const image = getBusinessImage(business);
  if (!image) {
    throw new Error(`No image found for business "${business.slug}"`);
  }

  return (
    <header className="container mx-auto flex items-center justify-center px-21 py-55">
      <Image
        src={image.src}
        alt={business.name}
        width={image.width}
        height={image.height}
      />
    </header>
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

  if (business.slug === "the-big-london-bake") {
    return { src: "/the-big-london-bake.png", width: 79, height: 55 };
  }

  if (business.slug.startsWith("true-")) {
    return { src: "/true.png", width: 133, height: 55 };
  }

  return null;
}
