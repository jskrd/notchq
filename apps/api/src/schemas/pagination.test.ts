import { paginationSchema } from "./pagination.ts";
import { describe, expect, it } from "vitest";

describe("paginationSchema", () => {
  describe("limit", () => {
    it("uses default value of 10 when not provided", () => {
      const result = paginationSchema.parse({});
      expect(result.limit).toBe(10);
    });

    it("coerces string to number", () => {
      const result = paginationSchema.parse({ limit: "25" });
      expect(result.limit).toBe(25);
    });

    it("accepts valid limit within range", () => {
      const result = paginationSchema.parse({ limit: 50 });
      expect(result.limit).toBe(50);
    });

    it("rejects limit below minimum", () => {
      expect(() => paginationSchema.parse({ limit: 0 })).toThrow();
    });

    it("rejects limit above maximum", () => {
      expect(() => paginationSchema.parse({ limit: 101 })).toThrow();
    });

    it("rejects non-integer values", () => {
      expect(() => paginationSchema.parse({ limit: 10.5 })).toThrow();
    });
  });

  describe("offset", () => {
    it("uses default value of 0 when not provided", () => {
      const result = paginationSchema.parse({});
      expect(result.offset).toBe(0);
    });

    it("coerces string to number", () => {
      const result = paginationSchema.parse({ offset: "100" });
      expect(result.offset).toBe(100);
    });

    it("accepts valid offset", () => {
      const result = paginationSchema.parse({ offset: 500 });
      expect(result.offset).toBe(500);
    });

    it("rejects negative offset", () => {
      expect(() => paginationSchema.parse({ offset: -1 })).toThrow();
    });

    it("rejects non-integer values", () => {
      expect(() => paginationSchema.parse({ offset: 10.5 })).toThrow();
    });
  });

  describe("combined", () => {
    it("parses both limit and offset together", () => {
      const result = paginationSchema.parse({ limit: 20, offset: 40 });
      expect(result).toEqual({ limit: 20, offset: 40 });
    });
  });
});
