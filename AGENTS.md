# AGENTS

This repository is a Yarn 4 + Moon monorepo with TypeScript project references.

## Quick Start

1. Install dependencies: `yarn install --immutable`
2. Run tests: `yarn test`
3. Run lint: `yarn lint`
4. Run all CI checks locally: `yarn moon ci`

Use root scripts in [package.json](package.json) for common workflows.

## Project Map

- Apps live in [apps](apps) and are discovered via [\.moon/workspace.yml](.moon/workspace.yml).
- Reusable packages live in [workspaces](workspaces), grouped by domain (`components`, `design-system`, `hooks`, `libs`, `utils`, etc.).
- Global Moon tasks are defined in [\.moon/tasks.yml](.moon/tasks.yml), with root orchestration in [moon.yml](moon.yml).

## Build And Task Conventions

- Default library build is TypeScript project build: `tsc -b tsconfig.build.json` (from [\.moon/tasks.yml](.moon/tasks.yml)).
- Many apps override build/dev commands in local `moon.yml` files (framework-native builds for Next.js, Vite, Docusaurus).
- `lint` depends on build tasks, so TypeScript errors may block lint execution.
- Testing and linting are documented canonically in [TESTING_AND_LINTING.md](TESTING_AND_LINTING.md). Read it before changing quality tooling or assuming how `lint`, `test`, `coverage`, or `moon ci` behave.
- Shared `test` tasks route through root Vitest workspace execution using `--project $VITEST_PROJECT` loaded from each workspace `.env` file.
- Shared `lint` tasks run `eslint` and depend on both the local build and `eslint-config:build`.

## TypeScript Conventions

- Presets are managed in [\.tscmonorc.yml](.tscmonorc.yml).
- Avoid hand-editing generated per-project TypeScript configs unless intentionally changing generated output patterns.
- Shared roots and references are declared in [tsconfig.base.json](tsconfig.base.json), [tsconfig.build.json](tsconfig.build.json), and [tsconfig.json](tsconfig.json).

## Styling Conventions

- Use [styling.instructions.md](.github/instructions/styling.instructions.md) as the source of truth for styling lanes, theme boundaries, website styling, and Turbopack guidance.

## CI And Publishing

- CI flow is defined in [\.github/workflows/ci.yml](.github/workflows/ci.yml).
- Main CI steps: immutable install, constraints, `yarn moon ci`.
- Versioning/publish is CI-driven when `.yarn/versions/*` files are present.

## Agent Customization Files

Customization lives in [\.github](.github) and is shared by VS Code Copilot Chat, Copilot CLI, Copilot cloud agent, and Copilot code review. Do not duplicate these files per tool.

| Location | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Repository-wide agent instructions (this file) |
| [\.github/instructions](.github/instructions) | Path-specific `*.instructions.md`, matched by `applyTo` globs |
| [\.github/instructions/website](.github/instructions/website) | Website-scoped instructions, namespaced by folder |
| [\.github/skills](.github/skills) | Reusable `SKILL.md` workflows |
| [\.github/agents](.github/agents) | Custom `*.agent.md` definitions |

Rules for adding customization:

- Path-specific instruction files must live at or below `.github/instructions`, end in `.instructions.md`, and declare an `applyTo` glob in frontmatter. Subfolders are supported and are the preferred way to namespace by app or domain.
- Put app-specific guidance in a namespaced subfolder, not in the root instructions folder.
- Keep repository-wide guidance in this file; do not add `.github/copilot-instructions.md`, which would duplicate it.
- Prefix website instruction filenames with `website-` so they remain identifiable once loaded, since only the basename is surfaced in some tools.

Verify discovery after changing customization files:

- Copilot CLI: `copilot plugins list --kind instruction` and `copilot skill list`
- VS Code: discovery settings are pinned in [\.vscode/settings.json](.vscode/settings.json)

## Agent Guardrails

- Prefer `rg`/`rg --files` for search.
- Package manager is Yarn Berry (Yarn 4). Only `yarn` commands are allowed.
  - Never use `npx`, `npm`, or `pnpm`.
  - Run installed binaries through Yarn directly: `yarn eslint`, `yarn tsc`, `yarn vitest`.
  - For a binary that is not a dependency, use `yarn dlx <package>`.
- Prefer `lint:fix` over non-fixing `lint` commands.
- After each user message, run `yarn eslint --fix` on every file edited in that work group. Report any remaining findings that ESLint cannot fix.
- Keep changes focused; do not refactor unrelated files.
- Do not edit generated outputs (`dist`, `.next`, coverage artifacts) unless explicitly requested.
- When uncertain about architecture or boundaries, consult [ARCHITECTURE.md](ARCHITECTURE.md) first.
- Follow conventional commits and repository hooks defined by [\.commitlintrc.yml](.commitlintrc.yml) and [\.husky](.husky).

## High-Value References

- Quality workflow: [TESTING_AND_LINTING.md](TESTING_AND_LINTING.md)
- Architecture overview: [ARCHITECTURE.md](ARCHITECTURE.md)
- Styling reference: [styling.instructions.md](.github/instructions/styling.instructions.md)
- Root task defaults: [\.moon/tasks.yml](.moon/tasks.yml)
- Root orchestration tasks: [moon.yml](moon.yml)
- CI pipeline: [\.github/workflows/ci.yml](.github/workflows/ci.yml)
- Agent customization layout: [\.github/instructions](.github/instructions)
