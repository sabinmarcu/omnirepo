# Theme refactor implementation plan

## Purpose and status

The [refactor plan](REFACTOR_PLAN.md) is the architectural contract. This document translates it into implementation order, repository targets, observable deliverables, and acceptance gates. Its phase numbering is execution-oriented and intentionally finer-grained than the architectural phases.

Phases 1–6 are implemented with compiler, behavior, and Chromium runtime evidence; native Safari acceptance remains deferred and unverified. Later implementation phases are pending. Planning prototypes demonstrate individual mechanisms, not completion of a production package or compatibility with Safari. No implementation phase is considered complete from compilation alone.

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

- [x] Separate the platform/server/DOM backend and its types from mandatory React imports; keep an optional React/SSR rendering wrapper as a consumer interface. Core declaration types must not expose React or Vanilla Extract types.
- [x] Replace regex parsing/merge and caller-array consumption with owned-rule handling that preserves selectors, declaration values, layers, and unrelated rules. Use browser CSSOM to parse/update existing browser sheets rather than implementing a CSS parser.
- [x] Implement explicit server rule serialization and browser creation/adoption. Adoption finds the correct owned node, preserves existing values, and does not append a duplicate or overwrite SSR content with constructor defaults.
- [x] Commit source declaration patches and synchronize the owned serialized contents. Make current raw/snapshot output reflect live contents; reacquire/invalidate handles after text replacement. Group related declaration changes into one commit without adding a competing mutable values cache.
- [x] Support the real owner document/realm and `Document`/`ShadowRoot` attachment context. Document allocation uses its declared root selector; private devtools host allocation through an inner sheet uses `:host`.
- [x] Carry nonces through SSR and browser mount paths; safely serialize CSS/HTML and preserve ownership boundaries. Reject or explicitly resolve ambiguous duplicate ownership rather than updating only one matching node.
- [x] Provide the minimal post-commit notification/current-read surface used later by theme updates and devtools. Notifications point to current sheet state, not detached value snapshots.
- [x] Migrate every affected existing stylesheet consumer when its import or API changes: theme runtime, theme overrider, and mirroring. Preserve the legitimate current `data-stylesheet` identity contract where appropriate. Text-based mirroring must observe current contents; do not optimize it into another subsystem without need.

### Exit evidence

- Server output is adopted and patched without resets; unrelated descendant/layered rules survive; caller arrays remain intact; duplicate ownership and nonces behave as specified.
- Two documents/hosts have independent mutable allocations. Immutable structural UI sheets may be shared later, but mutable allocation sheets are never shared accidentally.
- The existing website/Storybook continue working while the theme implementation remains unchanged; changed stylesheet APIs have no unmigrated caller or temporary alias.
- Current serialization and observed CSS agree after repeated patches, including values containing syntax the old regex parser could not preserve.

### Implemented ownership and verification

- `createStylesheet({ id, debugId?, nonce?, rules? })` owns request-local structured server rules. `mount(Document | ShadowRoot)` returns independent live state, adopting `data-stylesheet-id` without resetting contents, nonce, or label. `data-stylesheet` remains the mirror label, not the lookup key. Duplicate ownership/rule matches throw.
- Factory updates affect server state; mounted updates affect live CSSOM. `read`, current `css`/`raw`, `snapshot`, and post-commit `subscribe` expose that owner's current contents. Browser batches synchronize text once; failed batches restore the preceding sheet and do not notify. No detached values cache or retained CSSOM handles.
- Platform declarations contain no React/Vanilla Extract imports. Optional React SSR rendering moved to `/react`; React is an optional peer. `legacyRender` and factory `Component` were removed and consumers migrated. Theme/family callbacks now accumulate one commit per public update/pick; generator semantics remain unchanged.
- Chromium 150.0.0.0 smoke: SSR adoption, repeated source updates, readonly caller arrays, quoted values containing semicolons/colons/braces, nested layers, descendant/media/keyframe/import preservation, literal range-query operators, duplicate rejection, failed-batch rollback, current serialization, post-commit notifications, owner-realm iframe creation, and independent same-ID document/shadow-host allocations. Nonce-protected frame updates and style-tag breakout prevention were exercised against actual CSP and computed CSS.
- Actual Storybook manager/preview: dark-variant switching, one `theme-runtime` allocation, a complete legacy theme update producing `--grid-m: 2rem` in one commit, and current text mirrored into the manager. Actual production website: initial themed home surface, light selection, snippets navigation, and the CodeHike-backed `/snippets/crt-screen-dpi/script` route.
- Verification uses Node 24.18.0 with `MOON_TOOLCHAIN_FORCE_GLOBALS=true`; repository Moon's shared Node 22 and Storybook Node 23 declarations were not changed in this phase.
- Passed: changed-source `yarn eslint --fix`; stylesheet/theme/overrider/mirror/theme-storybook package builds and applicable tests (7 stylesheet regressions, 2 existing theme tests); optional React static SSR smoke; `yarn constraints`; `yarn install --immutable --mode=skip-build`; root `yarn lint` and `yarn test`; `yarn moon ci`; explicit `website:build` and `storybook:build`.
- Remaining findings: optional React wrapper reports `react/no-danger` for intentional escaped style delivery. Root lint also reports the existing MUI `useMemo` dependency warning; website build reports existing dynamic-filesystem tracing warnings. These were not suppressed or expanded into unrelated fixes.
- Native Safari/macOS/iOS is not available in this Linux environment and no remote SSH browser host is configured. Cross-engine acceptance remains open; Chromium results do not establish Safari compatibility. Phase 0's native-color/typecheck gates and Phase 5 cutover are not claimed by this implementation.


