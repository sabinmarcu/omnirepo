# @sabinmarcu/website-theme

Website-only composition of the shared concrete theme, static breakpoint configuration, and independent section families. Other applications and workspace packages use the shared theme lane instead.

```ts
import {
  createWebsiteTheme,
  theme,
  themeValues,
} from '@sabinmarcu/website-theme';

// Create independently for each server request.
const setup = createWebsiteTheme();
setup(themeValues);
const ownedStyleHTML = setup.stylesheet.raw;

theme.breakpoint.lt.mobile; // (width < 700px)
```

Emit the owned stylesheet before first paint. The website's localized root layout uses `@sabinmarcu/stylesheet/react` in `<head>`, alongside the shared reset CSS. Importing `theme`, `themes`, `families`, or `selectors` from a `.css.ts` consumer only provides metadata; it does not initialize theme values.

Inputs have `{ shared, families }` shape. `shared.grid` is a unitless numeric source (default 16); colors are contextual light/dark inputs for each independent family, including `base`. Changing `base` never supplies or resets another family's contextual values. Static breakpoints are 700/1000/1600/1900/3800px and cannot be supplied as values or updated.

Family views and `data-theme-family` select root-allocated contextual values for descendants. `data-theme-variant="light"` or `"dark"` chooses the variant; system mode removes the variant attribute. Existing cookie selection remains application-owned.

Browser adoption uses `setup.mount(document)` and preserves existing source values. Live updates and exports use the mounted handle's `update` and `read`, with the owned stylesheet as the authoritative source.

Native Safari acceptance is deferred and unverified; see the [Phase 5 evidence](../../../.github/plans/theme-refactor/IMPLEMENTATION_PLAN.md).
