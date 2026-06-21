# Testing And Linting

This document is the canonical reference for how linting, testing, coverage, and their Moon execution paths work in this repository.

## Human Summary

### Canonical Commands

- `yarn lint` runs `yarn moon run :lint`.
- `yarn test` runs `yarn moon run :test`.
- `yarn coverage` runs `vitest --run --coverage` from the repository root.
- `yarn moon ci` is the CI-grade task graph used by GitHub Actions after `yarn constraints`.

### What Actually Runs

- Moon is the task orchestrator. Package-level `package.json` scripts are not the source of truth for repository lint/test execution because Moon task inference from scripts is disabled in [.moon/toolchain.yml](.moon/toolchain.yml).
- Shared project tasks live in [.moon/tasks.yml](.moon/tasks.yml). Root aggregate tasks live in [moon.yml](moon.yml).
- The shared `lint` task runs `eslint` and depends on the local package build plus `eslint-config:build`.
- The shared `test` task routes through the root `testWorkspace` task, which runs Vitest against a single workspace-selected project.

### Linting Model

- Root ESLint config is the flat-config file [eslint.config.js](eslint.config.js).
- That config extends the internal package `@sabinmarcu/eslint-config`, then adds repo-specific overrides.
- Important root overrides:
  - ignore `**/dist`
  - require PascalCase for `*Command.ts` / `*Command.tsx`
  - disable `unicorn/filename-case` in `apps/timer40k`
  - apply Next core-web-vitals rules to `apps/website`
  - ignore `.next`, `out`, `build`, and `next-env.d.ts`

### Testing Model

- Vitest workspace discovery is defined in [vitest.workspace.mjs](vitest.workspace.mjs).
- The workspace file reads the root `workspaces` list from [package.json](package.json), expands each workspace glob to `package.json` files, and registers each workspace directory as a Vitest project.
- Shared test behavior is defined in [vitest.config.mjs](vitest.config.mjs).
- Test file convention is `**/!(*.type).spec.?(m|c)@(j|t)s`.
- `passWithNoTests: true` is enabled, so a workspace without tests does not fail by default.
- Many packages with tests have a local `vitest.config.mjs` that just merges the shared root config.

### Coverage And CI

- Coverage is not enabled during normal `yarn test`; it is enabled only when running `yarn coverage` or `vitest --coverage`.
- CI lives in [.github/workflows/ci.yml](.github/workflows/ci.yml).
- The main CI job runs:
  1. `yarn install --immutable`
  2. `yarn constraints`
  3. `yarn moon ci`
- Coverage is a separate CI job. It first builds non-application projects with Moon, then runs `yarn coverage`, then uploads the root `coverage/` directory to Codecov.

### Pre-Commit Behavior

- Husky pre-commit runs `yarn moon run :lint :test --affected --status=staged`, then `yarn constraints`.
- Husky commit-msg runs `yarn commitlint --edit $1`.
- The practical consequence is that staged changes usually need to pass affected lint/test plus workspace constraints before commit succeeds.

## AI And Agent Detail

### Source Of Truth Files

- Root scripts: [package.json](package.json)
- Shared project tasks: [.moon/tasks.yml](.moon/tasks.yml)
- Root aggregate tasks: [moon.yml](moon.yml)
- Moon workspace discovery: [.moon/workspace.yml](.moon/workspace.yml)
- Moon toolchain behavior: [.moon/toolchain.yml](.moon/toolchain.yml)
- Root ESLint flat config: [eslint.config.js](eslint.config.js)
- Shared ESLint package: [workspaces/personal/eslint-config/src/index.ts](workspaces/personal/eslint-config/src/index.ts)
- Root Vitest config: [vitest.config.mjs](vitest.config.mjs)
- Vitest workspace config: [vitest.workspace.mjs](vitest.workspace.mjs)
- CI workflow: [.github/workflows/ci.yml](.github/workflows/ci.yml)
- Hook entry points: [.husky/pre-commit](.husky/pre-commit), [.husky/commit-msg](.husky/commit-msg)

### Execution Chain

For normal repository usage, assume this command chain:

1. `yarn lint` -> `yarn moon run :lint`
2. `yarn test` -> `yarn moon run :test`
3. Project `:lint` and `:test` tasks inherit from [.moon/tasks.yml](.moon/tasks.yml)
4. Root `testWorkspace` in [moon.yml](moon.yml) invokes Vitest workspace mode

Important: `inferTasksFromScripts: false` in [.moon/toolchain.yml](.moon/toolchain.yml) means package scripts are not automatically converted into Moon tasks. Treat Moon config as canonical.

### Shared Moon Tasks

#### Inherited Project Tasks From `.moon/tasks.yml`

