import Heading2 from "@repo/book/components/heading-2";
import Paragraph from "@repo/book/components/paragraph";
import { BREAKPOINTS } from "@repo/book/lib/breakpoints";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export type CardProps = {
  linkUrl: string;
  imageUrl: string | null;
  heading: string | null;
  description: string | null;
  accentColor: string | null;
};

export default function Card({
  linkUrl,
  imageUrl,
  heading,
  description,
  accentColor,
}: CardProps): ReactNode {
  accentColor = accentColor || "--var(--gray)";

  return (
    <Link
      href={linkUrl}
      className="rounded-21 group relative aspect-square w-full overflow-hidden shadow-lg transition-all duration-50 ease-in-out hover:scale-[1.02] hover:shadow-2xl sm:w-[calc(50%-(var(--spacing-21))/2)] lg:w-[calc(33.333%-(var(--spacing-21))*2/3)]"
      style={{
        border: `5px solid ${accentColor}`,
      }}
    >
      {imageUrl && (
        <Image
          className="object-cover"
          src={imageUrl}
          alt=""
          fill
          sizes={`(max-width: ${BREAKPOINTS.sm}) 100vw, (max-width: ${BREAKPOINTS.lg}) 50vw, 33vw`}
        />
      )}

      <div
        className="absolute inset-0 flex items-end justify-start"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 50%, ${accentColor})`,
        }}
      >
        <div className="p-13">
          {heading && (
            <Heading2 className="text-34! font-bold text-white text-shadow-lg">
              {heading}
            </Heading2>
          )}
          {description && (
            <Paragraph className="line-clamp-2 text-white text-shadow-md">
              {description.slice(0, 128) + "..."}
            </Paragraph>
          )}
        </div>
      </div>
    </Link>
  );
}
