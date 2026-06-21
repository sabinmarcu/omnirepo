# Omnirepo Architecture

## Executive Summary (For Human Operators)

This repository is a Yarn 4 + Moon monorepo with TypeScript project references and strict workspace constraints.

- Core orchestration is done by Moon (`.moon/workspace.yml`, root `moon.yml`, `.moon/tasks.yml`), not by ad-hoc npm scripts.
- Dependency and manifest consistency are enforced by Yarn constraints (`yarn.config.cjs`).
- TypeScript config generation and preset alignment are managed by `tscmono` (`.tscmonorc.yml`).
- Testing, linting, coverage, and their Moon execution paths are documented canonically in [TESTING_AND_LINTING.md](TESTING_AND_LINTING.md).
- Package topology is explicit: `apps/*` (application projects) and `workspaces/*/*` (libraries, tooling, and private/internal packages).
- Build defaults are inherited from `.moon/tasks.yml` (`tsc -b tsconfig.build.json`) and overridden in app projects where needed.
- Publishing is centralized through Moon’s `publish` task (`yarn npm publish --tolerate-republish`) and CI, with versioning applied via `yarn version apply --all` when version-request files exist.
- Commit messages are intended to follow Conventional Commits with required scope (commitlint + custom workspace scope config); for this analysis, non-pattern outliers are treated as WIP-only and excluded.

---

## Detailed Reference (For AIs And Agents)

## 1) Repository Topology

### 1.1 Root Layout

- Root manifest: `package.json`
- Workspace discovery: `.moon/workspace.yml`
- Global Moon tasks: `.moon/tasks.yml` and root `moon.yml`
- TypeScript monorepo references:
  - root: `tsconfig.json`, `tsconfig.build.json`
  - category aggregators: `apps/tsconfig*.json`, `workspaces/tsconfig*.json`
- Yarn constraints and normalization: `yarn.config.cjs`, `.config/manifest.cjs`, `.config/yarn.cjs`
- Commit policy: `.commitlintrc.yml`, `.husky/commit-msg`, `.husky/pre-commit`
- CI pipeline: `.github/workflows/ci.yml`

### 1.2 Project Discovery

Moon discovers projects via:

- `workspaces/*/*`
- `apps/*`

and tracks VCS against `master` (`.moon/workspace.yml`).

## 2) Tooling Stack And Operation

### 2.1 Package + Dependency Management

- Yarn Berry v4.5.1 (`packageManager` in root `package.json`, `.yarnrc.yml`)
- Node linker: `node-modules` (`.yarnrc.yml`)
- Internal deps use workspace protocol (`workspace:*`) and are auto-corrected by constraints (`yarn.config.cjs`, `.config/yarn.cjs`).

### 2.2 Task Orchestration (Moon)

Moon controls default build/lint/test/dev/publish behavior.

Global shared tasks are defined in `.moon/tasks.yml`:

- `build`: `tsc -b tsconfig.build.json`
- `dev`: `tsc -b tsconfig.build.json --watch`
- `lint`: `eslint`
- `test`: wraps vitest workspace execution through `root:testWorkspace`
- `publish`: `yarn npm publish --tolerate-republish` (not run automatically in CI unless explicitly invoked)

Root orchestration tasks live in root `moon.yml`:

- `init`: ensures internal config packages are built first (`eslint-config`, `commitlint-config-workspaces`)
- aggregate jobs such as `lintAll`, `testAll`, `buildAll`, `clean`, `tsconfig`

### 2.3 Language + Build Tooling

- TypeScript 6.x across repo
- `tscmono` presets in `.tscmonorc.yml` map project classes to consistent compiler behaviors:
  - `lib`, `commonjs`, `react`, `viteApp`, `nextApp`, `storybook`, `docusaurus`, `build`
- Moon toolchain (`.moon/toolchain.yml`) enables TS project-reference sync and disables script inference.

### 2.4 App Framework Tooling

- Next.js apps: `apps/website`, `apps/timer40k`
- Vite apps: `apps/droprate`, `apps/team-rotation`
- Docusaurus docs: `apps/docs`
- Storybook app shell: `apps/storybook`

