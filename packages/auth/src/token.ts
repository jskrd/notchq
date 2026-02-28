import { createHash, randomBytes, timingSafeEqual } from "crypto";

const TOKEN_PREFIX = "nq_";
const SELECTOR_LENGTH = 32;
const VALIDATOR_LENGTH = 64;
const TOKEN_LENGTH = TOKEN_PREFIX.length + SELECTOR_LENGTH + VALIDATOR_LENGTH; // 99

export interface ParsedToken {
  selector: string;
  validator: string;
}

const BASE62_CHARS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function generateBase62(length: number): string {
  const bytesNeeded = Math.ceil((length * 6) / 8) + 1;
  const bytes = randomBytes(bytesNeeded);
  let value = BigInt("0x" + bytes.toString("hex"));

  let result = "";
  const radix = BigInt(62);

  while (result.length < length) {
    const remainder = value % radix;
    result = BASE62_CHARS[Number(remainder)] + result;
    value = value / radix;
  }

  return result.slice(0, length);
}

export function generateToken(): string {
  const selector = generateBase62(SELECTOR_LENGTH);
  const validator = generateBase62(VALIDATOR_LENGTH);
  return `${TOKEN_PREFIX}${selector}${validator}`;
}

export function parseToken(token: string): ParsedToken | null {
  if (typeof token !== "string") {
    return null;
  }

  if (token.length !== TOKEN_LENGTH) {
    return null;
  }

  if (!token.startsWith(TOKEN_PREFIX)) {
    return null;
  }

  const withoutPrefix = token.slice(TOKEN_PREFIX.length);
  const selector = withoutPrefix.slice(0, SELECTOR_LENGTH);
  const validator = withoutPrefix.slice(SELECTOR_LENGTH);

  const base62Regex = /^[0-9A-Za-z]+$/;
  if (!base62Regex.test(selector) || !base62Regex.test(validator)) {
    return null;
  }

  return { selector, validator };
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
