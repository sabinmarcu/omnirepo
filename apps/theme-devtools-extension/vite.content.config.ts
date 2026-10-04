import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// Self-contained classic script for `content_scripts` and `scripting.executeScript`.
export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'chrome123',
    lib: {
      entry: fileURLToPath(new URL('src/content.ts', import.meta.url)),
      formats: ['iife'],
      name: 'sabinmarcuThemeDevtoolsContent',
      fileName: () => 'content.js',
    },
  },
});