### 2.5 Quality Tooling

- ESLint flat config at root (`eslint.config.js`) extending workspace package `@sabinmarcu/eslint-config`
- Vitest workspace setup (`vitest.workspace.mjs`)
- Shared Moon `lint` depends on `~:build` and `eslint-config:build`; shared `test` routes through `root:testWorkspace` with `--project $VITEST_PROJECT`
- Per-workspace `.env` files provide `VITEST_PROJECT` and are maintained by Yarn constraint logic in `yarn.config.cjs`
- Husky hooks enforce commit and staged quality checks:
  - `commit-msg`: `yarn commitlint --edit $1`
  - `pre-commit`: affected lint+test and `yarn constraints`

Canonical quality reference: [TESTING_AND_LINTING.md](TESTING_AND_LINTING.md)

## 3) Workspace Inventory Grouped By Path And Purpose

Applications are listed separately as requested.

## 3.1 Applications (`apps/*`)

- `apps/docs` (`@sabinmarcu/docs`): private Docusaurus documentation portal
- `apps/droprate` (`@sabinmarcu/droprate`): private Vite + React + Jotai + MUI application
- `apps/storybook` (`@sabinmarcu/storybook`): Storybook workspace host for component/addon ecosystems
- `apps/team-rotation` (`@sabinmarcu/team-rotation`): private Vite + React scheduling app
- `apps/timer40k` (`@sabinmarcu/timer40k`): private Next.js app
- `apps/website` (`@sabinmarcu/website`): private Next.js site and content platform

Common app traits:

- Moon `type: application`
- Local app build commands override shared TS build where framework build is needed
- Most are `private: true` (storybook is the notable exception by manifest field)
- Heavily reuse internal libraries via workspace dependencies

## 3.2 Workspace Packages (`workspaces/*/*`)

### Components (`workspaces/components`)

- `@sabinmarcu/moving-mesh-background` (library): reusable visual/animated background component
- `@sabinmarcu/mui-material-theme` (library): MUI theme utilities and integration

### Design System (`workspaces/design-system`)

- `@sabinmarcu/theme` (library): core theme system
- `@sabinmarcu/theme-storybook` (library): storybook-specific theme bridge

### Hooks (`workspaces/hooks`)

- `@sabinmarcu/use-duplicate-ref` (library)
- `@sabinmarcu/use-local-storage` (library)
- `@sabinmarcu/use-match-media` (library)
- `@sabinmarcu/use-prefers-reduced-motion` (library)

Purpose: focused reusable React hooks used by components/apps.

### Libraries (`workspaces/libs`)

- `@sabinmarcu/config` (library)
- `@sabinmarcu/debug` (library)
- `eslint-plugin-logical-properties` (library, unscoped package name)
- `@sabinmarcu/jotai-storage-adapter-querystring` (library)
- `@sabinmarcu/observable` (library)
- `@sabinmarcu/storybook-addon-mirror-preview` (library)
- `@sabinmarcu/storybook-addon-split-toolbars` (library)
- `@sabinmarcu/storybook-addon-theme-overrider` (library)
- `@sabinmarcu/stylesheet` (library)
- `@sabinmarcu/types` (library)

Purpose clusters:

- Core primitives/runtime (`types`, `observable`, `config`, `debug`)
- Storybook addon ecosystem
- Styling/theming support (`stylesheet`)
- Lint/plugin support (`eslint-plugin-logical-properties`)
- State adapter (`jotai-storage-adapter-querystring`)

### Personal Tooling (`workspaces/personal`)

- `@sabinmarcu/commitlint-config-workspaces` (library, CommonJS target)
- `@sabinmarcu/eslint-config` (library)

Purpose: repository-wide policy packages used by all projects.

### Private/Internal (`workspaces/private`)

- `@sabinmarcu/website-theme` (library)

Purpose: internal website theming package.

Important nuance:

- Folder is named `private`, but package is not marked `private: true`.
- Publish task is explicitly excluded via `workspaces/private/website-theme/moon.yml` inherited tasks.

