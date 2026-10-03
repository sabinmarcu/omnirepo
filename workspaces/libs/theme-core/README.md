# @sabinmarcu/theme-core

Immutable generator descriptors, symbolic CSS dependencies, namespaced contract views, descriptor-derived source inputs, and ordered static breakpoints. Importing, defining, compiling, or binding a theme never accesses the DOM or emits CSS. Production code and public declarations have no React or Vanilla Extract dependency.

```ts
import {
  bindTheme, breakpointGenerator, compileTheme, css, numberCodec, source, variableGenerator,
} from '@sabinmarcu/theme-core';

const spacing = variableGenerator({
  scope: 'shared',
  sources: source(numberCodec, 8),
  build: (base) => ({ tokens: {
    m: css`calc(${base} * 1px)`,
    l: css`calc(${base} * ${2} * 1px)`,
  } }),
});
const definition = compileTheme({
  spacing,
  breakpoint: breakpointGenerator([['phone', 640], ['wide', 960]]),
});
const application = bindTheme(definition);
const privateUI = bindTheme(definition, { prefix: 'devtools-theme' });

application.contract.spacing.m; // 'var(--theme-spacing-m)'
privateUI.variables.spacing.l; // 'var(--devtools-theme-spacing-l)'
application.contract.breakpoint.lt.phone; // '(width < 640px)'
```

`defineTheme(schema, options)` combines compilation and binding. Rebind `theme.definition` with `bindTheme`; no generator executes again and no live allocations/values are borrowed. Prefixes are validated bare lowercase kebab namespaces, immutable for each bound view.

## Descriptors and expressions

`variableGenerator({ scope, sources, build })` executes `build` once and creates intrinsic immutable `kind: 'variable'` metadata. Defaults do not make variables static. `staticGenerator(output)` authors intrinsic static output and cannot wrap/reclassify an existing descriptor. `breakpointGenerator` always returns a static descriptor with precise output types.

`source(codec)` is required; `source(codec, default)` encodes an immutable default. `variantSource(codec, scalarOrPair?)` declares light/dark allocations and explicit variant patch support. Inputs may be nested descriptor trees or a single scalar source; a structured codec input remains one opaque value, not a recursive patch target. Custom codecs provide `encode`/`decode` with stable, pure round trips; source construction captures prototype methods and preserves receivers. Optional registration metadata lives with the corresponding source or `registered(expression, registration)` output.

The `build` callback receives symbolic source references plus `token(...localPath)` and `privateToken(...localPath)` constructors. Return `{ tokens, privateTokens? }`. `css` combines literal strings, fixed structural coefficients, and symbolic expressions; only symbols are rebound. Deliberately authored external `var(...)` strings remain external. Unknown/foreign references, dependency cycles, invalid paths, and flattened name collisions throw.

Public names follow `--prefix-<schema/output path>`. Private inputs and expressions use `--prefix-source-*` and `--prefix-private-*`. All dependencies and registration names stay inside the selected prefix. Names are deterministic; joining paths with hyphens requires collision checks rather than silently aliasing distinct paths.

## Contracts, inputs, and ownership

- `theme.contract`: plain nested references plus exact static output; no metadata in the tree.
- `theme.variables`: variable-only plain reference tree. Use this projection with Vanilla Extract `style`, `assignVars`, `assignInlineVars`, and `fallbackVar`; whole contracts with static queries are not assignment contracts.
- `theme.sources` / `theme.tokens`: immutable allocation metadata with source/derived roles, scope, generator/input paths, public/private visibility, dependencies, formulas, and property registrations.
- `ThemeInputs<typeof theme>`: nested setup source paths; required inputs stay required and declared defaults are optional.
- `ThemePatches<typeof theme>`: optional theme/source groups, complete opaque leaf replacements, and explicitly supported partial light/dark edits. Static/derived paths are not writable.
- `resolveThemeInputs(theme, input)`: validates paths, fills local defaults, and returns complete decoded inputs.
- `encodeThemePatch(theme, patch)`: produces declarations only for supplied source paths. Scalar variant shorthand writes both variants; omissions emit nothing. No mutable values cache is maintained.
- `claimThemeAllocations(theme, root, owner)` / `releaseThemeAllocations(root, owner)`: explicit root/owner object identities. Claims are atomic, reject other owners, and allow independent roots to reuse prefixes. Rendering integration is separate from definition.

## Direct server and browser rendering

```ts
import {
  backgroundGenerator, createThemeSetup, defineTheme, gridGenerator, paletteGenerator,
} from '@sabinmarcu/theme-core';

const theme = defineTheme({
  colors: { primary: paletteGenerator(), background: backgroundGenerator() },
  grid: gridGenerator(),
});
const setup = createThemeSetup(theme, { id: 'application-theme', nonce: requestNonce });
setup({ colors: { primary: '#0cf' }, grid: 16 }); // Returns theme.contract itself.
const html = setup.stylesheet.raw; // Emit before first paint.

// Browser construction defaults never replace an adopted server allocation.
const live = createThemeSetup(theme, { id: 'application-theme' }).mount(document);
live.update({ colors: { primary: { dark: '#f0c' } } });
const currentInputs = live.read(); // Complete setup-compatible input, decoded from owned sources.
```

