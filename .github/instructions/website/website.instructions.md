---
name: Website App Conventions
description: "Use when editing apps/website, Next.js app router pages, MDX content, TOC layouts, theme selectors, or website styling."
applyTo: "apps/website/**"
---

# Website App Conventions

## Scope

- Applies to the website application in [apps/website](../../../apps/website).
- For architecture context, link to [ARCHITECTURE.md](../../../ARCHITECTURE.md) instead of copying it.
- Companion instructions in this folder:
  - [website-models.instructions.md](./website-models.instructions.md) for content resource models.
  - [website-content-translation.instructions.md](./website-content-translation.instructions.md) for MDX content and locale variants.

## Implementation Rules

- Keep website styling on the Vanilla Extract and theme-contract path described in [STYLING.md](../../../STYLING.md).
- Use `@sabinmarcu/website-theme` only inside [apps/website](../../../apps/website).
- Do not introduce `@sabinmarcu/website-theme` into non-website packages.
- Preserve the existing TOC flow (build-time metadata and resource models) rather than adding runtime DOM TOC scanning.
- For MDX pages that need TOC entries, use markdown heading syntax so heading metadata can be generated.

## Routing And i18n

- All public routes live under `app/[locale]/`. There are no non-localized page routes.
- Register every new route in the `pathnames` map in [apps/website/i18n/routing.ts](../../../apps/website/i18n/routing.ts). Localized navigation silently fails for unregistered routes.
- Use the `Link`, `redirect`, and `getPathname` wrappers from [apps/website/i18n/navigation.ts](../../../apps/website/i18n/navigation.ts) rather than importing from `next/link` or `next/navigation` directly.
- Add UI strings to both [en.ts](../../../apps/website/i18n/messages/en.ts) and [ro.ts](../../../apps/website/i18n/messages/ro.ts). Read them with `getTranslations('<namespace>')`.
- Build page metadata through `canonicalMetadata` in [apps/website/i18n/metadata.ts](../../../apps/website/i18n/metadata.ts) so alternates and domain routing stay correct.

## Editing Guardrails

- Prefer small changes in feature-local files (`app`, `components`, `layouts`, `models`, `theme`, `utils`).
- Avoid broad route/layout refactors unless explicitly requested.
- Keep public route behavior stable when changing layout wrappers or metadata pipelines.

## Validation

Run the smallest useful check first, then widen scope only if needed.

1. `yarn moon run website:build`
2. `yarn moon run website:lint`
3. `yarn moon run website:test` (if tests exist for the touched area)

For changes under [apps/website/models](../../../apps/website/models), use the test-first order in [website-models.instructions.md](./website-models.instructions.md) instead; it overrides this order in that scope.

If a change affects shared theme or shared libraries, also run root checks:

- `yarn lint`
- `yarn test`
