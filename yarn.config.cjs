// @ts-check
/* eslint-disable no-continue */

const { defineConfig } = require('@yarnpkg/types');
const { default: moize } = require('moize');

const {
  DOCS_WORKSPACE_EXCLUDES,
  DOCS_WORKSPACE_NAME,
  STORYBOOK_WORKSPACE_NAME,
  STORYBOOK_WORKSPACE_PATHS,
} = require('./.config/documentation.cjs');
const {
  FIELD_IGNORE_LIST,
  FIELD_UPDATE_MAP,
  REQUIRED_WORKSPACE_DEPENDENCIES,
  REQUIRED_WORKSPACE_IGNORE_LIST,
  FIELD_TSCMONO_CONFIG_MAP,
  FIELD_TSCMONO_PRESET_KEY,
  FIELD_TSCMONO_PRESETS_KEY,
  MODULE_DEPENDENCY_ENFORCEMENT_FIELD_LIST,
  TREAT_AS_CJS,
  CJS_FIELD_UPDATE_MAP,
} = require('./.config/manifest.cjs');
const { WORKSPACE_PROTOCOL_RANGE } = require('./.config/yarn.cjs');

/**
 * @typedef {import('@yarnpkg/types').Yarn.Constraints.Workspace} Workspace
 * @typedef {import('@yarnpkg/types').Yarn.Constraints.Dependency} Dependency
 * @typedef {import('@yarnpkg/types').Yarn.Constraints.Context} Context
 */

const getMoonConfigOf = moize.promise(async (path) => {
  const { readFileSync } = await import('node:fs');
  // eslint-disable-next-line unicorn/import-style
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

const shouldSkipConsistentDependencyEnforcement = (dependency) => {
  if (MODULE_DEPENDENCY_ENFORCEMENT_FIELD_LIST.includes(dependency.type)) {
    return true;
  }
  if (!dependency.workspace.pkg[dependency.type]?.[dependency.ident]) {
    return true;
  }
  return false;
};
/**
 * This rule will enforce that a workspace MUST depend on the same version of
 * a dependency as the one used by the other workspaces.
 *
 * @param {Context} context
 */
async function enforceConsistentDependenciesAcrossTheProject({ Yarn }) {
  for (const dependency of Yarn.dependencies()) {
    if (shouldSkipConsistentDependencyEnforcement(dependency)) {
      continue;
    }

    if (Yarn.workspace({ ident: dependency.ident })) {
      continue;
    }

    for (const otherDependency of Yarn.dependencies({ ident: dependency.ident })) {
      if (shouldSkipConsistentDependencyEnforcement(otherDependency)) {
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
    const matches = [];
    for (const [match, presetOrPresets] of Object.entries(FIELD_TSCMONO_CONFIG_MAP)) {
      if (workspace.cwd.startsWith(match)) {
        matches.push([match, presetOrPresets]);
      }
    }

    if (matches.length > 0) {
      const [[, match]] = matches.sort(([a], [b]) => b.length - a.length);
      if (Array.isArray(match)) {
        for (const [index, value] of Object.entries(match)) {
          workspace.set(`${FIELD_TSCMONO_PRESETS_KEY}[${index}]`, value);
        }
      } else {
        workspace.set(FIELD_TSCMONO_PRESET_KEY, match);
      }
    }

    if (FIELD_IGNORE_LIST.has(`${workspace.ident}`)) {
      continue;
    }

    const fields = TREAT_AS_CJS.includes(`${workspace.ident}`)
      ? CJS_FIELD_UPDATE_MAP
      : FIELD_UPDATE_MAP;

    for (const [field, value] of Object.entries(fields)) {
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

    const moonConfig = await getMoonConfigOf(workspace.cwd);
    if (moonConfig.type === 'library') {
      docsWorkspace.set(`devDependencies.${workspace.ident}`, WORKSPACE_PROTOCOL_RANGE);
    }
  }
}

async function ensureStorybookDependencies({ Yarn }) {
  const storybookWorkspace = Yarn.workspace({ ident: STORYBOOK_WORKSPACE_NAME });
  for (const workspace of Yarn.workspaces()) {
    if (workspace.ident === storybookWorkspace.ident) {
      continue;
    }
    if (!STORYBOOK_WORKSPACE_PATHS.some(
      (workspacePath) => workspace.cwd.includes(workspacePath),
    )) {
      continue;
    }
    const moonConfig = await getMoonConfigOf(workspace.cwd);
    if (moonConfig.type === 'library') {
      storybookWorkspace.set(`peerDependencies.${workspace.ident}`, WORKSPACE_PROTOCOL_RANGE);
    }
  }
}

/**
 * Ensure each package has the correct homepage and repository fields
 *
 * @param {Context} context
 */
async function ensureHomepageAndRepository({ Yarn }) {
  const rootWorkspace = Yarn.workspace({ ident: 'root' });
  const { homepage, repository } = rootWorkspace?.manifest ?? {};
  for (const workspace of Yarn.workspaces()) {
    if (workspace.ident !== 'root' && !workspace.cwd.includes('apps')) {
      const workspaceSplit = workspace.ident?.split('/') ?? [];
      const workspaceHomepage = `${homepage}/api/${workspaceSplit.at(-1)}`
        .replaceAll(/\/{2,}/g, '/');
      workspace.set('repository.url', repository.url);
      workspace.set('repository.directory', workspace.cwd);
      workspace.set('repository.type', repository.type);
      workspace.set('homepage', workspaceHomepage);
    }
  }
}

/**
 * Ensure that all are type:module unless otherwise specified
 *
 * @param {Context} context
 */
async function ensureTypeModule({ Yarn }) {
  for (const workspace of Yarn.workspaces()) {
    if (FIELD_IGNORE_LIST.has(`${workspace.ident}`)) {
      continue;
    }

    const type = TREAT_AS_CJS.includes(`${workspace.ident}`)
      ? 'commonjs'
      : 'module';
    workspace.set('type', type);
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
  await ensureStorybookDependencies(context);
  await ensureHomepageAndRepository(context);
  await ensureTypeModule(context);
}

module.exports = defineConfig({
  constraints,
});