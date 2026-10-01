# Theme refactor implementation plan

## Purpose and status

The [refactor plan](REFACTOR_PLAN.md) is the architectural contract. This document translates it into implementation order, repository targets, observable deliverables, and acceptance gates. Its phase numbering is execution-oriented and intentionally finer-grained than the architectural phases.

All implementation phases are pending. Planning prototypes demonstrate individual mechanisms, not completion of a production package or compatibility with Safari. No implementation phase is considered complete from compilation alone.

## Non-negotiable implementation boundaries

- Generators own immutable `kind: 'static' | 'variable'` and, where variable, `scope: 'shared' | 'contextual'`. Composition never wraps/reclassifies them. Compile structure/formulas once; updates assign sources and CSS computes derivatives.
- Theme/core/family/renderer packages have no Vanilla Extract production, peer, or exported-type dependency. Existing component/page styles remain Vanilla Extract consumers of precise nested `var(--...)` references.
- Contract prefixes are chosen at creation/binding and immutable. Preserve default public `--theme-*` names; bind private devtools UI references under `--devtools-theme-*`. Namespace private sources, formulas, variants, mappings, and registrations as well as public references.
- The owned sheet is authoritative for current source allocations and current serialization. No parallel mutable input cache, devtools value store, or manifest value snapshot.
- Direct setup inputs are nested source inputs. Family setup/update/export uses `{ shared, families }`; every family, including `base`, has independent defaults and contextual values. Static/derived outputs cannot be assigned.
- Preserve light/dark selectors, family selection, and complete scoped reference mapping. Descendants select root-allocated values; they do not override sources locally.
- Use native `contrast-color()` and retain adaptive surface weights. Keep the default eight-point spacing scale; correct Fibonacci with ratios `2, 3, 5, 8, ...` and source-driven `calc(...)` expressions.
- Target latest stable Chromium and Safari/WebKit, including relevant macOS/iOS behavior. Firefox and legacy-browser polyfills are outside scope; experimental flags/nightlies are not acceptance evidence.
- Devtools core is Web Components plus handwritten CSS in TypeScript string modules, built with ordinary TypeScript. React is a separate thin binding package. Private UI shadow rendering is not an inspection target.
- Inspection is optional, manifest-gated, source-only, root-only, and light-DOM-only. Explicit manifests/props take precedence; omitted inputs discover light-DOM JSON data. Do not inspect private UI or open/closed shadow sheets, even with programmatic metadata.
- Clean cutover: migrate every affected caller and remove obsolete code/exports. No forwarding family re-exports, legacy input adapters, classification wrappers, or compatibility aliases.

## Execution map

| Phase | Deliverable | Prerequisites | Architectural coverage |
| --- | --- | --- | --- |
| 0 | Inventory, API decisions, and real-browser capability evidence | None | Inventory and unresolved implementation gates |
| 1 | Authoritative stylesheet backend with server/browser/shadow delivery | Phase 0 ownership contract | Unified renderer |
| 2 | Generator descriptors, namespaces, and typed contracts | Phase 0 descriptor contract | Family-free core |
| 3 | Direct rendering, source codecs, partial updates, and extension | Phases 1–2 | Core rendering and extension |
| 4 | Independent generic family layer | Phase 3 | Family extraction |
| 5 | Atomic concrete-theme, website, and Storybook cutover | Phases 0–4; color/browser gate passed | Recomposition and export migration |
| 6 | Optional manifest and light-DOM inspection contract | Phase 5; metadata designed in Phase 0 | Devtools prerequisites |
| 7 | Framework-agnostic Web Components devtools core | Phase 6; private UI uses Phase 3 | Devtools core |
| 8 | React hosting/bindings and app integration | Phase 7 | React devtools package |
| 9 | Release-quality integration evidence and documentation | Phases 5–8 | Final validation |

Phases 1 and 2 can be implemented independently after their shared interfaces are fixed. Do not start family/UI work by inventing another declaration model. Manifest/codec/ownership design happens in Phase 0 so Phases 1–3 expose the needed semantics; the manifest producer and UI are implemented later.

### Cutover discipline

New packages may be developed against real synthetic themes while existing applications still use their unchanged implementation. That is not permission to add compatibility shims. When an existing exported API is changed or removed, migrate all of its callers in the same change group.

- Stylesheet API changes in Phase 1 include existing stylesheet callers, even before the theme cutover.
- Concrete theme/family/SSR/runtime export changes in Phase 5 include all application, Storybook, and workspace callers atomically.
- Keep an existing API only if it is a deliberate part of the final API, not a temporary alias. Do not leave broken intermediate application states or publish a half-migrated dependency graph.

