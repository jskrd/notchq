import { slotResource, slotSchema } from "../resources/index.ts";
import { type RouteHandler, createRoute, z } from "@hono/zod-openapi";
import { db } from "@repo/db/database";

export const getSlotRoute = createRoute({
  method: "get",
  path: "/slots/{id}",
  request: {
    params: z.object({ id: z.coerce.number().int().positive() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ data: slotSchema }),
        },
      },
      description: "Slot",
    },
    404: {
      description: "Not found",
    },
  },
});

export const getSlotHandler: RouteHandler<typeof getSlotRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const row = await db()
    .selectFrom("slots")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
  if (!row) {
    return c.notFound();
  }

  return c.json(
    {
      data: slotResource(row),
    },
    200,
  );
};
