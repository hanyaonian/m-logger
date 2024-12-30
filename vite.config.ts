import { resolve } from "path";
import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  server: {
    open: "/demo/index.html?log_level=all",
  },
  build: {
    minify: true,
    emptyOutDir: true,
    lib: {
      name: "MLogger",
      fileName: (format) => {
        if (["es", "esm"].includes(format)) return "index.mjs";
        return `index.${format}.js`;
      },
      formats: ["es", "umd"],
      entry: resolve(__dirname, "src/index.ts"),
    },
    rollupOptions: {
      /** @see link https://rollupjs.org/guide/en/#preserveentrysignatures */
      preserveEntrySignatures: "strict",
      plugins: [typescript({ tsconfig: "./tsconfig.build.json" })],
    },
  },
});
