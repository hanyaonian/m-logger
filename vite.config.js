const { resolve } = require('path')
const { defineConfig } = require('vite')

export default defineConfig({
  server: {
    open: '/demo/index.html',
  },
  build: {
    target: 'es2018',
    minify: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.ts'),
      output: {
        format: 'esm',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      },
      /** @see link https://rollupjs.org/guide/en/#preserveentrysignatures */
      preserveEntrySignatures: 'strict',
    }
  },
})