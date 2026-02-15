import { businessCollection, businessResource } from "./business.ts";
import { createBusiness } from "@repo/db/factories/index";
import { describe, expect, it } from "vitest";

describe(businessResource.name, () => {
  it("returns the expected fields", async () => {
    const business = await createBusiness();

    expect(businessResource(business)).toEqual({
      id: business.id,
      slug: business.slug,
      name: business.name,
      created_at: business.created_at.toISOString(),
    });
  });
});

describe(businessCollection.name, () => {
  it("returns an array of business resources", async () => {
    const business = await createBusiness();

    expect(businessCollection([business])).toEqual([
      businessResource(business),
    ]);
  });
});
