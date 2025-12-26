import { BREAKPOINTS } from "@repo/book/lib/breakpoints";
import type { Business, Offering } from "@repo/db/types";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  business?: Business;
  offering?: Offering;
};

export default function Card({ business, offering }: Props): ReactNode {
  const baseClassName =
    "rounded-21 group relative aspect-[calc(1.618/1)] w-full overflow-hidden sm:w-[calc(50%-theme(spacing.21)/2)] lg:w-[calc(33.333%-theme(spacing.21)*2/3)]";

  if (!business || !offering) {
    return <div className={`${baseClassName} animate-pulse bg-gray-300`} />;
  }

  return (
    <Link
      href={`/${business.slug}/${offering.slug}`}
      key={offering.id}
      className={baseClassName}
    >
      <Image
        className="object-cover"
        src={`https://picsum.photos/seed/${offering.id}/1024/1024`}
        alt=""
        fill
        sizes={`(max-width: ${BREAKPOINTS.sm}) 100vw, (max-width: ${BREAKPOINTS.lg}) 50vw, 33vw`}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <h2 className="text-21 font-bold text-white drop-shadow group-hover:underline group-hover:underline-offset-8">
          {offering.name}
        </h2>
      </div>
    </Link>
  );
}
