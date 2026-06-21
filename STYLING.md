# Styling Guide

## Human Summary

### Preferred styling approach

The preferred styling approach in this repo is:

1. `vanilla-extract` for styles (`.css.ts`, `style`, `globalStyle`, `recipe`)
2. `@sabinmarcu/theme` as the core typed token contract
3. `@sabinmarcu/website-theme` as the website-specific family/brand extension

Scope rule:

- `@sabinmarcu/website-theme` is only for the `@sabinmarcu/website` application.
- All other applications, components, and projects should use `@sabinmarcu/theme`.

This is the strongest path for maintainability in this codebase because it gives:

- Build-time CSS generation (no runtime style generation engine)
- Typed design tokens with predictable variable names/contracts
- Theme family and variant switching via data attributes
- Shared behavior between website and Storybook

### Other styling approaches present in repo

Other styling systems exist and are valid in their own app contexts:

- MUI + Emotion (`apps/droprate`, `apps/team-rotation`, `workspaces/components/mui-material-theme`)
- CSS Modules (`apps/docs`, e.g. `styles.module.css`)
- Plain CSS files in some Storybook shell files (`apps/storybook/src/style.css`)

These are not the preferred path for new website/design-system work. For website-facing and design-system-facing code, use `vanilla-extract` + `@sabinmarcu/theme`.

Package choice rule:

- Use `@sabinmarcu/website-theme` only inside the `@sabinmarcu/website` app.
- Use `@sabinmarcu/theme` everywhere else.

### How theme works at a high level

- `@sabinmarcu/theme` defines typed token contracts for:
  - colors (primary/secondary/info/success/warning/error/background)
  - grid spacing scale
  - breakpoints
- `@sabinmarcu/website-theme` builds a **theme family** on top:
  - families: `base`, `personal`, `projects`, `articles`, `ramblings`, `snippets`
- Theme selection is done by data attributes:
  - `data-theme-variant` for light/dark/system
  - `data-theme-family` for section/family selection
- Website and Storybook both wire these data attributes and token values so the same `theme.*` references work in both environments.

### Best way to use it (short version)

1. Create styles in `.css.ts` using `style`, `globalStyle`, and `recipe`.
2. Use tokens from `@sabinmarcu/website-theme` (or `@sabinmarcu/theme` where appropriate), e.g. `theme.colors.background.page`, `theme.grid.m`.
3. Use `recipe` for component variants.
4. Keep one-off visual state in selectors and data attributes, not ad-hoc hardcoded values.
5. Use `withTheme`/theme selectors when a component must force or read a family context.

---

## Detailed Technical Notes (for AI / agents)

## 1. Repo-level styling landscape

### 1.1 Website and design system (preferred stack)

- `apps/website` uses `vanilla-extract` heavily (`@vanilla-extract/css`, `@vanilla-extract/recipes`).
- `apps/website/next.config.ts` uses `@vanilla-extract/next-plugin`.
- `workspaces/design-system/theme` is the core theme contract system.
- `workspaces/private/website-theme` extends the core theme contract with website families.
- `workspaces/design-system/theme-storybook` integrates theme behavior into Storybook.

### 1.2 Other stacks

- `apps/droprate` + `apps/team-rotation` use MUI + Emotion (`styled`, `Global`, `useTheme`).
- `apps/docs` uses CSS Modules (`styles.module.css`).

Conclusion: this is a multi-style monorepo, but the website/design-system lane is intentionally `vanilla-extract` + token contracts.

## 2. Core theme package internals (`@sabinmarcu/theme`)

### 2.1 Core exports

- `theme` export (from `src/theme.ts`) is the final typed contract object used in style files.
- Constants:
  - `rootNode = ':root'`
  - `themeVariants = ['light', 'dark']`
  - `themeDataAttribute = 'theme-variant'`
  - `themeFamilyDataAttribute = 'theme-family'`

### 2.2 Contract architecture

`src/contracts/theme.ts` creates a nested contract via `createThemeContract(...)`:

- `colors`
  - `primary`, `secondary`, `info`, `success`, `warning`, `error`, `background`
- `grid`
- `breakpoint`

The contract creator returns metadata with:

- contract
- finalContract
- raw

This metadata is attached through `ThemeMetadataSymbol`.

### 2.3 Token generation behavior

Generators define how a small input becomes a richer token set:

