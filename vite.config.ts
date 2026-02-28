import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Split vendor libraries into their own chunk — browsers cache it separately
    // from app code, so a code change doesn't bust the React/DOM cache entry.
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          seo:    ["react-helmet-async"],
        },
      },
    },
    // Raise the warning threshold slightly; our CSS is intentionally large.
    chunkSizeWarningLimit: 600,
    // Ensure assets include content hashes for long-lived cache headers.
    assetsInlineLimit: 4096,
  },
});
