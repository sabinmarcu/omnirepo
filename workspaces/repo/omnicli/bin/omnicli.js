#!/usr/bin/env node

const url = await import('node:url');
const { createJiti } = (await import('jiti'));

let filename = '';
try {
  filename = import.meta.url;
} catch {
  // eslint-disable-next-line unicorn/prefer-module
  filename = url.pathToFileURL(__filename);
}

const jiti = createJiti(filename, {
  sourceMaps: true,
});

const toPath = (path) => url.fileURLToPath(
  new URL(
    path,
    filename,
  ),
);

jiti.import(toPath('../src/cli.ts'));
