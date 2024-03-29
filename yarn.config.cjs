// @ts-check
/* eslint-disable no-continue */

const { defineConfig } = require('@yarnpkg/types');
const { default: moize } = require('moize');

const {
  DOCS_WORKSPACE_EXCLUDES,
  DOCS_WORKSPACE_NAME,
} = require('./.config/documentation.cjs');
const {
  FIELD_IGNORE_LIST,
  FIELD_UPDATE_MAP,
  REQUIRED_WORKSPACE_DEPENDENCIES,
  REQUIRED_WORKSPACE_IGNORE_LIST,
  FIELD_TSCMONO_CONFIG_MAP,
  FIELD_TSCMONO_KEY,
} = require('./.config/manifest.cjs');
const { WORKSPACE_PROTOCOL_RANGE } = require('./.config/yarn.cjs');

/**
 * @typedef {import('@yarnpkg/types').Yarn.Constraints.Workspace} Workspace
 * @typedef {import('@yarnpkg/types').Yarn.Constraints.Dependency} Dependency
 * @typedef {import('@yarnpkg/types').Yarn.Constraints.Context} Context
 */

const getMoonConfigOf = moize.promise(async (path) => {
  const { readFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');
  const { parse } = await import('yaml');

  const moonConfig = parse(readFileSync(resolve(path, 'moon.yml'), 'utf8'));

  return moonConfig;
});

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
 * Ensure that esm, build & tscmono fields are correctly set
 *
 * @param {Context} context
 */
async function ensureFieldConsistency({ Yarn }) {
  for (const workspace of Yarn.workspaces()) {
    for (const [match, preset] of Object.entries(FIELD_TSCMONO_CONFIG_MAP)) {
      if (workspace.cwd.startsWith(match)) {
        workspace.set(FIELD_TSCMONO_KEY, preset);
      }
    }

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

// eslint-disable-next-line unicorn/prevent-abbreviations
async function ensureDocsDependencies({ Yarn }) {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const docsWorkspace = Yarn.workspace({ ident: DOCS_WORKSPACE_NAME });
  for (const workspace of Yarn.workspaces()) {
    if (DOCS_WORKSPACE_EXCLUDES.includes(workspace.ident)) {
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    const moonConfig = await getMoonConfigOf(workspace.cwd);
    if (moonConfig.type === 'library') {
      docsWorkspace.set(`devDependencies.${workspace.ident}`, WORKSPACE_PROTOCOL_RANGE);
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
  await ensureDocsDependencies(context);
}

module.exports = defineConfig({
  constraints,
});
