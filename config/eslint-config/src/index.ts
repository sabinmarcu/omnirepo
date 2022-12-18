import type {
  Config,
} from './types.js';

let extension: string = '';
try {
  extension = __filename.split('.').pop()!;
} catch (e) {
  // @ts-ignore
  extension = import.meta.url.split('.').pop()!;
} finally {
  extension = `.${extension}`;
}

const config = {
  extends: [
    './configs/js',
    './configs/jsx',
    './configs/ts',
    './configs/tsx',
    './configs/config',
    './configs/ts.expect',
    './configs/module',
    './configs/stories',
    './configs/overrides',
  ].map((path) => require.resolve(path + extension)),
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
  },
} satisfies Config;

module.exports = config;
