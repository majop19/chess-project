import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import vike from "vike/plugin";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vike(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: "#front",
        replacement: path.resolve(__dirname, "./src/frontend"),
      },
      {
        find: "#back",
        replacement: path.resolve(__dirname, "./src/server"),
      },
    ],
  },
  build: {
    outDir: "dist/client",
    manifest: true,
    emptyOutDir: false, // ← IMPORTANT pour séparer client/server
  },
});