- `paletteGenerator(color)` -> `base`, `contrast`, `muted`, `emphasis` (OKLCH-based)
- `backgroundGenerator(color)` -> `page`, `surface`, `elevated`, `depressed`, `text`
- `gridGenerator(inputSize)` -> Fibonacci-offset spacing scale (`m`, `s`, `l`, `xs`, `xl`, ...)
- `breakpointGenerator({...})` -> `lt-*`, `gt-*`, `lte-*`, `gte-*`, `between-*`

### 2.4 Family system (`createThemeFamily`)

`src/utils/themeFamily.ts` introduces theme families with a base + overrides model:

- Maintains `base` updater and per-family updaters.
- `updater.pick(family, selector, updateFn)` maps root contract variables to selected family values.
- Uses `createGlobalTheme` by default, allowing static CSS output.
- Exposes:
  - `families`
  - `selector` (data attribute key for family)
  - `variantSelector` (data attribute key for variant)
  - `selectors` (prebuilt selector map)
  - `themes` (contracts per family)

Important implementation detail:

- Family values are merged with base via deep merge, so family can provide partial overrides.

### 2.5 Runtime update path

`src/contracts/theme.runtime.ts` supports runtime assignment with `assignInlineVars` + `@sabinmarcu/stylesheet`:

- `setupThemeRuntime` / `updateThemeRuntime`
- `setupThemeFamilyRuntime` / `updateThemeFamilyRuntime`
- `pickThemeFamilyRuntime`

This allows dynamic updates while still relying on predeclared contract variables.

## 3. Website-specific theme layer (`@sabinmarcu/website-theme`)

Scope restriction:

- This package is website-only and must be used only by the `@sabinmarcu/website` application.
- Non-website apps/packages should depend on `@sabinmarcu/theme`.

`workspaces/private/website-theme/src/index.ts`:

- Builds `setupTheme = createThemeFamily('personal', 'projects', 'articles', 'ramblings', 'snippets')`
- Exposes `themes`, `selector`, `variantSelector`, `selectors`, `families`
- Defines `themeColors` as base + per-family overrides
- Re-exports `theme` contract (from base package)

Practical effect:

- Website components read from one `theme` object.
- Family context is switched via `data-theme-family`.
- Variant (light/dark/system) is switched via `data-theme-variant`.

## 4. Website wiring and usage

### 4.1 Build integration

- `apps/website/next.config.ts` wraps config with `createVanillaExtractPlugin()`.

### 4.2 Theme initialization

- `apps/website/theme/theme.css.ts` executes `setupTheme(themeColors);`
- `apps/website/theme/index.ts` imports `./theme.css` so theme CSS is emitted.

This is critical: if `theme.css` is not imported, token variables may be undefined at runtime.

### 4.3 Variant selection

- `apps/website/theme/ThemeSelector.core.ts` reads/rotates cookie `theme-variant` (`light|dark|system`).
- `apps/website/app/layout.tsx` sets `<html {...{ [variantSelector]: await getThemeVariant() }}>`.
- `apps/website/theme/ThemeSelector.css.ts` toggles icon visibility based on current variant attribute.

### 4.4 Family selection

- Website uses `data-theme-family` in route/layout context (e.g. `RootPageLayout.tsx` + `withTheme.tsx`).
- Category mapping (`navigation/categories.ts`) maps sections to matching family values.

### 4.5 Style authoring pattern

In website styles (`.css.ts`):

- Token reads like `theme.colors.background.page`, `theme.colors.primary.base`, `theme.grid.xs`.
- Variants use `recipe` when component variants are needed.
- `globalStyle` is used for structural selectors and cross-node relationships.
- Utilities like `withStyles` + `extractRecipeProps` are used to bind recipe variants to React props.

### 4.6 Codehike/syntax theme integration

`apps/website/app/codehike.css.ts` maps code-theme variables per `data-theme-variant` including `system` through media queries.

## 5. Storybook integration path

## 5.1 Theme-storybook package role (`@sabinmarcu/theme-storybook`)

This package is the integration hub between Storybook and theme packages.

Key pieces:

- `withManager(...)` merges manager/head config extensions into Storybook main config.
- `preview.ts` deep-merges extension preview snippets and `theme-overrider` preview decorator.
- `manager.ts` registers manager-side addons and extension managers.
- `config/defaultTheme.ts` initializes runtime theme families for:
  - local playground themes
  - `@sabinmarcu/website-theme` values

### 5.2 Storybook app usage

- `apps/storybook/src/main.ts` wraps Storybook config with `withManager(...)`.
- Addons include `@sabinmarcu/theme-storybook`.
- `apps/storybook/src/vite.config.ts` uses `vanillaExtractPlugin()`.

## 6. Storybook plugin analysis (the two styling plugins)

