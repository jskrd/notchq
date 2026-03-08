import { env } from "./env";
import type { paths } from "./types";
import createFetchClient, { Client } from "openapi-fetch";

let client: Client<paths, `${string}/${string}`> | null = null;

export function apiClient(): Client<paths, `${string}/${string}`> {
  if (client === null) {
    client = createFetchClient<paths>({
      baseUrl: env().API_URL,
    });
  }
  return client;
}
