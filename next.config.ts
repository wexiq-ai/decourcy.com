import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BUILD_TIMESTAMP: new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) + " ET",
  },
};

export default nextConfig;