## Phase 2 — Generator descriptors, compiled references, and contract namespaces

**Entry:** Phase 0 descriptor contract; Phase 1 can proceed independently.

### Work

- [x] Create the proposed theme-core workspace with real descriptor/contract behavior and normal package/Moon/type wiring, not placeholder exports. Keep it independent of families, concrete schema, React UI, and Vanilla Extract.
- [x] Register new workspace identities/edges intentionally, then run constraints normalization (`yarn constraints --fix` where required), dependency/lockfile updates, and `yarn tscmono` generation through repository workflows. Constraints own internal `workspace:*` ranges/common exports/mandatory dev dependencies and generate each `.env` with `VITEST_PROJECT=@sabinmarcu/<package>`. Moon has automatic dependency synchronization disabled, so add actual direct `dependsOn` aliases explicitly. Do not hand-edit generated aggregate/project references or invent a bundler preset.
- [x] Implement immutable generator-owned `kind`; variable descriptors also own `scope` and source/derived metadata. Static breakpoint definitions preserve their precise output types. Supplying defaults does not reclassify a variable generator.
- [x] Represent source bindings and formula dependencies symbolically so namespace/family binding does not rerun generators or replace arbitrary strings. Compile fixed structural options only at definition time.
- [x] Allocate precise plain nested `var(--...)` views, metadata outside that tree, and a variable-only projection when static output is present. Preserve default public names; eliminate private names that escape their owning prefix.
- [x] Implement immutable validated construction prefixes. Bind a compiled definition to fresh independent views without changing the original or borrowing its values; reject path/name/ownership collisions within the relevant root.
- [x] Implement nested source-input/default/patch types derived from descriptors. Exclude static/derived fields, model supported light/dark patches explicitly, and avoid a blanket recursive `DeepPartial` promise for opaque generator inputs.
- [x] Assign reusable machinery to core and concrete schema choices to their appropriate owner. Static breakpoint generation is reusable core functionality; palette/background/grid definitions must be reusable across namespaces without coupling inspection to the app's bound view.

### Exit evidence

- Import/definition works without DOM access or CSS emission, and emitted public declarations have no framework/Vanilla Extract type imports.
- Default/custom prefix types are precise; all private references/formulas/registrations remain namespaced; creating another view preserves original identity.
- Compiler-checked assertions reject static updates, invalid source shapes, conflicting paths, and unsupported patches.
- A real Vanilla Extract consumer accepts our independently created variable views with `style`, `assignVars`, `assignInlineVars`, and `fallbackVar`; public static query additions are not mistakenly supplied to whole-contract assignment helpers.

### Phase 2 API and boundaries

The new `@sabinmarcu/theme-core` workspace owns descriptors, symbolic graphs, binding, source input types, and ordered static breakpoints. It has no production/peer dependencies on React, Vanilla Extract, families, or the concrete schema. Vanilla Extract and stylesheet are development-only consumer/smoke dependencies in this phase; direct rendering/setup belongs to Phase 3. Existing applications continue using their current theme until the atomic Phase 5 cutover.

```ts
import {
  bindTheme, breakpointGenerator, compileTheme, css, numberCodec, source, variableGenerator,
} from '@sabinmarcu/theme-core';

const spacing = variableGenerator({
  scope: 'shared',
  sources: source(numberCodec, 8),
  build: (base) => ({
    tokens: { m: css`calc(${base} * 1px)`, l: css`calc(${base} * ${2} * 1px)` },
  }),
});
const definition = compileTheme({
  spacing,
  breakpoint: breakpointGenerator([['phone', 640], ['wide', 960]]),
});
const application = bindTheme(definition); // Immutable 'theme' namespace.
const privateUI = bindTheme(definition, { prefix: 'devtools-theme' });
application.contract.spacing.m; // Exact 'var(--theme-spacing-m)'.
privateUI.variables.spacing.m; // Exact 'var(--devtools-theme-spacing-m)'.
application.contract.breakpoint.lt.phone; // Exact '(width < 640px)'.
```

