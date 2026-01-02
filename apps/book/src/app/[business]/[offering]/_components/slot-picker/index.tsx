"use client";

import AvailableDays, {
  useAvailableDays,
} from "@repo/book/app/[business]/[offering]/_components/slot-picker/available-days";
import AvailableSlots from "@repo/book/app/[business]/[offering]/_components/slot-picker/available-slots";
import { dateString } from "@repo/book/app/[business]/[offering]/_lib/date-string";

type Props = {
  offeringId: number;
};

export default function SlotPicker({ offeringId }: Props) {
  const { selectedDate, setSelectedDate } = useAvailableDays();

  return (
    <div className="grid grid-cols-2 gap-34">
      <AvailableDays
        className="col-span-2 md:col-span-1"
        selected={selectedDate}
        setSelected={setSelectedDate}
      />
      <div className="col-span-2 space-y-21 md:col-span-1">
        <div className="text-21 text-center leading-34 font-bold">
          {dateString(selectedDate)}
        </div>
        <AvailableSlots offeringId={offeringId} date={selectedDate} />
      </div>
    </div>
  );
}
