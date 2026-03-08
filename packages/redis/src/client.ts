import { env } from "@repo/env";
import { createClient } from "redis";

export type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient | null = null;

export async function redis(): Promise<RedisClient> {
  if (!client) {
    client = createClient({
      url: env().REDIS_URL,
    });
    await client.connect();
  }
  return client;
}

export function destroyRedis(): void {
  client?.destroy();
  client = null;
}