Create a server harness per request. Initial setup resolves local defaults and rejects missing required sources; later setup calls and `update` patch only supplied paths. Each call returns the already defined public contract. Formula declarations are emitted on initialization only; updates commit source declarations through `@sabinmarcu/stylesheet`, never regenerate formulas or retain a mutable values cache. External edits through the same owned sheet are reflected by `read` and survive omitted paths. Current `.raw`/`.snapshot` and subscriptions belong to `setup.stylesheet`.

`mount(Document | ShadowRoot)` returns independent browser state for that attachment root, retaining SSR values/nonce and rejecting conflicting allocation owners or ambiguous style IDs. The default document allocation selector is `:root`; the default shadow selector is `:host`. `selector` may declare one explicit document allocation element, or `:host` for a shadow harness; sources cannot be allocated on shadow descendants. Mutable sheets are per document/host. Cached mounts revalidate stylesheet ownership. Nonces are carried into new sheets; CSP-rejected new nodes are removed, while failed adoption never removes an existing server node.

Sources and formulas remain co-located at the allocation root. Initial `color-scheme: light dark` and `data-theme-variant="light"`/`"dark"` rules preserve variant selection. System mode uses the default scheme rather than another source allocation; remove the variant attribute to select it. Omitted source groups/variants remain current; scalar color shorthand writes both light/dark sources. Static and derived values cannot be supplied as input.

## Native color and spacing definitions

- `paletteGenerator({ default? })`: contextual editable light/dark colors with `base`, native `contrast`, relative-OKLCH `muted` (half chroma), and `emphasis` (double chroma).
- `backgroundGenerator({ default? })`: contextual `page`, native `text`, and adaptive `surface`, `elevated`, `raised`, `depressed`, `recessed`. Native foreground polarity—not the selected mode—chooses text-mix weights 10/20/30% for light inputs and 20/40/50% for dark inputs. Opposite-tone mixes stay 20/30%; neutral opposite colors preserve missing hue to avoid chromatic hue drift.
- `gridGenerator` / `eightPointGridGenerator`: shared unitless numeric source, unchanged eight-point pairs. Options are structural `{ pairs, default, unit, basis }`; defaults are 3 pairs, source 16, `rem`, basis 16. `px`/`em` default to basis 1. Main/small/large outputs are fixed source-driven `calc(...)` expressions.
- `fibonacciGridGenerator`: shared numeric source with multiplicative coefficients 2, 3, 5, 8, ...; small = base/ratio and large = base*ratio. Pair count/unit/basis are fixed at definition; a new source value scales every pair without running the generator again.
- `colorCodec`: authored single CSS color/expression serialization, not JavaScript color parsing or a general untrusted-CSS sanitizer. `numberCodec` preserves finite numeric input. Live source reads decode these representations directly; they never invert derived colors/lengths.

The native feature floor includes `light-dark()`, `contrast-color()`, relative OKLCH colors, `color-mix(in oklch)`, CSS `if(style(...))`, and typed custom-property registration. No fixed-weight, frozen-color, or JavaScript contrast fallback is provided. The renderer emits namespaced `@property` declarations for SSR and discovers matching definitions in document-owned stylesheet CSSOM. Missing definitions are emitted through an owned document stylesheet with the live nonce, including when rendering private shadows: current Chromium does not honor shadow-local `@property` for these computed conditions. Independent hosts and duplicated modules share identical immutable registration definitions, never mutable allocation sheets; conflicting definitions throw. Native Safari verification remains an explicit acceptance gate, not an inferred support claim.

## Pure extension

`extendTheme(base, additions)` merges distinct descriptor paths, including additions inside existing groups, while retaining the base prefix, untouched reference subobjects, and existing compiled/bound allocation objects. Only additions are compiled/bound. Descriptor overlap and flattened allocation-name collisions throw; there is no prefix override or replacement API. Create the extended theme before initializing its setup: an already initialized sheet is not retrofitted. Static additions are immediately available on the contract; variable additions participate in the same setup/read/update type projection when the extended theme is rendered. Render the extended contract once to let base and extended consumer styles coexist; allocating a separate base harness on the same root would conflict with its shared names.

Generic compiled graph composition uses `rebaseThemeDefinition(definition, path)`: schema/input/output paths and symbolic declaration dependencies move together without executing generators or rewriting CSS strings. Renderer `rules(selector)` adds structural rules to the initial allocation commit, and `ownedNames` reserves their public alias names on the same allocation root. Adoption requires those aliases to exist; constructor defaults do not repair or reset an incomplete adopted sheet.

Independent family composition lives in `@sabinmarcu/theme-family`, depending on core only. Core never imports family or concrete configuration.


## Static breakpoint queries

Ordered `[name, pixelThreshold]` tuples retain literal names and values. `lt`/`gt` are strict, `lte`/`gte` inclusive; `between` contains every forward pair, excludes both endpoints, and never contains reversed/self pairs. Fractional thresholds are retained without pixel subtraction. Duplicate names, ambiguous pair keys, nonfinite/negative thresholds, and equal/descending order throw.