## Repository targets

Paths below are existing implementation/integration surfaces unless explicitly marked proposed. Discover additional callers through symbol references and package-import searches before changing exports; this table is not an exhaustive caller list.

| Area | Targets |
| --- | --- |
| Stylesheet backend | [Stylesheet.tsx](../../../workspaces/libs/stylesheet/src/Stylesheet.tsx), [types.ts](../../../workspaces/libs/stylesheet/src/types.ts), stylesheet exports/Moon metadata |
| Existing contracts and updater machinery | `workspaces/design-system/theme/src/utils/{rawContract,themeContract,variantContract,themeFamily,prefixCache,prefixContract,prefixContractValues}.ts` and their type modules |
| Existing generators | `workspaces/design-system/theme/src/generators/{palette,background,grid,breakpoint}.ts` and breakpoint/grid type modules |
| Concrete schema and entry points | [contracts/theme.ts](../../../workspaces/design-system/theme/src/contracts/theme.ts), `src/contracts/theme.runtime.ts`, `src/{index,theme,ssr,runtime,family,family.runtime}.ts`, styles/layers and Storybook fixtures |
| Website composition | [website-theme/src/index.ts](../../../workspaces/private/website-theme/src/index.ts), its package/Moon metadata |
| Website emission and root selection | [theme/theme.css.ts](../../../apps/website/theme/theme.css.ts), [theme/index.ts](../../../apps/website/theme/index.ts), [locale layout](../../../apps/website/app/%5Blocale%5D/layout.tsx), `ThemeSelector.runtime.tsx`, `withTheme.tsx`, and `layouts/RootPageLayout.tsx` |
| Website caller exceptions | [responsive.ts](../../../apps/website/utils/responsive.ts) composes media/container queries; [app/layout.css.ts](../../../apps/website/app/layout.css.ts) consumes `themes[family].colors.background`/selectors and `assignVars`; family-type consumers also use `families` exports |
| Storybook families/runtime | `workspaces/design-system/theme-storybook/src/config/{defaultTheme,themes,themes.values}.ts`, `src/extensions/{themeConfiguration,themeFamily,themeVariant,themeFamily.data}.ts*`, preview/manager entries, and `apps/storybook/src/main.ts` |
| Stylesheet consumers/mirroring | [mirror addon](../../../workspaces/libs/storybook-addon-mirror-preview/src/addon.ts), `workspaces/libs/storybook-addon-theme-overrider/src/{addon,updater,renderStyles}.ts*` |
| New theme packages (proposed) | `workspaces/libs/theme-core`, `workspaces/libs/theme-family`; the concrete theme remains under `workspaces/design-system/theme` |
| New devtools packages (proposed) | `workspaces/libs/theme-devtools-core`, `workspaces/libs/theme-devtools-react` |
| Workspace/quality conventions | `.config/manifest.cjs`, `yarn.config.cjs`, `.tscmonorc.yml`, `tsconfig.base.json`, `.moon/{workspace,toolchain,tasks}.yml`, root/category references, and `vitest.{workspace,config}.mjs` |
| Dependency-only audit | `apps/docs/package.json` declares theme-related dependencies with no source import found in the inventory; confirm usage before removing them. Do not assume unused declarations are runtime consumers |

Place the generic reusable packages beside the existing renderer in `workspaces/libs`, following its plain-library manifest/Moon conventions. Use `lib` for core/family/devtools core and `lib` plus `react` for React bindings; base configuration already supplies DOM types. Moon commands use unscoped directory IDs, while `dependsOn` uses actual scoped aliases. Keep normalized exports/ranges/presets under constraints ownership and confirm discovery before invoking newly introduced tasks.

## Phase 0 — Inventory, contract decisions, and capability gate

**Entry:** agreed refactor plan; no production cutover yet.

### Work

