import { db } from "@repo/db/database";
import type { Business } from "@repo/db/types";
import { cache } from "react";

export async function getBusiness(slug: string): Promise<Business | undefined> {
  const cached = cache(() =>
    db
      .selectFrom("businesses")
      .where("slug", "=", slug)
      .selectAll()
      .executeTakeFirst(),
  );

  return cached();
}