- `variableGenerator` executes its structural `build` once, captures immutable `kind: 'variable'` and `scope`, and owns its source/default/expression data. `staticGenerator` authors intrinsically static output; it rejects wrapping an existing descriptor to reclassify it. `source` and `variantSource` carry typed codecs and encoded immutable defaults; absent defaults mean required setup inputs.
- The build callback receives symbolic source references and local `token`/`privateToken` reference constructors. `css` stores structural expression parts, and `registered` attaches property registration metadata. Binding only resolves symbols; deliberately literal/external CSS references remain unchanged. Unknown/foreign references, cycles, invalid paths, and flattened allocation-name collisions are rejected.
- Bound objects expose `contract` (variables plus exact static output), `variables` (variable-only plain reference trees), and immutable `sources`/`tokens` metadata outside those trees. Metadata retains source/derived roles, generator paths, assignment scope, public/private visibility, dependencies, and namespaced registration ownership. Public names follow `--prefix-<schema/output path>`; private inputs/formulas use `--prefix-source-*` and `--prefix-private-*`.
- `ThemeInputs`/`ThemePatches` derive nested input paths from descriptors, not generated outputs. `resolveThemeInputs` materializes complete input/defaults; `encodeThemePatch` emits declarations only for supplied sources. Scalar variant shorthand addresses both variants; partial light/dark edits leave omitted allocations to the renderer. Opaque codec values remain complete replacements, not recursive partial objects. These helpers return temporary data, never a competing mutable values store. Codecs must provide stable, pure round trips; receiver-dependent prototype methods are retained.
- `claimThemeAllocations`/`releaseThemeAllocations` reserve names by explicit root and owner object identity. Claims validate all names before mutation, permit idempotent reuse by the same owner, reject other owners, and isolate documents/hosts. Prefix identity does not substitute for allocation-root identity.
- Ordered breakpoints expose strict `lt`/`gt`, inclusive `lte`/`gte`, and exclusive forward-only `between` pairs. Thresholds retain fractions and exact literal types; equal/descending/nonfinite/negative values, duplicate names, and ambiguous flattened range keys are rejected. Prototype-like names are preserved safely.

### Phase 2 verification evidence

- New workspace manifests, `.env`, project/category TypeScript references, and lockfile were normalized with Yarn constraints/install and `yarn tscmono`; no stale bundler preset was copied. Matching scoped Moon dependencies are declared. Vanilla Extract and stylesheet are development-only dependencies; emitted JS/declarations contain no React, Vanilla Extract, concrete-theme, or family import.
- Passed the explicit `theme-core:build`, `theme-core:typecheck`, `theme-core:lint`, and `theme-core:test` graph: 17 behavior tests. Full-project compiler checks prove exact default/custom references, immutable discriminants/scope/prefix, required/defaulted/opaque/variant/nested-group inputs, static/derived exclusion (including static-only schemas), flattened path collisions, and actual Vanilla Extract `style`/assignment/fallback helper compatibility. The isolated compiler task is a required test dependency with `runInCI: true`.
- A Node import/definition/rebinding smoke installed throwing getters for `document`, `window`, and `CSSStyleSheet`; no platform access occurred. A generator built once across default/custom namespaces, and a prototype-based codec resolved numeric defaults and encoded source edits with its receiver retained.
- Chromium 150.0.7871.24 smoke consumed real built core/stylesheet and actual Vanilla Extract helpers. Synthetic document width changed from 16px to 48px after a unitless source update to 24; source contents/serialized text agreed and generator count stayed one. Two same-prefix private shadow hosts computed 14px and 16px independently while the application stayed 48px; private dependencies/registration names remained namespaced. `assignInlineVars`/`fallbackVar` produced a separate 9px consumer width.
- Browser `matchMedia` checks covered strict/inclusive 640px boundaries, exclusive 640–960px and nonadjacent 640–1200px ranges, plus 639.5/640/640.5px thresholds at a 640px viewport. No subtraction/epsilon or JavaScript query initialization was used.
- Passed changed-source ESLint fixes, root `yarn lint`/`yarn test`, `yarn constraints`, and `yarn install --immutable --mode=skip-build` on Node 24.18.0. `yarn moon ci` passed its existing affected graph; Moon excludes this not-yet-tracked new workspace from local VCS affected selection even with explicit CI targets. The complete new-package graph was executed explicitly, including the configured CI compiler task; staging/committing was not performed by the assistant. Existing MUI hook/stylesheet React delivery warnings remain; theme-core lint has no findings.
- Native Safari/macOS/iOS remains unavailable here. No cross-engine/native-color policy evidence or application cutover is claimed by Phase 2. Existing app generation/rendering behavior is intentionally unchanged; Phase 3 owns direct setup, concrete source/formula generators, live codecs/export, and extension.



## Phase 3 — Direct setup, CSS generators, source codecs, and extension

**Entry:** Phases 1–2 complete; Phase 0 color probes inform the formula implementation.

### Work

- [x] Implement native contrast and adaptive background generator definitions with fixed source/formula structure. Preserve weights 10/20/30% for light polarity and 20/40/50% for dark polarity; opposite-tone depressed/recessed weights remain 20/30%. Polarity is input-derived, not the selected light/dark mode.
- [x] Implement the unchanged eight-point scale and corrected Fibonacci coefficients `2, 3, 5, 8, ...`, with main/small/large source-dependent expressions. Pair count is structural; namespace binding and updates never call the generator again.
- [x] Implement intrinsic-static ordered breakpoints: strict `lt/gt`, inclusive `lte/gte`, exclusive ascending `between` pairs including nonadjacent pairs, invalid ordering rejection, and exact string-literal types. Remove mutable query initialization/update behavior from the new API.
- [x] Implement codecs/default resolution from nested inputs to owned source declarations and back. Initial setup resolves local defaults and rejects missing required values; subsequent supported patches retain omitted current values read from the sheet.
- [x] Normalize scalar light/dark shorthand into its declared source bindings. A dark-only patch preserves current light; a new scalar writes both. Keep source/formula allocation co-located at the harness root.
- [x] Implement functional direct setup/update with the unified renderer and convenience return of the same public contract. No rendering creates a contract or supplies static output; no independent normalized-input cache is authoritative.
- [x] Implement pure `extendTheme`: inherit prefix/identity, reject collisions, add static/variable definitions before consumers author styles, and do not recompile the base. A new namespace is separate binding, not an extension override.

