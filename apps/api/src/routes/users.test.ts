import { defaultHook } from "../app.ts";
import { createUserRoute, createUserHandler } from "./users.ts";
import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@repo/db";
import { createUser } from "@repo/db/factories";
import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

const app = new OpenAPIHono({ defaultHook });
app.openapi(createUserRoute, createUserHandler);

describe(`${createUserRoute.method} ${createUserRoute.path}`, () => {
  it.each(["GET", "PUT", "PATCH", "DELETE"])(
    "%s returns 404",
    async (method) => {
      const response = await app.request("/users", { method });
      expect(response.status).toBe(404);
    },
  );

  it("returns 422 when name is missing", async () => {
    const response = await app.request("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `${randomUUID()}@example.com`,
        password: "password",
      }),
    });
    expect(response.status).toBe(422);
  });

  it("returns 422 when email is missing", async () => {
    const response = await app.request("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", password: "password" }),
    });
    expect(response.status).toBe(422);
  });

  it("returns 422 when password is missing", async () => {
    const response = await app.request("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test",
        email: `${randomUUID()}@example.com`,
      }),
    });
    expect(response.status).toBe(422);
  });

  it("returns 409 when email is already taken", async () => {
    const email = `${randomUUID()}@example.com`;
    const existing = await createUser({ email });

    const response = await app.request("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test",
        email: existing.email,
        password: "password",
      }),
    });
    expect(response.status).toBe(409);

    const body = await response.json();
    expect(body).toEqual({ error: "Conflict" });
  });

  it("returns 201 with user and token for valid input", async () => {
    const email = `${randomUUID()}@example.com`;

    const response = await app.request("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email,
        password: "password123",
      }),
    });
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body).toEqual({
      data: {
        id: expect.any(Number),
        name: "Test User",
        email,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        token: {
          token: expect.stringMatching(/^nq_.{96}$/),
          created_at: expect.any(String),
          expires_at: expect.any(String),
          last_used_at: null,
        },
      },
    });
  });

  it("stores user and token in the database", async () => {
    const email = `${randomUUID()}@example.com`;

    await app.request("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Stored User",
        email,
        password: "password123",
      }),
    });

    const user = await db()
      .selectFrom("users")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst();
    expect(user).toBeDefined();
    expect(user!.name).toBe("Stored User");

    const tokens = await db()
      .selectFrom("tokens")
      .where("user_id", "=", user!.id)
      .selectAll()
      .execute();
    expect(tokens).toHaveLength(1);
    expect(tokens[0]!.selector).toBeDefined();
    expect(tokens[0]!.validator_hash).toBeDefined();
  });
});
