import { env } from "./env.ts";
import { createClient } from "redis";

export type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient | null = null;

export async function kvs(): Promise<RedisClient> {
  if (!client) {
    client = createClient({
      url: env().KVS_URL,
    });
    await client.connect();
  }
  return client;
}

export function destroyKvs(): void {
  if (client) {
    client.destroy();
    client = null;
  }
}
