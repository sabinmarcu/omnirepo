# @sabinmarcu/theme

Framework-free concrete color/grid definitions and stable public references. Importing this package compiles metadata; it does not render CSS or access the DOM.

```ts
import { theme, themeDefinition } from '@sabinmarcu/theme';

theme.colors.primary.base; // var(--theme-colors-primary-base)
theme.grid.m; // var(--theme-grid-m)
```

Vanilla Extract consumers continue using these precise references. The package has no production React, Storybook, Vanilla Extract, or JavaScript color-computation dependency.

Render `themeDefinition` through `createThemeSetup` from `@sabinmarcu/theme-core`. Generic independent-family composition lives in `@sabinmarcu/theme-family`; this package does not re-export it. The old `family`, `family.runtime`, `runtime`, and `ssr` entry points are removed.

The root export also provides selector constants, ordered layer names, `themeLayerOrder`, and `themeResetCSS`. Applications own reset/stylesheet delivery before first paint. Initial setup accepts nested source inputs; updates preserve omitted sources and CSS computes derived values.

Breakpoints are intrinsic static definitions from theme-core. Website configuration is an extension in `@sabinmarcu/website-theme`, not a mutable input or part of this concrete color/grid contract.

## Package guides

Use the [core guide](/api/theme-core) for direct setup/codecs/inspection and the [family guide](/api/theme-family) for independent member values.

Devtools are optional consumers: the [native inspector](/api/theme-devtools-core) owns the shared modeless window, and the [React binding](/api/theme-devtools-react) only hosts that core. The concrete theme does not acquire a devtools dependency.


## Browser and release boundary

Native colors require `light-dark()`, `contrast-color()`, relative OKLCH colors, `color-mix()`, CSS `if(style(...))`, and typed custom properties. No JavaScript or legacy-browser fallback is provided. Native Safari support remains unverified.
