import business from "./routes/v1/businesses/[id].ts";
import businessOfferings from "./routes/v1/businesses/[id]/offerings.ts";
import businesses from "./routes/v1/businesses/index.ts";
import offering from "./routes/v1/offerings/[id].ts";
import offeringSlots from "./routes/v1/offerings/[id]/slots.ts";
import slot from "./routes/v1/slots/[id].ts";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.route("/v1/businesses", businesses);
app.route("/v1/businesses/:id", business);
app.route("/v1/businesses/:id/offerings", businessOfferings);
app.route("/v1/offerings/:id", offering);
app.route("/v1/offerings/:id/slots", offeringSlots);
app.route("/v1/slots/:id", slot);

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
