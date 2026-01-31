import { hashPassword, verifyPassword } from "./password.ts";
import { describe, expect, it } from "vitest";

describe("hashPassword", () => {
  it("produces hash with argon2id prefix", async () => {
    const hash = await hashPassword("password123");

    expect(hash).toMatch(/^\$argon2id\$/);
  });

  it("produces different hashes for same password", async () => {
    const hash1 = await hashPassword("password123");
    const hash2 = await hashPassword("password123");

    expect(hash1).not.toBe(hash2);
  });
});

describe("verifyPassword", () => {
  it("returns true for correct password", async () => {
    const password = "mySecurePassword!";
    const digest = await hashPassword(password);

    const result = await verifyPassword(digest, password);

    expect(result).toBe(true);
  });

  it("returns false for incorrect password", async () => {
    const digest = await hashPassword("correctPassword");

    const result = await verifyPassword(digest, "wrongPassword");

    expect(result).toBe(false);
  });

  it("throws for malformed digest", async () => {
    await expect(
      verifyPassword("not-a-valid-digest", "password"),
    ).rejects.toThrow(TypeError);
  });

  it("throws for empty digest", async () => {
    await expect(verifyPassword("", "password")).rejects.toThrow(TypeError);
  });
});
