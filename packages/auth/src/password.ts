import {
  type BinaryLike,
  randomBytes,
  scrypt,
  type ScryptOptions,
  timingSafeEqual,
} from "crypto";

const COST_FACTOR = 131072; // 2^17
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 32;
const MAX_MEM = 256 * 1024 * 1024; // 256 MB

function scryptAsync(
  password: BinaryLike,
  salt: BinaryLike,
  keyLength: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) {
        reject(error);
      } else {
        resolve(derivedKey);
      }
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const hash = await scryptAsync(password, salt, KEY_LENGTH, {
    N: COST_FACTOR,
    r: BLOCK_SIZE,
    p: PARALLELIZATION,
    maxmem: MAX_MEM,
  });

  const saltBase64 = salt.toString("base64");
  const hashBase64 = hash.toString("base64");

  return `$scrypt$${COST_FACTOR}$${BLOCK_SIZE}$${PARALLELIZATION}$${saltBase64}$${hashBase64}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const parts = storedHash.split("$");

  if (parts.length !== 7 || parts[0] !== "" || parts[1] !== "scrypt") {
    return false;
  }

  const costFactorString = parts[2];
  const blockSizeString = parts[3];
  const parallelizationString = parts[4];
  const saltString = parts[5];
  const hashString = parts[6];

  if (
    !costFactorString ||
    !blockSizeString ||
    !parallelizationString ||
    !saltString ||
    !hashString
  ) {
    return false;
  }

  const costFactor = parseInt(costFactorString, 10);
  const blockSize = parseInt(blockSizeString, 10);
  const parallelization = parseInt(parallelizationString, 10);

  if (isNaN(costFactor) || isNaN(blockSize) || isNaN(parallelization)) {
    return false;
  }

  const salt = Buffer.from(saltString, "base64");
  const expectedHash = Buffer.from(hashString, "base64");

  if (salt.length !== SALT_LENGTH || expectedHash.length !== KEY_LENGTH) {
    return false;
  }

  try {
    const hash = await scryptAsync(password, salt, KEY_LENGTH, {
      N: costFactor,
      r: blockSize,
      p: parallelization,
      maxmem: MAX_MEM,
    });

    return timingSafeEqual(hash, expectedHash);
  } catch {
    return false;
  }
}
