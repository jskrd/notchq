import { defaultHook } from "../app.ts";
import { businessResource } from "../resources/business.ts";
import { getBusinessRoute, getBusinessHandler } from "./business.ts";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createBusiness } from "@repo/db/factories/index";
import { describe, expect, it } from "vitest";

const app = new OpenAPIHono({ defaultHook });
app.openapi(getBusinessRoute, getBusinessHandler);

describe(`${getBusinessRoute.method} ${getBusinessRoute.path}`, () => {
  it.each(["POST", "PUT", "PATCH", "DELETE"])(
    "%s returns 404",
    async (method) => {
      const response = await app.request("/businesses/1", { method });
      expect(response.status).toBe(404);
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
