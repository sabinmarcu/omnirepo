// @ts-check

const { generateTsProjects } = require('@sabinmarcu/eslint-config/utils/generateTsProjects');
const { generateImportResolver } = require('@sabinmarcu/eslint-config/utils/generateImportResolver');
const packageJson = require('./package.json');

const tsProjects = generateTsProjects(__dirname, packageJson.workspaces);

/** @type import('eslint').Linter.Config<any> */
const config = {
  root: true,
  extends: ['@sabinmarcu'],
  parserOptions: {
    project: tsProjects,
  },
  ...generateImportResolver(tsProjects),
  overrides: [
    {
      files: ['**/*Command.?(m|c)ts?(x)'],
      rules: {
        'unicorn/filename-case': [
          'error',
          { case: 'pascalCase' },
        ],
      },
    },
  ],
};

module.exports = config;
