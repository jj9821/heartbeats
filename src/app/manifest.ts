/**
 * PWA Manifest — Next.js native manifest file
 *
 * This generates /manifest.webmanifest at build time.
 * Defines the app name, colors, icons, and display mode for PWA installation.
 */

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Heartbeat — Thinking of You",
    short_name: "Heartbeat",
    description:
      "A private space for two hearts. Send a gentle signal to let your special person know you're thinking of them.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf2f8",
    theme_color: "#f472b6",
    orientation: "portrait",
    categories: ["lifestyle", "social"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
