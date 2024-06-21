import type { ESLint } from 'eslint';
import fs from 'node:fs/promises';
import rules from './rules/index.js';

const manifestPath = new URL(
  '../package.json',
  import.meta.url,
);
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as {
  name: string,
  version: string,
};

const plugin = {
  meta: {
    name: manifest.name,
    version: manifest.version,
  },
  rules,
} as const satisfies ESLint.Plugin;

export default plugin;
