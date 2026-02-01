import { businessCollection } from "../../../resources/business.ts";
import { paginationSchema } from "../../../schemas/pagination.ts";
import { slugSchema } from "../../../schemas/slug.ts";
import { rdb } from "@repo/rdb/database";
import { Hono } from "hono";
import * as z from "zod";

const app = new Hono();

app.get("/", async (c) => {
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

  let query = rdb()
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

export default app;