- [ ] Record public import paths and all setup/update/pick callers. Inventory current public variable names, private aliases, layer ordering, family/variant selectors, breakpoint consumers, and stylesheet identity/mirroring.
- [ ] Capture the concrete website emission chain: locale layout imports `@/theme`, whose barrel imports `theme.css.ts`. Include `responsive.ts`, family background triggers/`assignVars` in `app/layout.css.ts`, family-type consumers, and Storybook's `defaultTheme.ts` bootstrap in the atomic migration inventory. Preserve `framework.theme.values`, `.variants`, `.contract` ordering; `system` removes the variant attribute and is not a third allocated variant.
- [ ] Separate intentional existing behavior from deliberately changed behavior: native foreground selection replaces the old JavaScript WCAG rule; independent families replace base inheritance; Fibonacci values change; default eight-point values and variant selection do not.
- [ ] Specify the descriptor discriminants, source/formula reference representation, default/partial-input rules, namespace validation, and static-output type mapping. Generators describe themselves; no `variableTokens`/`staticTokens` composition API.
- [ ] Specify stylesheet ownership and allocation context: document versus private UI shadow rendering, actual allocation root, SSR isolation, duplicate-ID behavior, source read/write contract, current snapshots, and nonce handling. Registration/lookup must not depend on a debug label alone.
- [ ] Specify JSON-safe source codecs, manifest versioning/ownership/bindings, `{ shared, families }` export paths, validation, and programmatic-versus-DOM precedence. Do not invent a custom executable codec transport or a second values object.
- [ ] Capture behavior/type assertions and add an explicit compiler-check task for full project configs/consumer fixtures that include `*.type.spec.*`, with suitable incremental-cache isolation. Build dependencies first and wire the check into the actual CI graph. Current `tsconfig.build.json` excludes specs and Vitest excludes type specs; neither default build, Vitest, nor expect-type lint alone proves these assertions. Replace comment-only snapshots with consumer-relevant positive/negative checks, not source-text/incidental-format tests.
- [ ] Run capability probes in actual latest stable Chromium and Safari/WebKit. Verify native contrast, input-dependent surface percentages, relative colors, required conditional/computed-value mechanisms, typed-property behavior where needed, and document/private-shadow allocation contexts. Record browser versions and opacity/wide-gamut cases.
- [ ] Establish real Safari/macOS/iOS access for later acceptance. A Playwright WebKit build or iPhone emulation under Chromium is not automatically evidence for shipping Safari. Verify a usable native custom-element environment rather than treating the planning harness's registry limitation as a library behavior.
- [ ] Resolve verification prerequisites rather than assuming repository metadata is aligned: root Node requirement is now `~24`, website explicitly uses 24, but shared `.moon/toolchain.yml` still declares 22. Respect the Node 24 baseline when establishing the implementation toolchain. Workspace manifests/task inputs reference a currently absent `.config/build.config.ts`; actual builds are the shared TypeScript task, so do not copy or manufacture that stale preset as the package build solution.

### Exit evidence

- A migration inventory and named stylesheet/descriptor/codec interfaces are recorded alongside implementation changes, with no open semantic question already settled in the architecture document.
- Public default names and intentional selector behavior are characterized before their owners change.
- Adaptive native color behavior is proved on both target engine families, or the capability gate is explicitly blocked with exact failing feature/behavior and the next decision needed. Do not declare support from syntax detection alone.

**Stop gate:** do not perform Phase 5 until both target engines can support the agreed color policy. If `if()` or a typed marker does not work, find a verified CSS solution or obtain an explicit design/support decision. Fixed percentages, frozen colors, engine exclusion, or JavaScript generator reruns are not substitutes.

## Phase 1 — Repair and isolate the stylesheet backend

**Entry:** Phase 0 ownership/serialization contract fixed.

### Work

- [ ] Separate the platform/server/DOM backend and its types from mandatory React imports; keep an optional React/SSR rendering wrapper as a consumer interface. Core declaration types must not expose React or Vanilla Extract types.
- [ ] Replace regex parsing/merge and caller-array consumption with owned-rule handling that preserves selectors, declaration values, layers, and unrelated rules. Use browser CSSOM to parse/update existing browser sheets rather than implementing a CSS parser.
- [ ] Implement explicit server rule serialization and browser creation/adoption. Adoption finds the correct owned node, preserves existing values, and does not append a duplicate or overwrite SSR content with constructor defaults.
- [ ] Commit source declaration patches and synchronize the owned serialized contents. Make current raw/snapshot output reflect live contents; reacquire/invalidate handles after text replacement. Group related declaration changes into one commit without adding a competing mutable values cache.
- [ ] Support the real owner document/realm and `Document`/`ShadowRoot` attachment context. Document allocation uses its declared root selector; private devtools host allocation through an inner sheet uses `:host`.
- [ ] Carry nonces through SSR and browser mount paths; safely serialize CSS/HTML and preserve ownership boundaries. Reject or explicitly resolve ambiguous duplicate ownership rather than updating only one matching node.
- [ ] Provide the minimal post-commit notification/current-read surface used later by theme updates and devtools. Notifications point to current sheet state, not detached value snapshots.
- [ ] Migrate every affected existing stylesheet consumer when its import or API changes: theme runtime, theme overrider, and mirroring. Preserve the legitimate current `data-stylesheet` identity contract where appropriate. Text-based mirroring must observe current contents; do not optimize it into another subsystem without need.

