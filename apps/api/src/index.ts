import business from "./routes/businesses/[id].ts";
import businessOfferings from "./routes/businesses/[id]/offerings.ts";
import businesses from "./routes/businesses/index.ts";
import offering from "./routes/offerings/[id].ts";
import offeringSlots from "./routes/offerings/[id]/slots.ts";
import slot from "./routes/slots/[id].ts";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.route("/businesses", businesses);
app.route("/businesses/:id", business);
app.route("/businesses/:id/offerings", businessOfferings);
app.route("/offerings/:id", offering);
app.route("/offerings/:id/slots", offeringSlots);
app.route("/slots/:id", slot);

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
