import Heading2 from "@repo/book/components/heading-2";
import Paragraph from "@repo/book/components/paragraph";
import { BREAKPOINTS } from "@repo/book/lib/breakpoints";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export type CardProps = {
  linkUrl: string;
  imageUrl: string | null;
  tagline: string | null;
  heading: string | null;
  description: string | null;
  accentColor: string | null;
};

export default function Card({
  linkUrl,
  imageUrl,
  tagline,
  heading,
  description,
  accentColor,
}: CardProps): ReactNode {
  accentColor = accentColor || "--var(--gray)";

  return (
    <Link
      href={linkUrl}
      className="rounded-21 group relative aspect-square w-full overflow-hidden sm:w-[calc(50%-(var(--spacing-21))/2)] lg:w-[calc(33.333%-(var(--spacing-21))*2/3)]"
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
        className={
          "absolute inset-0 flex flex-col items-start " +
          (tagline ? "justify-between" : "justify-end")
        }
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 50%, ${accentColor})`,
        }}
      >
        {tagline && (
          <div
            className="text-13 rounded-br-21 px-13 py-3 font-semibold tracking-wide text-white uppercase"
            style={{
              backgroundColor: accentColor,
            }}
          >
            {tagline}
          </div>
        )}

        <div className="flex w-full flex-col gap-8 p-13 *:my-0">
          {heading && (
            <Heading2 className="text-34! font-bold text-white text-shadow-lg group-hover:underline">
              {heading}
            </Heading2>
          )}
          {description && (
            <Paragraph className="line-clamp-2 text-white opacity-90 text-shadow-md">
              {description.slice(0, 128)}
            </Paragraph>
          )}
        </div>
      </div>
    </Link>
  );
}
