import { businessResource, businessSchema } from "../resources/index.ts";
import { type RouteHandler, createRoute, z } from "@hono/zod-openapi";
import { db } from "@repo/db";

export const getBusinessRoute = createRoute({
  method: "get",
  path: "/businesses/{id}",
  request: {
    params: z.object({ id: z.coerce.number().int().positive() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ data: businessSchema }),
        },
      },
      description: "Business",
    },
    404: {
      description: "Not found",
    },
  },
});

export const getBusinessHandler: RouteHandler<typeof getBusinessRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");

  const row = await db()
    .selectFrom("businesses")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
  if (!row) {
    return c.notFound();
  }

  return c.json(
    {
      data: businessResource(row),
    },
    200,
  );
};
