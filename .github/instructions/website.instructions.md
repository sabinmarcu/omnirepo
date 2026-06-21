---
name: Website App Conventions
description: "Use when editing apps/website, Next.js app router pages, MDX content, TOC layouts, theme selectors, or website styling."
applyTo: "apps/website/**"
---

# Website App Conventions

## Scope

- Applies to the website application in [apps/website](../../apps/website).
- For architecture context, link to [ARCHITECTURE.md](../../ARCHITECTURE.md) instead of copying it.

## Implementation Rules

- Keep website styling on the Vanilla Extract and theme-contract path described in [STYLING.md](../../STYLING.md).
- Use `@sabinmarcu/website-theme` only inside [apps/website](../../apps/website).
- Do not introduce `@sabinmarcu/website-theme` into non-website packages.
- Preserve the existing TOC flow (build-time metadata and resource models) rather than adding runtime DOM TOC scanning.
- For MDX pages that need TOC entries, use markdown heading syntax so heading metadata can be generated.

## Editing Guardrails

- Prefer small changes in feature-local files (`app`, `components`, `layouts`, `models`, `theme`, `utils`).
- Avoid broad route/layout refactors unless explicitly requested.
- Keep public route behavior stable when changing layout wrappers or metadata pipelines.

## Validation

Run the smallest useful check first, then widen scope only if needed.

1. `yarn moon run website:build`
2. `yarn moon run website:lint`
3. `yarn moon run website:test` (if tests exist for the touched area)

If a change affects shared theme or shared libraries, also run root checks:

- `yarn lint`
- `yarn test`
