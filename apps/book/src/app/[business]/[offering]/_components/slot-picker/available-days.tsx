"use client";

import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { DayPicker } from "react-day-picker";

type Props = {
  className: string;
  selected: Date;
  setSelected: Dispatch<SetStateAction<Date>>;
};

type State = {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
};

export default function AvailableDays({
  className,
  selected,
  setSelected,
}: Props): ReactNode {
  return (
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
        root: className,
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
  );
}

export function useAvailableDays(): State {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return { selectedDate, setSelectedDate };
}
