// @ts-check
/* eslint-disable no-continue */

/**
 * @typedef {import('@yarnpkg/types').Yarn.Constraints.Workspace} Workspace
 * @typedef {import('@yarnpkg/types').Yarn.Constraints.Dependency} Dependency
 * @typedef {import('@yarnpkg/types').Yarn.Constraints.Context} Context
 */

/** @type {import('@yarnpkg/types')} */
const { defineConfig } = require('@yarnpkg/types');

const WORKSPACE_PROTOCOL_RANGE = 'workspace:*';
const FIELD_IGNORE_LIST = new Set(['root']);
const FIELD_UPDATE_MAP = {
  type: 'module',
  main: './cjs/index.cjs',
  module: './esm/index.mjs',
  'exports.["."].require': './cjs/index.cjs',
  'exports.["."].import': './esm/index.mjs',
  'exports.["./src/*"].require': './src/*',
  'exports.["./src/*"].import': './src/*',
  'exports.["./*"].require': './cjs/*.cjs',
  'exports.["./*"].import': './esm/*.mjs',
  'exports.["./package.json"]': './package.json',
  'typeVersions.["*"]["*"][0]': './esm/*',
  'build.preset': '../../../.config/build.config.ts',
  'tscmono.preset': 'lib',
};
const REQUIRED_WORKSPACE_IGNORE_LIST = new Set(['root']);
const REQUIRED_WORKSPACE_DEPENDENCIES = {
  devDependencies: [
    '@sabinmarcu/types',
    '@sabinmarcu/utils-test',
  ],
};

/**
 * Ensure that all workspace dependencies are using workspace protocol
 *
 * @param {Context} context
 */
async function ensureWorkspaceProtocol({ Yarn }) {
  for (const dependency of Yarn.dependencies()) {
    if (
      Yarn.workspace({ ident: dependency.ident })
      && dependency.range !== WORKSPACE_PROTOCOL_RANGE
    ) {
      dependency.update(WORKSPACE_PROTOCOL_RANGE);
    }
  }
}

/**
 * This rule will enforce that a workspace MUST depend on the same version of
 * a dependency as the one used by the other workspaces.
 *
 * @param {Context} context
 */
async function enforceConsistentDependenciesAcrossTheProject({ Yarn }) {
  for (const dependency of Yarn.dependencies()) {
    if (dependency.type === 'peerDependencies') {
      continue;
    }

    if (Yarn.workspace({ ident: dependency.ident })) {
      continue;
    }

    for (const otherDependency of Yarn.dependencies({ ident: dependency.ident })) {
      if (otherDependency.type === 'peerDependencies') {
        continue;
      }

      dependency.update(otherDependency.range);
    }
  }
}

/**
 * Ensure that esm,build & tscmono fields are correctly set
 *
 * @param {Context} context
 */
async function ensureFieldConsistency({ Yarn }) {
  for (const workspace of Yarn.workspaces()) {
    if (FIELD_IGNORE_LIST.has(`${workspace.ident}`)) {
      continue;
    }

    for (const [field, value] of Object.entries(FIELD_UPDATE_MAP)) {
      workspace.set(field, value);
    }
  }
}

/**
 * Ensure required dependencies for all packages
 *
 * @param {Context} context
 */
async function ensureRequiredDependencies({ Yarn }) {
  for (const workspace of Yarn.workspaces()) {
    if (REQUIRED_WORKSPACE_IGNORE_LIST.has(`${workspace.ident}`)) {
      continue;
    }

    for (const [type, dependencies] of Object.entries(REQUIRED_WORKSPACE_DEPENDENCIES)) {
      for (const dependency of dependencies) {
        if (workspace.ident === dependency) {
          continue;
        }
        workspace.set(`${type}.${dependency}`, WORKSPACE_PROTOCOL_RANGE);
      }
    }
  }
}

/**
 * A collection of all constraints defined in this file
 *
 * @param {Context} context
 */
async function constraints(context) {
  await ensureWorkspaceProtocol(context);
  await enforceConsistentDependenciesAcrossTheProject(context);
  await ensureFieldConsistency(context);
  await ensureRequiredDependencies(context);
}

module.exports = defineConfig({
  constraints,
});
