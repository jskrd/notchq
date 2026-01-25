"use server";

import { env } from "@repo/book/lib/env";
import z from "zod";

export interface AvailableSlot {
  id: number;
  start: Date;
  duration: number;
}

interface ApiSlot {
  id: number;
  offering_id: number;
  start: string;
  duration: number;
  price: number;
  capacity: number | null;
  created_at: string;
}

const schema = z.object({
  offeringId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function getAvailableSlots(
  data: unknown,
): Promise<AvailableSlot[]> {
  const { offeringId, date } = schema.parse(data);

  const response = await fetch(
    `${env().API_URL}/v1/offerings/${offeringId}/slots?date=${date}`,
  );

  if (!response.ok) {
    return [];
  }

  const json = (await response.json()) as { data: ApiSlot[] };

  return json.data.map((slot) => ({
    id: slot.id,
    start: new Date(slot.start),
    duration: slot.duration,
  }));
}
