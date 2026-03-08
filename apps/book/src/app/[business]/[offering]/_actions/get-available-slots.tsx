"use server";

import { apiClient } from "@repo/api-client/client";
import z from "zod";

export interface AvailableSlot {
  id: number;
  start: Date;
  duration: number;
}

const schema = z.object({
  offeringId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function getAvailableSlots(
  data: unknown,
): Promise<AvailableSlot[]> {
  const { offeringId, date } = schema.parse(data);

  const { data: responseData, error } = await apiClient().GET(
    "/offerings/{id}/slots",
    {
      params: { path: { id: offeringId }, query: { date } },
    },
  );

  if (error) {
    return [];
  }

  return responseData.data.map((slot) => ({
    id: slot.id,
    start: new Date(slot.start),
    duration: slot.duration,
  }));
}