### Exit evidence

- A non-family synthetic theme emits usable SSR/current browser CSS and can update sources through the same renderer with no generator executions or formula regeneration.
- Actual colors/spacing change from source edits; omitted inputs/variants remain current; code copied from live source reads reproduces the result with correct types/units.
- Static breakpoints are usable before rendering, cannot enter value updates, and match the exact declared query types and fractional-width behavior.
- Direct base and extended consumer styles coexist with unchanged base references; document and private UI host rendering remain independent.

### Phase 3 API and exercised evidence

- `createThemeSetup(theme, { id, nonce?, selector?, layer?, debugId? })` creates request-local server state; the callable setup and `update` return the existing `theme.contract`. `read`/`readThemeSources` decode current owned source declarations into complete setup-compatible inputs, including declared empty source groups. Initial setup fills local defaults; subsequent calls patch only supplied inputs. No mutable input/value cache, formula rebinding, or generator execution occurs during updates.
- `mount(Document | ShadowRoot)` returns independent live state. It adopts complete current SSR sources/formulas without resets, uses one explicit document allocation selector (normally `:root`) or shadow `:host`, and claims allocation names on the actual document element/host. Constructor nonce defaults never overwrite an adopted nonce. Cached mounts revalidate sheet ownership; conflicts/ambiguous style IDs fail. New CSP-rejected nodes are removed rather than left as failed owned allocations.
- `paletteGenerator`/`backgroundGenerator` intrinsically own contextual scope. Color sources are editable light/dark CSS expressions; native `contrast-color()`, relative OKLCH colors, and `light-dark()` provide public outputs. Typed private foreground markers plus `if(style(--namespaced-marker: white))` choose all prescribed adaptive weights from input polarity. `propertyName` is a symbolic expression node for style-query property names, not regex replacement. Opposite-tone mixing explicitly keeps neutral hue missing; browser smoke caught and fixed hue drift when achromatic foreground hue was made concrete.
- Namespaced `@property` declarations are serialized for SSR. Browser delivery discovers registrations in document-owned stylesheet CSSOM and emits missing definitions through an owned document stylesheet with the live nonce. Identical definitions are shared across independent hosts and duplicated modules; conflicting definitions throw. Chromium's shadow-local `@property` probe did not compute the required branch, so private hosts use owner-document declarations. No module-local registration cache or duplicate `CSS.registerProperty` call is required.
- Shared `gridGenerator`/`eightPointGridGenerator` preserve the default eight-point scale; shared `fibonacciGridGenerator` compiles ratios 2, 3, 5, 8, ... in one pass. Pair count, length unit, and basis are structural; live input remains a finite unitless number. The default rem basis is 16, while px/em default to 1. All generated lengths remain fixed CSS expressions driven by that source.
- Pure `extendTheme` recursively merges distinct groups and compiles/binds additions only. Base descriptor, compiled allocation, bound allocation, and untouched reference-subtree identities survive. Descriptor/path/name collisions and namespace overrides are rejected; precise static output stays outside variable assignment and value-input types.
- Passed `stylesheet:build/lint/test` and `theme-core:build/typecheck/lint/test`: 7 stylesheet regressions and 33 core behavior tests. Full-project compiler checks include generator shape/units, source-only direct updates, complete live input types, extension overlap/collision/prefix errors, static-query exclusion, and real Vanilla Extract styles using base/extended contracts together. Production JS/declarations contain no React, Vanilla Extract, or ColorJS imports; stylesheet is now an actual core production dependency.
- Chromium 150.0.7871.24 actual computed-color smoke checked native palette contrast, relative palette chroma, and every adaptive surface weight against native reference colors. Inputs included white, black, chromatic OKLCH, half-opacity white, and Display-P3 colors; changing a source flipped the native foreground and branch. White input retained light-polarity weights even in selected dark mode. Neutral opposite mixes retained the input hue for chromatic colors. Scoped descendant dark selection and system attribute removal were exercised without a third source variant.
- Actual spacing smoke confirmed default eight-point widths 16/8/24/4/32/2/40px and their doubling from source 16 to 32. Four Fibonacci pairs used 2/3/5/8 ratios, including positive 256px fourth large output at source 32. A synthetic generator executed once across extension, setup, adoption, updates, live export, and private binding. The complete exported input was replayed successfully; out-of-band edits through the owned sheet remained authoritative after omitted-input patches.
- Browser scenarios also covered SSR nonce/value adoption, one owned style node, current text/CSSOM agreement, document/iframe owner-realm and numeric-source independence, same-prefix private shadow hosts with separate values and adaptive branches, root ownership-conflict cleanup, cached-mount duplicate rejection, source-free formula graphs, CSP nonce delivery and failed-mount cleanup. Existing static query boundaries were checked at 639/640/641/960px; Phase 2's fractional threshold evidence remains applicable to the unchanged breakpoint generator.
- Passed changed-source `yarn eslint --fix`, root `yarn lint`/`yarn test`, `yarn constraints`, immutable install, and `yarn moon ci`'s existing affected graph on Node 24.18.0. The full new core graph was run explicitly because local VCS-based Moon CI still excludes the not-yet-tracked workspace. Existing optional stylesheet React-delivery and MUI hook lint warnings remain; new core lint has no findings.
- **Native Safari gate remains open:** this Linux environment has no native Safari/macOS/iOS browser and no configured remote SSH host. Required feature floor: `contrast-color`, relative colors, `light-dark`, `color-mix`, CSS computed-value `if(style(...))`, and typed property registration in document/private-host contexts. No WebKit/Safari compatibility, fixed-weight fallback, JavaScript contrast policy, or Phase 5 application cutover is claimed. Obtain a shipping native Safari environment and exercise the same color/host/CSP scenarios before the concrete-theme cutover.


