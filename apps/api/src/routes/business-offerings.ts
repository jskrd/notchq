import { offeringCollection } from "../resources/index.ts";
import { paginationSchema, slugSchema } from "../schemas/index.ts";
import { db } from "@repo/db/database";
import { Hono } from "hono";
import * as z from "zod";

const businessOfferings = new Hono();

businessOfferings.get("/", async (c) => {
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

businessOfferings.all("/", (c) => c.body(null, 405));

export { businessOfferings };