### Exit evidence

- Server output is adopted and patched without resets; unrelated descendant/layered rules survive; caller arrays remain intact; duplicate ownership and nonces behave as specified.
- Two documents/hosts have independent mutable allocations. Immutable structural UI sheets may be shared later, but mutable allocation sheets are never shared accidentally.
- The existing website/Storybook continue working while the theme implementation remains unchanged; changed stylesheet APIs have no unmigrated caller or temporary alias.
- Current serialization and observed CSS agree after repeated patches, including values containing syntax the old regex parser could not preserve.

## Phase 2 — Generator descriptors, compiled references, and contract namespaces

**Entry:** Phase 0 descriptor contract; Phase 1 can proceed independently.

### Work

- [ ] Create the proposed theme-core workspace with real descriptor/contract behavior and normal package/Moon/type wiring, not placeholder exports. Keep it independent of families, concrete schema, React UI, and Vanilla Extract.
- [ ] Register new workspace identities/edges intentionally, then run constraints normalization (`yarn constraints --fix` where required), dependency/lockfile updates, and `yarn tscmono` generation through repository workflows. Constraints own internal `workspace:*` ranges/common exports/mandatory dev dependencies and generate each `.env` with `VITEST_PROJECT=@sabinmarcu/<package>`. Moon has automatic dependency synchronization disabled, so add actual direct `dependsOn` aliases explicitly. Do not hand-edit generated aggregate/project references or invent a bundler preset.
- [ ] Implement immutable generator-owned `kind`; variable descriptors also own `scope` and source/derived metadata. Static breakpoint definitions preserve their precise output types. Supplying defaults does not reclassify a variable generator.
- [ ] Represent source bindings and formula dependencies symbolically so namespace/family binding does not rerun generators or replace arbitrary strings. Compile fixed structural options only at definition time.
- [ ] Allocate precise plain nested `var(--...)` views, metadata outside that tree, and a variable-only projection when static output is present. Preserve default public names; eliminate private names that escape their owning prefix.
- [ ] Implement immutable validated construction prefixes. Bind a compiled definition to fresh independent views without changing the original or borrowing its values; reject path/name/ownership collisions within the relevant root.
- [ ] Implement nested source-input/default/patch types derived from descriptors. Exclude static/derived fields, model supported light/dark patches explicitly, and avoid a blanket recursive `DeepPartial` promise for opaque generator inputs.
- [ ] Assign reusable machinery to core and concrete schema choices to their appropriate owner. Static breakpoint generation is reusable core functionality; palette/background/grid definitions must be reusable across namespaces without coupling inspection to the app's bound view.

### Exit evidence

- Import/definition works without DOM access or CSS emission, and emitted public declarations have no framework/Vanilla Extract type imports.
- Default/custom prefix types are precise; all private references/formulas/registrations remain namespaced; creating another view preserves original identity.
- Compiler-checked assertions reject static updates, invalid source shapes, conflicting paths, and unsupported patches.
- A real Vanilla Extract consumer accepts our independently created variable views with `style`, `assignVars`, `assignInlineVars`, and `fallbackVar`; public static query additions are not mistakenly supplied to whole-contract assignment helpers.

## Phase 3 — Direct setup, CSS generators, source codecs, and extension

**Entry:** Phases 1–2 complete; Phase 0 color probes inform the formula implementation.

### Work

- [ ] Implement native contrast and adaptive background generator definitions with fixed source/formula structure. Preserve weights 10/20/30% for light polarity and 20/40/50% for dark polarity; opposite-tone depressed/recessed weights remain 20/30%. Polarity is input-derived, not the selected light/dark mode.
- [ ] Implement the unchanged eight-point scale and corrected Fibonacci coefficients `2, 3, 5, 8, ...`, with main/small/large source-dependent expressions. Pair count is structural; namespace binding and updates never call the generator again.
- [ ] Implement intrinsic-static ordered breakpoints: strict `lt/gt`, inclusive `lte/gte`, exclusive ascending `between` pairs including nonadjacent pairs, invalid ordering rejection, and exact string-literal types. Remove mutable query initialization/update behavior from the new API.
- [ ] Implement codecs/default resolution from nested inputs to owned source declarations and back. Initial setup resolves local defaults and rejects missing required values; subsequent supported patches retain omitted current values read from the sheet.
- [ ] Normalize scalar light/dark shorthand into its declared source bindings. A dark-only patch preserves current light; a new scalar writes both. Keep source/formula allocation co-located at the harness root.
- [ ] Implement functional direct setup/update with the unified renderer and convenience return of the same public contract. No rendering creates a contract or supplies static output; no independent normalized-input cache is authoritative.
- [ ] Implement pure `extendTheme`: inherit prefix/identity, reject collisions, add static/variable definitions before consumers author styles, and do not recompile the base. A new namespace is separate binding, not an extension override.

