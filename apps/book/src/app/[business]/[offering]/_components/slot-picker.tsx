"use client";

import { getSlots } from "@repo/book/app/[business]/[offering]/_actions/get-slots";
import type { Slot } from "@repo/db/types";
import { useState, useEffect, useTransition } from "react";
import { DayPicker } from "react-day-picker";

type SlotPickerProps = {
  offeringId: number;
};

export default function SlotPicker({ offeringId }: SlotPickerProps) {
  const [selected, setSelected] = useState<Date | undefined>();
  const [slots, setSlots] = useState<Pick<Slot, "id" | "start" | "duration">[]>(
    [],
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!selected) {
      return;
    }

    let cancelled = false;

    startTransition(() => {
      const dateString = selected.toISOString().split("T")[0];
      getSlots({ offeringId, date: dateString }).then((result) => {
        if (cancelled) return;

        if (result.success) {
          setSlots(result.data);
        } else {
          console.error(result.message);
          setSlots([]);
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [selected, offeringId]);

  const buttonClassNames =
    "relative after:h-3 after:bg-black after:absolute after:bottom-[-3px] after:left-[0%] after:right-[0%] after:opacity-0 hover:after:opacity-100 cursor-pointer";

  return (
    <div className="grid grid-cols-2 gap-34">
      <DayPicker
        classNames={{
          button_next: `h-34 w-34 flex items-center justify-center ${buttonClassNames}`,
          button_previous: `h-34 w-34 flex items-center justify-center ${buttonClassNames}`,
          chevron: "w-34 h-34",
          day_button: `h-55 w-full text-21 leading-21 font-light ${buttonClassNames}`,
          month_caption: "text-34 leading-34 font-bold col-span-2",
          month_grid: "w-full mt-34 col-span-3",
          month: "grid grid-cols-3",
          nav: "h-34 flex justify-end space-x-21",
          outside: "text-gray-400",
          root: "col-span-2 tablet:col-span-1",
          selected:
            "relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1/2 before:-translate-x-1/2 before:h-34 before:w-34 before:outline before:outline-2 before:outline-black before:outline-offset-2 before:rounded-full",
          today:
            "text-white relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1/2 before:-translate-x-1/2 before:h-34 before:w-34 before:bg-black before:rounded-full",
          weekday: "w-1/7 pb-21",
          weekdays: "text-21 leading-21 font-bold",
        }}
        fixedWeeks={true}
        mode="single"
        navLayout="after"
        onSelect={setSelected}
        selected={selected}
        showOutsideDays={true}
        weekStartsOn={1}
      />
      {selected && (
        <div className="tablet:col-span-1 col-span-2 max-h-[440px] space-y-13 overflow-y-auto">
          {isPending ? (
            <div className="text-21 flex h-55 items-center justify-center">
              Loading slots...
            </div>
          ) : slots.length === 0 ? (
            <div className="text-21 flex h-55 items-center justify-center">
              No slots available
            </div>
          ) : (
            slots.map((slot) => (
              <div
                key={slot.id}
                className="flex h-55 items-center border border-gray-300 px-21"
              >
                {slot.start.toLocaleTimeString()} - {slot.duration}m
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
