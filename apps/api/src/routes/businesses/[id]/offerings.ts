import { offeringCollection } from "../../../resources/offering.ts";
import { paginationSchema } from "../../../schemas/pagination.ts";
import { slugSchema } from "../../../schemas/slug.ts";
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
      slug: slugSchema.optional(),
    })
    .extend(paginationSchema.shape)
    .safeParse(c.req.query());
  if (!queryParam.success) {
    return c.json(z.flattenError(queryParam.error), 422);
  }

  let query = db()
    .selectFrom("offerings")
    .where("business_id", "=", pathParam.data.id)
    .where("deleted_at", "is", null)
    .orderBy("name", "asc")
    .limit(queryParam.data.limit)
    .offset(queryParam.data.offset)
    .selectAll();
  if (queryParam.data.slug) {
    query = query.where("slug", "=", queryParam.data.slug);
  }
  const offerings = await query.execute();

  return c.json({
    data: offeringCollection(offerings),
  });
});

app.all("/", (c) => c.body(null, 405));

export default app;
