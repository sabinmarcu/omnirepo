import type {
  Config,
} from './types.js';

let extension: string = '';
try {
  extension = __filename.split('.').pop()!;
} catch {
  // @ts-ignore
  extension = import.meta.url.split('.').pop()!;
} finally {
  extension = `.${extension}`;
}

const config = {
  extends: [
    './configs/unicorn',
    './configs/js',
    './configs/jsx',
    './configs/ts',
    './configs/tsx',
    './configs/config',
    './configs/ts.expect',
    './configs/module',
    './configs/stories',
    './configs/jest',
    './configs/overrides',
  ].map((path) => require.resolve(path + extension)),
} satisfies Config;

module.exports = config;
