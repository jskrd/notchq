import { offeringResource } from "../../../resources/offering.ts";
import { rdb } from "@repo/rdb/database";
import { Hono } from "hono";
import * as z from "zod";

const app = new Hono();

app.get("/", async (c) => {
  const pathParam = z
    .object({ id: z.coerce.number().int().positive() })
    .safeParse(c.req.param());
  if (!pathParam.success) {
    return c.notFound();
  }

  const offering = await rdb()
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

export default app;
