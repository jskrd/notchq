import { slugSchema } from "./slug.ts";
import { describe, expect, it } from "vitest";

describe("slugSchema", () => {
  it.each(["a", "hello-world", "my-slug-123", "0", "abc-def-ghi"])(
    "accepts valid slug: %s",
    (value) => {
      expect(slugSchema.safeParse(value).success).toBe(true);
    },
  );

  it("accepts a slug at the maximum length of 255", () => {
    const value = "a".repeat(255);
    expect(slugSchema.safeParse(value).success).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(slugSchema.safeParse("").success).toBe(false);
  });

  it("rejects a string longer than 255 characters", () => {
    const value = "a".repeat(256);
    expect(slugSchema.safeParse(value).success).toBe(false);
  });

  it.each(["Hello", "UPPERCASE", "camelCase"])(
    "rejects uppercase characters: %s",
    (value) => {
      expect(slugSchema.safeParse(value).success).toBe(false);
    },
  );

  it.each(["hello world", "has space", "foo_bar", "a.b", "a/b", "a@b"])(
    "rejects special characters and spaces: %s",
    (value) => {
      expect(slugSchema.safeParse(value).success).toBe(false);
    },
  );

  it.each([123, null, undefined, true, {}, []])(
    "rejects non-string value: %s",
    (value) => {
      expect(slugSchema.safeParse(value).success).toBe(false);
    },
  );
});