### Exit evidence

- A non-family synthetic theme emits usable SSR/current browser CSS and can update sources through the same renderer with no generator executions or formula regeneration.
- Actual colors/spacing change from source edits; omitted inputs/variants remain current; code copied from live source reads reproduces the result with correct types/units.
- Static breakpoints are usable before rendering, cannot enter value updates, and match the exact declared query types and fractional-width behavior.
- Direct base and extended consumer styles coexist with unchanged base references; document and private UI host rendering remain independent.

## Phase 4 — Generic independent family composition

**Entry:** Phase 3 complete.

### Work

- [ ] Create the theme-family workspace against core only. Derive contextual/shared partitions from generator descriptors, including mixed-scope nested branches; do not add a concrete-schema dependency or an app `vary` list.
- [ ] Implement `{ shared, families }` setup/update input and export shape. Shared source allocations exist once outside every member; contextual source/formula graphs exist for ordinary `base` and each declared member.
- [ ] Resolve family defaults independently and reject unknown/duplicate/reserved names as specified. Missing values never inherit another member's current inputs; shared/static/derived values are invalid in member payloads.
- [ ] Qualify private configuration/family/variant names under the contract prefix without generator reruns or collisions between independent configurations.
- [ ] Implement complete public reference mapping, default/root selection, scoped `data-theme-family` selection, and existing variant behavior. A scoped selection maps root-allocated source and derived references; it never declares local source overrides.
- [ ] Delegate setup/update/pick declarations to the single stylesheet backend. Return the existing public theme contract from family setup, not private selected references.
- [ ] Define the family portion of the later manifest projection using the same source bindings and input paths, but do not make rendering depend on inspection metadata.

### Exit evidence

- A synthetic schema unlike the concrete theme works, with compile-time shared/contextual/static partitioning and runtime validation of member names.
- Updating `base` changes no other contextual member; changing one member/variant changes no other; shared edits intentionally affect all members.
- Root and scoped family/variant selection resolve the complete derived graph without the inherited-formula rebinding bug. Inactive member values are allocated and independently readable.
- Direct/family APIs share the same renderer, and core/concrete modules do not import family code.

## Phase 5 — Atomic concrete-theme, website, and Storybook cutover

**Entry:** Phases 0–4 gates passed; all affected caller changes prepared together.

### Work

- [ ] Recompose the concrete schema with self-describing one-time generators and default `theme` namespace. Preserve public color/grid paths/names and remove production React/Storybook/Vanilla Extract coupling from theme entry points where it exists.
- [ ] Move reusable static breakpoint ownership into core and website configuration into website-theme. Extend before style authoring and remove breakpoint inputs from variable setup.
- [ ] Reshape website values to `{ shared, families }`; materialize previous base-inherited contextual values into each member's independent defaults/inputs. Do not alter intended website appearance except acknowledged native contrast/Fibonacci changes.
- [ ] Replace [theme.css.ts](../../../apps/website/theme/theme.css.ts)'s emission side effect and its import in [theme/index.ts](../../../apps/website/theme/index.ts) together. The locale layout reaches this chain through `getThemeVariant`; migrate to server/build-owned stylesheet emission before paint while retaining `<html data-theme-variant>` and client cookie/attribute selection. Definitions remain importable by `.css.ts` consumers without SSR rendering.
- [ ] Migrate [responsive.ts](../../../apps/website/utils/responsive.ts) to static website queries and verify its orientation/container composition at strict/fractional boundaries. Migrate `app/layout.css.ts` family background triggers/private view assignment, descendant family attributes in layouts/HOCs/search/tag pages, and type-only family consumers in the same change group. Equivalent colors/grid-only styles keep stable imports and must not be rewritten unnecessarily.
- [ ] Migrate Storybook bootstrap `config/defaultTheme.ts`, demo `themes.ts`/`themes.values.ts`, `themeFamily.data.ts` lists, family/variant toolbars, and `themeConfiguration.ts` mirror configuration together. The current `family.runtime` caller is this bootstrap; direct `runtime`/`ssr` subpaths have no source caller found but remain public removal surfaces. Preserve overrider references, `[data-stylesheet="themeValues"]` behavior/current contents, and `apps/storybook/src/main.ts` integration. Do not introduce new workspace-to-app or otherwise forbidden composition edges.
- [ ] Migrate every package/subpath caller identified in Phase 0, including exceptional consumers outside website/Storybook. Remove obsolete `family`, `family.runtime`, old SSR/runtime render owners, tuple/prefix-string machinery, static updaters, and JS derived-value computation where replaced.
- [ ] Update exports, dependencies, Moon edges, and generated project references in the same cutover. No concrete-theme family re-exports, legacy input adapters, or broken intermediate builds remain.

