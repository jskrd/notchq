"use server";

import {
  getOfferings,
  type Offering,
} from "@repo/book/app/[business]/_lib/get-offerings";
import { z } from "zod";

const schema = z.object({
  businessId: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
});

export async function loadMoreOfferings(data: unknown): Promise<Offering[]> {
  const { businessId, offset } = schema.parse(data);

  return await getOfferings(businessId, 12, offset);
}
