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

## Optional website inspector

Enable **Theme devtools** through Settings → Experiments. The `themeDevtools` experiment defaults to `false` and uses the existing `experiment-themeDevtools` cookie path. When disabled, the root layout renders no editor launcher or inspection-manifest payload. Definitions and initial theme emission never depend on inspection metadata.

When enabled, the locale root layout calls `manifest()` on the same request-local website setup that emits the owned stylesheet, serializes it as ordinary JSON, and passes that declared list to the client [React binding](/api/theme-devtools-react). It does not create another browser theme owner, copy current input values into metadata, or automatically embed a discoverable DOM catalog. The manifest is version 2 and includes transitive source dependencies for granular inspector updates.

The launcher toggles the shared native modeless inspector: a draggable liquid-glass window with family tabs, shared/static values separated from member values, and compact contract-tree controls. The page remains usable; the former website-only modal/backdrop is removed. Closing unmounts only the private inspector, and reopening reads the current application declarations. Applied edits remain while the existing app sheet lives, including client navigation that preserves the root layout. A new full page/server request materializes the configured `themeValues` again; editor persistence/history is not implemented.

Color controls use native pickers with a raw-CSS path for authored expressions; numeric grid input remains a number, not a CSS length string. Computed/static outputs remain read-only. Copy exports complete current `{ shared, families }` inputs suitable for `createWebsiteTheme()` setup. Shared edits intentionally affect all section families; contextual edits and partial light/dark patches retain unrelated current values.

Other applications should compose their own families using theme-core/theme-family and must not import website-theme. Storybook's Programmatic and DomDiscovery demonstrations use their existing shared `themeRuntime` owner, not this website composition.

See the [native inspector guide](/api/theme-devtools-core) for catalog precedence, source-only light-DOM access, lifecycle, CSP/nonces and the native component registry's separate version-2 reload policy.

## Browser support

Native shipping Safari/macOS/iOS support remains unverified.