## Optional source manifests and inspection

`setup.manifest()` projects version-2 `ThemeManifest` metadata without reading or storing source values. It can be called before initial setup. `createThemeManifest(theme, { sheetId, selector?, layer?, id? })` projects the same schema for an explicitly owned application sheet. Records contain immutable namespace/root/sheet identities, source input paths and scope/variant/codec metadata, public read-only derived allocations, and construction-time static outputs. Each derived output's `sources` list contains its transitive editable-source dependencies, including paths through private intermediate formulas. Defaults, current source values, formulas, and executable codecs are not embedded. Version 1 is rejected; regenerate stored/embedded catalogs through the current producer rather than supplying legacy manifests.

```ts
import { createThemeInspection, embedThemeManifests } from '@sabinmarcu/theme-core';

// Optional server output, alongside the already emitted setup.stylesheet.raw.
const manifests = [setup.manifest()];
const inertMetadataHTML = embedThemeManifests(manifests, { nonce: requestNonce });

// Browser: supplied lists are authoritative, not merged with embedded records.
const inspection = createThemeInspection(document, manifests);
const target = inspection.targets[0];
target.patch({ grid: 24 });
const completeInputs = target.export(); // Current owned sources, setup-compatible.
const unsubscribe = target.subscribe(() => console.log(target.read()));
unsubscribe();
inspection.dispose(); // App allocations/metadata/edits are left intact.
```

`embedThemeManifests` returns an inert `<script type="application/json" data-theme-manifests>` block with HTML-breakout characters escaped. Programmatic delivery does not emit HTML automatically. Definitions, normal rendering, and updates never require manifests or a window registry; importing these helpers remains DOM-free.

Codec/editor kinds are declared, never inferred from a CSS value: standard `numberCodec`, `stringCodec`, and `colorCodec`; `numberUnitCodec(unit)` retains numeric input while explicitly serializing its CSS unit; `jsonCodec` handles a complete JSON-value replacement through a quoted CSS JSON representation. JSON objects/arrays are not recursive partial updates. Standard codec identity survives descriptor ownership. Arbitrary custom codecs still render normally, but manifest projection rejects unsupported semantics even if a custom object advertises a standard representation. Colors remain authored CSS/native-gamut expressions, not converted to hex.

`createThemeInspection(document)` discovers only designated light-DOM JSON blocks. `[]` explicitly grants no targets; invalid supplied or discovered data throws without falling back to unrelated metadata. `setManifests(next)` atomically replaces visibility and invalidates old target handles, preserving app values. `setManifests(undefined)` returns to DOM discovery. `refresh()` rereads DOM catalogs only in discovery mode; explicit catalogs remain authoritative. Catalog changes are manual-refresh, not an implicit DOM observer or union. Failed replacement retains the preceding valid catalog.

Each declared selector must resolve one light-DOM allocation element, and its owned style ID must resolve one active light-DOM sheet. Sources must exist directly in the declared selector/layer, not be inherited from another rule. Duplicate IDs, missing/replaced roots/sheets, shadow roots/sheets, `:host`, reserved `devtools-theme` namespaces, and roots/sheets under `data-theme-inspection="private"` are rejected. Metadata cannot authorize arbitrary descendants or static/derived/private output patches. Public outputs are available through `readOutputs()` as static metadata or the computed CSS custom-property text. Computed custom-property text is not necessarily an evaluated CSS property color.

Reads/exports decode the authoritative sheet; patches reuse `encodeThemePatch` and the shared stylesheet backend. Omitted paths/variants remain current; scalar variant shorthand writes both variants. Source subscriptions share post-commit notifications with application handles and additionally observe direct owned-node text replacement. Catalog `subscribe` reports source commits and successful catalog replacements. Disposal removes only inspection listeners/observers; it never resets or removes application CSS. Arbitrary direct CSSOM mutations outside the backend do not emit commit events.

Granular reads use `target.readSource(name)` or `target.readSources(names)`, preserving declared codec types without reconstructing the full input tree. `readOutputs(names?)` optionally reads only the requested public derived allocations; the names are validated and static/derived values remain read-only. Full `read()`/`export()` returns complete current setup-compatible inputs and batches declaration reads.

Source/catalog subscriptions receive `InspectionChange`: `{ targetId, sources, outputs }` for a known source commit, with allocation names identifying changed sources and transitively affected outputs. `undefined` means catalog replacement, a structural/mapping change, or an unknown out-of-band sheet text replacement and requires conservative invalidation. Ownership and complete declarations are validated initially and after unknown sheet replacement; known commits revalidate targeted declarations without rescanning every input. No applied-value cache is introduced.

The optional inspection API is headless. Use the dedicated [native devtools guide](../theme-devtools-core/README.md) or [React devtools guide](../theme-devtools-react/README.md) for UI integration; neither changes application source ownership or turns derived outputs into inputs. Native Safari/macOS/iOS and latest-code cross-engine release acceptance remain open.

