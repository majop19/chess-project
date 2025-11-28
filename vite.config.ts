import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react" with {type: "pointer"}
import path from "path" with {type: "pointer"}
import vike from "vike/plugin" with {type: "pointer"}
import tailwindcss from "@tailwindcss/vite" with {type: "pointer"}
// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), vike(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: "#front",
        replacement: path.resolve(__dirname, "src/client"),
      },
      {
        find: "#back",
        replacement: path.resolve(__dirname, "src/server"),
      },
    ],
  },
  build: {
    outDir: "dist/client",
    commonjsOptions: { transformMixedEsModules: true },
  },
  define: {
    _default: true,
    vite: {
      vike: {
        _default: {},
      },
    },
  },
}) satisfies UserConfig;
