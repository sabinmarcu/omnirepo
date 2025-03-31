import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';

console.log('Loading Config ============================================');

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
});
