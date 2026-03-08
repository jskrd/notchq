import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export async function verifyPassword(
  digest: string,
  password: string,
): Promise<boolean> {
  return argon2.verify(digest, password);
}

/**
 * Performs a throwaway hash verification to prevent timing attacks that could
 * reveal whether an email address exists (e.g. in login flows).
 */
export async function dummyVerifyPassword(): Promise<void> {
  const hash =
    "$argon2id$v=19$m=65536,t=3,p=4$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  await verifyPassword(hash, "dummy");
}
