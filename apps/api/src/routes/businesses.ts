import { businessCollection } from "../resources/index.ts";
import { paginationSchema, slugSchema } from "../schemas/index.ts";
import { db } from "@repo/db/database";
import { Hono } from "hono";
import * as z from "zod";

const businesses = new Hono();

businesses.get("/", async (c) => {
  const queryParam = z
    .object({
      slug: slugSchema.optional(),
    })
    .extend(paginationSchema.shape)
    .safeParse(c.req.query());
  if (!queryParam.success) {
    return c.json(z.flattenError(queryParam.error), 422);
  }

  if (!queryParam.data.slug) {
    return c.json({ error: "Listing all businesses is not permitted" }, 403);
  }

  let query = db()
    .selectFrom("businesses")
    .orderBy("name", "asc")
    .selectAll()
    .limit(queryParam.data.limit)
    .offset(queryParam.data.offset);
  if (queryParam.data.slug) {
    query = query.where("slug", "=", queryParam.data.slug);
  }
  const businesses = await query.execute();

  return c.json({
    data: businessCollection(businesses),
  });
});

businesses.all("/", (c) => c.body(null, 405));

export { businesses };
