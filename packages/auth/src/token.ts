import { createHash, randomBytes, timingSafeEqual } from "crypto";

const TOKEN_PREFIX = "nq_";
const SELECTOR_LENGTH = 32;
const VALIDATOR_LENGTH = 64;
const TOKEN_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

export interface ParsedToken {
  selector: string;
  validator: string;
}

export function generateToken(): string {
  const selector = randomBytes(24).toString("base64url"); // 32 chars, 192 bits
  const validator = randomBytes(48).toString("base64url"); // 64 chars, 384 bits
  return `${TOKEN_PREFIX}${selector}${validator}`;
}

export function parseToken(token: string): ParsedToken | null {
  if (typeof token !== "string") {
    return null;
  }

  if (!token.startsWith(TOKEN_PREFIX)) {
    return null;
  }

  const expectedLength =
    TOKEN_PREFIX.length + SELECTOR_LENGTH + VALIDATOR_LENGTH;
  if (token.length !== expectedLength) {
    return null;
  }

  const withoutPrefix = token.slice(TOKEN_PREFIX.length);
  const selector = withoutPrefix.slice(0, SELECTOR_LENGTH);
  const validator = withoutPrefix.slice(SELECTOR_LENGTH);

  const base64urlRegex = /^[A-Za-z0-9\-_]+$/;
  if (!base64urlRegex.test(selector) || !base64urlRegex.test(validator)) {
    return null;
  }

  return { selector, validator };
}

export function tokenExpiresAt(): Date {
  return new Date(Date.now() + TOKEN_LIFETIME_MS);
}

export function hashValidator(validator: string): string {
  return createHash("sha256").update(validator).digest("hex");
}

export function verifyValidator(
  validator: string,
  storedHash: string,
): boolean {
  const computedHash = hashValidator(validator);

  const computedBuffer = Buffer.from(computedHash, "utf8");
  const storedBuffer = Buffer.from(storedHash, "utf8");

  if (computedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(computedBuffer, storedBuffer);
}
