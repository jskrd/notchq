import Heading2 from "@repo/book/components/heading-2";
import Paragraph from "@repo/book/components/paragraph";
import { BREAKPOINTS } from "@repo/book/lib/breakpoints";
import type { Business, Offering } from "@repo/db/types";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  business: Business;
  offering: Offering;
};

export default function Card({ business, offering }: Props): ReactNode {
  const truncatedDescription =
    offering.description.length > 200
      ? offering.description.slice(0, 200)
      : offering.description;

  return (
    <Link
      href={`/${business.slug}/${offering.slug}`}
      key={offering.id}
      className="rounded-21 group relative aspect-square w-full overflow-hidden shadow-lg transition-all duration-50 ease-in-out hover:scale-[1.02] hover:shadow-2xl sm:w-[calc(50%-(var(--spacing-21))/2)] lg:w-[calc(33.333%-(var(--spacing-21))*2/3)]"
      style={{
        border: offering.image_accent_color
          ? `5px solid ${offering.image_accent_color}`
          : undefined,
      }}
    >
      {offering.image_url && (
        <Image
          className="object-cover"
          src={offering.image_url}
          alt=""
          fill
          sizes={`(max-width: ${BREAKPOINTS.sm}) 100vw, (max-width: ${BREAKPOINTS.lg}) 50vw, 33vw`}
        />
      )}
      <div
        className="absolute inset-0 flex items-end justify-start"
        style={
          offering.image_accent_color
            ? {
                backgroundImage: `linear-gradient(to bottom, transparent 50%, ${offering.image_accent_color})`,
              }
            : {}
        }
      >
        <div className="p-13">
          <Heading2 className="text-34! font-bold text-white text-shadow-lg">
            {offering.name}
          </Heading2>
          <Paragraph className="line-clamp-2 text-white text-shadow-md">
            {truncatedDescription}
          </Paragraph>
        </div>
      </div>
    </Link>
  );
}
