import {
  generateToken,
  hashValidator,
  parseToken,
  verifyValidator,
} from "./token.ts";
import { describe, expect, it } from "vitest";

describe("generateToken", () => {
  it("generates token with correct length", () => {
    const token = generateToken();

    expect(token).toHaveLength(99);
  });

  it("generates token with correct prefix", () => {
    const token = generateToken();

    expect(token.startsWith("nq_")).toBe(true);
  });

  it("generates token with base62 characters only", () => {
    const token = generateToken();
    const withoutPrefix = token.slice(3);
    const base62Regex = /^[0-9A-Za-z]+$/;

    expect(base62Regex.test(withoutPrefix)).toBe(true);
  });

  it("generates unique tokens", () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateToken());
    }

    expect(tokens.size).toBe(100);
  });
});

describe("parseToken", () => {
  it("parses valid token correctly", () => {
    const token = generateToken();

    const parsed = parseToken(token);

    expect(parsed).not.toBeNull();
    expect(parsed!.selector).toHaveLength(32);
    expect(parsed!.validator).toHaveLength(64);
  });

  it("returns null for token with wrong prefix", () => {
    const token = "xx_" + "a".repeat(96);

    const parsed = parseToken(token);

    expect(parsed).toBeNull();
  });

  it("returns null for token with wrong length", () => {
    const token = "nq_tooshort";

    const parsed = parseToken(token);

    expect(parsed).toBeNull();
  });

  it("returns null for token with invalid characters", () => {
    const token = "nq_" + "!".repeat(32) + "@".repeat(64);

    const parsed = parseToken(token);

    expect(parsed).toBeNull();
  });

  it("returns null for non-string input", () => {
    const parsed = parseToken(null as unknown as string);

    expect(parsed).toBeNull();
  });

  it("round-trips correctly", () => {
    const token = generateToken();
    const parsed = parseToken(token);

    expect(parsed).not.toBeNull();

    const reconstructed = `nq_${parsed!.selector}${parsed!.validator}`;

    expect(reconstructed).toBe(token);
  });
});

describe("hashValidator", () => {
  it("produces consistent hash for same input", () => {
    const validator = "testValidator123";

    const hash1 = hashValidator(validator);
    const hash2 = hashValidator(validator);

    expect(hash1).toBe(hash2);
  });

  it("produces different hashes for different inputs", () => {
    const hash1 = hashValidator("validator1");
    const hash2 = hashValidator("validator2");

    expect(hash1).not.toBe(hash2);
  });

  it("produces 64-character hex hash", () => {
    const hash = hashValidator("testValidator");

    expect(hash).toHaveLength(64);
    expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
  });
});

describe("verifyValidator", () => {
  it("returns true for matching validator", () => {
    const validator = "mySecretValidator";
    const hash = hashValidator(validator);

    const result = verifyValidator(validator, hash);

    expect(result).toBe(true);
  });

  it("returns false for non-matching validator", () => {
    const hash = hashValidator("correctValidator");

    const result = verifyValidator("wrongValidator", hash);

    expect(result).toBe(false);
  });

  it("returns false for wrong hash length", () => {
    const result = verifyValidator("validator", "tooshort");

    expect(result).toBe(false);
  });
});
