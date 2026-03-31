import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "layout-adaptor": path.resolve(root, "../packages/core/src/index.ts"),
      "layout-adaptor-vue": path.resolve(root, "../packages/vue/src/index.ts"),
    },
  },
  server: {
    port: 3000,
  },
});
