import { dateSchema } from "./date.ts";
import { describe, expect, it } from "vitest";

describe("dateSchema", () => {
  describe("valid dates", () => {
    it("accepts standard date format", () => {
      expect(dateSchema.parse("2024-01-15")).toBe("2024-01-15");
    });

    it("accepts end of year date", () => {
      expect(dateSchema.parse("2024-12-31")).toBe("2024-12-31");
    });

    it("accepts historical date", () => {
      expect(dateSchema.parse("1999-01-01")).toBe("1999-01-01");
    });
  });

  describe("invalid dates", () => {
    it("rejects slash separators", () => {
      expect(() => dateSchema.parse("2024/01/15")).toThrow();
    });

    it("rejects MM-DD-YYYY format", () => {
      expect(() => dateSchema.parse("01-15-2024")).toThrow();
    });

    it("rejects single digit month", () => {
      expect(() => dateSchema.parse("2024-1-15")).toThrow();
    });

    it("rejects missing day", () => {
      expect(() => dateSchema.parse("2024-01")).toThrow();
    });

    it("rejects year only", () => {
      expect(() => dateSchema.parse("2024")).toThrow();
    });

    it("rejects ISO datetime format", () => {
      expect(() => dateSchema.parse("2024-01-15T00:00:00")).toThrow();
    });

    it("rejects non-numeric characters", () => {
      expect(() => dateSchema.parse("abcd-ef-gh")).toThrow();
    });

    it("rejects empty string", () => {
      expect(() => dateSchema.parse("")).toThrow();
    });
  });
});
