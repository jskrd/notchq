"use client";

import { getAvailableSlots } from "@repo/book/app/[business]/[offering]/_actions/get-available-slots";
import { LoaderCircle } from "lucide-react";
import {
  useEffect,
  useState,
  useTransition,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type AvailableSlot = Awaited<
  ReturnType<typeof getAvailableSlots>
>[number];

type Props = {
  offeringId: number;
  date: string;
  setSelectedSlot: Dispatch<SetStateAction<AvailableSlot | null>>;
};

type State = {
  selectedSlot: AvailableSlot | null;
  setSelectedSlot: Dispatch<SetStateAction<AvailableSlot | null>>;
};

export default function AvailableSlots({
  offeringId,
  date,
  setSelectedSlot,
}: Props): ReactNode {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[] | null>(
    null,
  );

  const [isFetching, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      (async () => {
        const slots = await getAvailableSlots({
          offeringId,
          date: new Date(date).toISOString().split("T")[0],
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
            <button
              key={availableSlot.id}
              className="text-21 flex h-55 w-full cursor-pointer items-center justify-center rounded-full border border-black px-21 text-blue-700 transition-colors duration-50 hover:bg-blue-100 hover:text-blue-800"
              onClick={() => setSelectedSlot(availableSlot)}
            >
              {availableSlot.start.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              &ndash;{" "}
              {new Date(
                availableSlot.start.getTime() +
                  availableSlot.duration * 60 * 1000,
              ).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export function useAvailableSlots(): State {
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  return { selectedSlot, setSelectedSlot };
}