### Exit evidence

- Website build and representative route work with server-emitted values and no theme runtime initialization; initial paint has the correct family/variant and app breakpoint behavior.
- Family/variant switching and a scoped family section still work, including computed derived tokens. Direct shared components keep their default references.
- Storybook preview/manager remain synchronized after source updates and family/variant selection.
- There are no surviving callers of removed entry points, no dependency cycles, and no forbidden framework/Vanilla Extract dependency in the theme/renderer production graph.

## Phase 6 — Optional manifest and light-DOM inspection interface

**Entry:** Phase 5 complete; schema/ownership/codec decisions already designed in Phase 0.

### Work

- [ ] Implement a versioned JSON-safe projection of declared application source bindings, types/editors/codecs, namespace/root/sheet ownership, family/variant identities, and read-only outputs. Values remain in the authoritative sheet, not in a catalog snapshot.
- [ ] Implement an optional safe/inert server embedding helper and programmatic manifest-object delivery. Both expose the same schema and require no page theme runtime setup for initial inspection.
- [ ] Implement light-DOM resolution/validation of owned application roots/sheets. Do not infer access from arbitrary variable names, traverse shadow trees, inspect private UI sheets, or add a closed-root access bridge.
- [ ] Expose current source read/patch/export through the existing update path and codecs. Reconstruct direct nested inputs or family `{ shared, families }` live inputs with correct numbers/units/variants.
- [ ] Apply catalog precedence consistently: supplied data is authoritative, omitted data discovers designated light-DOM blocks, and explicit empty data exposes no targets. Invalid supplied data is reported, not permission to fall back to unrelated DOM catalogs.
- [ ] Set an explicit catalog refresh/replacement policy and cleanup contract. Changes to catalog visibility never delete theme allocations or reset current values. Avoid unconditional window registries or executable manifest payloads.

### Exit evidence

- The same real SSR/static page is inspectable with a programmatic catalog and with DOM data while no theme runtime was initialized.
- Without manifests, normal rendering/update is unchanged and inspection exposes no target.
- Read/patch/export sees current sheet values, source-only writes preserve families/variants, and exported inputs replay through setup to the same visible result.
- Out-of-scope/invalid ownership is rejected; shadow/private UI sheets stay unavailable even if explicit metadata names them.

## Phase 7 — Web Components devtools core

**Entry:** Phase 6 complete; private UI theme uses the same core/renderer from Phase 3.

### Work

- [ ] Create the devtools-core workspace with plain TypeScript/DOM code and handwritten CSS string modules. No React, Chrome API, consumer compiler, bundler, Vanilla Extract extraction, or inspected-schema dependency.
- [ ] Define/bind the private UI theme under `devtools-theme` with its own defaults and spacing/font basis. Allocate sources/formulas on its outer host through a shadow sheet using `:host`; never add it to inspection targets.
- [ ] Implement framework-free components/controller, source editors, root/family/variant grouping, read-only output presentation, and copyable live setup data. Native color representations and codec input types must not be silently reduced to hex or CSS strings in numeric fields.
- [ ] Mount into the supplied container, accept/replace manifests, resolve light-DOM fallback, and subscribe to authoritative source updates. UI drafts are uncommitted; no applied-value cache or derived override controls.
- [ ] Defer element class creation/registration until a real owner document/realm exists. Establish namespaced tags, idempotent compatible registration, and explicit incompatible-version behavior; import on the server without `HTMLElement`/DOM access.
- [ ] Share immutable structural sheets only within their valid document/namespace context. Keep mutable private host allocation sheets per instance and honor CSP/nonces for supported delivery. Set typography/control colors/color-scheme and avoid accidental `rem` dependence on app root fonts.
- [ ] Dispose owned components, private sheets, listeners, and subscriptions without resetting inspected app source values. Keep UI mounting separate from the inspection connection concept for a later Chrome frontend; do not implement the extension now.

