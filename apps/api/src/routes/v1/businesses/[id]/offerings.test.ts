import { offeringCollection } from "../../../../resources/offering.ts";
import route from "./offerings.ts";
import { createBusiness, createOffering } from "@repo/db/factories/index";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";

const app = new Hono();
app.route("/v1/businesses/:id/offerings", route);

describe("GET /v1/businesses/:id/offerings", () => {
  it.each(["POST", "PUT", "PATCH", "DELETE"])(
    "%s returns 405",
    async (method) => {
      const response = await app.request("/v1/businesses/1/offerings", {
        method,
      });
      expect(response.status).toBe(405);
    },
  );

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 404 for invalid business id %s",
    async (id) => {
      const response = await app.request(`/v1/businesses/${id}/offerings`);
      expect(response.status).toBe(404);
    },
  );

  it("returns 422 for invalid slug", async () => {
    const business = await createBusiness();
    const response = await app.request(
      `/v1/businesses/${business.id}/offerings?slug=INVALID!`,
    );
    expect(response.status).toBe(422);
  });

  it.each(["limit=0", "offset=-1"])(
    "returns 422 for invalid pagination %s",
    async (param) => {
      const business = await createBusiness();
      const response = await app.request(
        `/v1/businesses/${business.id}/offerings?${param}`,
      );
      expect(response.status).toBe(422);
    },
  );

  it("returns empty array when business has no offerings", async () => {
    const business = await createBusiness();

    const response = await app.request(
      `/v1/businesses/${business.id}/offerings`,
    );

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ data: [] });
  });

  it("returns offerings for the business", async () => {
    const business = await createBusiness();
    const offering = await createOffering({ business_id: business.id });

    const response = await app.request(
      `/v1/businesses/${business.id}/offerings`,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch("application/json");

    const body = await response.json();
    expect(body).toEqual({
      data: offeringCollection([offering]),
    });
  });

  it("filters offerings by slug", async () => {
    const business = await createBusiness();
    const offering = await createOffering({ business_id: business.id });
    await createOffering({ business_id: business.id });

    const response = await app.request(
      `/v1/businesses/${business.id}/offerings?slug=${offering.slug}`,
    );

    const body = await response.json();
    expect(body).toEqual({
      data: offeringCollection([offering]),
    });
  });

  it("excludes soft-deleted offerings", async () => {
    const business = await createBusiness();
    await createOffering({
      business_id: business.id,
      deleted_at: new Date().toISOString(),
    });

    const response = await app.request(
      `/v1/businesses/${business.id}/offerings`,
    );

    const body = await response.json();
    expect(body).toEqual({ data: [] });
  });
});
