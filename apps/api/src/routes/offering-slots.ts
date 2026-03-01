import { slotCollection, slotSchema } from "../resources/index.ts";
import {
  dateSchema,
  paginationSchema,
  validationErrorSchema,
} from "../schemas/index.ts";
import { type RouteHandler, createRoute, z } from "@hono/zod-openapi";
import { db } from "@repo/db/database";

export const listOfferingSlotsRoute = createRoute({
  method: "get",
  path: "/offerings/{id}/slots",
  request: {
    params: z.object({ id: z.coerce.number().int().positive() }),
    query: z
      .object({
        date: dateSchema,
      })
      .extend(paginationSchema.shape),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ data: z.array(slotSchema) }),
        },
      },
      description: "List of slots",
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

export const listOfferingSlotsHandler: RouteHandler<
  typeof listOfferingSlotsRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const { date, limit, offset } = c.req.valid("query");

  const startOfDay = new Date(date);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const slots = await db()
    .selectFrom("slots")
    .where("offering_id", "=", id)
    .where("start", ">=", startOfDay)
    .where("start", "<", endOfDay)
    .orderBy("start", "asc")
    .limit(limit)
    .offset(offset)
    .selectAll()
    .execute();

  return c.json(
    {
      data: slotCollection(slots),
    },
    200,
  );
};
