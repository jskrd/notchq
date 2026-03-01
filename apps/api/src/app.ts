import {
  getBusinessHandler,
  getBusinessRoute,
  getOfferingHandler,
  getOfferingRoute,
  getSlotHandler,
  getSlotRoute,
  listBusinessOfferingsHandler,
  listBusinessOfferingsRoute,
  listBusinessesHandler,
  listBusinessesRoute,
  listOfferingSlotsHandler,
  listOfferingSlotsRoute,
} from "./routes/index.ts";
import { serveStatic } from "@hono/node-server/serve-static";
import { OpenAPIHono, type OpenAPIHonoOptions, z } from "@hono/zod-openapi";
import type { Env } from "hono";

export const defaultHook: NonNullable<
  OpenAPIHonoOptions<Env>["defaultHook"]
> = (result, c) => {
  if (!result.success) {
    if (result.target === "param") {
      return c.notFound();
    }
    return c.json(z.flattenError(result.error), 422);
  }
  return;
};

export const app = new OpenAPIHono({ defaultHook });

app.openapi(listBusinessesRoute, listBusinessesHandler);
app.openapi(getBusinessRoute, getBusinessHandler);

app.openapi(listBusinessOfferingsRoute, listBusinessOfferingsHandler);

app.openapi(getOfferingRoute, getOfferingHandler);

app.openapi(listOfferingSlotsRoute, listOfferingSlotsHandler);

app.openapi(getSlotRoute, getSlotHandler);

app.use("/*", serveStatic({ root: "./public" }));
