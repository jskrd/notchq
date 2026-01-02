import type { AvailableSlot } from "@repo/book/app/[business]/[offering]/_actions/get-available-slots";

export function timeDurationString(availableSlot: AvailableSlot): string {
  const start = availableSlot.start;
  const end = new Date(
    availableSlot.start.getTime() + availableSlot.duration * 60 * 1000,
  );

  const hours = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60),
  );
  const minutes = Math.floor(
    ((end.getTime() - start.getTime()) % (1000 * 60 * 60)) / (1000 * 60),
  );

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}