### Repo Tooling (`workspaces/repo`)

- `@sabinmarcu/omnicli` (Moon `type: tool`, `private: true`)

Purpose: repository maintenance CLI.

### Utilities (`workspaces/utils`)

- `@sabinmarcu/utils-fs` (library)
- `@sabinmarcu/utils-path` (library)
- `@sabinmarcu/utils-primitives` (library)
- `@sabinmarcu/utils-repo` (library)
- `@sabinmarcu/utils-string` (library)
- `@sabinmarcu/utils-test` (library)

Purpose: foundational utility layer used across almost all other packages.

## 4) Commonalities Across Packages

### 4.1 Structural Commonalities

- Most non-app projects are Moon `type: library`.
- Most publishable workspaces define:
  - explicit `version`
  - `publishConfig.access: public`
  - standardized exports/main/types fields (often normalized by constraints)
  - `tscmono` preset metadata
- Required dev dependencies are enforced for most projects by constraints:
  - `@sabinmarcu/types`
  - `@sabinmarcu/utils-test`

### 4.2 Dependency Commonalities

- Extensive internal linking through workspace protocol.
- Apps pull from components, hooks, libs, and theme packages.
- Policy packages (`eslint-config`, `commitlint-config-workspaces`) are root bootstrapping dependencies.

### 4.3 Configuration Commonalities

- Shared TypeScript inheritance via root and category-level references.
- Shared lint baseline via `@sabinmarcu/eslint-config` + root overrides.
- Shared task model through Moon inherited tasks.

## 5) Build Model Grouped By Package Type

## 5.1 Default Build Path (Libraries/Tools)

Default shared Moon build task:

- Command: `tsc -b tsconfig.build.json`
- Output convention: `dist` (based on task outputs and package export fields)
- Dependency bootstrapping: build depends on `root:init`

This applies unless a project overrides tasks in its `moon.yml`.

## 5.2 Application Build Path

Applications override build/start to framework-native commands and disable cache for those tasks.

- Next apps: `yarn build` / `yarn dev`
- Vite apps: `yarn build` / `yarn dev`
- Docs: `docusaurus build` / `docusaurus start`
- Storybook: `storybook build` / `storybook dev`

App build tasks often set `runInCI: false` at project level, while CI still runs Moon pipelines where applicable.

## 5.3 Special Cases

- `@sabinmarcu/types` explicitly removes default dev/build deps in `moon.yml` (`mergeDeps: replace`).
- `@sabinmarcu/eslint-config` build depends on `eslint-plugin-logical-properties:build`.
- `@sabinmarcu/commitlint-config-workspaces` is treated as CommonJS by constraints (`TREAT_AS_CJS`).
- `@sabinmarcu/website-theme` excludes publish inherited task despite public-style manifest fields.

## 6) Publishing And Versioning Model

## 6.1 Publishing Execution

Publishing is centralized via Moon:

- Task: `publish` in `.moon/tasks.yml`
- Command: `yarn npm publish --tolerate-republish`
- Precondition: `~:build`
- CI behavior: task itself has `runInCI: false`, but CI explicitly invokes `yarn moon run :publish` in versioning job.

Auth/token sources:

- `.yarnrc.yml` uses `YARN_NPM_AUTH_TOKEN`
- CI maps secret `NPM_TOKEN` into `YARN_NPM_AUTH_TOKEN`

## 6.2 Versioning Trigger + Apply

Versioning is CI-driven:

1. CI checks for files matching `.yarn/versions/*`
2. If present on `master`, versioning job runs:
   - `yarn version apply --all`
   - `yarn moon run :publish`
3. CI commits resulting manifest changes with:
   - `chore(ci): Automatic Versioning`

Observed current state:

- `.yarn/versions/` is absent in working tree, meaning no pending version requests at this moment.

## 6.3 Publish Grouping (Practical)

Publishable by configuration pattern:

- Most `workspaces/libs/*`, `workspaces/utils/*`, `workspaces/hooks/*`, `workspaces/components/*`, `workspaces/design-system/*`, `workspaces/personal/*`

Not intended to publish:

- Private apps (`apps/*` mostly `private: true`)
- `@sabinmarcu/omnicli` (`private: true`)
- `@sabinmarcu/website-theme` (publish task excluded in Moon)

## 7) Commit Format Analysis (Excluding WIP) And Package Relation

## 7.1 Enforced Format (Policy)

Commitlint configuration (`.commitlintrc.yml`) extends:

- `@commitlint/config-conventional`
- `@sabinmarcu/commitlint-config-workspaces`

Custom rules from `workspaces/personal/commitlint-config-workspaces/src/generateWorkspacesConfig.cts`:

- `scope-empty`: forbidden (`scope` required)
- `scope-enum`: must be in generated workspace aliases + extra scopes (`root`, `repo`, `ci`, `docs`, `deps`)

This creates intended commit format:

- `<type>(<workspace-scope>): <subject>`

## 7.2 Observed History Pattern

Recent history (excluding WIP commits) is treated as:

- Compliant conventional commits, e.g.:
  - `feat(website-theme): ...`
  - `fix(root): ...`
  - `chore(ci): Automatic Versioning`

Interpretation:

- Repository intent is strict scoped conventional commits.
- Latest non-pattern commit messages are WIP-oriented and are intentionally excluded from commit-format conclusions.

## 7.3 Relationship Between Commit Scope And Packages

When conventional format is followed:

- Scope maps cleanly to package or operational domain (`theme`, `storybook`, `root`, `ci`, etc.)
- This supports package-centric reasoning for release notes and ownership.

When not followed:

- Scope-to-package mapping becomes heuristic and ambiguous.

Agent guidance:

- Always generate commits with valid scoped conventional format.
- Prefer exact workspace alias/package scope when touching a single package.
- Use cross-cutting scopes (`root`, `ci`, `docs`, `deps`) only for broad changes.

## 8) Operational Playbook For AI Agents

## 8.1 Before Editing

- Read target project `moon.yml` to confirm `type`, local task overrides, and dependencies.
- Read target `package.json` for:
  - `private`
  - `publishConfig`
  - `tscmono`
  - workspace dependency usage
- If changing exports/version/dependencies, run/consider `yarn constraints` behavior from `yarn.config.cjs`.

## 8.2 While Implementing

- Respect workspace protocol for internal deps (`workspace:*` unless intentionally different).
- Preserve Moon task inheritance unless project-specific behavior is required.
- Keep app builds framework-native; keep libraries aligned with shared TS build model.

## 8.3 Validation Sequence

Suggested minimal validation order:

1. `yarn constraints`
2. `yarn moon run :lint --affected`
3. `yarn moon run :test --affected`
4. `yarn moon run :build --affected`

For repo-wide confidence:

- `yarn moon ci`

## 8.4 Releasing Changes

If your change should publish:

- Ensure target package is actually publish-eligible (not `private`, not excluded from publish task).
- Ensure versioning request files are present (Yarn version workflow) before expecting CI publish.
- Do not manually bypass CI release flow unless intentionally doing a one-off publish.

## 8.5 Commit Guidance

Use scoped conventional commits and avoid WIP messages.

Recommended templates:

- `feat(<workspace-or-package-scope>): <summary>`
- `fix(<workspace-or-package-scope>): <summary>`
- `chore(root): <summary>`
- `chore(ci): <summary>`

## 9) Quick Classification Matrix

- Orchestrator: Moon
- Package manager: Yarn 4
- Language/build backbone: TypeScript + tscmono + project references
- Unit test runner: Vitest
- Linting: ESLint flat config + shared internal config
- Docs app: Docusaurus
- Component workbench: Storybook
- Commit policy: commitlint + custom workspace scope generator
- Release/versioning: Yarn version apply + Moon publish in CI

## 10) Notes On Uncertainty

- No dedicated release/changelog generator config is visible at root (release behavior is CI + version-apply centric).
- Some package manifests in apps include library-like export fields despite being `private`; treat Moon type and CI paths as source of truth for behavior.
- Commit analysis in this document intentionally excludes WIP/outlier commits that do not follow the commit pattern.