## 6.1 `@sabinmarcu/storybook-addon-theme-overrider`

Purpose:

- Override Storybook UI/docs/canvas surface colors and typography through a CSS variable contract.

How it works:

1. Defines a large config schema (`defaultOptions`) for docs/sidebar/panel/toolbar/etc.
2. Creates a global theme contract (`createGlobalThemeContract`) from default options.
3. Uses `assignInlineVars` to produce CSS variable assignments.
4. Injects CSS and config into both preview and manager via generated script/style snippets.
5. Applies manager and preview overrides through dedicated style rule sets (`styles.manager.ts`, `styles.preview.ts`).

Why it matters here:

- In `theme-storybook`, config is bound to `@sabinmarcu/theme` tokens, so Storybook chrome colors track the same token source as website styles.

## 6.2 `@sabinmarcu/storybook-addon-mirror-preview`

Purpose:

- Mirror selected nodes/styles from Storybook preview iframe into manager document.

How it works:

1. Accepts config entries `{ selector, id }`.
2. Polls iframe every 500ms.
3. For matching nodes in iframe, clones/updates counterpart node in manager head by matching on `id` attribute value.

Configured use in this repo:

- `theme-storybook` sets mirror config for `[data-stylesheet="themeValues"]`.

Why it matters:

- The runtime-injected theme stylesheet (from theme runtime path) exists in preview iframe; mirror-preview copies it so manager UI can use the same variables too.

## 6.3 Split toolbars (supporting plugin)

`@sabinmarcu/storybook-addon-split-toolbars` is not itself a styling engine, but it powers multi-part toolbar global controls used by theme variant/family selectors. It enables structured toolbar item groups and packed values consumed by the theme selector extensions.

## 7. Vanilla Extract docs alignment

Official docs (https://vanilla-extract.style/) align strongly with this architecture:

- Build-time CSS generation with TypeScript authoring (`style`, `globalStyle`, `styleVariants`).
- Typed theming via contracts.
- `createThemeContract` recommended when separating contract from concrete theme implementations and enabling code-split themes.
- Runtime assignment via `@vanilla-extract/dynamic` (`assignInlineVars`) for dynamic themes.
- Optional packages:
  - `recipes` for typed variant APIs
  - `sprinkles` for atomic utility classes (not currently central in this repo)

Repo match quality:

- Excellent match for contract + runtime assignment pattern.
- Excellent match for `recipe`-driven variants.
- No central Sprinkles layer today.

## 8. Recommended usage rules for contributors/agents

### 8.1 When working in website or design-system code

Use this order of preference:

1. `theme` tokens (no hardcoded raw colors unless truly local/special-case)
2. `recipe` for variantable components
3. `style` for local classes
4. `globalStyle` only when relationship selectors/global structure are required

Dependency boundary:

- `@sabinmarcu/website-theme` is allowed only in the `@sabinmarcu/website` app.
- For every other app/library/component/project, use `@sabinmarcu/theme`.

### 8.2 Theme-aware component checklist

- Use `theme` contract values instead of literals.
- If component has variants, expose them via `recipe` and type props with `RecipeVariants`.
- If component should respond to section family, ensure `data-theme-family` context exists (or use wrappers like `withTheme`).
- If component should respond to light/dark/system, base behavior on `data-theme-variant` and media query fallback for system where needed.

### 8.3 Storybook checklist

- Ensure theme runtime setup is loaded (`defaultTheme.ts` path in theme-storybook).
- Keep `theme-overrider` config mapped to `theme` tokens.
- Keep mirror-preview selector list synced with any stylesheet debug-id changes (e.g. `themeValues`).

### 8.4 What to avoid

- Do not introduce ad-hoc untyped CSS variable names when an existing contract token exists.
- Do not introduce new styling systems in website/design-system path unless there is a strong explicit reason.
- Do not bypass theme family/variant attributes for visual states that are intended to be themed globally.

## 9. Quick reference map

Preferred stack files:

- `workspaces/design-system/theme/src/*`
- `workspaces/private/website-theme/src/index.ts`
- `apps/website/**/*.css.ts`
- `workspaces/design-system/theme-storybook/src/*`

Storybook styling plugins:

- `workspaces/libs/storybook-addon-theme-overrider/src/*`
- `workspaces/libs/storybook-addon-mirror-preview/src/*`

Other styling systems:

- `apps/droprate/src/*` (MUI + Emotion)
- `apps/team-rotation/src/*` (MUI + Emotion)
- `apps/docs/src/components/HomepageFeatures/styles.module.css`
