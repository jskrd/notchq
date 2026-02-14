import { existsSync } from "fs";
import type { NextConfig } from "next";
import { resolve } from "path";

const envPath = resolve(
  import.meta.dirname,
  `../../.env.${process.env["NODE_ENV"]}`,
);
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