### Exit evidence

- A plain HTML/ESM consumer mounts complete functional devtools without a framework/compiler/bundler, edits real application sources, and observes the page change while forbidden/derived targets remain unchanged.
- App edits do not drive private UI defaults; one devtools instance's private changes do not alter another. Nested shadow widgets inherit the correct UI namespace and aggressive app styles do not accidentally supply UI values.
- Manifest replacement, repeated mount/disposal, native registration, multiple realms, and current source/export behavior work in both target engines. SSR import is safe; no private/hidden sheet is inspected.

## Phase 8 — React bindings and application integration

**Entry:** Phase 7 complete.

### Work

- [ ] Create the separate React workspace depending on devtools-core. Render a host container and initialize the existing core, rather than implement another editor UI or theme-state model.
- [ ] Forward manifest props through the same precedence and replacement interface. React prop changes update visibility/bindings without recreating theme allocations or rolling back app edits.
- [ ] Implement only needed React component/bindings/subscription access; avoid speculative framework abstractions. Preserve owner-document/realm and deferred browser initialization.
- [ ] Handle development remounts, cleanup, and hot reload without duplicate element registration, UI, subscriptions, or ownership. Server rendering produces the appropriate host/metadata without evaluating browser classes.
- [ ] Add a real application/Storybook demonstration using declared light-DOM targets and optional programmatic/DOM manifest routes. Do not expose private UI sheets or change the app's initial theme-emission requirements.

### Exit evidence

- React and plain DOM integrations share the same functional core and produce equivalent edits/live exports.
- Server import/render and client mounting are safe; strict-development remounts and prop replacement leave one valid mounted UI and intact application values.
- Both target engine families exercise the actual visible React surface, not only mocked lifecycle forwarding.

## Phase 9 — Final integration, publication, and acceptance

**Entry:** completed real implementation and phase evidence; no placeholder phase substitutes for a deliverable.

### Work

- [ ] Run applicable package builds, compiler/type assertions, unit behavior checks, source ESLint fixes, and constraints; run the website build explicitly and the full applicable Moon CI graph. No Markdown ESLint pass is required.
- [ ] Exercise the final browser acceptance matrix below in latest stable Chromium and Safari/WebKit, recording actual versions/device/context and any limits. Never report emulated Chromium as Safari.
- [ ] Verify published exports/types/assets and dependency graph. Framework-free packages must not require React/Vanilla Extract at import time; devtools uses TypeScript-embedded CSS rather than an extraction build.
- [ ] Document breaking import/input replacements, direct/family setup, independent defaults, extension/static configuration timing, immutable prefixes, SSR emission/adoption, optional manifest delivery, supported codecs, root ownership, devtools lifecycle, browser support, and no-metadata/no-access behavior.
- [ ] Remove obsolete replaced implementation and migration-only fixtures/throwaway probes as each cutover completes. Keep consumer-visible regression/type checks and actual examples, not temporary aliases or initial-value/devtools override state.
- [ ] Add version requests/release metadata according to repository publishing conventions; do not publish an incomplete consumer cutover or future Chrome scaffolding.

### Final browser acceptance matrix

| Scenario | Required observation |
| --- | --- |
| Direct SSR theme; no theme runtime | Correct first paint, typed tokens usable before rendering, later adoption retains allocations |
| Extended static breakpoints | Exact configured queries exist during style authoring; no breakpoint updater/input |
| Root source change | Palette/grid derivatives react in CSS; formula structure/reference identity remains fixed |
| Native foreground polarity flip | Native foreground and adaptive percentages change coherently, independently of variant selection |
| Partial variant/family update | Omitted current values remain; no inheritance from another member; shared effects are intentional |
| Default/scoped family and variant selection | Complete root-allocated graph is mapped correctly; no local source override allocation |
| Repeated stylesheet updates | Unrelated rules/layers remain, input arrays are intact, current DOM text/snapshot reflects current values |
| Namespace/private UI | Default app names remain stable; all private/UI dependencies are isolated; same-prefix hosts have independent mutable sheets |
| Optional manifests | Explicit list wins, omitted list discovers light DOM, empty/absent data grants no access; rendering does not depend on metadata |
| Source-only light-DOM editor | Real root sources change; derived/static/private UI/shadow sheets cannot be edited |
| Live export | Direct/family typed inputs copied from current sheet values reproduce the edited result via setup |
| Lifecycle/React/realms | No duplicate UI/registration/subscriptions, cleanup preserves app edits, server imports stay DOM-free |
| CSP and Safari/WebKit | Supported nonce/style paths and all agreed adaptive behavior work on actual target engine versions |
| Storybook | Preview/manager stay synchronized with current source/family/variant changes |

