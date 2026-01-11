"use client";

import { loadMoreOfferings } from "@repo/book/app/[business]/_actions/load-more-offerings";
import Card from "@repo/book/app/[business]/_components/card";
import type { Business, Offering } from "@repo/db/types";
import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type Props = {
  business: Business;
  initialOfferings: Offering[];
  initialHasMore: boolean;
};

export default function InfiniteScroll({
  business,
  initialOfferings,
  initialHasMore,
}: Props): ReactNode {
  const [offerings, setOfferings] = useState(initialOfferings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          const newOfferings = await loadMoreOfferings({
            businessId: business.id,
            offset: offerings.length,
          });

          if (newOfferings.length === 0) {
            setHasMore(false);
          } else {
            setOfferings((prev) => [...prev, ...newOfferings]);
          }

          setIsLoading(false);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [business.id, offerings.length, hasMore, isLoading]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-21 px-21">
        {offerings.map((offering) => (
          <Card
            key={offering.slug}
            linkUrl={`/${business.slug}/${offering.slug}`}
            imageUrl={offering.image_url}
            heading={offering.name}
            description={offering.description}
            accentColor={offering.accent_color}
          />
        ))}
      </div>

      <div ref={observerTarget} className="h-1 w-full" />

      {isLoading && (
        <div className="flex w-full items-center justify-center pt-55">
          <LoaderCircle className="size-34 animate-spin" />
        </div>
      )}
    </>
  );
}
