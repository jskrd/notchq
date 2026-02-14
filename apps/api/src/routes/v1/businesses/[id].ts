import { businessResource } from "../../../resources/business.ts";
import { db } from "@repo/db/database";
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

  const business = await db()
    .selectFrom("businesses")
    .where("id", "=", pathParam.data.id)
    .selectAll()
    .executeTakeFirst();
  if (!business) {
    return c.notFound();
  }

  return c.json({
    data: businessResource(business),
  });
});

export default app;
