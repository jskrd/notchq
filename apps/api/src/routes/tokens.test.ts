import { defaultHook } from "../app.ts";
import { createTokenRoute, createTokenHandler } from "./tokens.ts";
import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@repo/db";
import { createUser } from "@repo/db/factories";
import { describe, expect, it } from "vitest";

const app = new OpenAPIHono({ defaultHook });
app.openapi(createTokenRoute, createTokenHandler);

describe(`${createTokenRoute.method} ${createTokenRoute.path}`, () => {
  it.each(["GET", "PUT", "PATCH", "DELETE"])(
    "%s returns 404",
    async (method) => {
      const response = await app.request("/tokens", { method });
      expect(response.status).toBe(404);
    },
  );

  it("returns 422 when email is missing", async () => {
    const response = await app.request("/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "password" }),
    });
    expect(response.status).toBe(422);
  });

  it("returns 422 when password is missing", async () => {
    const response = await app.request("/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    expect(response.status).toBe(422);
  });

  it("returns 401 for non-existent email", async () => {
    const response = await app.request("/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "nonexistent@example.com",
        password: "password",
      }),
    });
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 for wrong password", async () => {
    const user = await createUser({ password: "correctpassword" });

    const response = await app.request("/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, password: "wrongpassword" }),
    });
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("returns 201 with token for valid credentials", async () => {
    const user = await createUser({ password: "mypassword" });

    const response = await app.request("/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, password: "mypassword" }),
    });
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body).toEqual({
      data: {
        token: expect.stringMatching(/^nq_.{96}$/),
        created_at: expect.any(String),
        expires_at: expect.any(String),
        last_used_at: null,
      },
    });
  });

  it("stores the token in the database", async () => {
    const user = await createUser({ password: "mypassword" });

    await app.request("/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, password: "mypassword" }),
    });

    const tokens = await db()
      .selectFrom("tokens")
      .where("user_id", "=", user.id)
      .selectAll()
      .execute();
    expect(tokens).toHaveLength(1);
    expect(tokens[0]!.selector).toBeDefined();
    expect(tokens[0]!.validator_hash).toBeDefined();
  });
});
