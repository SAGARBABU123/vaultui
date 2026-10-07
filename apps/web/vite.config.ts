import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * Split the bundle so no single chunk is a monolith:
         *  - `vendor-react` / `vendor-icons` / `vendor-supabase` are stable
         *    across app deploys, so their long cache is never invalidated by
         *    an app-code change.
         *  - each `docs/registry-*.tsx` kit becomes its own chunk, fetched in
         *    parallel instead of one ~425 KB `entries` blob.
         */
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            const kit = id.match(/\/docs\/(registry-[a-z-]+)\.tsx?$/);
            return kit ? `kit-${kit[1]}` : undefined;
          }
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) {
            return "vendor-react";
          }
          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("lucide-react")) return "vendor-icons";
          return undefined;
        },
      },
    },
  },
});
