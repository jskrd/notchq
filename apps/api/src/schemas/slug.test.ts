import { slugSchema } from "./slug.ts";
import { describe, expect, it } from "vitest";

describe("slugSchema", () => {
  describe("valid slugs", () => {
    it("accepts lowercase letters", () => {
      expect(slugSchema.parse("hello")).toBe("hello");
    });

    it("accepts lowercase letters with hyphens", () => {
      expect(slugSchema.parse("hello-world")).toBe("hello-world");
    });

    it("accepts numbers", () => {
      expect(slugSchema.parse("123")).toBe("123");
    });

    it("accepts single character", () => {
      expect(slugSchema.parse("a")).toBe("a");
    });

    it("accepts mixed letters, numbers, and hyphens", () => {
      expect(slugSchema.parse("a-1-b-2")).toBe("a-1-b-2");
    });

    it("accepts slug at maximum length (64 chars)", () => {
      const maxSlug = "a".repeat(64);
      expect(slugSchema.parse(maxSlug)).toBe(maxSlug);
    });

    it("accepts slug starting with hyphen", () => {
      expect(slugSchema.parse("-hello")).toBe("-hello");
    });

    it("accepts slug ending with hyphen", () => {
      expect(slugSchema.parse("hello-")).toBe("hello-");
    });
  });

  describe("invalid slugs", () => {
    it("rejects uppercase letters", () => {
      expect(() => slugSchema.parse("Hello")).toThrow();
    });

    it("rejects all uppercase", () => {
      expect(() => slugSchema.parse("HELLO")).toThrow();
    });

    it("rejects underscores", () => {
      expect(() => slugSchema.parse("hello_world")).toThrow();
    });

    it("rejects dots", () => {
      expect(() => slugSchema.parse("hello.world")).toThrow();
    });

    it("rejects spaces", () => {
      expect(() => slugSchema.parse("hello world")).toThrow();
    });

    it("rejects empty string", () => {
      expect(() => slugSchema.parse("")).toThrow();
    });

    it("rejects slug exceeding maximum length (65 chars)", () => {
      const tooLong = "a".repeat(65);
      expect(() => slugSchema.parse(tooLong)).toThrow();
    });
  });
});
