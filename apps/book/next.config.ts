import type { NextConfig } from "next";
import { resolve } from "path";

process.loadEnvFile(resolve(import.meta.dirname, "../../.env"));

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
