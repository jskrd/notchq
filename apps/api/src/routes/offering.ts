import { offeringResource } from "../resources/index.ts";
import { db } from "@repo/db/database";
import { Hono } from "hono";
import * as z from "zod";

const offering = new Hono();

offering.get("/", async (c) => {
  const pathParam = z
    .object({ id: z.coerce.number().int().positive() })
    .safeParse(c.req.param());
  if (!pathParam.success) {
    return c.notFound();
  }

  const offering = await db()
    .selectFrom("offerings")
    .where("id", "=", pathParam.data.id)
    .where("deleted_at", "is", null)
    .selectAll()
    .executeTakeFirst();
  if (!offering) {
    return c.notFound();
  }

  return c.json({
    data: offeringResource(offering),
  });
});

offering.all("/", (c) => c.body(null, 405));

export { offering };
