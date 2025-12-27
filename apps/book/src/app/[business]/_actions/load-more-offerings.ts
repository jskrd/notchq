"use server";

import { getOfferings } from "@repo/book/app/[business]/_lib/get-offerings";
import type { Offering } from "@repo/db/types";

export async function loadMoreOfferings(
  businessId: number,
  offset: number,
): Promise<Offering[]> {
  return await getOfferings(businessId, 12, offset);
}
