"use client";

import {
  getAvailableSlots,
  type AvailableSlot,
} from "@repo/book/app/[business]/[offering]/_actions/get-available-slots";
import SlotDialog from "@repo/book/app/[business]/[offering]/_components/slot-picker/slot-dialog";
import { timeRangeString } from "@repo/book/app/[business]/[offering]/_lib/time-range-string";
import { Button } from "@repo/book/components/button";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState, useTransition, type ReactNode } from "react";

type Props = {
  offeringId: number;
  date: Date;
};

export default function AvailableSlots({ offeringId, date }: Props): ReactNode {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[] | null>(
    null,
  );

  const [isFetching, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      (async () => {
        const slots = await getAvailableSlots({
          offeringId,
          date: date.toISOString().split("T")[0],
        });
        setAvailableSlots(slots);
      })();
    });
  }, [offeringId, date]);

  return (
    <>
      {isFetching || !availableSlots ? (
        <div className="flex h-55 items-center justify-center">
          <LoaderCircle className="size-34 animate-spin" />
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="text-21 flex h-55 items-center justify-center">
          No slots found for this date
        </div>
      ) : (
        <div className="space-y-13">
          {availableSlots.map((availableSlot) => (
            <SlotDialog
              key={availableSlot.id}
              selectedSlot={availableSlot}
              trigger={
                <Button
                  variant="secondary"
                  className="w-full border border-black"
                >
                  {timeRangeString(availableSlot)}
                </Button>
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
