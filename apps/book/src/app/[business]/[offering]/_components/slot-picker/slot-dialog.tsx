import { AvailableSlot } from "@repo/book/app/[business]/[offering]/_actions/get-available-slots";
import { getSlot } from "@repo/book/app/[business]/[offering]/_actions/get-slot";
import { dateString } from "@repo/book/app/[business]/[offering]/_lib/date-string";
import { timeDurationString } from "@repo/book/app/[business]/[offering]/_lib/time-duration-string";
import { timeRangeString } from "@repo/book/app/[business]/[offering]/_lib/time-range-string";
import { Button } from "@repo/book/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooterActions,
  DialogTitle,
  DialogTrigger,
} from "@repo/book/components/dialog";
import { Slot } from "@repo/db/types";
import { useEffect, useState, type ReactNode } from "react";
import { useTransition } from "react";

type Props = {
  selectedSlot: AvailableSlot;
  trigger: ReactNode;
};

export default function SlotDialog({
  selectedSlot,
  trigger,
}: Props): ReactNode {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [slot, setSlot] = useState<Slot | null>(null);

  const [isFetching, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      (async () => {
        const slot = await getSlot({ id: selectedSlot.id });
        setSlot(slot);
      })();
    });
  }, [selectedSlot]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>
          {dateString(selectedSlot.start)} &bull;{" "}
          {timeRangeString(selectedSlot)}
        </DialogTitle>
        {isFetching || !slot ? (
          <></>
        ) : (
          <dl className="text-21 grid grid-cols-2 gap-4">
            <dt className="font-semibold">Date:</dt>
            <dd>{dateString(slot.start)}</dd>
            <dt className="font-semibold">Time:</dt>
            <dd>
              {timeRangeString(slot)} ({timeDurationString(slot)})
            </dd>
            <dt className="font-semibold">Price:</dt>
            <dd>
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "GBP",
              }).format(slot.price / 100)}
            </dd>
          </dl>
        )}
        <DialogFooterActions>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {}}>
            Book
          </Button>
        </DialogFooterActions>
      </DialogContent>
    </Dialog>
  );
}
