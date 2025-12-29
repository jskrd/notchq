"use client";

import { getSlots } from "@repo/book/app/[business]/[offering]/_actions/get-slots";
import type { Slot } from "@repo/db/types";
import { LoaderCircle } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { DayPicker } from "react-day-picker";

type SlotPickerProps = {
  offeringId: number;
};

export default function SlotPicker({ offeringId }: SlotPickerProps) {
  const [selected, setSelected] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Pick<Slot, "id" | "start" | "duration">[]>(
    [],
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
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

  return (
    <div className="grid grid-cols-2 gap-34">
      <DayPicker
        classNames={{
          button_next: `size-34 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full transition-colors duration-50`,
          button_previous: `size-34 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full transition-colors duration-50`,
          chevron: "size-21",
          day: "h-55 text-center",
          day_button: `size-34 text-21 leading-21 font-light cursor-pointer hover:bg-gray-100 rounded-full transition-colors duration-50`,
          disabled: "*:line-through",
          month_caption: "text-21 leading-34 font-bold col-span-2",
          month_grid: "w-full mt-34 col-span-3",
          month: "grid grid-cols-3",
          nav: "h-34 flex justify-end space-x-21",
          outside: "text-gray-400",
          root: "col-span-2 md:col-span-1",
          selected: "*:bg-blue-100 hover:*:bg-blue-200",
          today: "*:bg-blue-700 hover:*:bg-blue-800 *:text-white",
          weekday: "w-1/7 pb-21",
          weekdays: "text-21 leading-21 font-bold",
        }}
        disabled={{ before: new Date() }}
        fixedWeeks={true}
        mode="single"
        navLayout="after"
        onSelect={setSelected}
        required={true}
        selected={selected}
        showOutsideDays={true}
        weekStartsOn={1}
      />
      <div className="col-span-2 space-y-21 overflow-y-auto md:col-span-1">
        <div className="text-21 text-center leading-34 font-bold">
          {selected.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            weekday: "long",
          })}
        </div>
        {isPending ? (
          <div className="flex h-55 items-center justify-center">
            <LoaderCircle className="size-34 animate-spin" />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-21 flex h-55 items-center justify-center">
            No slots found for this date
          </div>
        ) : (
          <div className="space-y-13">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="text-21 flex h-55 cursor-pointer items-center justify-center rounded-full border border-black px-21 text-blue-700 transition-colors duration-50 hover:bg-blue-100 hover:text-blue-800"
              >
                {slot.start.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                &ndash;{" "}
                {new Date(
                  slot.start.getTime() + slot.duration * 60 * 1000,
                ).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
