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

## TypeScript Conventions

- Presets are managed in [\.tscmonorc.yml](.tscmonorc.yml).
- Avoid hand-editing generated per-project TypeScript configs unless intentionally changing generated output patterns.
- Shared roots and references are declared in [tsconfig.base.json](tsconfig.base.json), [tsconfig.build.json](tsconfig.build.json), and [tsconfig.json](tsconfig.json).

## Styling Conventions

- Preferred path for website and design-system work: Vanilla Extract with theme contracts.
- Use [STYLING.md](STYLING.md) as source of truth.
- Important scope rule from [STYLING.md](STYLING.md): `@sabinmarcu/website-theme` is website-only; use `@sabinmarcu/theme` elsewhere.

## CI And Publishing

- CI flow is defined in [\.github/workflows/ci.yml](.github/workflows/ci.yml).
- Main CI steps: immutable install, constraints, `yarn moon ci`.
- Versioning/publish is CI-driven when `.yarn/versions/*` files are present.

## Agent Guardrails

- Prefer `rg`/`rg --files` for search.
- Keep changes focused; do not refactor unrelated files.
- Do not edit generated outputs (`dist`, `.next`, coverage artifacts) unless explicitly requested.
- When uncertain about architecture or boundaries, consult [ARCHITECTURE.md](ARCHITECTURE.md) first.
- Follow conventional commits and repository hooks defined by [\.commitlintrc.yml](.commitlintrc.yml) and [\.husky](.husky).

## High-Value References

- Architecture overview: [ARCHITECTURE.md](ARCHITECTURE.md)
- Styling reference: [STYLING.md](STYLING.md)
- Root task defaults: [\.moon/tasks.yml](.moon/tasks.yml)
- Root orchestration tasks: [moon.yml](moon.yml)
- CI pipeline: [\.github/workflows/ci.yml](.github/workflows/ci.yml)
