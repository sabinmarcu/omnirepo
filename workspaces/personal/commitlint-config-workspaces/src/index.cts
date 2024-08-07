/* eslint-disable import/no-commonjs */
/* eslint-disable unicorn/prefer-module */

const { generateWorkspacesConfig } = require('./generateWorkspacesConfig.cjs');

module.exports = generateWorkspacesConfig([
  'root',
  'repo',
  'ci',
  'docs',
  'deps',
]);