## Phase 4 — Generic independent family composition

**Entry:** Phase 3 complete.

### Work

- [x] Create the theme-family workspace against core only. Derive contextual/shared partitions from generator descriptors, including mixed-scope nested branches; do not add a concrete-schema dependency or an app `vary` list.
- [x] Implement `{ shared, families }` setup/update input and export shape. Shared source allocations exist once outside every member; contextual source/formula graphs exist for ordinary `base` and each declared member.
- [x] Resolve family defaults independently and reject unknown/duplicate/reserved names as specified. Missing values never inherit another member's current inputs; shared/static/derived values are invalid in member payloads.
- [x] Qualify private configuration/family/variant names under the contract prefix without generator reruns or collisions between independent configurations.
- [x] Implement complete public reference mapping, default/root selection, scoped `data-theme-family` selection, and existing variant behavior. A scoped selection maps root-allocated source and derived references; it never declares local source overrides.
- [x] Delegate setup/update/pick declarations to the single stylesheet backend. Return the existing public theme contract from family setup, not private selected references.
- [x] Define the family portion of the later manifest projection using the same source bindings and input paths, but do not make rendering depend on inspection metadata.

### Exit evidence

- A synthetic schema unlike the concrete theme works, with compile-time shared/contextual/static partitioning and runtime validation of member names.
- Updating `base` changes no other contextual member; changing one member/variant changes no other; shared edits intentionally affect all members.
- Root and scoped family/variant selection resolve the complete derived graph without the inherited-formula rebinding bug. Inactive member values are allocated and independently readable.
- Direct/family APIs share the same renderer, and core/concrete modules do not import family code.

### Phase 4 API and exercised evidence

