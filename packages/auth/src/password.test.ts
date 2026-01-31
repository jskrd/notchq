import { hashPassword, verifyPassword } from "./password.js";
import { describe, expect, it } from "vitest";

describe("hashPassword", () => {
  it("produces hash in correct format", async () => {
    const hash = await hashPassword("password123");
    const parts = hash.split("$");

    expect(parts).toHaveLength(7);
    expect(parts[0]).toBe("");
    expect(parts[1]).toBe("scrypt");
    expect(parts[2]).toBe("131072");
    expect(parts[3]).toBe("8");
    expect(parts[4]).toBe("1");
    expect(Buffer.from(parts[5]!, "base64")).toHaveLength(32);
    expect(Buffer.from(parts[6]!, "base64")).toHaveLength(64);
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
    const hash = await hashPassword(password);

    const result = await verifyPassword(password, hash);

    expect(result).toBe(true);
  });

  it("returns false for incorrect password", async () => {
    const hash = await hashPassword("correctPassword");

    const result = await verifyPassword("wrongPassword", hash);

    expect(result).toBe(false);
  });

  it("returns false for malformed hash - missing parts", async () => {
    const result = await verifyPassword("password", "$scrypt$131072$8$1");

    expect(result).toBe(false);
  });

  it("returns false for malformed hash - wrong prefix", async () => {
    const result = await verifyPassword(
      "password",
      "$bcrypt$131072$8$1$salt$hash",
    );

    expect(result).toBe(false);
  });

  it("returns false for malformed hash - invalid N parameter", async () => {
    const salt = Buffer.from("a".repeat(32)).toString("base64");
    const hash = Buffer.from("b".repeat(64)).toString("base64");

    const result = await verifyPassword(
      "password",
      `$scrypt$invalid$8$1$${salt}$${hash}`,
    );

    expect(result).toBe(false);
  });

  it("returns false for empty hash", async () => {
    const result = await verifyPassword("password", "");

    expect(result).toBe(false);
  });
});
