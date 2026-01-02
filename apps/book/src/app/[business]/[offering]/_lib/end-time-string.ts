import type { AvailableSlot } from "@repo/book/app/[business]/[offering]/_actions/get-available-slots";

export function endTimeString(availableSlot: AvailableSlot): string {
  return new Date(
    availableSlot.start.getTime() + availableSlot.duration * 60 * 1000,
  ).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
