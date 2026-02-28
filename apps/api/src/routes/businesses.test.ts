import { businessCollection } from "../resources/business.ts";
import route from "./businesses.ts";
import { createBusiness } from "@repo/db/factories/index";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";

const app = new Hono();
app.route("/businesses", route);

describe("GET /businesses", () => {
  it.each(["POST", "PUT", "PATCH", "DELETE"])(
    "%s returns 405",
    async (method) => {
      const response = await app.request("/businesses", { method });
      expect(response.status).toBe(405);
    },
  );

  it("returns 403 when no slug param is provided", async () => {
    const response = await app.request("/businesses");

    expect(response.status).toBe(403);

    const body = await response.json();
    expect(body).toEqual({ error: "Listing all businesses is not permitted" });
  });

  it("returns 422 for invalid slug", async () => {
    const response = await app.request("/businesses?slug=INVALID!");
    expect(response.status).toBe(422);
  });

  it.each(["limit=0", "offset=-1"])(
    "returns 422 for invalid pagination %s",
    async (param) => {
      const response = await app.request(`/businesses?slug=test&${param}`);
      expect(response.status).toBe(422);
    },
  );

  it("returns empty array when no businesses match slug", async () => {
    const response = await app.request("/businesses?slug=nonexistent-slug");

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ data: [] });
  });

  it("returns matching business", async () => {
    const business = await createBusiness();

    const response = await app.request(`/businesses?slug=${business.slug}`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch("application/json");

    const body = await response.json();
    expect(body).toEqual({
      data: businessCollection([business]),
    });
  });
});
