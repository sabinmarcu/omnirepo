---
name: Libraries Workspace Conventions
description: "Use when editing workspaces/libs packages, shared TypeScript libraries, eslint plugins, observable/config/types libs, or storybook addons."
applyTo: "workspaces/libs/**"
---

# Libraries Workspace Conventions

## Scope

- Applies to packages under [workspaces/libs](../../workspaces/libs).
- Use [ARCHITECTURE.md](../../ARCHITECTURE.md) for package boundary context.

## Source And Build Conventions

- Treat `src` as source of truth.
- Do not edit generated outputs (`dist`, `cjs`, `esm`) unless explicitly requested.
- Keep package exports/types aligned with built output paths in each package `package.json`.
- Keep internal workspace dependencies on `workspace:*` unless there is a specific reason not to.

## TypeScript And Tasks

- Prefer changing shared TS behavior in [\.tscmonorc.yml](../../.tscmonorc.yml) or base configs, not ad-hoc drift across package tsconfig files.
- Use Moon project tasks for targeted validation.
- Run focused commands before full-repo checks.

Recommended sequence for touched package `<id>`:

1. `yarn moon run <id>:build`
2. `yarn moon run <id>:lint`
3. `yarn moon run <id>:test`

Then run broader checks if changes affect shared contracts:

- `yarn lint`
- `yarn test`

## ESLint Plugin Notes

- For ESLint plugin packages (for example [workspaces/libs/eslint-plugin-logical-properties](../../workspaces/libs/eslint-plugin-logical-properties)), preserve peer dependency compatibility with supported ESLint versions.
- Prefer rule tests for behavior changes, including both valid and invalid cases.
