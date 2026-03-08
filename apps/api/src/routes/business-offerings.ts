import { offeringCollection, offeringSchema } from "../resources/index.ts";
import {
  paginationSchema,
  slugSchema,
  validationErrorSchema,
} from "../schemas/index.ts";
import { type RouteHandler, createRoute, z } from "@hono/zod-openapi";
import { db } from "@repo/db";

export const listBusinessOfferingsRoute = createRoute({
  method: "get",
  path: "/businesses/{id}/offerings",
  request: {
    params: z.object({ id: z.coerce.number().int().positive() }),
    query: z
      .object({
        slug: slugSchema.optional(),
      })
      .extend(paginationSchema.shape),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ data: z.array(offeringSchema) }),
        },
      },
      description: "List of offerings",
    },
    422: {
      content: {
        "application/json": {
          schema: validationErrorSchema,
        },
      },
      description: "Validation error",
    },
  },
});

export const listBusinessOfferingsHandler: RouteHandler<
  typeof listBusinessOfferingsRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const { slug, limit, offset } = c.req.valid("query");

  let dbQuery = db()
    .selectFrom("offerings")
    .where("business_id", "=", id)
    .where("deleted_at", "is", null)
    .orderBy("name", "asc")
    .limit(limit)
    .offset(offset)
    .selectAll();
  if (slug) {
    dbQuery = dbQuery.where("slug", "=", slug);
  }
  const rows = await dbQuery.execute();

  return c.json(
    {
      data: offeringCollection(rows),
    },
    200,
  );
};
