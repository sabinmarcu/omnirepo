---
name: repo-ci-checks
description: 'Run repository CI-style validation for Yarn + Moon monorepo changes. Use for pre-PR checks, failing CI triage, lint/test/build validation, and constraints issues.'
argument-hint: 'Optional: project id or scope (for example website, eslint-plugin-logical-properties, full-repo)'
user-invocable: true
---

# Repo CI Checks

## When To Use

- Before opening a PR.
- When CI is failing and root cause is unclear.
- When a change touches shared workspace configuration.
- When you need quick go or no-go confidence for merge readiness.

Before assuming how linting or testing works, read [TESTING_AND_LINTING.md](../../../TESTING_AND_LINTING.md).

## Standard Workflow

1. Install deterministically:
   - `yarn install --immutable`
2. Validate manifest/dependency constraints:
   - `yarn constraints`
3. Run full repository CI task graph:
   - `yarn moon ci`

## Focused Workflow (Optional)

If the user provides a project id `<id>`, run targeted checks first:

1. `yarn moon run <id>:build`
2. `yarn moon run <id>:lint`
3. `yarn moon run <id>:test`

Assume `lint` depends on `build`, and `test` routes through root Vitest workspace mode using the workspace-specific `VITEST_PROJECT` value from `.env`.

Escalate to full `yarn moon ci` when:

- shared configs changed,
- dependency graph changed,
- or targeted checks pass but CI still fails.

## Common Failure Patterns

- Constraint failures:
  - fix manifest/dependency rules first, then rerun `yarn constraints`.
- Lint blocked by build errors:
  - fix TypeScript/build issues before expecting lint to pass.
- TS config drift:
  - rerun `yarn tscmono` when presets or tsconfig generation inputs changed.
- Targeted Vitest mismatch:
  - verify the workspace `.env` contains the expected `VITEST_PROJECT`; rerun `yarn constraints` if the workspace was added or renamed.

## Reporting Format

Return results in this order:

1. Commands executed
2. First failing command (or `none`)
3. Root-cause hypothesis
4. Smallest next fix
5. Whether to escalate to full `yarn moon ci`

## References

- Quality workflow: [TESTING_AND_LINTING.md](../../../TESTING_AND_LINTING.md)
- CI workflow: [\.github/workflows/ci.yml](../../workflows/ci.yml)
- Shared Moon tasks: [\.moon/tasks.yml](../../../.moon/tasks.yml)
- Root task orchestration: [moon.yml](../../../moon.yml)
- Architecture context: [ARCHITECTURE.md](../../../ARCHITECTURE.md)
