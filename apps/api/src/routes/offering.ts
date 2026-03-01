import { offeringResource, offeringSchema } from "../resources/index.ts";
import { type RouteHandler, createRoute, z } from "@hono/zod-openapi";
import { db } from "@repo/db/database";

export const getOfferingRoute = createRoute({
  method: "get",
  path: "/offerings/{id}",
  request: {
    params: z.object({ id: z.coerce.number().int().positive() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ data: offeringSchema }),
        },
      },
      description: "Offering",
    },
    404: {
      description: "Not found",
    },
  },
});

export const getOfferingHandler: RouteHandler<typeof getOfferingRoute> = async (
  c,
) => {
  const { id } = c.req.valid("param");

  const row = await db()
    .selectFrom("offerings")
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .selectAll()
    .executeTakeFirst();
  if (!row) {
    return c.notFound();
  }

  return c.json(
    {
      data: offeringResource(row),
    },
    200,
  );
};
