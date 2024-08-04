const { DOCS_WORKSPACE_NAME } = require('./documentation.cjs');

module.exports.FIELD_IGNORE_LIST = new Set([
  'root',
  '@sabinmarcu/docs',
]);
module.exports.FIELD_UPDATE_MAP = {
  type: 'module',
  main: './cjs/index.cjs',
  module: './esm/index.mjs',
  types: './esm/index.d.ts',
  'exports.["."].require': './cjs/index.cjs',
  'exports.["."].import': './esm/index.mjs',
  'exports.["."].types': './esm/index.d.ts',
  'exports.["./src/*"].require': './src/*',
  'exports.["./src/*"].import': './src/*',
  'exports.["./*"].require': './cjs/*.cjs',
  'exports.["./*"].import': './esm/*.mjs',
  'exports.["./*"].types': './esm/*.d.ts',
  'exports.["./package.json"]': './package.json',
  'typeVersions.["*"]["*"][0]': './esm/*',
  'build.preset': '../../../.config/build.config.ts',
};
module.exports.FIELD_TSCMONO_KEY = 'tscmono.preset';
module.exports.FIELD_TSCMONO_CONFIG_MAP = {
  packages: 'lib',
  'apps/docs': 'docusaurus',
};
module.exports.REQUIRED_WORKSPACE_IGNORE_LIST = new Set([
  'root',
  DOCS_WORKSPACE_NAME,
]);
module.exports.REQUIRED_WORKSPACE_DEPENDENCIES = {
  devDependencies: [
    '@sabinmarcu/types',
    '@sabinmarcu/utils-test',
  ],
};
module.exports.MODULE_DEPENDENCY_ENFORCEMENT_FIELD_LIST = [
  'peerDependencies',
  'optionalDependencies',
]
