import { businessCollection, businessSchema } from "../resources/index.ts";
import {
  paginationSchema,
  slugSchema,
  validationErrorSchema,
} from "../schemas/index.ts";
import { type RouteHandler, createRoute, z } from "@hono/zod-openapi";
import { db } from "@repo/db/database";

export const listBusinessesRoute = createRoute({
  method: "get",
  path: "/businesses",
  request: {
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
          schema: z.object({ data: z.array(businessSchema) }),
        },
      },
      description: "List of businesses",
    },
    403: {
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
      description: "Forbidden",
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

export const listBusinessesHandler: RouteHandler<
  typeof listBusinessesRoute
> = async (c) => {
  const { slug, limit, offset } = c.req.valid("query");

  if (!slug) {
    return c.json({ error: "Listing all businesses is not permitted" }, 403);
  }

  let dbQuery = db()
    .selectFrom("businesses")
    .orderBy("name", "asc")
    .selectAll()
    .limit(limit)
    .offset(offset);
  if (slug) {
    dbQuery = dbQuery.where("slug", "=", slug);
  }
  const rows = await dbQuery.execute();

  return c.json(
    {
      data: businessCollection(rows),
    },
    200,
  );
};
