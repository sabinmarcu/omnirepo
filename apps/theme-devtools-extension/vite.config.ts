import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const page = (name: string) => fileURLToPath(new URL(`${name}.html`, import.meta.url));

// Extension pages (DevTools page, panel, Elements sidebar). The content script is a separate
// classic-script build (`vite.content.config.ts`) because static content scripts cannot be modules.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'chrome123',
    modulePreload: false,
    rollupOptions: {
      input: {
        devtools: page('devtools'),
        panel: page('panel'),
        sidebar: page('sidebar'),
      },
    },
  },
});
