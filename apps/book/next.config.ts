import { env } from "@repo/env";
import type { NextConfig } from "next";

// Load and validate environment variables before the app starts
env();

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
