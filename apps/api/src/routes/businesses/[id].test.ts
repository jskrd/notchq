import { businessResource } from "../../resources/business.ts";
import route from "./[id].ts";
import { createBusiness } from "@repo/db/factories/index";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";

const app = new Hono();
app.route("/businesses/:id", route);

describe("GET /businesses/:id", () => {
  it.each(["POST", "PUT", "PATCH", "DELETE"])(
    "%s returns 405",
    async (method) => {
      const response = await app.request("/businesses/1", { method });
      expect(response.status).toBe(405);
    },
  );

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 404 for invalid id %s",
    async (id) => {
      const response = await app.request(`/businesses/${id}`);
      expect(response.status).toBe(404);
    },
  );

  it("returns 404 for non-existent business", async () => {
    const response = await app.request("/businesses/2147483647");
    expect(response.status).toBe(404);
  });

  it("returns the business as JSON", async () => {
    const business = await createBusiness();

    const response = await app.request(`/businesses/${business.id}`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch("application/json");

    const body = await response.json();
    expect(body).toEqual({
      data: businessResource(business),
    });
  });
});
