import { slotCollection } from "../../../../resources/slot.ts";
import { dateSchema } from "../../../../schemas/date.ts";
import { paginationSchema } from "../../../../schemas/pagination.ts";
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

  const queryParam = z
    .object({
      date: dateSchema,
    })
    .extend(paginationSchema.shape)
    .safeParse(c.req.query());
  if (!queryParam.success) {
    return c.json(z.flattenError(queryParam.error), 422);
  }

  const startOfDay = new Date(queryParam.data.date);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const slots = await db()
    .selectFrom("slots")
    .where("offering_id", "=", pathParam.data.id)
    .where("start", ">=", startOfDay)
    .where("start", "<", endOfDay)
    .orderBy("start", "asc")
    .limit(queryParam.data.limit)
    .offset(queryParam.data.offset)
    .selectAll()
    .execute();

  return c.json({
    data: slotCollection(slots),
  });
});

export default app;
