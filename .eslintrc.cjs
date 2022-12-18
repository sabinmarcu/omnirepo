// @ts-check

const { generateTsProjects } = require('@sabinmarcu/eslint-config/utils/generateTsProjects');
const { generateImportResolver } = require('@sabinmarcu/eslint-config/utils/generateImportResolver');
const pkg = require('./package.json');

const tsProjects = generateTsProjects(__dirname, pkg.workspaces);

/** @type import('eslint').Linter.Config */
const config = {
  root: true,
  extends: ['@sabinmarcu'],
  parserOptions: {
    project: tsProjects,
  },
  ...generateImportResolver(tsProjects),
};

module.exports = config;
