// eslint-disable-next-line import/extensions
const { generateWorkspacesConfig } = require('./generateWorkspacesConfig.cjs');

module.exports = generateWorkspacesConfig([
  'root',
  'repo',
  'ci',
  'docs',
  'deps',
]);
