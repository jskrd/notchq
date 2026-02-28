"use server";

import { env } from "@repo/book/lib/env";
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
  id: z.number().int().positive(),
});

export async function getSlot(data: unknown): Promise<Slot | null> {
  const { id } = schema.parse(data);

  const response = await fetch(`${env().API_URL}/slots/${id}`);

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as { data: ApiSlot };

  return {
    ...json.data,
    start: new Date(json.data.start),
    created_at: new Date(json.data.created_at),
  };
}
