import { resolve } from "path";
import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  server: {
    open: "/demo/index.html?log=all",
  },
  build: {
    target: "modules",
    minify: true,
    emptyOutDir: true,
    lib: {
      name: "MLogger",
      fileName: "index",
      entry: resolve(__dirname, "src/index.ts"),
    },
    rollupOptions: {
      /** @see link https://rollupjs.org/guide/en/#preserveentrysignatures */
      preserveEntrySignatures: "strict",
      plugins: [typescript({ tsconfig: "./tsconfig.json" })],
    },
  },
});
