import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

/**
 * Serwist PWA integration
 * Compiles src/sw.ts into the service worker at build time
 */
const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  // Allow loading Google profile images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

export default withSerwist(nextConfig);
