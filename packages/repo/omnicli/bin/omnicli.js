#!/usr/bin/env node
/* eslint-disable import/extensions */

const url = await import('node:url');
const { default: jiti } = (await import('jiti'));
const { transform } = await import('../bin-src/transform.mjs');

let filename = '';
try {
  filename = import.meta.url;
} catch {
  // eslint-disable-next-line unicorn/prefer-module
  filename = url.pathToFileURL(__filename);
}

const toPath = (path) => url.fileURLToPath(
  new URL(
    path,
    filename,
  ),
);

jiti(toPath('../src'), {
  sourceMaps: true,
  transform,
})('./cli.ts');
