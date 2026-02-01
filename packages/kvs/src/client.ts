import { env } from "./env.ts";
import { createClient } from "redis";

export type RedisClient = ReturnType<typeof createClient>;

let _client: RedisClient | null = null;

export async function client(): Promise<RedisClient> {
  if (!_client) {
    _client = createClient({
      url: env().KVS_URL,
    });
    await _client.connect();
  }
  return _client;
}

export function destroy(): void {
  if (_client) {
    _client.destroy();
    _client = null;
  }
}
