import { config } from "dotenv";
import type { NextConfig } from "next";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env"),
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