- `build`
  - command: `tsc -b tsconfig.build.json`
  - deps: `root:init`
  - outputs: `dist`
- `dev`
  - command: `tsc -b tsconfig.build.json --watch`
  - deps: `root:init`
  - not run in CI
- `lint`
  - command: `eslint`
  - deps: `~:build`, `eslint-config:build`
  - type: `test`
- `testRaw`
  - command: `moon root:testWorkspace -- --project $VITEST_PROJECT`
  - deps: `~:build`
  - uses `envFile: .env`
  - internal Moon task
- `test`
  - extends `testRaw`
  - adds `--run`
- `testDev`
  - extends `testRaw`
  - watch-like workflow, `persistent: true`, `cache: false`, not run in CI
- `testUi`
  - extends `testRaw`
  - adds `--ui`, `persistent: true`, `cache: false`, not run in CI
- `publish`
  - command: `yarn npm publish --tolerate-republish`
  - deps: `~:build`
  - not run in CI unless explicitly invoked

#### Root Tasks From `moon.yml`

- `init`
  - bootstraps config packages by building `eslint-config` and `commitlint-config-workspaces`
- `lintAll`
  - direct root `eslint` command
- `testAll`
  - direct root `vitest --run`
- `testAllDev`
  - direct root `vitest`
- `testWorkspace`
  - direct root `vitest`
- `coverage`
  - direct root `yarn coverage`

### How Targeted Vitest Execution Works

- Each workspace has a checked-in `.env` file with `VITEST_PROJECT=<workspace ident>`.
- Those `.env` files are written by the Yarn constraint logic in [yarn.config.cjs](yarn.config.cjs).
- The shared Moon `testRaw` task reads that `.env` file and forwards `--project $VITEST_PROJECT` to the root Vitest workspace runner.
- Root `.env` sets `VITEST_PROJECT=root`.
- If a new workspace is added or renamed, `yarn constraints` is part of keeping `.env` and targeted Vitest execution aligned.

### Vitest Configuration Details

- Root shared config in [vitest.config.mjs](vitest.config.mjs):
  - includes `**/!(*.type).spec.?(m|c)@(j|t)s`
  - uses setup file `.config/jest/setupFiles/moize.mjs`
  - enables `passWithNoTests: true`
  - sets root coverage output to `coverage/`
  - excludes `**/index.ts` plus Vitest defaults from coverage
- Vitest workspace discovery in [vitest.workspace.mjs](vitest.workspace.mjs):
  - reads root workspace globs from `package.json`
  - expands them by searching for child `package.json` files
  - passes the resulting workspace directories to `defineWorkspace(...)`
- Local per-package `vitest.config.mjs` files typically just `mergeConfig(configShared)` and exist so each workspace participates as an explicit Vitest project.

### ESLint Configuration Details

- Root config uses ESLint 9 flat config in [eslint.config.js](eslint.config.js).
- It extends the internal package exported from [workspaces/personal/eslint-config/src/index.ts](workspaces/personal/eslint-config/src/index.ts).
- The shared package composes JS, TS, JSX, module, Jest, Vitest, Unicorn, Storybook, type-testing, and logical-properties config layers.
- The shared package has explicit config relaxations for config files and Vitest config files, including `vitest.*.(m|c)?(j|t)s` patterns and `__fixtures__` folders.
- Root-level overrides add repo-specific behavior instead of redefining the full policy package.

### CI And Hook Semantics

- GitHub Actions main CI job runs `yarn install --immutable`, `yarn constraints`, and `yarn moon ci`.
- Separate coverage job builds non-application projects first with `yarn moon run :build --query "projectType!=application"`, then runs root coverage.
- Pre-commit checks use Moon affected/staged filters, so most local commit failures will be narrower than full-repo `yarn lint` or `yarn test` failures.

### Common Assumptions Agents Should Make

- Assume `lint` can fail because `build` failed first. Fix type/build blockers before treating lint output as authoritative.
- Assume targeted `moon run <project>:test` ultimately executes root Vitest workspace mode with a project filter, not an isolated package-local Vitest instance.
- Assume `yarn coverage` is root-wide and not the same thing as `moon run <project>:test`.
- Assume new workspace or rename work may require `yarn constraints` to refresh generated `.env` files used by testing.
- Assume repository CI truth comes from Moon plus Yarn constraints, not from ad-hoc package scripts.

### Recommended Verification Order

For code changes affecting a single project:

1. `yarn moon run <project>:build`
2. `yarn moon run <project>:lint`
3. `yarn moon run <project>:test`

Escalate to:

1. `yarn constraints`
2. `yarn moon ci`

when shared configuration, dependency wiring, task definitions, or repository-wide tooling changes are involved.