- `@sabinmarcu/theme-family` has one production dependency: theme-core. Yarn constraints/install and `yarn tscmono` normalized exports, lockfile, `.env`, and TypeScript references; explicit scoped Moon dependencies and a full-config isolated-cache compiler task are declared. Existing concrete theme, website, and Storybook integrations are intentionally unchanged.
- `createThemeFamily(theme, { id, families, nonce?, debugId?, selector?, layer? })` is a callable setup returning the original public contract, with `update`, `read`, `pick`, `mount`, `contract`, `families`, `selectors`, plain mixed `themes[member]` views, current `stylesheet`/`selector`, and immutable `bindings`. IDs/member names are safe kebab namespaces; built-in ordinary `base`, duplicates, unsafe/reserved names, unknown inputs, wrong-scope payloads, null groups, required omissions, and flattened cross-member name collisions are validated.
- Scope partitions prune each generator leaf independently, preserve descriptor/compiled entry identity, and never reclassify or rerun a generator. Required/optional shared/member containers derive directly from source default metadata; static/derived paths and opaque deep-partial promises are excluded. Members named `shared`/`families` remain legal because value addressing is explicit.
- Existing compiled graphs are rebased beneath logical `shared` and `families.<member>` paths with the generic core `rebaseThemeDefinition` helper. Symbolic declarations/dependencies move together; authored CSS strings are not replaced. Private names are under `--<contract-prefix>-family-<configuration-id>-*`. Shared source/formula graphs exist once; all contextual member graphs—including inactive members—are allocated at the actual harness root.
- Initial complete mappings and source/formula allocations use one core renderer commit via structural `rules(selector)`. Original public aliases participate in the same root ownership claims via `ownedNames`; adoption requires complete aliases as well as sources/formulas. Unrelated configurations cannot compete for one root's public contract. Root/scoped selection maps every contextual public output, not private source overrides; shared aliases stay root-wide. `pick` changes mappings only and leaves all member source inputs intact.
- Family bindings are JSON-safe, source-only records with current owned declaration names, full wrapped input/variant paths, intrinsic scope, member/variant identity, and generator paths. They contain no current/default value snapshot or executable codecs, and rendering does not depend on a manifest. The later producer can combine these records with the harness's sheet/root ownership and original descriptor codecs; shadow/private UI inspection remains forbidden.
- Passed `theme-family:build/typecheck/lint/test` (8 behavior tests) and `theme-core:build/typecheck/lint/test` (33 behavior tests). Full compiler fixtures reject wrong-scope mixed branches, static/derived edits, missing required members/shared inputs, opaque partial values, unknown/system variants, unknown picks, duplicate/reserved names, and invalid IDs. Exact original/private/shared/static view types and real Vanilla Extract public/member assignments compile. Emitted family JS/declarations have no React/Vanilla Extract/concrete-theme import, and core/concrete sources do not import family.
- A Node smoke imported, composed, rendered, patched, read, and picked a synthetic numeric family with throwing getters for `document`, `window`, and `CSSStyleSheet`: no DOM access, one generator execution, original contract identity, and independently retained base/night values.
- Chromium 150.0.7871.24 computed-style smoke used a synthetic mixed `scene.metric` contextual numeric generator, shared `scene.density`, contextual variant tint, native adaptive background, and static queries. SSR selected night adopted as 60px derived width while scoped base/ocean stayed 20px. One update committed base 24px, night 70px, and shared 8px padding while ocean/nested-ocean remained 20px. Three structural generators ran once each across family binding/render/update/pick/export/private mounts. Complete source export replayed successfully; an inactive ocean source edit remained authoritative and produced a 34px selected output after another member changed.
- Nested family plus dark-variant scopes resolved cyan night and navy nested-ocean colors from distinct root allocations. Picking changed only aliases and left inputs unchanged. CSSOM inspection verified every family selector contains public mappings only—no local private source/formula declarations. Shared source metadata appeared once; inactive member bindings remained independently addressable and JSON-safe. Current text and CSSOM serialization agreed, SSR nonce remained intact, and one owned style node survived adoption.
- Two same-prefix shadow-host family allocations stayed independent (100px versus 20px, source 50 versus 10) while document base stayed 14. Duplicate/cached-mount ownership failed safely, and a competing configuration's public aliases were rejected with its new sheet removed. These renderer/ownership scenarios required no devtools or inspection manifest.
- Passed changed-source ESLint fixes, root `yarn lint`/`yarn test`, `yarn constraints`, immutable install, and `yarn moon ci`'s existing affected graph on Node 24.18.0. New-workspace VCS affected selection remains excluded locally until tracked; both complete package graphs were run explicitly. Existing optional stylesheet React-delivery/MUI hook and dependency peer warnings remain; new family/core lint has no findings.
- **Phase 5 stop gate remains open:** native shipping Safari/macOS/iOS access is unavailable here. Phase 4 does not claim cross-engine/native-color support or authorize the application cutover. Obtain native Safari and exercise the Phase 3 color/host/CSP and Phase 4 family/variant scenarios before Phase 5.


## Phase 5 — Atomic concrete-theme, website, and Storybook cutover

**Entry:** Phases 0–4 implementation evidence available; all affected caller changes prepared together. Native Safari verification is deferred, not passed; this cutover does not establish cross-engine release acceptance.

### Work

- [x] Recompose the concrete schema with self-describing one-time generators and default `theme` namespace. Preserve public color/grid paths/names and remove production React/Storybook/Vanilla Extract coupling from theme entry points where it exists.
- [x] Move reusable static breakpoint ownership into core and website configuration into website-theme. Extend before style authoring and remove breakpoint inputs from variable setup.
- [x] Reshape website values to `{ shared, families }`; materialize previous base-inherited contextual values into each member's independent defaults/inputs. Do not alter intended website appearance except acknowledged native contrast/Fibonacci changes.
- [x] Replace the removed `apps/website/theme/theme.css.ts` emission side effect and its import in [theme/index.ts](../../../apps/website/theme/index.ts) together. The locale layout reaches this chain through `getThemeVariant`; migrate to server/build-owned stylesheet emission before paint while retaining `<html data-theme-variant>` and client cookie/attribute selection. Definitions remain importable by `.css.ts` consumers without SSR rendering.
- [x] Migrate [responsive.ts](../../../apps/website/utils/responsive.ts) to static website queries and verify its orientation/container composition at strict/fractional boundaries. Migrate `app/layout.css.ts` family background triggers/private view assignment, descendant family attributes in layouts/HOCs/search/tag pages, and type-only family consumers in the same change group. Equivalent colors/grid-only styles keep stable imports and must not be rewritten unnecessarily.
- [x] Migrate Storybook bootstrap `config/defaultTheme.ts`, demo `themes.ts`/`themes.values.ts`, `themeFamily.data.ts` lists, family/variant toolbars, and `themeConfiguration.ts` mirror configuration together. The previous `family.runtime` caller was this bootstrap; direct `runtime`/`ssr` subpaths had no source callers but were public removal surfaces. Preserve overrider references, `[data-stylesheet="themeValues"]` behavior/current contents, and `apps/storybook/src/main.ts` integration. Do not introduce new workspace-to-app or otherwise forbidden composition edges.
- [x] Migrate every package/subpath caller identified in Phase 0, including exceptional consumers outside website/Storybook. Remove obsolete `family`, `family.runtime`, old SSR/runtime render owners, tuple/prefix-string machinery, static updaters, and JS derived-value computation where replaced.
- [x] Update exports, dependencies, Moon edges, and generated project references in the same cutover. No concrete-theme family re-exports, legacy input adapters, or broken intermediate builds remain.

