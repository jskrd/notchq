import { slotResource } from "../../../resources/slot.ts";
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

  const slot = await db()
    .selectFrom("slots")
    .where("id", "=", pathParam.data.id)
    .selectAll()
    .executeTakeFirst();
  if (!slot) {
    return c.notFound();
  }

  return c.json({
    data: slotResource(slot),
  });
});

app.all("/", (c) => c.body(null, 405));

export default app;
