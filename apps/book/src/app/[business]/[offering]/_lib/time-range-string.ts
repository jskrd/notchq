import type { AvailableSlot } from "@repo/book/app/[business]/[offering]/_actions/get-available-slots";
import { endTimeString } from "@repo/book/app/[business]/[offering]/_lib/end-time-string";
import { startTimeString } from "@repo/book/app/[business]/[offering]/_lib/start-time-string";

export function timeRangeString(availableSlot: AvailableSlot): string {
  return `${startTimeString(availableSlot)} – ${endTimeString(availableSlot)}`;
}