### Exit evidence

- Website build and representative route work with server-emitted values and no theme runtime initialization; initial paint has the correct family/variant and app breakpoint behavior.
- Family/variant switching and a scoped family section still work, including computed derived tokens. Direct shared components keep their default references.
- Storybook preview/manager remain synchronized after source updates and family/variant selection.
- There are no surviving callers of removed entry points, no dependency cycles, and no forbidden framework/Vanilla Extract dependency in the theme/renderer production graph.

### Phase 5 API and exercised evidence

- `@sabinmarcu/theme` exports the concrete bound definition, stable color/grid token view, selectors/layers, and reset CSS through its root only. Its sole production dependency is theme-core; obsolete family/runtime/SSR subpaths and their source machinery are removed. Actual Node imports of concrete and website definitions plus server setup succeeded with throwing `document`, `window`, and `CSSStyleSheet` getters.
- Website-theme owns static 700/1000/1600/1900/3800px breakpoints through `extendTheme`, complete independent `{ shared, families }` inputs, and metadata-only family views. `createWebsiteTheme()` creates request-local rendering state; the localized root layout emits reset and owned family CSS before paint. Website style imports do not render or mutate values.
- Chromium 150.0.7871.24 first-paint smoke against the final production website with JavaScript disabled showed one owned website stylesheet in `<head>`, a real 16px grid probe, the personal light background `oklch(0.767 0.022 68.63)`, and usable navigation/layout. Interactive dark/system selection, navigation to the CRT CodeHike snippet, and scoped `snippets` family rendering retained one owned sheet. Actual container queries from `responsive.ts` passed portrait 699.5/700/700.5px and landscape 999.5/1000/1000.5px boundaries; equality matches neither strict branch.
- Storybook demo composition stays in the shared-theme lane, without importing website-theme. Both dev and built production manager/preview surfaces were exercised; family/variant toolbar selection synchronized their attributes. A live personal-family dark-only source patch preserved light, computed native black contrast, changed shared grid 16→24, produced a 24px spacing probe, and mirrored current owned sheet contents and source value 24 into the manager.
- A duplicated-renderer browser smoke mounted same-prefix private hosts with independent sources 16 and 24, sharing one document-owned typed-registration sheet and retaining its nonce. An observed wildcard registration with nullable `initialValue` rejected a conflicting typed definition and removed the failed host sheet. This replaces the module-local `CSS.registerProperty` cache that threw `InvalidModificationError` after duplicated imports.
- Passed explicit core/family/concrete/website-theme compiler tasks and core/family behavior suites: 33 core and 8 family tests. Website and Storybook production builds, root `yarn lint`, root `yarn test`, `yarn constraints`, `yarn install --immutable`, `yarn tscmono`, and `yarn moon ci` passed on Node 24.18.0. Moon CI passed its VCS-selected affected graph (46 actions completed, 26 cached, 3 skipped); the explicit core/family graph supplies coverage beyond that selection. Website-theme now uses the existing shared Vitest configuration to exclude compiler-only `.type.spec.ts` fixtures from runtime collection; its Moon compiler task still checks those fixtures.
- Existing non-blocking warnings remain: stylesheet React delivery (`react/no-danger`), MUI hook dependencies, package export-condition ordering, install peer requirements, Storybook empty story globs/chunk size, and website dynamic-filesystem tracing. No warnings were suppressed. Copilot instruction discovery listed the updated styling instructions; skill discovery also succeeded.
- **Deferred native Safari acceptance:** no shipping native Safari/macOS/iOS result is claimed. Native color functions, adaptive computed-value/property-registration behavior, private-host/CSP delivery, and family/variant scenarios still require a native shipping Safari run before cross-engine release acceptance. Do not substitute emulated Chromium or an untested fallback policy.


## Phase 6 — Optional manifest and light-DOM inspection interface

**Entry:** Phase 5 complete; schema/ownership/codec decisions already designed in Phase 0.

### Work

- [x] Implement a versioned JSON-safe projection of declared application source bindings, types/editors/codecs, namespace/root/sheet ownership, family/variant identities, and read-only outputs. Values remain in the authoritative sheet, not in a catalog snapshot.
- [x] Implement an optional safe/inert server embedding helper and programmatic manifest-object delivery. Both expose the same schema and require no page theme runtime setup for initial inspection.
- [x] Implement light-DOM resolution/validation of owned application roots/sheets. Do not infer access from arbitrary variable names, traverse shadow trees, inspect private UI sheets, or add a closed-root access bridge.
- [x] Expose current source read/patch/export through the existing update path and codecs. Reconstruct direct nested inputs or family `{ shared, families }` live inputs with correct numbers/units/variants.
- [x] Apply catalog precedence consistently: supplied data is authoritative, omitted data discovers designated light-DOM blocks, and explicit empty data exposes no targets. Invalid supplied data is reported, not permission to fall back to unrelated DOM catalogs.
- [x] Set an explicit catalog refresh/replacement policy and cleanup contract. Changes to catalog visibility never delete theme allocations or reset current values. Avoid unconditional window registries or executable manifest payloads.