## Quality commands and evidence discipline

Read [TESTING_AND_LINTING.md](../../../TESTING_AND_LINTING.md) before changing quality wiring and [ARCHITECTURE.md](../../../ARCHITECTURE.md) for workspace boundaries. Use matching repository styling/library/website instructions during implementation.

- Existing libraries inherit `tsc -b tsconfig.build.json`; core/family/devtools core use `lib`, while only React bindings need the general React addition (not `storybookLib`). Base compiler config includes DOM. Use `.tscmonorc.yml`, manifest metadata, `yarn tscmono`, and enabled Moon reference synchronization rather than manually editing generated configs.
- `.config/manifest.cjs`/`yarn.config.cjs` normalize ESM exports and internal ranges, enforce common dev dependencies, and generate `.env` project identities. Moon discovers the two-level workspace directories but does not synchronize dependency edges automatically; keep scoped `dependsOn` aliases and unscoped command IDs consistent. Update intended lockfile/configuration through normal workflows before final immutable-install verification.
- Add the explicit Phase 0 compiler-check task: full `tsconfig.json` includes specs, build config excludes them, and Vitest deliberately excludes `*.type.spec.*`. A task based on `yarn tsc --project tsconfig.json --noEmit` or a dedicated actually compiled consumer fixture must verify positive/negative assertions after dependency builds; isolate its incremental cache and include it in CI. Existing type-test lint is not that task.
- Website task inheritance is exceptional: run `yarn moon run website:build` explicitly. Do not assume its library-style lint/test tasks exist or its build participates in Moon CI. Likewise run `storybook:build` and actual preview/manager smoke explicitly for the affected application.
- Fix source files with `yarn eslint --fix <changed-source-files>`; do not lint Markdown. Run checks at coherent slice boundaries, not repeatedly while coupled edits are unfinished.

Representative commands after the corresponding workspaces exist and their IDs are confirmed:

```sh
yarn install --immutable
yarn constraints
yarn moon run stylesheet:build theme-core:build theme-family:build theme:build
yarn moon run stylesheet:lint theme-core:lint theme-family:lint theme:lint
yarn moon run stylesheet:test theme-core:test theme-family:test theme:test
yarn moon run theme-devtools-core:build theme-devtools-react:build
yarn moon run theme-core:typecheck theme-family:typecheck theme:typecheck
yarn moon run website:build
yarn moon run storybook:build
yarn moon ci
```

Add affected website-theme, Storybook, mirror/overrider, and devtools quality tasks to the slice graph. `typecheck` above is the new explicit Phase 0 task, not an existing repository command; wire analogous checks for other contract-bearing packages as needed. Use behavior/error/boundary tests and actual compiler checks, plus browser smoke for rendering/UI. No mocked forwarding, copies, source-text assertions, or incidental-default tests.

For each phase, record changed owners, commands/results, target browser versions, actual exercised scenarios, and any blocked gate. Planning demonstrations are not implementation verification, and an unavailable Safari or native custom-element environment is a missing prerequisite to acquire—not permission to shrink browser support.

## Decisions to close during implementation

The architectural semantics are fixed. These details need concrete implementations, not another round of reopening the agreed design:

- Manifest wire keys/version handling, declarative codec set, and supported source representations.
- Owned root/sheet IDs, request isolation, adoption/duplicate behavior, serialization/nonce API, and post-commit notifications.
- Verified adaptive native-color mechanics on both shipping engine families, including computed-value/property-registration behavior in private UI shadows.
- Catalog refresh/replacement, element registration/version conflicts, default UI shadow mode, lifecycle, and CSP/style delivery.
- Reset/restore only if explicitly included; initial-value copying, a devtools override layer, persistence, undo/history, shadow inspection, and Chrome extension implementation are not implicit work.

**Completion:** all phases' observable gates passed, all current consumers migrated, both target engines exercised, package graph/public types/exports coherent, docs updated, and no forbidden legacy implementation or unimplemented public surface remains.
