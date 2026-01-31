import {
  generateToken,
  hashValidator,
  parseToken,
  SELECTOR_LENGTH,
  TOKEN_LENGTH,
  TOKEN_PREFIX,
  VALIDATOR_LENGTH,
  verifyValidator,
} from "./token.ts";
import { describe, expect, it } from "vitest";

describe("generateToken", () => {
  it("generates token with correct length", () => {
    const token = generateToken();

    expect(token).toHaveLength(TOKEN_LENGTH);
  });

  it("generates token with correct prefix", () => {
    const token = generateToken();

    expect(token.startsWith(TOKEN_PREFIX)).toBe(true);
  });

  it("generates token with base62 characters only", () => {
    const token = generateToken();
    const withoutPrefix = token.slice(TOKEN_PREFIX.length);
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
    expect(parsed!.selector).toHaveLength(SELECTOR_LENGTH);
    expect(parsed!.validator).toHaveLength(VALIDATOR_LENGTH);
  });

  it("returns null for token with wrong prefix", () => {
    const token = "xx_" + "a".repeat(SELECTOR_LENGTH + VALIDATOR_LENGTH);

    const parsed = parseToken(token);

    expect(parsed).toBeNull();
  });

  it("returns null for token with wrong length", () => {
    const token = TOKEN_PREFIX + "tooshort";

    const parsed = parseToken(token);

    expect(parsed).toBeNull();
  });

  it("returns null for token with invalid characters", () => {
    const token =
      TOKEN_PREFIX + "!".repeat(SELECTOR_LENGTH) + "@".repeat(VALIDATOR_LENGTH);

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

    const reconstructed = `${TOKEN_PREFIX}${parsed!.selector}${parsed!.validator}`;

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
