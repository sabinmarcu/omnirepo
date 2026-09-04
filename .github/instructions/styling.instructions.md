---
name: Styling Conventions
description: "Use when editing styles, themes, design-system components, Vanilla Extract files, Storybook styling, or Turbopack configuration."
applyTo: "{apps,workspaces}/**/*.{css,scss,ts,tsx}"
---

# Styling Conventions

## Choose The Existing Styling Lane

- For the website and design-system packages, use Vanilla Extract (`.css.ts`, `style`, `globalStyle`, and `recipe`) with typed theme contracts.
- Use MUI with Emotion only in its established lane: `apps/droprate`, `apps/team-rotation`, and `workspaces/components/mui-material-theme`.
- Use CSS Modules in the documentation app, and preserve its existing plain CSS only where it is already established (such as Storybook shell styles).
- Do not introduce a new styling system into an existing lane without an explicit architectural reason.

## Theme Boundaries

- Use `@sabinmarcu/theme` for shared applications, libraries, components, and design-system packages.
- `@sabinmarcu/website-theme` is exclusive to `apps/website`; never add it to another app or workspace package.
- Use `theme` contract tokens before literals for colors, spacing, and breakpoints. Do not create an untyped CSS variable when an existing token can represent the value.
- The website theme uses `data-theme-family` for section families and `data-theme-variant` for `light`, `dark`, and `system`. Preserve those selectors and their runtime wiring.

## Vanilla Extract Authoring

- Use `recipe` and `RecipeVariants` for component variants; use `style` for a local class; reserve `globalStyle` for structural or cross-node selectors.
- Keep theme family and color-variant behavior in data-attribute selectors rather than scattered hardcoded values.
- Ensure generated theme CSS remains imported by the relevant application entry point; token references otherwise resolve to undefined CSS custom properties.
- When a pseudo-element needs themed custom properties, declare the variables and responsive overrides on its parent rule so the pseudo-element inherits them.
- Do not nest `@media` rules that assign `vars` inside a pseudo-element or selector object. Vanilla Extract's Turbopack compiler can emit invalid virtual CSS for that pattern. Put the `vars` and `@media` block on the owning style rule instead.

## Website Styling

- The website uses Vanilla Extract, `@sabinmarcu/theme`, and `@sabinmarcu/website-theme`; retain this path for pages, layouts, components, and MDX presentation.
- The theme setup and selector wiring must remain intact: `apps/website/theme/theme.css.ts` emits token values, and the localized root layout sets the variant attribute.
- Use `withTheme` or the established theme selectors when a component needs a specific website family.
- Keep the build-time MDX TOC pipeline; do not replace it with runtime DOM scanning.

## Storybook Styling

- Keep `@sabinmarcu/theme-storybook` responsible for applying theme runtime values to Storybook.
- Keep `theme-overrider` configuration token-driven and preserve `mirror-preview` entries that mirror the theme stylesheet into Storybook manager UI.

## Next.js Turbopack And Vanilla Extract

- The website is configured for Turbopack through `next dev` and `next build`. Keep `createVanillaExtractPlugin` configured with `unstable_turbopack.mode: 'auto'` and source-style globs for `.css.ts` and `.css.tsx`.
- The website's MDX plugins must use Turbopack-serializable configuration. Use package-name strings for default-export plugins; use local default-export adapter modules when a plugin only exports a named attacher (currently CodeHike and `remark-mdx-toc`).
- Use absolute paths for local MDX plugin adapters in `next.config.ts`; `@next/mdx` resolves plugin paths relative to each MDX source file.
- Validate both the production build and representative interactive routes after changing Vanilla Extract, MDX, or Turbopack configuration. Include a CodeHike MDX route, theme selection, and navigation in the smoke test.
- Treat Turbopack warnings about `process.cwd()` and dynamic filesystem access as deployment-size risks. Prefer statically scoped paths or intentionally suppress only a reviewed false positive.

## Validation

- For website style, theme, MDX, or Turbopack changes, run `yarn moon run website:build` first.
- Then run `yarn vitest --run --project @sabinmarcu/website` when the affected behavior has website coverage.
- Run `yarn eslint --fix` from the relevant workspace for every edited source file.
- For changes to shared theme or Storybook styling packages, also run the applicable root lint and test commands.