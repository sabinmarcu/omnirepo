/* eslint-disable import/no-commonjs */
/* eslint-disable import/no-import-module-exports */
/* eslint-disable unicorn/prefer-module */

import { generateWorkspacesConfig } from './generateWorkspacesConfig';

module.exports = generateWorkspacesConfig([
  'root',
  'repo',
  'ci',
  'docs',
  'deps',
]);
