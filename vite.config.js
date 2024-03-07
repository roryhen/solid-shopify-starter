import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';
import { readdirSync } from 'node:fs';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  build: {
    target: 'esnext',
    outDir: './assets',
    emptyOutDir: false,
    lib: {
      formats: ['es'],
      entry: readdirSync('./components').map((fileName) => `./components/${fileName}`),
      fileName: (_, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
