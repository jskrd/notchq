import { tokenResource } from "./token.ts";
import type { Token } from "@repo/db";
import { describe, expect, it } from "vitest";

const token: Token & { token: string } = {
  id: 1,
  user_id: 1,
  selector: "abc",
  validator_hash: "def",
  token: "nq_abc123",
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  expires_at: new Date("2026-01-31T00:00:00.000Z"),
  last_used_at: null,
};

describe(tokenResource.name, () => {
  it("returns the expected fields", () => {
    expect(tokenResource(token)).toEqual({
      token: "nq_abc123",
      created_at: "2026-01-01T00:00:00.000Z",
      expires_at: "2026-01-31T00:00:00.000Z",
      last_used_at: null,
    });
  });
});
