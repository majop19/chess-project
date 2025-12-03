import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import vike from "vike/plugin";
import tailwindcss from "@tailwindcss/vite";
import { root } from "#back/root";

// https://vite.dev/config/
export default defineConfig({
  root: process.env.NODE_ENV === "production" ? undefined : root,
  plugins: [react(), vike(), tailwindcss()],
  server: {
    port: Number(process.env.PORT) || 3000,
  },
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
    emptyOutDir: false,
  },
});
