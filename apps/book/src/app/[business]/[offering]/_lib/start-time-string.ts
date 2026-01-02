import type { AvailableSlot } from "@repo/book/app/[business]/[offering]/_actions/get-available-slots";

export function startTimeString(availableSlot: AvailableSlot): string {
  return availableSlot.start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
