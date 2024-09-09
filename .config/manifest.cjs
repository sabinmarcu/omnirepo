const { DOCS_WORKSPACE_NAME } = require('./documentation.cjs');

module.exports.FIELD_IGNORE_LIST = new Set([
  'root',
  '@sabinmarcu/docs',
]);
module.exports.FIELD_UPDATE_MAP = {
  main: './dist/index.js',
  types: './dist/index.d.ts',
  'exports.["."].import': './dist/index.js',
  'exports.["."].default': './dist/index.js',
  'exports.["."].types': './dist/index.d.ts',
  'exports.["./src/*"].import': './src/*',
  'exports.["./src/*"].default': './src/*',
  'exports.["./*"].import': './dist/*.js',
  'exports.["./*"].default': './dist/*.js',
  'exports.["./*"].types': './dist/*.d.ts',
  'exports.["./package.json"]': './package.json',
  'typeVersions.["*"]["*"][0]': './dist/*',
};
module.exports.CJS_FIELD_UPDATE_MAP = {
  main: './dist/index.cjs',
  types: './dist/index.d.ts',
  'exports.["."].import': './dist/index.cjs',
  'exports.["."].default': './dist/index.cjs',
  'exports.["."].types': './dist/index.d.ts',
  'exports.["./src/*"].import': './src/*',
  'exports.["./src/*"].default': './src/*',
  'exports.["./*"].import': './dist/*.cjs',
  'exports.["./*"].default': './dist/*.cjs',
  'exports.["./*"].types': './dist/*.d.ts',
  'exports.["./package.cjson"]': './package.json',
  'typeVersions.["*"]["*"][0]': './dist/*',
};
module.exports.FIELD_REMOVE_MAP = [
  'exports.["."].require',
  'exports.["./src/*"].require',
  'exports.["./*"].require',
  'module',
  'exports.["./*"].main',
  'exports.["./src/*"].main',
  'exports.["./src/*"].main',
];
module.exports.TREAT_AS_CJS = [
  "@sabinmarcu/commitlint-config-workspaces",
]
module.exports.FIELD_TSCMONO_PRESET_KEY = 'tscmono.preset';
module.exports.FIELD_TSCMONO_PRESETS_KEY = 'tscmono.presets';
module.exports.FIELD_TSCMONO_CONFIG_MAP = {
  workspaces: 'lib',
  'workspaces/components': ['lib', 'react'],
  'workspaces/personal/commitlint-config-workspaces': ["lib", "commonjs"],
  'apps/docs': 'docusaurus',
  'apps/droprate': 'viteApp',
  'apps/team-rotation': 'viteApp',
  'apps/isspacemarine2outyet': 'nextApp',
};
module.exports.REQUIRED_WORKSPACE_IGNORE_LIST = new Set([
  'root',
  '@sabinmarcu/types',
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
