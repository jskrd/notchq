"use server";

import { apiClient } from "@repo/api-client";
import z from "zod";

export interface Slot {
  id: number;
  offering_id: number;
  start: Date;
  duration: number;
  price: number;
  capacity: number | null;
  created_at: Date;
}

const schema = z.object({
  id: z.number().int().positive(),
});

export async function getSlot(data: unknown): Promise<Slot | null> {
  const { id } = schema.parse(data);

  const { data: responseData, error } = await apiClient().GET("/slots/{id}", {
    params: { path: { id } },
  });

  if (error || !responseData) {
    return null;
  }

  return {
    ...responseData.data,
    start: new Date(responseData.data.start),
    created_at: new Date(responseData.data.created_at),
  };
}