### Exit evidence

- The same real SSR/static page is inspectable with a programmatic catalog and with DOM data while no theme runtime was initialized.
- Without manifests, normal rendering/update is unchanged and inspection exposes no target.
- Read/patch/export sees current sheet values, source-only writes preserve families/variants, and exported inputs replay through setup to the same visible result.
- Out-of-scope/invalid ownership is rejected; shadow/private UI sheets stay unavailable even if explicit metadata names them.

### Phase 6 API and exercised evidence

- Core owns `ThemeManifest` version 1, `createThemeManifest`, `validateThemeManifest`, `embedThemeManifests`, and `createThemeInspection`. Direct setup adds `manifest()`; family adds its own rebased source/member projection, original public namespace/static outputs, and complete empty shared/member groups. Metadata contains no defaults, mutable source values, formulas, or executable codecs. Existing applications remain opt-in; no new package, mandatory embedding, page startup, UI, or window registry was introduced.
- Declared editor/codec kinds are number, CSS string, native CSS color, and complete JSON replacement. `numberUnitCodec(unit)` preserves numeric inputs with explicit serialized units; `jsonCodec` round-trips quoted CSS JSON through CSSOM. Recognized standard codec identity survives descriptor ownership; custom codecs remain usable for rendering but unsupported inspection semantics throw rather than being inferred from sample values. Shared acyclic JSON references are accepted; cycles/accessor-bearing data are rejected. Complete live exports retain declared empty source containers, including legal groups named `kind`, rather than mistaking those groups for source descriptors.
- Inspection validates one declared application light-DOM allocation element and one active owned stylesheet, reading only sources present at the exact selector/layer. Reserved private UI prefixes/markers, host selectors, shadow roots/sheets in both modes, forged source names, duplicate sheet/catalog IDs, missing/replaced bindings, and derived/static/descendant writes are rejected. Public outputs are read-only. Source writes reuse the existing encoder and owned stylesheet backend, with no second renderer or applied-value store.
- Programmatic lists are authoritative; omitted lists discover `script[type="application/json"][data-theme-manifests]`; explicit empty lists grant no access. Catalog refresh is explicit. Replacement is transactional and invalidates stale target handles; failure preserves the preceding valid catalog without DOM fallback. Source subscriptions observe shared element commit events and owned-node text replacements. Replacement/disposal removes only inspection subscriptions/observers and leaves application CSS, metadata, and edits intact.
- A real Node-served SSR-only page using the built website family and a separately namespaced direct theme was exercised in Chromium 150.0.7871.24 with native ESM/import-map delivery. Before inspection, only inert metadata/import-map scripts existed and probes computed 16px/12px. Both programmatic-subset and DOM-discovery catalogs edited actual sources; shared grid 16→32 changed the rendered probe to 32px, a personal dark-only edit preserved light and base members, and inactive family inputs remained readable.
- Browser proof covered explicit/empty/omitted precedence, malformed metadata, explicit/discovered refresh, stale target invalidation, transactional replacement, no-metadata/no-access rendering, private/open/closed-shadow boundaries, duplicate ownership, and source-only patches. Cross-handle app/inspection subscriptions delivered one notification per commit, no duplicate text-observer callback, and no stale callbacks after disposal. Complete direct/family exports replayed exact live inputs and matching native black contrast/white color/32px width in an independently inspected iframe document.
- Unit numbers and structured JSON containing quotes, backslashes, newlines, null characters, and HTML end-tag text round-tripped through real browser CSSOM; invalid multi-source patches preserved the prior sheet. A nonce-only CSP route retained `phase6-nonce` and computed 37.5px after inspection writes. Embedding parsed as one inert JSON element, preserved data/nonce bytes, prevented HTML breakout, and rejected accessor metadata without invoking it. Server imports/projection/embedding succeeded with throwing getters for document/window/CSSStyleSheet/HTMLElement; metadata before setup equaled metadata after supplying values.
- Passed changed-source ESLint fixes, explicit stylesheet/core/family builds and full compiler tasks, and behavior suites: 7 stylesheet, 38 core, and 10 family tests. Concrete/website-theme compiler tasks and Storybook build passed. Root lint/test, constraints, immutable install, and Moon CI's affected graph passed (46 completed actions, 27 cached, 3 skipped); explicit new-core/family checks supplement local VCS selection. Existing immutable-install peer warnings remain.
- **Website build blocker:** the production bundle compiled, but its type-check failed with TS7006 at the unmodified content-variant callbacks in `projects/[slug]/page.tsx:27`, `snippets/[slug]/page.tsx:17`, and `tools/[slug]/page.tsx:15`. These content-resource consumers were not changed by Phase 6. No broad website type fix or implicit-any suppression was added. Existing MUI/stylesheet lint, package export ordering, Storybook story-glob/chunk, and website filesystem-tracing warnings remain.
- **Deferred native Safari acceptance:** no shipping Safari/macOS/iOS result is claimed. The native color/registration/CSP and inspection/lifecycle matrix still needs a native shipping Safari environment before cross-engine release acceptance. Web Components/React surfaces remain Phases 7–8.


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
