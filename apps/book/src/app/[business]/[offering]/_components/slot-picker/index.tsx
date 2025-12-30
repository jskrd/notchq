"use client";

import AvailableDays, {
  useAvailableDays,
} from "@repo/book/app/[business]/[offering]/_components/slot-picker/available-days";
import AvailableSlots, {
  useAvailableSlots,
} from "@repo/book/app/[business]/[offering]/_components/slot-picker/available-slots";

type Props = {
  offeringId: number;
};

export default function SlotPicker({ offeringId }: Props) {
  const { selectedDate, setSelectedDate } = useAvailableDays();
  const { selectedSlot, setSelectedSlot } = useAvailableSlots();

  return (
    <div className="grid grid-cols-2 gap-34">
      <AvailableDays
        className="col-span-2 md:col-span-1"
        selected={selectedDate}
        setSelected={setSelectedDate}
      />
      <div className="col-span-2 space-y-21 overflow-y-auto md:col-span-1">
        <div className="text-21 text-center leading-34 font-bold">
          {selectedDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            weekday: "long",
          })}
        </div>
        <AvailableSlots
          offeringId={offeringId}
          date={selectedDate.toISOString()}
          setSelectedSlot={setSelectedSlot}
        />
      </div>
    </div>
  );
}
